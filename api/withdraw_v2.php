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

$input = json_decode(file_get_contents('php://input'), true);

$amount = floatval($input['amount'] ?? 0);
$pixKey = $input['pixKey'] ?? '';
$pixType = $input['pixType'] ?? '';
$beneficiaryName = $input['beneficiaryName'] ?? '';
$beneficiaryDocument = $input['beneficiaryDocument'] ?? '';

// Validações
if ($amount < 50) {
    http_response_code(400);
    echo json_encode(['error' => 'Valor mínimo para saque é R$ 50,00']);
    exit;
}

if (empty($pixKey)) {
    http_response_code(400);
    echo json_encode(['error' => 'Chave PIX é obrigatória']);
    exit;
}

if (empty($beneficiaryName)) {
    http_response_code(400);
    echo json_encode(['error' => 'Nome do beneficiário é obrigatório']);
    exit;
}

if (empty($beneficiaryDocument) || strlen($beneficiaryDocument) !== 11) {
    http_response_code(400);
    echo json_encode(['error' => 'CPF do beneficiário inválido']);
    exit;
}

// Simular processamento do saque
$withdrawId = 'WD' . time() . rand(1000, 9999);

$response = [
    'success' => true,
    'withdraw_id' => $withdrawId,
    'amount' => $amount,
    'status' => 'pending',
    'message' => 'Saque solicitado com sucesso! Será processado em até 24 horas.',
    'estimated_completion' => date('Y-m-d H:i:s', strtotime('+24 hours'))
];

echo json_encode($response);
?>
