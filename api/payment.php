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

// Simular geração de PIX
$amount = floatval($_POST['amount'] ?? 0);
$cpf = $_POST['cpf'] ?? '';

if ($amount < 20) {
    http_response_code(400);
    echo json_encode(['error' => 'Valor mínimo é R$ 20,00']);
    exit;
}

if (empty($cpf) || strlen($cpf) !== 11) {
    http_response_code(400);
    echo json_encode(['error' => 'CPF inválido']);
    exit;
}

// Gerar código PIX simulado
$qrcode = 'PIX' . time() . rand(1000, 9999);

// Simular resposta da API de pagamento
$response = [
    'success' => true,
    'qrcode' => $qrcode,
    'amount' => $amount,
    'expires_at' => date('Y-m-d H:i:s', strtotime('+15 minutes')),
    'message' => 'PIX gerado com sucesso'
];

echo json_encode($response);
?>
