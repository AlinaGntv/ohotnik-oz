<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
date_default_timezone_set('Europe/Moscow');

const DATA_DIR = __DIR__ . '/../../../ohotnik-data';

function out(int $code, array $data): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_store(string $name): array
{
    $path = DATA_DIR . '/' . $name . '.json';
    if (!is_file($path)) return [];
    $value = json_decode((string) file_get_contents($path), true);
    return is_array($value) ? $value : [];
}

function write_store(string $name, array $value): void
{
    if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0700, true) && !is_dir(DATA_DIR)) {
        out(500, ['ok' => false, 'error' => 'Не удалось создать хранилище данных']);
    }
    @chmod(DATA_DIR, 0700);
    $lock = fopen(DATA_DIR . '/' . $name . '.lock', 'c');
    if ($lock) @chmod(DATA_DIR . '/' . $name . '.lock', 0600);
    if (!$lock || !flock($lock, LOCK_EX)) out(500, ['ok' => false, 'error' => 'Не удалось заблокировать хранилище']);
    $json = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    $temp = tempnam(DATA_DIR, 'write-');
    $written = $temp ? file_put_contents($temp, $json, LOCK_EX) : false;
    if ($written === false || !rename($temp, DATA_DIR . '/' . $name . '.json')) {
        if ($temp && is_file($temp)) unlink($temp);
        flock($lock, LOCK_UN);
        fclose($lock);
        out(500, ['ok' => false, 'error' => 'Не удалось сохранить данные']);
    }
    @chmod(DATA_DIR . '/' . $name . '.json', 0600);
    flock($lock, LOCK_UN);
    fclose($lock);
}

function body(): array
{
    $data = json_decode((string) file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function require_auth(): void
{
    if (empty($_SESSION['admin_authenticated'])) out(401, ['ok' => false, 'error' => 'Войдите в админку']);
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!hash_equals((string) ($_SESSION['csrf'] ?? ''), (string) $token)) {
        out(419, ['ok' => false, 'error' => 'Сессия устарела. Обновите страницу и войдите снова']);
    }
}

if (!is_dir(DATA_DIR)) @mkdir(DATA_DIR, 0700, true);
$configPath = dirname(__DIR__, 3) . '/ohotnik-config.php';
$config = is_file($configPath) ? require $configPath : [];
if (session_status() !== PHP_SESSION_ACTIVE) {
    ini_set('session.use_strict_mode', '1');
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_set_cookie_params(['httponly' => true, 'secure' => $isHttps, 'samesite' => 'Strict', 'path' => '/']);
    session_start();
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

if ($action === 'session' && $method === 'GET') {
    out(200, ['ok' => true, 'authenticated' => !empty($_SESSION['admin_authenticated']), 'csrf' => $_SESSION['csrf'] ?? null]);
}

if ($action === 'login' && $method === 'POST') {
    $hash = (string) ($config['admin_password_hash'] ?? '');
    $attempt = (string) (body()['password'] ?? '');
    if ($hash === '' || !password_verify($attempt, $hash)) {
        usleep(250000);
        out(401, ['ok' => false, 'error' => 'Неверный пароль или админка ещё не настроена']);
    }
    session_regenerate_id(true);
    $_SESSION['admin_authenticated'] = true;
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    out(200, ['ok' => true, 'csrf' => $_SESSION['csrf']]);
}

if ($action === 'logout' && $method === 'POST') {
    require_auth();
    $_SESSION = [];
    session_destroy();
    out(200, ['ok' => true]);
}

require_auth();

if ($action === 'upload' && $method === 'POST') {
    $file = $_FILES['image'] ?? null;
    if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || ($file['size'] ?? 0) > 8 * 1024 * 1024) {
        out(422, ['ok' => false, 'error' => 'Выберите изображение до 8 МБ']);
    }
    $imageInfo = @getimagesize($file['tmp_name']);
    $types = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
    $kind = $imageInfo[2] ?? 0;
    if (!isset($types[$kind])) out(422, ['ok' => false, 'error' => 'Поддерживаются только JPG, PNG и WebP']);
    $kindName = ($_GET['type'] ?? '') === 'hall' ? 'hall' : 'dish';
    $directory = dirname(__DIR__) . '/images/' . ($kindName === 'hall' ? 'halls' : 'menu') . '/uploads';
    if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) out(500, ['ok' => false, 'error' => 'Не удалось создать каталог изображений']);
    $filename = $kindName . '-' . bin2hex(random_bytes(10)) . '.' . $types[$kind];
    if (!move_uploaded_file($file['tmp_name'], $directory . '/' . $filename)) out(500, ['ok' => false, 'error' => 'Не удалось сохранить изображение']);
    @chmod($directory . '/' . $filename, 0644);
    out(200, ['ok' => true, 'image' => '/images/' . ($kindName === 'hall' ? 'halls' : 'menu') . '/uploads/' . $filename]);
}

if ($action === 'bootstrap' && $method === 'POST') {
    $current = read_store('menu');
    if (array_key_exists('dishes', $current)) out(200, ['ok' => true, 'menu' => $current]);
    $data = body();
    $menu = ['dishes' => $data['dishes'] ?? [], 'categories' => $data['categories'] ?? []];
    if (!$menu['dishes'] || !$menu['categories']) out(422, ['ok' => false, 'error' => 'Не удалось загрузить исходное меню']);
    write_store('menu', $menu);
    out(200, ['ok' => true, 'menu' => $menu]);
}

if ($action === 'menu' && $method === 'GET') {
    out(200, ['ok' => true, 'menu' => read_store('menu')]);
}

if ($action === 'menu' && $method === 'PUT') {
    $data = body();
    $dishes = $data['dishes'] ?? null;
    $categories = $data['categories'] ?? null;
    if (!is_array($dishes) || !is_array($categories) || !$categories) out(422, ['ok' => false, 'error' => 'Проверьте меню и категории']);
    $seen = [];
    foreach ($dishes as $dish) {
        if (!is_array($dish) || !isset($dish['id'], $dish['name'], $dish['category'], $dish['price'], $dish['image'])) out(422, ['ok' => false, 'error' => 'В блюде не заполнены обязательные поля']);
        if (!is_numeric($dish['price']) || (int) $dish['price'] < 0 || (int) $dish['price'] > 100000) out(422, ['ok' => false, 'error' => 'Цена должна быть от 0 до 100 000 ₽']);
        if (mb_strlen((string) $dish['name']) > 100 || mb_strlen((string) $dish['description']) > 500 || !in_array($dish['category'], $categories, true)) out(422, ['ok' => false, 'error' => 'Проверьте название, описание и категорию']);
        $id = (string) $dish['id'];
        if (isset($seen[$id])) out(422, ['ok' => false, 'error' => 'Идентификаторы блюд должны быть уникальными']);
        $seen[$id] = true;
    }
    write_store('menu', ['dishes' => array_values($dishes), 'categories' => array_values(array_unique($categories))]);
    out(200, ['ok' => true]);
}

if ($action === 'bootstrap-halls' && $method === 'POST') {
    $current = read_store('halls');
    if (array_key_exists('halls', $current)) out(200, ['ok' => true, 'halls' => $current['halls']]);
    $halls = body()['halls'] ?? null;
    if (!is_array($halls)) out(422, ['ok' => false, 'error' => 'Не удалось загрузить исходный список залов']);
    write_store('halls', ['halls' => array_values($halls)]);
    out(200, ['ok' => true, 'halls' => array_values($halls)]);
}

if ($action === 'halls' && $method === 'GET') {
    out(200, ['ok' => true, 'halls' => read_store('halls')['halls'] ?? null]);
}

if ($action === 'halls' && $method === 'PUT') {
    $halls = body()['halls'] ?? null;
    if (!is_array($halls)) out(422, ['ok' => false, 'error' => 'Проверьте список залов']);
    $seen = [];
    foreach ($halls as $hall) {
        if (!is_array($hall) || !isset($hall['id'], $hall['name'], $hall['capacity'])) out(422, ['ok' => false, 'error' => 'В зале не заполнены название и вместимость']);
        $id = (string) $hall['id'];
        $images = $hall['images'] ?? (isset($hall['image']) ? [$hall['image']] : []);
        if ($id === '' || isset($seen[$id])) out(422, ['ok' => false, 'error' => 'Идентификаторы залов должны быть уникальными']);
        if (mb_strlen((string) $hall['name']) > 100 || mb_strlen((string) $hall['capacity']) > 80) out(422, ['ok' => false, 'error' => 'Проверьте название и вместимость зала']);
        if (!is_array($images) || count($images) < 1) out(422, ['ok' => false, 'error' => 'Добавьте хотя бы одно фото зала']);
        foreach (['features', 'extras', 'images'] as $field) if (isset($hall[$field]) && !is_array($hall[$field])) out(422, ['ok' => false, 'error' => 'Проверьте список характеристик, доплат и фото']);
        $seen[$id] = true;
    }
    write_store('halls', ['halls' => array_values($halls)]);
    out(200, ['ok' => true]);
}

if ($action === 'stats' && $method === 'GET') {
    $requests = read_store('requests');
    $now = new DateTimeImmutable('now', new DateTimeZone('Europe/Moscow'));
    $today = $now->format('Y-m-d');
    $weekStart = $now->modify('monday this week')->setTime(0, 0)->getTimestamp();
    $stats = ['orders' => 0, 'leads' => 0, 'today' => 0, 'week' => 0, 'revenue' => 0, 'pending' => 0];
    foreach ($requests as $item) {
        $isOrder = ($item['type'] ?? '') === 'order';
        $stats[$isOrder ? 'orders' : 'leads']++;
        if (($item['status'] ?? 'new') === 'new') $stats['pending']++;
        $created = strtotime((string) ($item['created_at'] ?? ''));
        if ($created && date('Y-m-d', $created) === $today) $stats['today']++;
        if ($created && $created >= $weekStart) $stats['week']++;
        if ($isOrder) $stats['revenue'] += (int) ($item['total'] ?? 0);
    }
    out(200, ['ok' => true, 'stats' => $stats]);
}

if ($action === 'records' && $method === 'GET') {
    $type = $_GET['type'] ?? 'all';
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $perPage = 20;
    $items = array_values(array_filter(read_store('requests'), fn ($item) => $type === 'all' || (($type === 'orders') === (($item['type'] ?? '') === 'order'))));
    usort($items, fn ($a, $b) => strcmp((string) ($b['created_at'] ?? ''), (string) ($a['created_at'] ?? '')));
    $total = count($items);
    out(200, ['ok' => true, 'items' => array_slice($items, ($page - 1) * $perPage, $perPage), 'page' => $page, 'perPage' => $perPage, 'total' => $total, 'pages' => max(1, (int) ceil($total / $perPage))]);
}

if ($action === 'record' && $method === 'PATCH') {
    $data = body();
    $items = read_store('requests');
    $found = false;
    foreach ($items as &$item) {
        if (($item['id'] ?? '') !== ($data['id'] ?? null)) continue;
        if (!in_array($data['status'] ?? '', ['new', 'in_progress', 'done', 'cancelled'], true)) out(422, ['ok' => false, 'error' => 'Неизвестный статус']);
        $item['status'] = $data['status'];
        $found = true;
        break;
    }
    unset($item);
    if (!$found) out(404, ['ok' => false, 'error' => 'Заявка не найдена']);
    write_store('requests', $items);
    out(200, ['ok' => true]);
}

if ($action === 'record' && $method === 'DELETE') {
    $id = (string) ($_GET['id'] ?? '');
    $items = read_store('requests');
    $next = array_values(array_filter($items, fn ($item) => ($item['id'] ?? '') !== $id));
    if (count($next) === count($items)) out(404, ['ok' => false, 'error' => 'Заявка не найдена']);
    write_store('requests', $next);
    out(200, ['ok' => true]);
}

out(404, ['ok' => false, 'error' => 'Команда не найдена']);
