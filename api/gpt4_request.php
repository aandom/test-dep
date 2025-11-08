<?php

// require_once 'config.php'; // Contains your API_KEY

// // Validate API key
// if (!defined('API_KEY') || empty(API_KEY)) {
//     http_response_code(500);
//     header('Content-Type: application/json');
//     echo json_encode(['error' => 'API key is not configured']);
//     exit;
// }
// $api_key = API_KEY;

// // Start PHP session
// if (session_status() == PHP_SESSION_NONE) {
//     // Configure session parameters (optional, but good practice)
//     ini_set('session.cookie_httponly', 1);
//     ini_set('session.use_strict_mode', 1);
//     // Consider setting session.save_path if your default isn't writable or secure enough
//     session_start();
// }


// // Set content type
// header('Content-Type: application/json');

// // Get the request body
// $input = json_decode(file_get_contents('php://input'), true);
// $prompt = $input['prompt'] ?? '';

// if (empty($prompt)) {
//     http_response_code(400);
//     echo json_encode(['error' => 'Prompt is required']);
//     exit;
// }

// // Use PHP session ID
// $session_id = session_id();

// // Define session file path
// $sessions_dir = __DIR__ . '/sessions/'; // Use absolute path for reliability
// if (!is_dir($sessions_dir)) {
//     if (!mkdir($sessions_dir, 0755, true) || !is_writable($sessions_dir)) {
//         http_response_code(500);
//         error_log("Unable to create or write to sessions directory: " . $sessions_dir);
//         echo json_encode(['error' => 'Server configuration error: Unable to manage session data.']);
//         exit;
//     }
// }
// $session_file = $sessions_dir . $session_id . '.json';

// // Initialize conversation from session or file
// $conversation_history = []; // Default to empty array

// if (isset($_SESSION['conversation_' . $session_id])) {
//     $conversation_history = $_SESSION['conversation_' . $session_id];
// } elseif (file_exists($session_file)) {
//     $file_content = file_get_contents($session_file);
//     if ($file_content !== false) {
//         $decoded_content = json_decode($file_content, true);
//         if (is_array($decoded_content)) {
//             $conversation_history = $decoded_content;
//             $_SESSION['conversation_' . $session_id] = $conversation_history; // Load into session
//         }
//     }
// }


// // Trim conversation if it exceeds the limit (before adding new message)
// // OpenAI's API expects an array of message objects: {role: "user/assistant", content: "text"}
// $max_messages_in_history = 10; // Keep last 5 pairs (user + AI)
// if (count($conversation_history) >= $max_messages_in_history) {
//     // Keep the latest N messages. array_slice with negative offset does this.
//     $conversation_history = array_slice($conversation_history, -$max_messages_in_history + 2); // +2 to make space for current user and upcoming AI message
// }

// // Add user's new message
// $conversation_history[] = [
//     'role' => 'user',
//     'content' => $prompt
//     // 'timestamp' => time() // Timestamps are not part of the OpenAI API message format
// ];

// // Prepare the request to OpenAI API
// $data = [
//     'model' => 'gpt-4', // Or your preferred model
//     'messages' => $conversation_history, // Send the current history
//     'temperature' => 0.7,
//     'max_tokens' => 1000 // Adjust as needed
// ];

// // Initialize cURL session
// $ch = curl_init('https://api.openai.com/v1/chat/completions');
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_POST, true);
// curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
// curl_setopt($ch, CURLOPT_HTTPHEADER, [
//     'Content-Type: application/json',
//     'Authorization: Bearer ' . $api_key
// ]);
// curl_setopt($ch, CURLOPT_TIMEOUT, 60); // Set a timeout for the API call (e.g., 60 seconds)


// // Execute the request
// $response = curl_exec($ch);
// $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
// $curl_error = curl_error($ch);
// curl_close($ch);

// // Check for cURL errors
// if ($curl_error) {
//     http_response_code(500);
//     error_log("cURL Error: " . $curl_error);
//     echo json_encode(['error' => 'Failed to connect to AI service. cURL error: ' . $curl_error]);
//     exit;
// }

// // Check for API errors
// if ($http_status != 200) {
//     $error_data = json_decode($response, true);
//     $api_error_message = $error_data['error']['message'] ?? 'Unknown API error occurred.';
//     http_response_code($http_status);
//     error_log("OpenAI API Error (HTTP {$http_status}): " . $api_error_message . " | Response: " . $response);
//     echo json_encode(['error' => $api_error_message]);
//     exit;
// }

// // Process the response
// $response_data = json_decode($response, true);
// $ai_response_content = $response_data['choices'][0]['message']['content'] ?? 'No meaningful response received from AI.';

// // Add AI response to conversation history
// $conversation_history[] = [
//     'role' => 'assistant',
//     'content' => $ai_response_content
// ];

// // Update session and save to file
// $_SESSION['conversation_' . $session_id] = $conversation_history;

// $file_save_successful = file_put_contents($session_file, json_encode($conversation_history), LOCK_EX);
// if ($file_save_successful === false) {
//     error_log("Failed to write to session file: " . $session_file);
//     // Continue, but log the error. The session still holds the data.
// }


// // Return response with session ID
// http_response_code(200);
// echo json_encode([
//     'response' => $ai_response_content,
//     'session_id' => $session_id // Good for debugging or if client needs it
// ]);

/**
 * GPT-4 Request Handler
 * 
 * Handles API requests to OpenAI's GPT-4 model with session-based conversation management.
 * Uses PHP sessions and file storage for conversation persistence.
 * 
 * @author 
 * @version 
 * @package PromptEnhancer
 */

require_once 'config.php';

// Validate API key is configured and available
if (!defined('API_KEY') || empty(API_KEY)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'API key is not configured']);
    exit;
}
$api_key = API_KEY;

// Start PHP session to track conversation state
session_start();

// Set response content type to JSON
header('Content-Type: application/json');

/**
 * Parse incoming JSON request and extract user prompt
 * @var array $input Decoded JSON request body
 * @var string $prompt User's input prompt
 */
$input = json_decode(file_get_contents('php://input'), true);
$prompt = $input['prompt'] ?? '';

// Validate that prompt was provided
if (empty($prompt)) {
    http_response_code(400);
    echo json_encode(['error' => 'Prompt is required']);
    exit;
}

/**
 * Initialize session file storage for conversation persistence
 * @var string $session_id Current PHP session identifier
 * @var string $sessions_dir Directory for storing session files
 * @var string $session_file Full path to current session's JSON file
 */
$session_id = session_id();
$sessions_dir = 'sessions/';

// Create sessions directory if it doesn't exist
if (!is_dir($sessions_dir)) {
    if (!mkdir($sessions_dir, 0755, true) || !is_writable($sessions_dir)) {
        http_response_code(500);
        echo json_encode(['error' => 'Unable to create or write to sessions directory']);
        exit;
    }
}
$session_file = $sessions_dir . $session_id . '.json';

/**
 * Load existing conversation from session or restore from file
 * @var array $conversation Message history array with role, content, and timestamp
 */
if (!isset($_SESSION['conversation'])) {
    $_SESSION['conversation'] = [];
    
    // Restore conversation from file if it exists
    if (file_exists($session_file)) {
        $file = fopen($session_file, 'r');
        if ($file && flock($file, LOCK_SH)) {
            $conversation = json_decode(fread($file, filesize($session_file)), true);
            if (is_array($conversation)) {
                $_SESSION['conversation'] = $conversation;
            }
            flock($file, LOCK_UN);
            fclose($file);
        }
    }
}
$conversation = &$_SESSION['conversation'];

/**
 * Limit conversation history to prevent exceeding token limits
 * Maintains last 10 messages (5 user/assistant pairs)
 */
$max_messages = 10;
if (count($conversation) >= $max_messages) {
    $conversation = array_slice($conversation, -$max_messages + 2);
}

// Add user's message to conversation with timestamp
$conversation[] = [
    'role' => 'user',
    'content' => $prompt,
    'timestamp' => time()
];

/**
 * Build OpenAI API request payload
 * @var array $data Request data including model, messages, and parameters
 */
$data = [
    'model' => 'gpt-4',
    'messages' => $conversation,
    'temperature' => 0.7,
    'max_tokens' => 1000
];

/**
 * Send request to OpenAI API using cURL
 * @var resource $ch cURL handle
 * @var string|false $response Raw API response body
 * @var int $http_status HTTP response status code
 */
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $api_key
]);

$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Check for API errors and return error response
if ($http_status != 200) {
    $error_data = json_decode($response, true);
    http_response_code($http_status);
    echo json_encode(['error' => $error_data['error']['message'] ?? 'Unknown API error']);
    exit;
}

/**
 * Extract AI response from API result
 * @var array $response_data Decoded JSON response from OpenAI
 * @var string $ai_response Generated text content from AI
 */
$response_data = json_decode($response, true);
$ai_response = $response_data['choices'][0]['message']['content'] ?? 'No response';

// Store AI's response in conversation history
$conversation[] = [
    'role' => 'assistant',
    'content' => $ai_response,
    'timestamp' => time()
];

/**
 * Save updated conversation to file with file locking
 * @var resource|false $file File handle for session storage
 */
$file = fopen($session_file, 'c');
if ($file) {
    if (flock($file, LOCK_EX)) {
        ftruncate($file, 0);
        fwrite($file, json_encode($conversation));
        flock($file, LOCK_UN);
        fclose($file);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Unable to lock session file for writing']);
        fclose($file);
        exit;
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to open session file for writing']);
    exit;
}

/**
 * Send successful response to client
 * Format: {"response": "AI message", "session_id": "session_identifier"}
 */
http_response_code(200);
echo json_encode([
    'response' => $ai_response,
    'session_id' => $session_id
]);



?>
