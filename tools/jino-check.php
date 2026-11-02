<?php
// Проверка хостинга перед подключением SMS/Telegram-уведомлений.
// Загрузите файл в папку любого сайта на Jino, откройте его в браузере,
// пришлите результат и сразу удалите файл с сервера.
// Скрипт ничего не отправляет и не хранит: только пробует открыть страницы сервисов.

header('Content-Type: text/html; charset=utf-8');

$targets = [
    'SMS.ru'       => 'https://sms.ru/',
    'SMSC.ru'      => 'https://smsc.ru/',
    'Telegram API' => 'https://api.telegram.org/',
];

function check_curl($url)
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_NOBODY         => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_CONNECTTIMEOUT => 6,
        CURLOPT_FOLLOWLOCATION => true,
    ]);
    $start = microtime(true);
    curl_exec($ch);
    $code  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    $ms = round((microtime(true) - $start) * 1000);

    return $code > 0
        ? ['ok' => true, 'text' => "ответ HTTP $code за $ms мс"]
        : ['ok' => false, 'text' => 'нет соединения: ' . ($error ?: 'неизвестная ошибка')];
}

$rows = [];
$rows[] = ['PHP', true, PHP_VERSION];
$rows[] = ['Расширение cURL', function_exists('curl_init'), function_exists('curl_init') ? 'есть' : 'нет'];
$rows[] = ['allow_url_fopen', (bool) ini_get('allow_url_fopen'), ini_get('allow_url_fopen') ? 'включено' : 'выключено'];
$rows[] = ['Расширение JSON', function_exists('json_encode'), function_exists('json_encode') ? 'есть' : 'нет'];

foreach ($targets as $name => $url) {
    $host = parse_url($url, PHP_URL_HOST);
    $ip = gethostbyname($host);
    $rows[] = ["DNS $host", $ip !== $host, $ip !== $host ? $ip : 'не резолвится'];

    if (function_exists('curl_init')) {
        $r = check_curl($url);
        $rows[] = ["Запрос к $name", $r['ok'], $r['text']];
    }
}

$allOk = !in_array(false, array_column($rows, 1), true);
?>
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Проверка хостинга</title>
<style>
  body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 32px auto; padding: 0 16px; }
  td { padding: 6px 10px; border-bottom: 1px solid #ddd; }
  .ok { color: #2e7d32; } .fail { color: #c62828; }
</style>
<h2 class="<?= $allOk ? 'ok' : 'fail' ?>">
  <?= $allOk ? '✓ Всё в порядке: уведомления можно подключать' : '✗ Есть проблемы — пришлите этот экран' ?>
</h2>
<table>
  <?php foreach ($rows as [$label, $ok, $text]): ?>
    <tr>
      <td><?= htmlspecialchars($label) ?></td>
      <td class="<?= $ok ? 'ok' : 'fail' ?>"><?= $ok ? '✓' : '✗' ?> <?= htmlspecialchars($text) ?></td>
    </tr>
  <?php endforeach; ?>
</table>
<p>После проверки удалите этот файл с сервера.</p>
