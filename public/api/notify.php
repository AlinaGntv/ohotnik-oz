<?php
// Приём заявок с сайта (бронь стола и заказ еды). Уведомления уходят двумя
// независимыми каналами:
//   - в вебхук Make, откуда сценарий шлёт сообщение в Telegram
//     (российский хостинг не может обращаться к Telegram напрямую);
//   - SMS админу напрямую через SMS.ru.
// Заявка принята, если сработал хотя бы один канал.
//
// Настройки лежат вне папки сайта, в ~/ohotnik-config.php (см. docs/notifications-make.md):
//   make_webhook_url, make_secret — Make; sms_ru_api_id, sms_to, sms_test — SMS.

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const RATE_LIMIT = 5;          // заявок
const RATE_WINDOW = 600;       // за 10 минут с одного IP
const TZ = 'Europe/Moscow';

function respond(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $code, string $message): void
{
    respond($code, ['ok' => false, 'error' => $message]);
}

function str_field(array $data, string $key, int $max, bool $required = true): string
{
    $value = trim((string) ($data[$key] ?? ''));
    $value = preg_replace('/\s+/u', ' ', $value);
    if ($required && $value === '') {
        fail(422, 'Заполните все обязательные поля');
    }
    if (mb_strlen($value) > $max) {
        fail(422, 'Слишком длинное значение в поле');
    }
    return $value;
}

function phone_field(array $data): string
{
    $digits = preg_replace('/\D/', '', (string) ($data['phone'] ?? ''));
    if (strlen($digits) === 11 && $digits[0] === '8') {
        $digits = '7' . substr($digits, 1);
    }
    if (strlen($digits) === 10) {
        $digits = '7' . $digits;
    }
    if (strlen($digits) !== 11 || $digits[0] !== '7') {
        fail(422, 'Проверьте номер телефона');
    }
    return sprintf('+7 (%s) %s-%s-%s', substr($digits, 1, 3), substr($digits, 4, 3), substr($digits, 7, 2), substr($digits, 9, 2));
}

function e(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function money(int $rub): string
{
    return number_format($rub, 0, '', ' ') . ' ₽';
}

// ---------- проверки запроса ----------

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'Метод не поддерживается');
}

$configPath = dirname(__DIR__, 3) . '/ohotnik-config.php';
$config = is_file($configPath) ? require $configPath : [];
$webhook = $config['make_webhook_url'] ?? '';
$smsApiId = $config['sms_ru_api_id'] ?? '';
$smsTo = preg_replace('/[^\d,]/', '', (string) ($config['sms_to'] ?? ''));
if (!$webhook && !($smsApiId && $smsTo)) {
    fail(503, 'Приём заявок временно не настроен. Позвоните нам, пожалуйста.');
}

$data = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($data)) {
    fail(400, 'Некорректный запрос');
}

// поле-ловушка: люди его не видят, боты заполняют
if (!empty($data['website'])) {
    respond(200, ['ok' => true, 'id' => '0']);
}

// ограничение частоты по IP
// Jino проксирует запросы через nginx: настоящий IP — в X-Real-IP или последним в
// X-Forwarded-For (первые значения в нём клиент может подставить сам)
$forwarded = array_filter(array_map('trim', explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')));
$ip = $_SERVER['HTTP_X_REAL_IP'] ?? (end($forwarded) ?: ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
$rateDir = dirname(__DIR__, 3) . '/tmp/notify-rate';
if (!is_dir($rateDir)) {
    @mkdir($rateDir, 0700, true);
}
$rateFile = $rateDir . '/' . md5($ip);
$now = time();
$hits = array_filter(
    is_file($rateFile) ? array_map('intval', file($rateFile, FILE_IGNORE_NEW_LINES)) : [],
    fn ($t) => $t > $now - RATE_WINDOW
);
if (count($hits) >= RATE_LIMIT) {
    fail(429, 'Слишком много заявок подряд. Попробуйте через несколько минут или позвоните нам.');
}
$hits[] = $now;
@file_put_contents($rateFile, implode("\n", $hits), LOCK_EX);

// ---------- разбор заявки ----------

// согласие на обработку персональных данных (152-ФЗ) обязательно
if (($data['consent'] ?? false) !== true) {
    fail(422, 'Отметьте согласие на обработку персональных данных');
}

$type = $data['type'] ?? '';
$created = new DateTimeImmutable('now', new DateTimeZone(TZ));
$id = $created->format('dmy') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 4));

$name = str_field($data, 'name', 80);
$phone = phone_field($data);
$comment = str_field($data, 'comment', 500, false);

if ($type === 'booking') {
    $date = str_field($data, 'date', 10);
    $time = str_field($data, 'time', 5);
    $guests = (int) ($data['guests'] ?? 0);

    $day = DateTimeImmutable::createFromFormat('!Y-m-d', $date, new DateTimeZone(TZ));
    if (!$day || $day < $created->setTime(0, 0)) {
        fail(422, 'Выберите дату не раньше сегодняшней');
    }
    if (!preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $time)) {
        fail(422, 'Проверьте время');
    }
    if ($guests < 1 || $guests > 300) {
        fail(422, 'Проверьте количество гостей');
    }

    $fields = [
        'date' => $day->format('d.m.Y'),
        'time' => $time,
        'guests' => $guests,
    ];
    $lines = [
        "🍽 <b>Бронь стола</b> · № {$id}",
        '',
        '📅 ' . e($fields['date']) . ' в ' . e($time),
        "👥 Гостей: {$guests}",
        '👤 ' . e($name),
        '📞 ' . e($phone),
    ];
    $sms = "Бронь {$id}: " . $day->format('d.m') . " {$time}, {$guests} гост. {$name}, {$phone}";
} elseif ($type === 'order') {
    $address = str_field($data, 'address', 200);
    $paymentLabels = ['cash' => 'Наличными курьеру', 'card' => 'Картой курьеру'];
    $payment = $paymentLabels[$data['payment'] ?? ''] ?? null;
    if (!$payment) {
        fail(422, 'Выберите способ оплаты');
    }

    $items = [];
    $total = 0;
    foreach (array_slice((array) ($data['items'] ?? []), 0, 50) as $item) {
        $title = mb_substr(trim((string) ($item['name'] ?? '')), 0, 80);
        $qty = (int) ($item['qty'] ?? 0);
        $price = (int) ($item['price'] ?? 0);
        if ($title === '' || $qty < 1 || $qty > 99 || $price < 0 || $price > 100000) {
            continue;
        }
        $items[] = ['name' => $title, 'qty' => $qty, 'price' => $price, 'sum' => $qty * $price];
        $total += $qty * $price;
    }
    if (!$items) {
        fail(422, 'Корзина пуста');
    }

    $fields = [
        'address' => $address,
        'payment' => $payment,
        'items' => $items,
        'total' => $total,
    ];
    $lines = ["🛵 <b>Заказ доставки</b> · № {$id}", ''];
    foreach ($items as $i) {
        $lines[] = '• ' . e($i['name']) . " × {$i['qty']} — " . money($i['sum']);
    }
    $lines[] = '';
    $lines[] = '💰 <b>Итого: ' . money($total) . '</b>';
    $lines[] = '💳 ' . e($payment);
    $lines[] = '';
    $lines[] = '👤 ' . e($name);
    $lines[] = '📞 ' . e($phone);
    $lines[] = '📍 ' . e($address);
    $paymentShort = ($data['payment'] ?? '') === 'cash' ? 'наличными' : 'картой';
    $sms = "Заказ {$id}: " . money($total) . ", {$paymentShort}. {$name}, {$phone}, " . mb_substr($address, 0, 60);
} else {
    fail(400, 'Неизвестный тип заявки');
}

if ($comment !== '') {
    $lines[] = '💬 ' . e($comment);
}
$lines[] = '';
$lines[] = '<i>' . $created->format('d.m.Y H:i') . ' · ohotnik-oz.ru</i>';

$payload = array_merge([
    // секрет для фильтра в Make: запросы без него сценарий отбрасывает
    'secret' => (string) ($config['make_secret'] ?? ''),
    'type' => $type,
    'id' => $id,
    'created_at' => $created->format(DATE_ATOM),
    'name' => $name,
    'phone' => $phone,
    'comment' => $comment,
], $fields, [
    // готовый текст для Telegram (parse mode: HTML)
    'text' => implode("\n", $lines),
]);

// ---------- отправка уведомлений ----------

function send_to_make(string $url, array $payload): bool
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
    ]);
    curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($status < 200 || $status >= 300) {
        error_log("notify.php: Make webhook failed, status {$status}, " . curl_error($ch));
        return false;
    }
    return true;
}

// https://sms.ru/api/send — несколько номеров через запятую
function send_sms(string $apiId, string $to, string $text, bool $test): bool
{
    $params = ['api_id' => $apiId, 'to' => $to, 'msg' => $text, 'json' => 1];
    if ($test) {
        $params['test'] = 1; // имитация отправки: деньги не списываются, SMS не приходит
    }
    $ch = curl_init('https://sms.ru/sms/send');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($params),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
    ]);
    $response = json_decode((string) curl_exec($ch), true);
    if (($response['status'] ?? '') !== 'OK') {
        error_log('notify.php: SMS.ru failed: ' . json_encode($response ?: curl_error($ch), JSON_UNESCAPED_UNICODE));
        return false;
    }
    // общий статус OK, но конкретный номер мог не принять SMS (например, неверный номер)
    foreach ((array) ($response['sms'] ?? []) as $number => $result) {
        if (($result['status'] ?? '') !== 'OK') {
            error_log("notify.php: SMS.ru rejected {$number}: " . ($result['status_text'] ?? ''));
        }
    }
    return true;
}

$delivered = false;
if ($webhook) {
    $delivered = send_to_make($webhook, $payload);
}
if ($smsApiId && $smsTo) {
    $delivered = send_sms($smsApiId, $smsTo, $sms, !empty($config['sms_test'])) || $delivered;
}

if (!$delivered) {
    fail(502, 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.');
}

respond(200, ['ok' => true, 'id' => $id]);
