<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$path = dirname(__DIR__, 3) . '/ohotnik-data/menu.json';
if (!is_file($path)) {
    echo json_encode(['dishes' => null, 'categories' => null], JSON_UNESCAPED_UNICODE);
    exit;
}

$data = json_decode((string) file_get_contents($path), true);
if (!is_array($data) || !isset($data['dishes'], $data['categories'])) {
    http_response_code(503);
    echo json_encode(['error' => 'Меню временно недоступно'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
