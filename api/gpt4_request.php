<?php
// Vercel doesn't use .env files - it uses getenv() for environment variables
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get input
$input = json_decode(file_get_contents('php://input'), true);
$prompt = $input['prompt'] ?? '';

if (empty($prompt)) {
    http_response_code(400);
    echo json_encode(['error' => 'Prompt is required']);
    exit();
}

// Get API key from Vercel environment variable (NOT from .env)
$apiKey = getenv('OPENAI_API_KEY');

// Debug: Check if API key exists (remove after testing)
if (empty($apiKey)) {
    http_response_code(500);
    echo json_encode([
        'error' => 'API key not configured',
        'debug' => 'OPENAI_API_KEY environment variable is empty'
    ]);
    exit();
}

// Prepare API request
$data = [
    'model' => 'gpt-4',
    'messages' => [
        ['role' => 'user', 'content' => $prompt]
    ],
    'temperature' => 0.7,
    'max_tokens' => 500
];

// Make API request
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Handle curl errors
if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'CURL error', 'details' => $curlError]);
    exit();
}

// Handle non-200 responses
if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode([
        'error' => 'OpenAI API error',
        'http_code' => $httpCode,
        'details' => json_decode($response, true)
    ]);
    exit();
}

// Return successful response
echo $response;
?>
