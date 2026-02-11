# Prompt Engineering Tool

A dual-panel web application that helps users craft better prompts for GPT-4 through direct interaction and guided prompt enhancement.

## Overview

This tool features two interaction modes:
- **Direct Panel**: Standard chat with GPT-4
- **Enhanced Panel**: Guided questionnaire to build refined prompts through 7 strategic questions (topic, AI role, context, audience level, tone, examples, diversity)

## Architecture Flow

```
User Input → JavaScript (script.js) → PHP Backend (api/gpt4_request.php)
                                           ↓
                                    Load/Save Session
                                           ↓
                                    OpenAI GPT-4 API
                                           ↓
                                    Response → Display
```

**Data Flow:**
1. User enters message in either panel
2. Frontend validates and sends to `api/gpt4_request.php` via fetch
3. Backend loads conversation history from session
4. Sends conversation context to OpenAI GPT-4
5. Receives and stores AI response
6. Returns response to frontend
7. Frontend displays message and updates UI

**Session Management:**
- PHP sessions track users
- Conversations stored in `api/sessions/{session_id}.json`
- History limited to last 10 messages (5 exchanges)
- File locking prevents concurrent write conflicts

## Technologies Used

**Frontend:**
- HTML5, CSS3 (flexbox, CSS variables for theming)
- Vanilla JavaScript (ES6+, async/await, fetch API)
- Font Awesome 6.4.0 icons

**Backend:**
- PHP 7.4+ (sessions, file I/O, cURL)
- OpenAI GPT-4 API (chat completions endpoint)

## Code Explanation

### `api/config.php`
Loads environment variables from `.env` file:
```php
// Reads .env file
$envFile = __DIR__ . '/../.env';
$lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

// Parses KEY=VALUE format
foreach ($lines as $line) {
    list($key, $value) = explode('=', $line, 2);
    $_ENV[$key] = trim($value);
}

// Defines API_KEY constant
define('API_KEY', $_ENV['OPENAI_API_KEY'] ?? '');
```

### `api/gpt4_request.php`
Handles API requests to OpenAI:
```php
// 1. Validate and load API key
require_once 'config.php';

// 2. Start session and load conversation history
session_start();
$session_id = session_id();
$conversation = $_SESSION['conversation'] ?? [];

// 3. Add user message and trim history
$conversation[] = ['role' => 'user', 'content' => $prompt];
if (count($conversation) >= 10) {
    $conversation = array_slice($conversation, -8);
}

// 4. Send to OpenAI API
$data = [
    'model' => 'gpt-4',
    'messages' => $conversation,
    'temperature' => 0.7,
    'max_tokens' => 1000
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $api_key
]);

// 5. Process response and save
$ai_response = json_decode(curl_exec($ch), true)['choices'][0]['message']['content'];
$conversation[] = ['role' => 'assistant', 'content' => $ai_response];
file_put_contents("sessions/{$session_id}.json", json_encode($conversation));
```

### `script.js`
Frontend interaction logic:
```javascript
// Fetch response from backend
async function fetchGPT4Response(prompt) {
    const response = await fetch('api/gpt4_request.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
    });
    const data = await response.json();
    return data.response;
}

// Handle message sending
function sendDirectMessage() {
    const message = directInput.value.trim();
    addMessage(directChat, message, 'user');
    showTypingIndicator(directChat);
    
    fetchGPT4Response(message).then(response => {
        removeTypingIndicator(directChat);
        addMessage(directChat, response, 'ai');
    });
}

// Enhanced panel manages state for 7-question flow
let enhancedState = {
    isAskingQuestions: false,
    currentQuestionIndex: 0,
    userPrompt: '',
    answers: []
};
```

## Project Structure

```
test-dep/
├── index.html           # Dual-panel UI layout
├── script.js           # Frontend logic (1521 lines)
├── styles.css          # Styling with theme support (629 lines)
├── .env                # API key (create this, not in repo)
├── .env.example        # Template for .env
└── api/
    ├── config.php      # Loads .env and defines API_KEY
    ├── gpt4_request.php # Handles OpenAI API calls (344 lines)
    └── sessions/       # Conversation storage (JSON files)
```

## How to Run

### 1. Setup Environment

```bash
# Create .env file with your OpenAI API key
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env

# Create sessions directory
mkdir -p api/sessions
chmod 755 api/sessions
```

Get your API key from: https://platform.openai.com/api-keys

### 2. Start Server

```bash
# Using PHP built-in server
php -S localhost:8000
```

### 3. Access Application

Open browser to: `http://localhost:8000`

### 4. Usage

**Direct Panel (Left):**
- Type message → Press Enter → Get response

**Enhanced Panel (Right):**
- Enter initial idea → Answer 7 questions → Copy enhanced prompt → Use in Direct Panel

## Troubleshooting

**"API key is not configured"**
→ Create `.env` file with `OPENAI_API_KEY=your_key`

**No response from AI**
→ Check API key validity and billing status at OpenAI dashboard

**Session not persisting**
→ Ensure `api/sessions/` exists and is writable (chmod 755)

**Enable debug mode:**
```php
// Add to api/gpt4_request.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

---

**Note:** Requires active OpenAI API key. Usage incurs costs. Monitor at https://platform.openai.com/usage
