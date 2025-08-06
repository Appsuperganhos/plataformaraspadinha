<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$qrcode = $_POST['qrcode'] ?? '';

if (empty($qrcode)) {
    http_response_code(400);
    echo json_encode(['error' => 'QR Code é obrigatório']);
    exit;
}

// Simular consulta de pagamento
// Em um ambiente real, você consultaria a API do gateway de pagamento
$paid = rand(1, 10) > 8; // 20% de chance de estar pago (para demonstração)

$response = [
    'success' => true,
    'paid' => $paid,
    'qrcode' => $qrcode,
    'status' => $paid ? 'paid' : 'pending',
    'paid_at' => $paid ? date('Y-m-d H:i:s') : null
];

echo json_encode($response);
?>
