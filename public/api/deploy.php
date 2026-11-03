<?php
// Деплой по сигналу из GitHub Actions. Крупные передачи данных из GitHub в Jino
// зависают (FTP, SFTP и HTTPS-загрузка одинаково), а короткие запросы и скачивание
// с GitHub на Jino работают стабильно. Поэтому GitHub присылает только короткий
// подписанный манифест, а файлы сайт скачивает сам.
//
// Запрос: POST, тело — JSON {"commit": "<sha коммита ветки build>", "hashes": {"путь": "<sha256>", ...}},
// заголовки X-Deploy-Timestamp (unix-время) и
// X-Deploy-Signature = hex(HMAC-SHA256(timestamp + "." + тело, deploy_token)).
// deploy_token лежит в ~/ohotnik-config.php и в секрете DEPLOY_TOKEN репозитория.
//
// Скачиваются только изменившиеся файлы, каждый проверяется по sha256.
// Старые сборки в assets/, которых нет в манифесте, удаляются.
// Всё, что вне папки сайта (конфиг, логи), скрипт не трогает.

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const MAX_AGE = 300; // подпись действительна 5 минут
const REPO = 'AlinaGntv/ohotnik-oz';

set_time_limit(240);

function done(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function download(string $url): ?string
{
    for ($attempt = 1; $attempt <= 3; $attempt++) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 60,
        ]);
        $data = curl_exec($ch);
        if (is_string($data) && curl_getinfo($ch, CURLINFO_HTTP_CODE) === 200) {
            return $data;
        }
        sleep(2);
    }
    return null;
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

$manifest = json_decode($body, true);
$commit = (string) ($manifest['commit'] ?? '');
$files = $manifest['hashes'] ?? null;
if (!preg_match('/^[0-9a-f]{40}$/', $commit) || !is_array($files) || !isset($files['index.html'])) {
    done(400, ['ok' => false, 'error' => 'bad manifest']);
}

$root = dirname(__DIR__); // папка сайта: .../domains/ohotnik-oz.ru

// 1. проверяем пути и скачиваем изменившиеся файлы во временную память
$pending = [];
foreach ($files as $path => $hash) {
    $path = (string) $path;
    // только относительные пути без «..»; из скрытых файлов разрешён лишь .htaccess
    $safe = preg_match('#^[A-Za-z0-9_\-./]+$#', $path)
        && strpos($path, '..') === false
        && $path[0] !== '/'
        && !preg_match('#(^|/)\.(?!htaccess$)#', $path)
        && preg_match('/^[0-9a-f]{64}$/', (string) $hash);
    if (!$safe) {
        done(400, ['ok' => false, 'error' => "bad file: {$path}"]);
    }

    $target = "{$root}/{$path}";
    if (is_file($target) && hash_file('sha256', $target) === $hash) {
        continue; // файл не менялся
    }

    $data = download('https://raw.githubusercontent.com/' . REPO . "/{$commit}/{$path}");
    if ($data === null || hash('sha256', $data) !== $hash) {
        done(502, ['ok' => false, 'error' => "download failed: {$path}"]);
    }
    $pending[$path] = $data;
}

// 2. записываем — только когда скачано всё, чтобы не оставить сайт наполовину обновлённым.
// index.html последним: он ссылается на новые файлы assets/
uksort($pending, fn ($a, $b) => ($a === 'index.html') <=> ($b === 'index.html'));
foreach ($pending as $path => $data) {
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
}

// 3. удаляем старые файлы сборки (у них хэш в имени, новые сборки их не перезаписывают)
$removed = 0;
foreach (glob("{$root}/assets/*") ?: [] as $old) {
    if (is_file($old) && !isset($files['assets/' . basename($old)])) {
        $removed += (int) unlink($old);
    }
}

done(200, ['ok' => true, 'commit' => substr($commit, 0, 7), 'updated' => array_keys($pending), 'removed' => $removed]);
