<?php
// Приём деплоя из GitHub Actions по HTTPS (FTP/SFTP между GitHub и Jino нестабильны).
//
// Запрос: POST, тело — JSON {"files": {"путь/файла": "<base64>", ...}},
// заголовки X-Deploy-Timestamp (unix-время) и
// X-Deploy-Signature = hex(HMAC-SHA256(timestamp + "." + тело, deploy_token)).
// deploy_token лежит в ~/ohotnik-config.php и в секрете DEPLOY_TOKEN репозитория.
//
// Файлы пишутся в папку сайта; старые сборки в assets/, которых нет в новой, удаляются.
// Всё, что вне папки сайта (конфиг, логи), скрипт не трогает.

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const MAX_AGE = 300; // подпись действительна 5 минут

function done(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

$configPath = dirname(__DIR__, 3) . '/ohotnik-config.php';
$config = is_file($configPath) ? require $configPath : [];
$token = (string) ($config['deploy_token'] ?? '');

// без настроенного ключа скрипт для всех выглядит как отсутствующий
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || strlen($token) < 32) {
    done(404, ['ok' => false]);
}

$body = (string) file_get_contents('php://input');
$ts = (int) ($_SERVER['HTTP_X_DEPLOY_TIMESTAMP'] ?? 0);
$signature = (string) ($_SERVER['HTTP_X_DEPLOY_SIGNATURE'] ?? '');
$expected = hash_hmac('sha256', $ts . '.' . $body, $token);

if (abs(time() - $ts) > MAX_AGE || !hash_equals($expected, $signature)) {
    done(403, ['ok' => false, 'error' => 'bad signature']);
}

$files = json_decode($body, true)['files'] ?? null;
if (!is_array($files) || !isset($files['index.html'])) {
    done(400, ['ok' => false, 'error' => 'no files']);
}

$root = dirname(__DIR__); // папка сайта: .../domains/ohotnik-oz.ru
$written = [];

foreach ($files as $path => $content) {
    $path = (string) $path;
    // только относительные пути без «..»; из скрытых файлов разрешён лишь .htaccess
    $safe = preg_match('#^[A-Za-z0-9_\-./]+$#', $path)
        && strpos($path, '..') === false
        && $path[0] !== '/'
        && !preg_match('#(^|/)\.(?!htaccess$)#', $path);
    $data = is_string($content) ? base64_decode($content, true) : false;
    if (!$safe || $data === false) {
        done(400, ['ok' => false, 'error' => "bad file: {$path}"]);
    }

    $target = "{$root}/{$path}";
    $dir = dirname($target);
    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        done(500, ['ok' => false, 'error' => "mkdir failed: {$path}"]);
    }
    // запись через временный файл и rename — посетитель не увидит полузаписанный файл
    $tmp = "{$target}.deploy-tmp";
    if (file_put_contents($tmp, $data) === false || !rename($tmp, $target)) {
        @unlink($tmp);
        done(500, ['ok' => false, 'error' => "write failed: {$path}"]);
    }
    chmod($target, 0644);
    @chmod($dir, 0755);
    $written[$path] = true;
}

// удаляем старые файлы сборки (у них хэш в имени, новые сборки их не перезаписывают)
$removed = 0;
foreach (glob("{$root}/assets/*") ?: [] as $old) {
    if (is_file($old) && !isset($written['assets/' . basename($old)])) {
        $removed += (int) unlink($old);
    }
}

done(200, ['ok' => true, 'written' => count($written), 'removed' => $removed]);
