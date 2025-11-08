
// document.addEventListener('DOMContentLoaded', function() {

//     const themeToggleButton = document.getElementById('themetoggle');
//     const themeToggleIcon = themeToggleButton.querySelector('i');

//     function applyTheme(theme) {
//       document.body.classList.remove('dark', 'light');
//       document.body.classList.add(theme);
//       if (theme === 'dark') {
//         themeToggleIcon.classList.remove('fa-moon');
//         themeToggleIcon.classList.add('fa-sun');
//         themeToggleButton.setAttribute('aria-label', 'Switch to light theme');
//       } else {
//         themeToggleIcon.classList.remove('fa-sun');
//         themeToggleIcon.classList.add('fa-moon');
//         themeToggleButton.setAttribute('aria-label', 'Switch to dark theme');
//       }
//     }

//     const savedTheme = localStorage.getItem('theme') || 'light';
//     applyTheme(savedTheme);

//     themeToggleButton.addEventListener('click', function () {
//       const isDark = document.body.classList.contains('dark');
//       const newTheme = isDark ? 'light' : 'dark';
//       localStorage.setItem('theme', newTheme);
//       applyTheme(newTheme);
//     });

//     const directChat = document.getElementById('direct-chat');
//     const directInput = document.getElementById('direct-input');
//     const directSendBtn = document.getElementById('direct-send');
    
//     const enhancedChat = document.getElementById('enhanced-chat');
//     const enhancedInput = document.getElementById('enhanced-input');
//     const enhancedSendBtn = document.getElementById('enhanced-send');
    
//     let enhancedState = {
//       isAskingQuestions: false,
//       currentQuestionIndex: 0,
//       userPrompt: '', // This will store the user's initial, overall prompt/topic
//       answers: [],
//       questions: [
//           "What is the topic?",
//           "What is the role of AI (e.g., think like a social media influencer, CEO, Phd, etc.)?",
//           "What contextual information do you want the AI to know about the topic?",
//           "What's the level of knowledge of the reader of the prompt outcome(beginner, intermediate, Expert, etc.)?",
//           "What tone of language is needed (e.g., formal, informal, academic, enthusiastic, witty, empathetic, persuasive, neutral, etc.)?",
//           "What examples do you have in mind?",
//           "Do you care about diversity?"
//       ]
//     };
    
//     function autoResizeTextarea(textarea) {
//         textarea.style.height = 'auto';
//         let newHeight = textarea.scrollHeight;
//         if (newHeight === 0 && textarea.value === '') {
//             const computedStyle = getComputedStyle(textarea);
//             const minHeight = parseInt(computedStyle.minHeight, 10) || 52;
//             newHeight = minHeight;
//         }
//         textarea.style.height = (newHeight > 200 ? 200 : newHeight) + 'px';
//     }
    
//     [directInput, enhancedInput].forEach(textarea => {
//         textarea.addEventListener('input', function() { autoResizeTextarea(this); });
//         autoResizeTextarea(textarea);
//     });
    
//     directSendBtn.addEventListener('click', sendDirectMessage);
//     directInput.addEventListener('keypress', function(e) {
//         if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendDirectMessage(); }
//     });
    
//     enhancedSendBtn.addEventListener('click', sendEnhancedMessage);
//     enhancedInput.addEventListener('keypress', function(e) {
//         if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendEnhancedMessage(); }
//     });
    
//     function sendDirectMessage() {
//         const message = directInput.value.trim();
//         if (message) {
//             addMessage(directChat, message, 'user');
//             directInput.value = '';
//             autoResizeTextarea(directInput);
//             showTypingIndicator(directChat);
//             fetchGPT4Response(message)
//                 .then(response => {
//                     removeTypingIndicator(directChat);
//                     addMessage(directChat, response, 'ai');
//                 })
//                 .catch(error => {
//                     console.error('Error in sendDirectMessage:', error);
//                     removeTypingIndicator(directChat);
//                     addMessage(directChat, 'Sorry, there was an error processing your request. Please try again.', 'ai');
//                 });
//         }
//     }
    
//     function sendEnhancedMessage() {
//       const message = enhancedInput.value.trim();
//       if (!message) return;
      
//       addMessage(enhancedChat, message, 'user');
//       enhancedInput.value = '';
//       autoResizeTextarea(enhancedInput);
      
//       const isGreeting = /^(continue|hello|hi|hey|greetings|howdy|good morning|good afternoon|good evening)(\s|$)/i.test(message);
      
//       if (isGreeting && !enhancedState.isAskingQuestions) {
//           showTypingIndicator(enhancedChat);
//           fetchGPT4Response(message)
//               .then(response => {
//                   removeTypingIndicator(enhancedChat);
//                   addMessage(enhancedChat, response, 'ai');
//               })
//               .catch(error => {
//                   console.error('Error in sendEnhancedMessage (greeting):', error);
//                   removeTypingIndicator(enhancedChat);
//                   addMessage(enhancedChat, 'Sorry, there was an error processing your request.', 'ai');
//               });
//       } else if (!enhancedState.isAskingQuestions) {
//           enhancedState.isAskingQuestions = true;
//           enhancedState.currentQuestionIndex = 0;
//           enhancedState.userPrompt = message; // Store the initial user message as the main topic
//           enhancedState.answers = [];
          
//           showTypingIndicator(enhancedChat);
//           setTimeout(() => {
//               removeTypingIndicator(enhancedChat);
//               const qIndex = enhancedState.currentQuestionIndex;
//               const qText = enhancedState.questions[qIndex];
//               const stepIndicator = `<strong class="step-indicator">Step ${qIndex + 1} of ${enhancedState.questions.length}:</strong> `;
//               let firstQuestionMessage = `I'd like to help you craft a better prompt. ${stepIndicator}${qText}`;
//               addMessage(enhancedChat, firstQuestionMessage, 'ai', { isQuestion: true, questionIndex: qIndex, originalQuestionText: qText });
//           }, 1000);

//       } else { 
//           enhancedState.answers.push(message);
          
//           if (enhancedState.currentQuestionIndex < enhancedState.questions.length - 1) {
//             enhancedState.currentQuestionIndex++;
//             showTypingIndicator(enhancedChat);
//             setTimeout(() => {
//                 removeTypingIndicator(enhancedChat);
//                 const qIndex = enhancedState.currentQuestionIndex;
//                 const qText = enhancedState.questions[qIndex];
//                 const stepIndicator = `<strong class="step-indicator">Step ${qIndex + 1} of ${enhancedState.questions.length}:</strong> `;
//                 let nextQuestionMessage = stepIndicator + qText;
//                 addMessage(enhancedChat, nextQuestionMessage, 'ai', { isQuestion: true, questionIndex: qIndex, originalQuestionText: qText });
//             }, 1000);
//           } else {
//               const finalEnhancedPrompt = constructEnhancedPrompt(enhancedState.userPrompt, enhancedState.answers);
//               displayEnhancedPromptWithOptions(enhancedChat, finalEnhancedPrompt);
//               enhancedState.isAskingQuestions = false;
//               enhancedState.currentQuestionIndex = 0;
//               enhancedState.userPrompt = ''; // Clear for next round
//               enhancedState.answers = [];
//           }
//       }
//     }

//     function constructEnhancedPrompt(originalUserTopic, answers) {
//       let finalOutputPrompt = `Act as ${answers[1] || 'a helpful AI assistant'}. `;
//       finalOutputPrompt += `Your target audience has a ${answers[3] || 'general'} level of knowledge. `;
//       finalOutputPrompt += `The tone should be ${answers[4] || 'neutral and informative'}. `;
//       finalOutputPrompt += `The primary goal is to address: "${originalUserTopic}".\n\n`; // Use originalUserTopic
//       finalOutputPrompt += `Consider the following details:\n`;
//       finalOutputPrompt += `- Topic/Subject: ${answers[0] || 'As per the original query'}\n`;
//       if (answers[2] && answers[2].trim() !== '' && !['n/a', 'skip'].includes(answers[2].toLowerCase())) {
//         finalOutputPrompt += `- Key Context: ${answers[2]}\n`;
//       }
//       if (answers[5] && answers[5].trim() !== '' && !['n/a', 'skip'].includes(answers[5].toLowerCase())) {
//         finalOutputPrompt += `- Output Style/Examples: Try to emulate aspects of "${answers[5]}"\n`;
//       }
//       if (answers[6] && answers[6].trim() !== '' && !['n/a', 'skip'].includes(answers[6].toLowerCase())) {
//         finalOutputPrompt += `- Diversity Note: ${answers[6]}\n`;
//       }
//       finalOutputPrompt += `\nPlease provide a comprehensive response to: "${originalUserTopic}"`; // Use originalUserTopic
//       return finalOutputPrompt;
//     }
    
//     function showTypingIndicator(container) {
//         if (container.querySelector('.typing-message')) return;
//         const messageDiv = document.createElement('div');
//         messageDiv.className = 'message typing-message';
//         const messageContent = document.createElement('div');
//         messageContent.className = 'message-content';
//         const avatar = document.createElement('div');
//         avatar.className = 'avatar ai-avatar';
//         const icon = document.createElement('i');
//         icon.className = 'fas fa-robot';
//         avatar.appendChild(icon);
//         const content = document.createElement('div');
//         content.className = 'content';
//         const typingIndicator = document.createElement('div');
//         typingIndicator.className = 'typing-indicator';
//         for (let i = 0; i < 3; i++) {
//             const dot = document.createElement('div');
//             dot.className = 'typing-dot';
//             typingIndicator.appendChild(dot);
//         }
//         content.appendChild(typingIndicator);
//         messageContent.appendChild(avatar);
//         messageContent.appendChild(content);
//         messageDiv.appendChild(messageContent);
//         container.appendChild(messageDiv);
//         container.scrollTop = container.scrollHeight;
//     }
    
//     function removeTypingIndicator(container) {
//         const typingIndicator = container.querySelector('.typing-message');
//         if (typingIndicator) typingIndicator.remove();
//     }
    
//     function addMessage(container, text, sender, options = {}) {
//         const messageDiv = document.createElement('div');
//         messageDiv.className = 'message';
//         if (sender === 'user') messageDiv.classList.add('user-message-bubble');
//         else messageDiv.classList.add('ai-message-bubble');
        
//         const messageContentDiv = document.createElement('div');
//         messageContentDiv.className = 'message-content';
        
//         const avatarDiv = document.createElement('div');
//         avatarDiv.className = sender === 'user' ? 'avatar user-avatar' : 'avatar ai-avatar';
//         const icon = document.createElement('i');
//         icon.className = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
//         avatarDiv.appendChild(icon);
        
//         const contentDiv = document.createElement('div');
//         contentDiv.className = 'content';
        
//         if (options.isRawHtml) {
//             contentDiv.innerHTML = text;
//         } else {
//             let htmlContent = escapeHtml(text)
//                 .replace(/```([\s\S]*?)```/g, (match, code) => `<pre><code>${code.trim()}</code></pre>`)
//                 .replace(/`([^`]+)`/g, (match, code) => `<code>${code}</code>`)
//                 .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                 .replace(/\*(.*?)\*/g, '<em>$1</em>')
//                 .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
//                 .replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, headingText) => `<h${hashes.length}>${headingText.trim()}</h${hashes.length}>`)
//                 .replace(/^\s*-\s+(.*)$/gm, '<ul><li>$1</li></ul>')
//                 .replace(/^\s*\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>')
//                 .replace(/\n/g, '<br>');
//             htmlContent = htmlContent.replace(/<\/ul>\s*<ul>/g, '');
//             htmlContent = htmlContent.replace(/<\/ol>\s*<ol>/g, '');
            
//             if (sender === 'ai' && options.isQuestion) {
//                  contentDiv.innerHTML = text; // text already contains HTML for step indicator
//             } else {
//                  contentDiv.innerHTML = htmlContent;
//             }
//         }
        
//         if (sender === 'ai' && options.isQuestion) {
//             const suggestionIconWrapper = document.createElement('span');
//             suggestionIconWrapper.className = 'suggestion-icon-trigger';
//             suggestionIconWrapper.setAttribute('role', 'button');
//             suggestionIconWrapper.setAttribute('tabindex', '0');
//             suggestionIconWrapper.title = 'Get a suggestion for this question';

//             const iconElement = document.createElement('i');
//             iconElement.className = 'fas fa-lightbulb'; // Default icon
//             suggestionIconWrapper.appendChild(iconElement);

//             suggestionIconWrapper.dataset.questionIndex = options.questionIndex;
//             suggestionIconWrapper.dataset.originalQuestionText = options.originalQuestionText;
            
//             const handleSuggestionEvent = (event) => { // Use a wrapper for click/keydown
//                  event.preventDefault(); // Prevent default for spacebar scroll, etc.
//                  handleGetSuggestionClick(event, iconElement, options.originalQuestionText, options.questionIndex);
//             };

//             suggestionIconWrapper.addEventListener('click', handleSuggestionEvent);
//             suggestionIconWrapper.addEventListener('keydown', (e) => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                     handleSuggestionEvent(e);
//                 }
//             });
//             contentDiv.appendChild(suggestionIconWrapper);

//             const suggestionDisplayContainer = document.createElement('div');
//             suggestionDisplayContainer.className = 'suggestion-display-container';
//             suggestionDisplayContainer.id = `suggestion-container-${options.questionIndex}`;
//             suggestionDisplayContainer.style.display = 'none';
//             contentDiv.appendChild(suggestionDisplayContainer);
//         }

//         messageContentDiv.appendChild(avatarDiv);
//         messageContentDiv.appendChild(contentDiv);
//         messageDiv.appendChild(messageContentDiv);
//         container.appendChild(messageDiv);
//         container.scrollTop = container.scrollHeight;
//     }

//     function escapeHtml(unsafe) {
//         if (typeof unsafe !== 'string') return '';
//         return unsafe
//              .replace(/&/g, "&")
//              .replace(/</g, "<")
//              .replace(/>/g, ">")
//              .replace(/"/g, "&quot")
//              .replace(/'/g, "'");
//     }
    
//     async function fetchGPT4Response(prompt) {
//         const url = 'api/gpt4_request.php';
//         try {
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ prompt: prompt })
//             });
//             if (!response.ok) {
//                 const errorData = await response.text();
//                 throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Details: ${errorData}`);
//             }
//             const data = await response.json();
//             if (data.error) throw new Error(data.error);
//             return data.response || "No response content received.";
//         } catch (error) {
//             console.error('Error fetching GPT-4 response:', error.message);
//             return `Sorry, an error occurred: ${error.message}. Please check the console.`;
//         }
//     }

//     async function handleGetSuggestionClick(event, iconElement, originalQuestionText, questionIndex) {
//         const iconWrapper = iconElement.parentElement; // Get the span wrapper
//         if (iconWrapper.classList.contains('loading')) return; // Prevent multiple clicks

//         iconWrapper.classList.add('loading');
//         const originalIconClasses = iconElement.className; // Store original classes
//         iconElement.className = 'fas fa-spinner fa-spin'; // Loading spinner

//         const suggestionContainer = document.getElementById(`suggestion-container-${questionIndex}`);
//         if (!suggestionContainer) {
//             console.error("Suggestion container not found for question index:", questionIndex);
//             iconElement.className = originalIconClasses; // Revert icon
//             iconWrapper.classList.remove('loading');
//             return;
//         }
//         suggestionContainer.innerHTML = '';
//         suggestionContainer.style.display = 'block';

//         const miniLoader = document.createElement('div');
//         miniLoader.className = 'typing-indicator';
//         for (let i = 0; i < 3; i++) {
//             const dot = document.createElement('div');
//             dot.className = 'typing-dot';
//             miniLoader.appendChild(dot);
//         }
//         suggestionContainer.appendChild(miniLoader);

//         const userMainTopic = enhancedState.userPrompt; // Get the overall topic
//         const suggestionPrompt = `A user is trying to construct a detailed AI prompt. Their main topic/goal is: "${userMainTopic ? escapeHtml(userMainTopic) : 'not yet specified'}".
// They are currently being asked the following question to help refine their prompt: "${escapeHtml(originalQuestionText)}".
// Provide a concise (1-2 sentences) and helpful suggestion to guide the user in answering this specific question *in the context of their main topic*. The suggestion could clarify the question's intent or offer examples of what kind of information would be useful, keeping their main topic in mind.
// Output only the suggestion text itself, without any conversational fluff or repeating the question.`;
        
//         try {
//             const suggestionResponse = await fetchGPT4Response(suggestionPrompt);
//             miniLoader.remove();

//             if (suggestionResponse && !suggestionResponse.startsWith("Sorry, an error occurred:")) {
//                 const suggestionElement = document.createElement('div');
//                 suggestionElement.className = 'ai-suggestion-text';
//                 suggestionElement.innerHTML = `<strong>Suggestion:</strong> ${escapeHtml(suggestionResponse).replace(/\n/g, '<br>')}`;
//                 suggestionContainer.appendChild(suggestionElement);
                
//                 iconElement.className = 'fas fa-check-circle text-success'; // Success icon
//                 // iconWrapper.style.display = 'none'; // Optionally hide icon trigger after success
//             } else {
//                 suggestionContainer.innerHTML = `<p class="error-text">Could not load suggestion. ${escapeHtml(suggestionResponse)}</p>`;
//                 iconElement.className = 'fas fa-times-circle text-danger'; // Error icon
//             }
//         } catch (error) {
//             console.error('Error fetching suggestion:', error);
//             miniLoader.remove();
//             suggestionContainer.innerHTML = `<p class="error-text">Error fetching suggestion. Please try again.</p>`;
//             iconElement.className = 'fas fa-times-circle text-danger'; // Error icon
//         } finally {
//             // Revert icon after a delay, unless it was hidden
//             if (iconWrapper.style.display !== 'none') {
//                 setTimeout(() => {
//                     iconElement.className = originalIconClasses; // Revert to original (e.g., lightbulb)
//                     iconWrapper.classList.remove('loading');
//                 }, 2000); // Show success/error icon for 2 seconds
//             } else {
//                  iconWrapper.classList.remove('loading'); // Still remove loading class if hidden
//             }
//         }
//     }

//     function displayEnhancedPromptWithOptions(container, promptText) {
//         //const avatarHtml = `<div class="avatar ai-avatar"><i class="fas fa-robot"></i></div>`;
//         let contentHtml = `<div class="content">`;
//         contentHtml += `<p>Thanks! Here's the enhanced prompt I've constructed based on your answers. You can copy it and paste it into the <strong>Direct Interaction</strong> panel:</p>`;
//         contentHtml += `<pre><code>${escapeHtml(promptText)}</code></pre>`;
//         const copyButtonId = `copy-prompt-${Date.now()}`;
//         contentHtml += `<button id="${copyButtonId}" class="copy-prompt-button">Copy Prompt</button>`;
//         contentHtml += `</div>`;
//         const messageContentHtml = `<div class="message-content">${contentHtml}</div>`;
//         addMessage(container, messageContentHtml, 'ai', { isRawHtml: true });

//         const newCopyButton = document.getElementById(copyButtonId);
//         if (newCopyButton) {
//             newCopyButton.addEventListener('click', () => {
//                 navigator.clipboard.writeText(promptText).then(() => {
//                     newCopyButton.textContent = 'Copied!';
//                     newCopyButton.disabled = true;
//                     setTimeout(() => {
//                         newCopyButton.textContent = 'Copy Prompt';
//                         newCopyButton.disabled = false;
//                     }, 2000);
//                 }).catch(err => {
//                     console.error('Failed to copy text: ', err);
//                     newCopyButton.textContent = 'Copy Failed';
//                     setTimeout(() => { newCopyButton.textContent = 'Copy Prompt'; }, 2000);
//                 });
//             });
//         }
//     }
// });



// document.addEventListener('DOMContentLoaded', function() {

//     const themeToggleButton = document.getElementById('themetoggle');
//     const themeToggleIcon = themeToggleButton.querySelector('i');

//     function applyTheme(theme) {
//       document.body.classList.remove('dark', 'light');
//       document.body.classList.add(theme);
//       if (theme === 'dark') {
//         themeToggleIcon.classList.remove('fa-moon');
//         themeToggleIcon.classList.add('fa-sun');
//         themeToggleButton.setAttribute('aria-label', 'Switch to light theme');
//       } else {
//         themeToggleIcon.classList.remove('fa-sun');
//         themeToggleIcon.classList.add('fa-moon');
//         themeToggleButton.setAttribute('aria-label', 'Switch to dark theme');
//       }
//     }

//     const savedTheme = localStorage.getItem('theme') || 'light';
//     applyTheme(savedTheme);

//     themeToggleButton.addEventListener('click', function () {
//       const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
//       localStorage.setItem('theme', newTheme);
//       applyTheme(newTheme);
//     });

//     const directChat = document.getElementById('direct-chat');
//     const directInput = document.getElementById('direct-input');
//     const directSendBtn = document.getElementById('direct-send');
    
//     const enhancedChat = document.getElementById('enhanced-chat');
//     const enhancedInput = document.getElementById('enhanced-input');
//     const enhancedSendBtn = document.getElementById('enhanced-send');
//     const enhancedInputBox = enhancedInput.closest('.input-box'); // Get the parent input-box

//     const SKIP_ANSWER_SENTINEL = "USER_CHOSE_TO_SKIP_THIS_QUESTION"; // Used to mark skipped questions internally
    
//     let enhancedState = {
//       isAskingQuestions: false,
//       initialGreetingShown: false,
//       currentQuestionIndex: 0,
//       userPrompt: '', 
//       answers: [],
//       questions: [ 
//           { text: "What is the topic?", staticSuggestion: "Example: 'The history of AI', 'marketing strategies for a new app', 'a Python script for data analysis'." },
//           { text: "What is the role of AI (e.g., think like a social media influencer, CEO, PhD, etc.)?", staticSuggestion: "Defining a role helps the AI adopt a specific voice, style, and knowledge base. E.g., 'Act as a travel guide,' 'Be a Socratic philosopher.'" },
//           { text: "What contextual information do you want the AI to know about the topic?", staticSuggestion: "Include specific background details, data points, or prior knowledge. E.g., 'The target audience is small business owners,' 'Assume familiarity with basic calculus.'" },
//           { text: "What's the level of knowledge of the reader of the prompt outcome (beginner, intermediate, Expert, etc.)?", staticSuggestion: "This tailors the complexity and vocabulary. E.g., 'Explain it to a 5-year-old,' 'Write for a graduate-level audience.'" },
//           { text: "What tone of language is needed (e.g., formal, informal, academic, enthusiastic, witty, empathetic, persuasive, neutral, etc.)?", staticSuggestion: "The tone affects how the message is received. E.g., 'Use a formal and respectful tone,' 'Be playful and humorous.'" },
//           { text: "What examples do you have in mind?", staticSuggestion: "Provide 1-2 examples of the desired output style or key phrases. E.g., 'Similar to the style of Neil Gaiman,' 'Include bullet points for key takeaways.'" },
//           { text: "Do you care about diversity and inclusivity in the response?", staticSuggestion: "Consider aspects like cultural sensitivity, inclusive language, or avoiding biases. E.g., 'Ensure examples are globally relevant,' 'Use gender-neutral pronouns.'" }
//       ]
//     };
    
//     function autoResizeTextarea(textarea) {
//         textarea.style.height = 'auto';
//         let newHeight = textarea.scrollHeight;
//         if (newHeight === 0 && textarea.value === '') {
//             const computedStyle = getComputedStyle(textarea);
//             const minHeight = parseInt(computedStyle.minHeight, 10) || 52;
//             newHeight = minHeight;
//         }
//         textarea.style.height = (newHeight > 200 ? 200 : newHeight) + 'px';
//     }
    
//     directInput.addEventListener('input', function() { autoResizeTextarea(this); });
//     enhancedInput.addEventListener('input', function() { autoResizeTextarea(this); });
//     autoResizeTextarea(directInput);
//     autoResizeTextarea(enhancedInput);
    
//     directSendBtn.addEventListener('click', sendDirectMessage);
//     directInput.addEventListener('keypress', function(e) {
//         if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendDirectMessage(); }
//     });
    
//     enhancedSendBtn.addEventListener('click', sendEnhancedMessage);
//     enhancedInput.addEventListener('keypress', function(e) {
//         if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendEnhancedMessage(); }
//     });

//     enhancedChat.addEventListener('click', function(event) {
//         if (event.target.classList.contains('show-suggestion-btn')) {
//             const suggestionContent = event.target.nextElementSibling;
//             if (suggestionContent && suggestionContent.classList.contains('suggestion-content')) {
//                 const isHidden = suggestionContent.style.display === 'none';
//                 suggestionContent.style.display = isHidden ? 'block' : 'none';
//                 const isAISuggestion = event.target.textContent.includes('(AI)');
//                 if (isHidden) {
//                     event.target.textContent = isAISuggestion ? 'Hide Suggestion (AI)' : 'Hide Suggestion';
//                 } else {
//                     event.target.textContent = isAISuggestion ? 'Show Suggestion (AI)' : 'Show Suggestion';
//                 }
//             }
//         }
//     });

//     // Function to display the initial greeting
//     function displayInitialGreeting() {
//         if (!enhancedState.initialGreetingShown) {
//             const greetingHtml = `Hello! I'm here to help you build a more effective prompt.
//             <br><br>Please start by typing your initial idea, goal, or question in the message box below.
//             <br>For example: <em>"Write a marketing plan for a new coffee shop"</em> or <em>"Explain black holes to a child."</em>`;
//             addMessage(enhancedChat, greetingHtml, 'ai', true); // true for isHtml
//             enhancedState.initialGreetingShown = true;
//         }
//     }
//     // Call the greeting function when the script loads
//     displayInitialGreeting();
    
//     function sendDirectMessage() {
//         const message = directInput.value.trim();
//         if (message) {
//             addMessage(directChat, message, 'user');
//             directInput.value = '';
//             autoResizeTextarea(directInput);
//             showTypingIndicator(directChat);
//             fetchGPT4Response(message)
//                 .then(response => {
//                     removeTypingIndicator(directChat);
//                     addMessage(directChat, response, 'ai');
//                 })
//                 .catch(error => {
//                     console.error('Error in sendDirectMessage:', error);
//                     removeTypingIndicator(directChat);
//                     addMessage(directChat, 'Sorry, an error occurred processing your request.', 'ai');
//                 });
//         }
//     }
    
//     function sendEnhancedMessage() {
//       const message = enhancedInput.value.trim();
//       if (!message) return;
      
//       addMessage(enhancedChat, message, 'user');
//       enhancedInput.value = '';
//       autoResizeTextarea(enhancedInput);
      
//       const isGreetingOrSimpleQuery = /^(continue|hello|hi|hey|greetings|howdy|good morning|good afternoon|good evening|ok|yes|no|next)(\s|$)/i.test(message);
      
//       if (!enhancedState.isAskingQuestions) { // This is the initial prompt from the user
//           enhancedState.isAskingQuestions = true;
//           enhancedState.currentQuestionIndex = 0;
//           enhancedState.userPrompt = message; 
//           enhancedState.answers = []; 
//           addSkipButton(); // Add skip button when Q&A starts
          
//           askNextEnhancedQuestion("Great! Thanks for that initial prompt. Now, let's refine it. Here's the first question:\n");
//       } else { // This is an answer to one of the enhancing questions
//           processUserAnswer(message);
//       }
//     }

//     function processUserAnswer(answer) {
//         enhancedState.answers.push(answer);
//         displayIntermediateEnhancedPrompt(); // Show current prompt state

//         if (enhancedState.currentQuestionIndex < enhancedState.questions.length - 1) {
//             enhancedState.currentQuestionIndex++;
//             askNextEnhancedQuestion();
//         } else {
//             // All questions answered
//             addMessage(enhancedChat, "Excellent! We've gone through all the refinement steps.", 'ai');
//             // The final prompt is already shown by displayIntermediateEnhancedPrompt in the last step
//             // So now we just show the copyable version.
//             const finalEnhancedPrompt = constructEnhancedPrompt(enhancedState.userPrompt, enhancedState.answers);
//             displayEnhancedPromptWithOptions(enhancedChat, finalEnhancedPrompt, "Here's the final enhanced prompt. You can copy it:");
            
//             enhancedState.isAskingQuestions = false;
//             removeSkipButton();
//             displayInitialGreeting(); // Re-display greeting for next round after a small delay
//         }
//     }

//     function handleSkipQuestion() {
//         addMessage(enhancedChat, "Okay, skipping this question.", 'ai');
//         processUserAnswer(SKIP_ANSWER_SENTINEL); // Use the sentinel for skipped answer
//     }

//     function addSkipButton() {
//         if (enhancedInputBox.querySelector('.skip-question-btn')) return; // Already exists

//         const skipButton = document.createElement('button');
//         skipButton.textContent = 'Skip Question';
//         skipButton.className = 'skip-question-btn';
//         skipButton.type = 'button'; // Important for forms, though not strictly a form here
//         skipButton.addEventListener('click', handleSkipQuestion);
        
//         // Insert it before the send button
//         enhancedInputBox.insertBefore(skipButton, enhancedSendBtn);
//     }

//     function removeSkipButton() {
//         const skipButton = enhancedInputBox.querySelector('.skip-question-btn');
//         if (skipButton) {
//             skipButton.remove();
//         }
//     }

//     function askNextEnhancedQuestion(leadInText = "") {
//         showTypingIndicator(enhancedChat);
//         setTimeout(() => {
//             removeTypingIndicator(enhancedChat);

//             const questionObj = enhancedState.questions[enhancedState.currentQuestionIndex];
//             const questionText = questionObj.text;
            
//             const stepInfo = `Step ${enhancedState.currentQuestionIndex + 1} of ${enhancedState.questions.length}: `;
//             const mainQuestionHtml = escapeHtml(leadInText + stepInfo + questionText).replace(/\n/g, '<br />');

//             const suggestionPlaceholderId = `sg-ph-${Date.now()}-${enhancedState.currentQuestionIndex}`;
//             const fullMessageHtml = mainQuestionHtml + `<div id="${suggestionPlaceholderId}" class="suggestion-placeholder"><small><i>Fetching suggestion...</i></small></div>`;
            
//             addMessage(enhancedChat, fullMessageHtml, 'ai', true); 

//             fetchAndDisplayDynamicSuggestion(
//                 enhancedState.userPrompt, 
//                 questionObj, 
//                 suggestionPlaceholderId
//             );
//         }, 700); // Reduced delay slightly
//     }

//     async function fetchAndDisplayDynamicSuggestion(userInitialPrompt, questionObject, placeholderId) {
//         const placeholderDiv = document.getElementById(placeholderId);
//         if (!placeholderDiv) return;

//         const currentQuestionText = questionObject.text;
//         let suggestionButtonText = "Show Suggestion";
//         let suggestionContentHtml = "";

//         try {
//             const suggestionPrompt = `User's initial goal: "${userInitialPrompt}". Current question to user: "${currentQuestionText}". Provide a concise (1-2 sentences, max 30 words) tip or example to help answer THIS question effectively. Do NOT answer the question. Suggestion:`;
//             let aiSuggestionText = await fetchGPT4Response(suggestionPrompt);
//             aiSuggestionText = aiSuggestionText.replace(/^Suggestion:\s*/i, '').trim().replace(/^["']|["']$/g, '');

//             if (aiSuggestionText && aiSuggestionText.length > 5 && aiSuggestionText !== "No response content received." && !aiSuggestionText.toLowerCase().includes("error")) {
//                 suggestionButtonText = "Show Suggestion (AI)";
//                 suggestionContentHtml = `<div class="suggestion-content suggestion-island" style="display:none;"><strong>Suggestion:</strong> ${escapeHtml(aiSuggestionText).replace(/\n/g, '<br />')}</div>`;
//             } else {
//                 throw new Error("AI suggestion not usable.");
//             }
//         } catch (error) {
//             console.warn("Dynamic suggestion failed, falling back to static:", error.message);
//             if (questionObject.staticSuggestion) {
//                 suggestionButtonText = "Show Suggestion";
//                 suggestionContentHtml = `<div class="suggestion-content suggestion-island" style="display:none;"><strong>Suggestion:</strong> ${escapeHtml(questionObject.staticSuggestion).replace(/\n/g, '<br />')}</div>`;
//             }
//         }

//         if (suggestionContentHtml) {
//             placeholderDiv.className = 'suggestion-interactive';
//             const buttonHtml = `<button class="show-suggestion-btn">${suggestionButtonText}</button>`;
//             placeholderDiv.innerHTML = buttonHtml + suggestionContentHtml;
//         } else {
//             placeholderDiv.className = 'suggestion-fallback';
//             placeholderDiv.innerHTML = `<small><i>No suggestion available.</i></small>`;
//         }
//     }

//     function constructEnhancedPrompt(originalPrompt, answers) {
//       let finalOutputPrompt = `Act as ${answers[1] && answers[1] !== SKIP_ANSWER_SENTINEL ? answers[1] : 'a helpful AI assistant'}. `;
      
//       const audienceKnowledge = answers[3] && answers[3] !== SKIP_ANSWER_SENTINEL ? answers[3] : 'general';
//       finalOutputPrompt += `Your target audience has a ${audienceKnowledge} level of knowledge. `;
      
//       const tone = answers[4] && answers[4] !== SKIP_ANSWER_SENTINEL ? answers[4] : 'neutral and informative';
//       finalOutputPrompt += `The tone should be ${tone}. `;
      
//       finalOutputPrompt += `The primary goal is to address: "${originalPrompt}".\n\n`;
//       finalOutputPrompt += `Consider the following details:\n`;
      
//       const topic = answers[0] && answers[0] !== SKIP_ANSWER_SENTINEL ? answers[0] : 'As per the original query';
//       finalOutputPrompt += `- Topic/Subject: ${topic}\n`;

//       if (answers[2] && answers[2] !== SKIP_ANSWER_SENTINEL && answers[2].trim() !== '' && !/^(n\/?a)$/i.test(answers[2])) {
//         finalOutputPrompt += `- Key Context: ${answers[2]}\n`;
//       }
//       if (answers[5] && answers[5] !== SKIP_ANSWER_SENTINEL && answers[5].trim() !== '' && !/^(n\/?a)$/i.test(answers[5])) {
//         finalOutputPrompt += `- Output Style/Examples: Try to emulate aspects of "${answers[5]}"\n`;
//       }
//       if (answers[6] && answers[6] !== SKIP_ANSWER_SENTINEL && answers[6].trim() !== '' && !/^(n\/?a)$/i.test(answers[6])) {
//         finalOutputPrompt += `- Diversity/Inclusivity Note: ${answers[6]}\n`;
//       }
//       finalOutputPrompt += `\nPlease provide a comprehensive response to: "${originalPrompt}"`;
//       return finalOutputPrompt;
//     }

//     function displayIntermediateEnhancedPrompt() {
//         const currentAnswers = [...enhancedState.answers];
//         // Fill remaining answers with SKIP_ANSWER_SENTINEL if not all questions are answered yet
//         // for the purpose of constructing an *intermediate* prompt.
//         // This ensures constructEnhancedPrompt always gets an array of the expected length.
//         while (currentAnswers.length < enhancedState.questions.length) {
//             currentAnswers.push(SKIP_ANSWER_SENTINEL); 
//         }

//         const promptText = constructEnhancedPrompt(enhancedState.userPrompt, currentAnswers);
//         const messageDiv = document.createElement('div');
//         messageDiv.className = 'message ai-message-bubble intermediate-prompt-display';

//         const messageContentDiv = document.createElement('div');
//         messageContentDiv.className = 'message-content';

//         const avatarDiv = document.createElement('div');
//         avatarDiv.className = 'avatar ai-avatar';
//         const icon = document.createElement('i');
//         icon.className = 'fas fa-cogs'; // Different icon for prompt construction
//         avatarDiv.appendChild(icon);

//         const contentDiv = document.createElement('div');
//         contentDiv.className = 'content';

//         const infoP = document.createElement('p');
//         infoP.innerHTML = `<strong>Current Enhanced Prompt (so far):</strong>`;
//         contentDiv.appendChild(infoP);

//         const pre = document.createElement('pre');
//         const code = document.createElement('code');
//         code.textContent = promptText;
//         pre.appendChild(code);
//         contentDiv.appendChild(pre);
        
//         messageContentDiv.appendChild(avatarDiv);
//         messageContentDiv.appendChild(contentDiv);
//         messageDiv.appendChild(messageContentDiv);
//         enhancedChat.appendChild(messageDiv);
//         enhancedChat.scrollTop = enhancedChat.scrollHeight;
//     }
    
//     function showTypingIndicator(container) {
//         if (container.querySelector('.typing-message')) return;
//         const messageDiv = document.createElement('div');
//         messageDiv.className = 'message typing-message';
//         const messageContent = document.createElement('div');
//         messageContent.className = 'message-content';
//         const avatar = document.createElement('div');
//         avatar.className = 'avatar ai-avatar';
//         const icon = document.createElement('i');
//         icon.className = 'fas fa-robot';
//         avatar.appendChild(icon);
//         const content = document.createElement('div');
//         content.className = 'content';
//         const typingIndicator = document.createElement('div');
//         typingIndicator.className = 'typing-indicator';
//         for (let i = 0; i < 3; i++) {
//             const dot = document.createElement('div');
//             dot.className = 'typing-dot';
//             typingIndicator.appendChild(dot);
//         }
//         content.appendChild(typingIndicator);
//         messageContent.appendChild(avatar);
//         messageContent.appendChild(content);
//         messageDiv.appendChild(messageContent);
//         container.appendChild(messageDiv);
//         container.scrollTop = container.scrollHeight;
//     }
    
//     function removeTypingIndicator(container) {
//         const typingIndicator = container.querySelector('.typing-message');
//         if (typingIndicator) typingIndicator.remove();
//     }
    
//     function addMessage(container, textOrHtml, sender, isHtml = false) {
//         const messageDiv = document.createElement('div');
//         messageDiv.className = 'message';
//         messageDiv.classList.add(sender === 'user' ? 'user-message-bubble' : 'ai-message-bubble');
        
//         const messageContentDiv = document.createElement('div');
//         messageContentDiv.className = 'message-content';
        
//         const avatarDiv = document.createElement('div');
//         avatarDiv.className = `avatar ${sender === 'user' ? 'user-avatar' : 'ai-avatar'}`;
//         const icon = document.createElement('i');
//         icon.className = `fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}`;
//         avatarDiv.appendChild(icon);
        
//         const contentDiv = document.createElement('div');
//         contentDiv.className = 'content';
        
//         if (isHtml) {
//             contentDiv.innerHTML = textOrHtml;
//         } else {
//             let htmlOutput = escapeHtml(textOrHtml)
//                 .replace(/```([\s\S]*?)```/g, (match, code) => `<pre><code>${code.trim()}</code></pre>`)
//                 .replace(/`([^`]+)`/g, (match, code) => `<code>${code}</code>`)
//                 .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                 .replace(/\*(.*?)\*/g, '<em>$1</em>')
//                 .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
//                 .replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, headingText) => `<h${hashes.length}>${headingText.trim()}</h${hashes.length}>`)
//                 .replace(/^\s*-\s+(.*)$/gm, '<ul><li>$1</li></ul>')
//                 .replace(/^\s*\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>')
//                 .replace(/\n/g, '<br>');
//             htmlOutput = htmlOutput.replace(/<\/ul>\s*<br \/>\s*<ul>/g, '');
//             htmlOutput = htmlOutput.replace(/<\/ol>\s*<br \/>\s*<ol>/g, '');
//             contentDiv.innerHTML = htmlOutput;
//         }
        
//         messageContentDiv.appendChild(avatarDiv);
//         messageContentDiv.appendChild(contentDiv);
//         messageDiv.appendChild(messageContentDiv);
//         container.appendChild(messageDiv);
//         container.scrollTop = container.scrollHeight;
//     }

//     function escapeHtml(unsafe) {
//         if (typeof unsafe !== 'string') return '';
//         return unsafe
//              .replace(/&/g, "&")
//              .replace(/</g, "<")
//              .replace(/>/g, ">")
//              .replace(/"/g, "&quot")
//              .replace(/'/g, "'");
//     }
    
//     async function fetchGPT4Response(prompt) {
//         const url = 'api/gpt4_request.php';
//         try {
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ prompt: prompt })
//             });
//             if (!response.ok) {
//                 const errorData = await response.text();
//                 throw new Error(`Network error: ${response.status} ${response.statusText}. Details: ${errorData}`);
//             }
//             const data = await response.json();
//             if (data.error) throw new Error(data.error);
//             return data.response || "No response content received.";
//         } catch (error) {
//             console.error('Error fetching GPT-4 response:', error.message);
//             return `Sorry, an error occurred: ${error.message}.`;
//         }
//     }

//     function displayEnhancedPromptWithOptions(container, promptText, headingText = "Thanks! Here's the enhanced prompt...") {
//         const messageDiv = document.createElement('div');
//         messageDiv.className = 'message ai-message-bubble';
//         const messageContentDiv = document.createElement('div');
//         messageContentDiv.className = 'message-content';
//         const avatarDiv = document.createElement('div');
//         avatarDiv.className = 'avatar ai-avatar';
//         const icon = document.createElement('i');
//         icon.className = 'fas fa-magic'; // Changed icon for final prompt
//         avatarDiv.appendChild(icon);
//         const contentDiv = document.createElement('div');
//         contentDiv.className = 'content';

//         const infoP = document.createElement('p');
//         infoP.innerHTML = escapeHtml(headingText).replace(/\n/g, '<br />') + " You can copy it and paste it into the <strong>Direct Interaction</strong> panel:";
//         contentDiv.appendChild(infoP);

//         const pre = document.createElement('pre');
//         const code = document.createElement('code');
//         code.textContent = promptText;
//         pre.appendChild(code);
//         contentDiv.appendChild(pre);

//         const copyButton = document.createElement('button');
//         copyButton.textContent = 'Copy Final Prompt';
//         copyButton.className = 'copy-prompt-button';
//         copyButton.addEventListener('click', () => {
//             navigator.clipboard.writeText(promptText).then(() => {
//                 copyButton.textContent = 'Copied!';
//                 copyButton.disabled = true;
//                 setTimeout(() => { copyButton.textContent = 'Copy Final Prompt'; copyButton.disabled = false; }, 2000);
//             }).catch(err => {
//                 console.error('Failed to copy: ', err);
//                 copyButton.textContent = 'Copy Failed';
//                 setTimeout(() => { copyButton.textContent = 'Copy Final Prompt'; }, 2000);
//             });
//         });
//         contentDiv.appendChild(copyButton);
//         messageContentDiv.appendChild(avatarDiv);
//         messageContentDiv.appendChild(contentDiv);
//         messageDiv.appendChild(messageContentDiv);
//         container.appendChild(messageDiv);
//         container.scrollTop = container.scrollHeight;
//     }
// });




document.addEventListener('DOMContentLoaded', function() {

    const themeToggleButton = document.getElementById('themetoggle');
    const themeToggleIcon = themeToggleButton.querySelector('i');

    /**
     * Applies the specified theme to the page and updates the theme toggle button.
     * @param {string} theme - The theme to apply ('dark' or 'light').
     */
    function applyTheme(theme) {
      document.body.classList.remove('dark', 'light');
      document.body.classList.add(theme);
      if (theme === 'dark') {
        themeToggleIcon.classList.remove('fa-moon');
        themeToggleIcon.classList.add('fa-sun');
        themeToggleButton.setAttribute('aria-label', 'Switch to light theme');
      } else {
        themeToggleIcon.classList.remove('fa-sun');
        themeToggleIcon.classList.add('fa-moon');
        themeToggleButton.setAttribute('aria-label', 'Switch to dark theme');
      }
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggleButton.addEventListener('click', function () {
      const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });

    const directChat = document.getElementById('direct-chat');
    const directInput = document.getElementById('direct-input');
    const directSendBtn = document.getElementById('direct-send');
    
    const enhancedChat = document.getElementById('enhanced-chat');
    const enhancedInput = document.getElementById('enhanced-input');
    const enhancedSendBtn = document.getElementById('enhanced-send');
    const enhancedInputBox = enhancedInput.closest('.input-box'); // Get the parent input-box

    const SKIP_ANSWER_SENTINEL = "USER_CHOSE_TO_SKIP_THIS_QUESTION"; // Used to mark skipped questions internally
    
    let enhancedState = {
      isAskingQuestions: false,
      initialGreetingShown: false,
      currentQuestionIndex: 0,
      userPrompt: '', 
      answers: [],
      questions: [ 
          { text: "What is the topic?", staticSuggestion: "Example: 'The history of AI', 'marketing strategies for a new app', 'a Python script for data analysis'." },
          { text: "What is the role of AI (e.g., think like a social media influencer, CEO, PhD, etc.)?", staticSuggestion: "Defining a role helps the AI adopt a specific voice, style, and knowledge base. E.g., 'Act as a travel guide,' 'Be a Socratic philosopher.'" },
          { text: "What contextual information do you want the AI to know about the topic?", staticSuggestion: "Include specific background details, data points, or prior knowledge. E.g., 'The target audience is small business owners,' 'Assume familiarity with basic calculus.'" },
          { text: "What's the level of knowledge of the reader of the prompt outcome (beginner, intermediate, Expert, etc.)?", staticSuggestion: "This tailors the complexity and vocabulary. E.g., 'Explain it to a 5-year-old,' 'Write for a graduate-level audience.'" },
          { text: "What tone of language is needed (e.g., formal, informal, academic, enthusiastic, witty, empathetic, persuasive, neutral, etc.)?", staticSuggestion: "The tone affects how the message is received. E.g., 'Use a formal and respectful tone,' 'Be playful and humorous.'" },
          { text: "What examples do you have in mind?", staticSuggestion: "Provide 1-2 examples of the desired output style or key phrases. E.g., 'Similar to the style of Neil Gaiman,' 'Include bullet points for key takeaways.'" },
          { text: "Do you care about diversity and inclusivity in the response?", staticSuggestion: "Consider aspects like cultural sensitivity, inclusive language, or avoiding biases. E.g., 'Ensure examples are globally relevant,' 'Use gender-neutral pronouns.'" }
      ]
    };
    
    /**
     * Automatically adjusts the height of a textarea based on its content.
     * @param {HTMLTextAreaElement} textarea - The textarea element to resize.
     */
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        let newHeight = textarea.scrollHeight;
        if (newHeight === 0 && textarea.value === '') {
            const computedStyle = getComputedStyle(textarea);
            const minHeight = parseInt(computedStyle.minHeight, 10) || 52;
            newHeight = minHeight;
        }
        textarea.style.height = (newHeight > 200 ? 200 : newHeight) + 'px';
    }
    
    directInput.addEventListener('input', function() { autoResizeTextarea(this); });
    enhancedInput.addEventListener('input', function() { autoResizeTextarea(this); });
    autoResizeTextarea(directInput);
    autoResizeTextarea(enhancedInput);
    
    directSendBtn.addEventListener('click', sendDirectMessage);
    directInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendDirectMessage(); }
    });
    
    enhancedSendBtn.addEventListener('click', sendEnhancedMessage);
    enhancedInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendEnhancedMessage(); }
    });

    // START OF MODIFIED JS (Suggestion button and Skip button event listeners)
    enhancedChat.addEventListener('click', function(event) {
        const button = event.target.closest('.show-suggestion-btn'); // Handles clicks on icon inside button too
        if (button) {
            const suggestionInteractive = button.closest('.suggestion-interactive');
            const suggestionContent = suggestionInteractive.querySelector('.suggestion-content');
            if (suggestionContent) {
                const isHidden = suggestionContent.style.display === 'none';
                suggestionContent.style.display = isHidden ? 'block' : 'none';
                
                const isAISuggestion = button.dataset.isAi === 'true';
                if (isHidden) {
                    button.title = isAISuggestion ? 'Hide AI Suggestion' : 'Hide Suggestion';
                    button.classList.add('active');
                } else {
                    button.title = isAISuggestion ? 'Show AI Suggestion' : 'Show Suggestion';
                    button.classList.remove('active');
                }
            }
        }
        
        // Handle Skip Question button clicks
        const skipButton = event.target.closest('.skip-question-btn');
        if (skipButton && !skipButton.disabled) {
            const questionIndex = parseInt(skipButton.dataset.questionIndex, 10);
            // Only allow skipping if this is the current active question
            if (questionIndex === enhancedState.currentQuestionIndex && enhancedState.isAskingQuestions) {
                handleSkipQuestion(questionIndex);
            }
        }
    });
    // END OF MODIFIED JS

    /**
     * Displays the initial greeting message in the enhanced chat panel.
     * Only shows once when the page loads or after a session is completed.
     */
    function displayInitialGreeting() {
        if (!enhancedState.initialGreetingShown) {
            const greetingHtml = `Hello! I'm here to help you build a more effective prompt.
            <br><br>Please start by typing your initial idea, goal, or question in the message box below.
            <br>For example: <em>"Write a marketing plan for a new coffee shop"</em> or <em>"Explain black holes to a child."</em>`;
            addMessage(enhancedChat, greetingHtml, 'ai', true); // true for isHtml
            enhancedState.initialGreetingShown = true;
        }
    }
    // Call the greeting function when the script loads
    displayInitialGreeting();
    
    /**
     * Sends a message from the direct interaction panel to the GPT-4 API.
     * Displays the user message, shows a typing indicator, and then displays the AI response.
     */
    function sendDirectMessage() {
        const message = directInput.value.trim();
        if (message) {
            addMessage(directChat, message, 'user');
            directInput.value = '';
            autoResizeTextarea(directInput);
            showTypingIndicator(directChat);
            fetchGPT4Response(message)
                .then(response => {
                    removeTypingIndicator(directChat);
                    addMessage(directChat, response, 'ai');
                })
                .catch(error => {
                    console.error('Error in sendDirectMessage:', error);
                    removeTypingIndicator(directChat);
                    addMessage(directChat, 'Sorry, an error occurred processing your request.', 'ai');
                });
        }
    }
    
    /**
     * Sends a message from the enhanced prompting panel.
     * Handles both initial prompt input and answers to refinement questions.
     */
    function sendEnhancedMessage() {
      const message = enhancedInput.value.trim();
      if (!message) return;
      
      addMessage(enhancedChat, message, 'user');
      enhancedInput.value = '';
      autoResizeTextarea(enhancedInput);
      
      // const isGreetingOrSimpleQuery = /^(continue|hello|hi|hey|greetings|howdy|good morning|good afternoon|good evening|ok|yes|no|next)(\s|$)/i.test(message); // This line is in your provided code but seems unused in the immediate logic block, kept for integrity.
      
      if (!enhancedState.isAskingQuestions) { // This is the initial prompt from the user
          enhancedState.isAskingQuestions = true;
          enhancedState.currentQuestionIndex = 0;
          enhancedState.userPrompt = message; 
          enhancedState.answers = []; 
          
          askNextEnhancedQuestion("Great! Thanks for that initial prompt. Now, let's refine it. Here's the first question:\n");
      } else { // This is an answer to one of the enhancing questions
          processUserAnswer(message);
      }
    }

    /**
     * Processes the user's answer to a refinement question.
     * Disables the skip button, stores the answer, and moves to the next question or completes the session.
     * @param {string} answer - The user's answer or the SKIP_ANSWER_SENTINEL value.
     */
    function processUserAnswer(answer) {
        // Disable the skip button for the question that was just answered
        disableSkipButtonForQuestion(enhancedState.currentQuestionIndex);
        
        enhancedState.answers.push(answer);
        displayIntermediateEnhancedPrompt(); // Show current prompt state

        if (enhancedState.currentQuestionIndex < enhancedState.questions.length - 1) {
            enhancedState.currentQuestionIndex++;
            askNextEnhancedQuestion();
        } else {
            // All questions answered
            addMessage(enhancedChat, "Excellent! We've gone through all the refinement steps.", 'ai');
            // The final prompt is already shown by displayIntermediateEnhancedPrompt in the last step
            // So now we just show the copyable version.
            const finalEnhancedPrompt = constructEnhancedPrompt(enhancedState.userPrompt, enhancedState.answers);
            displayEnhancedPromptWithOptions(enhancedChat, finalEnhancedPrompt, "Here's the final enhanced prompt. You can copy it:");
            
            enhancedState.isAskingQuestions = false;
            // displayInitialGreeting(); // Re-display greeting for next round - decided to remove immediate re-greeting for cleaner flow post-completion
            enhancedState.initialGreetingShown = false; // Allow greeting on next new interaction
        }
    }

    /**
     * Handles the skip button click for a specific question.
     * Records a skip sentinel value as the answer and proceeds to the next question.
     * @param {number} questionIndex - The index of the question being skipped.
     */
    function handleSkipQuestion(questionIndex) {
        addMessage(enhancedChat, "Okay, skipping this question.", 'ai');
        processUserAnswer(SKIP_ANSWER_SENTINEL); // Use the sentinel for skipped answer
    }

    /**
     * Disables the skip button for a specific question after it has been answered.
     * Updates the button's visual state and prevents further interaction.
     * @param {number} questionIndex - The index of the question whose skip button should be disabled.
     */
    function disableSkipButtonForQuestion(questionIndex) {
        // Find and disable the skip button for this specific question
        const skipButtons = enhancedChat.querySelectorAll('.skip-question-btn');
        skipButtons.forEach(button => {
            if (parseInt(button.dataset.questionIndex, 10) === questionIndex) {
                button.disabled = true;
                button.style.opacity = '0.5';
                button.style.cursor = 'not-allowed';
                button.title = 'Question already answered';
            }
        });
    }

    /**
     * Asks the next refinement question in the enhanced prompting flow.
     * Displays the question with step information and fetches a dynamic suggestion.
     * @param {string} [leadInText=''] - Optional introductory text to display before the question.
     */
    function askNextEnhancedQuestion(leadInText = "") {
        showTypingIndicator(enhancedChat);
        setTimeout(() => {
            removeTypingIndicator(enhancedChat);

            const questionObj = enhancedState.questions[enhancedState.currentQuestionIndex];
            const questionText = questionObj.text;
            
            const stepInfoText = `Step ${enhancedState.currentQuestionIndex + 1} of ${enhancedState.questions.length}: `;
            const stepInfoHtml = `<span class="step-info">${escapeHtml(stepInfoText)}</span>`; // Wrap step info
            
            const escapedLeadIn = escapeHtml(leadInText).replace(/\n/g, '<br />');
            const escapedQuestionText = escapeHtml(questionText).replace(/\n/g, '<br />');

            const mainQuestionHtml = escapedLeadIn + stepInfoHtml + escapedQuestionText;

            const suggestionPlaceholderId = `sg-ph-${Date.now()}-${enhancedState.currentQuestionIndex}`;
            const fullMessageHtml = mainQuestionHtml + `<div id="${suggestionPlaceholderId}" class="suggestion-placeholder"><small><i>Fetching suggestion...</i></small></div>`;
            
            addMessage(enhancedChat, fullMessageHtml, 'ai', true); 

            fetchAndDisplayDynamicSuggestion(
                enhancedState.userPrompt, 
                questionObj, 
                suggestionPlaceholderId
            );
        }, 700);
    }
    // END OF MODIFIED JS

    /**
     * Fetches an AI-generated suggestion for the current question and displays it.
     * Falls back to static suggestion if AI suggestion fails or is unavailable.
     * @param {string} userInitialPrompt - The user's initial prompt/goal.
     * @param {Object} questionObject - The question object containing text and staticSuggestion.
     * @param {string} placeholderId - The ID of the placeholder element to update with the suggestion.
     */
    async function fetchAndDisplayDynamicSuggestion(userInitialPrompt, questionObject, placeholderId) {
        const placeholderDiv = document.getElementById(placeholderId);
        if (!placeholderDiv) return;

        const currentQuestionText = questionObject.text;
        let suggestionContentHtml = "";
        let isAISuggestion = false;
        let buttonTitle = "Show Suggestion";

        try {
            const suggestionPrompt = `User's initial goal: "${userInitialPrompt}". Current question to user: "${currentQuestionText}". Provide a concise (1-2 sentences, max 30 words) tip or example to help answer THIS question effectively. Do NOT answer the question. Suggestion:`;
            let aiSuggestionText = await fetchGPT4Response(suggestionPrompt);
            aiSuggestionText = aiSuggestionText.replace(/^Suggestion:\s*/i, '').trim().replace(/^["']|["']$/g, '');

            if (aiSuggestionText && aiSuggestionText.length > 5 && aiSuggestionText !== "No response content received." && !aiSuggestionText.toLowerCase().includes("error")) {
                isAISuggestion = true;
                buttonTitle = "Show AI Suggestion";
                suggestionContentHtml = `<div class="suggestion-content suggestion-island" style="display:none;"><strong>Suggestion (AI):</strong> ${escapeHtml(aiSuggestionText).replace(/\n/g, '<br />')}</div>`;
            } else {
                throw new Error("AI suggestion not usable.");
            }
        } catch (error) {
            console.warn("Dynamic suggestion failed, falling back to static:", error.message);
            if (questionObject.staticSuggestion) {
                isAISuggestion = false; // It's a static suggestion
                buttonTitle = "Show Suggestion";
                suggestionContentHtml = `<div class="suggestion-content suggestion-island" style="display:none;"><strong>Suggestion:</strong> ${escapeHtml(questionObject.staticSuggestion).replace(/\n/g, '<br />')}</div>`;
            }
        }

        if (suggestionContentHtml) {
            placeholderDiv.className = 'suggestion-interactive';
            // Create button container with suggestion button and skip button
            // Add data-question-index to track which question this skip button belongs to
            const currentIndex = enhancedState.currentQuestionIndex;
            const buttonsHtml = `<div class="suggestion-buttons-container">
                                    <button class="show-suggestion-btn" title="${buttonTitle}" data-is-ai="${isAISuggestion}">
                                        <i class="fas fa-lightbulb"></i>
                                    </button>
                                    <button class="skip-question-btn" title="Skip this question" data-question-index="${currentIndex}">
                                        <i class="fas fa-forward"></i>
                                    </button>
                                </div>`;
            placeholderDiv.innerHTML = buttonsHtml + suggestionContentHtml;
        } else {
            placeholderDiv.className = 'suggestion-fallback';
            placeholderDiv.innerHTML = `<small><i>No suggestion available.</i></small>`;
        }
    }
    // END OF MODIFIED JS

    /**
     * Constructs the final enhanced prompt based on the user's initial prompt and answers.
     * Combines all refinement details into a structured, comprehensive prompt.
     * @param {string} originalPrompt - The user's original prompt/goal.
     * @param {Array<string>} answers - Array of answers to refinement questions.
     * @returns {string} The constructed enhanced prompt.
     */
    function constructEnhancedPrompt(originalPrompt, answers) {
      let finalOutputPrompt = `Act as ${answers[1] && answers[1] !== SKIP_ANSWER_SENTINEL ? answers[1] : 'a helpful AI assistant'}. `;
      
      const audienceKnowledge = answers[3] && answers[3] !== SKIP_ANSWER_SENTINEL ? answers[3] : 'general';
      finalOutputPrompt += `Your target audience has a ${audienceKnowledge} level of knowledge. `;
      
      const tone = answers[4] && answers[4] !== SKIP_ANSWER_SENTINEL ? answers[4] : 'neutral and informative';
      finalOutputPrompt += `The tone should be ${tone}. `;
      
      finalOutputPrompt += `The primary goal is to address: "${originalPrompt}".\n\n`;
      finalOutputPrompt += `Consider the following details:\n`;
      
      const topic = answers[0] && answers[0] !== SKIP_ANSWER_SENTINEL ? answers[0] : 'As per the original query';
      finalOutputPrompt += `- Topic/Subject: ${topic}\n`;

      if (answers[2] && answers[2] !== SKIP_ANSWER_SENTINEL && answers[2].trim() !== '' && !/^(n\/?a)$/i.test(answers[2])) {
        finalOutputPrompt += `- Key Context: ${answers[2]}\n`;
      }
      if (answers[5] && answers[5] !== SKIP_ANSWER_SENTINEL && answers[5].trim() !== '' && !/^(n\/?a)$/i.test(answers[5])) {
        finalOutputPrompt += `- Output Style/Examples: Try to emulate aspects of "${answers[5]}"\n`;
      }
      if (answers[6] && answers[6] !== SKIP_ANSWER_SENTINEL && answers[6].trim() !== '' && !/^(n\/?a)$/i.test(answers[6])) {
        finalOutputPrompt += `- Diversity/Inclusivity Note: ${answers[6]}\n`;
      }
      finalOutputPrompt += `\nPlease provide a comprehensive response to: "${originalPrompt}"`;
      return finalOutputPrompt;
    }

    /**
     * Displays the current state of the enhanced prompt after each question is answered.
     * Shows a preview of the prompt being built with answers collected so far.
     */
    function displayIntermediateEnhancedPrompt() {
        const currentAnswers = [...enhancedState.answers];
        while (currentAnswers.length < enhancedState.questions.length) {
            currentAnswers.push(SKIP_ANSWER_SENTINEL); 
        }

        const promptText = constructEnhancedPrompt(enhancedState.userPrompt, currentAnswers);
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message-bubble intermediate-prompt-display';

        const messageContentDiv = document.createElement('div');
        messageContentDiv.className = 'message-content';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar ai-avatar';
        const icon = document.createElement('i');
        icon.className = 'fas fa-cogs'; 
        avatarDiv.appendChild(icon);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        const infoP = document.createElement('p');
        infoP.innerHTML = `<strong>Current Enhanced Prompt (so far):</strong>`;
        contentDiv.appendChild(infoP);

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = promptText;
        pre.appendChild(code);
        contentDiv.appendChild(pre);
        
        messageContentDiv.appendChild(avatarDiv);
        messageContentDiv.appendChild(contentDiv);
        messageDiv.appendChild(messageContentDiv);
        enhancedChat.appendChild(messageDiv);
        enhancedChat.scrollTop = enhancedChat.scrollHeight;
    }
    
    /**
     * Displays a typing indicator (animated dots) in the specified chat container.
     * @param {HTMLElement} container - The chat container element to add the typing indicator to.
     */
    function showTypingIndicator(container) {
        if (container.querySelector('.typing-message')) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message typing-message';
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        const avatar = document.createElement('div');
        avatar.className = 'avatar ai-avatar';
        const icon = document.createElement('i');
        icon.className = 'fas fa-robot';
        avatar.appendChild(icon);
        const content = document.createElement('div');
        content.className = 'content';
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        content.appendChild(typingIndicator);
        messageContent.appendChild(avatar);
        messageContent.appendChild(content);
        messageDiv.appendChild(messageContent);
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }
    
    /**
     * Removes the typing indicator from the specified chat container.
     * @param {HTMLElement} container - The chat container element to remove the typing indicator from.
     */
    function removeTypingIndicator(container) {
        const typingIndicator = container.querySelector('.typing-message');
        if (typingIndicator) typingIndicator.remove();
    }
    
    /**
     * Adds a message to the specified chat container.
     * Supports both plain text and HTML content with markdown-style formatting.
     * @param {HTMLElement} container - The chat container to add the message to.
     * @param {string} textOrHtml - The message content (plain text or HTML).
     * @param {string} sender - The sender type ('user' or 'ai').
     * @param {boolean} [isHtml=false] - Whether the content is already HTML (true) or needs formatting (false).
     */
    function addMessage(container, textOrHtml, sender, isHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.classList.add(sender === 'user' ? 'user-message-bubble' : 'ai-message-bubble');
        
        const messageContentDiv = document.createElement('div');
        messageContentDiv.className = 'message-content';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = `avatar ${sender === 'user' ? 'user-avatar' : 'ai-avatar'}`;
        const icon = document.createElement('i');
        icon.className = `fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}`;
        avatarDiv.appendChild(icon);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        
        if (isHtml) {
            contentDiv.innerHTML = textOrHtml;
        } else {
            let htmlOutput = escapeHtml(textOrHtml)
                .replace(/```([\s\S]*?)```/g, (match, code) => `<pre><code>${code.trim()}</code></pre>`)
                .replace(/`([^`]+)`/g, (match, code) => `<code>${code}</code>`)
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                .replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, headingText) => `<h${hashes.length}>${headingText.trim()}</h${hashes.length}>`)
                .replace(/^\s*-\s+(.*)$/gm, '<ul><li>$1</li></ul>')
                .replace(/^\s*\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>')
                .replace(/\n/g, '<br>');
            htmlOutput = htmlOutput.replace(/<\/ul>\s*<br \/>\s*<ul>/g, '');
            htmlOutput = htmlOutput.replace(/<\/ol>\s*<br \/>\s*<ol>/g, '');
            contentDiv.innerHTML = htmlOutput;
        }
        
        messageContentDiv.appendChild(avatarDiv);
        messageContentDiv.appendChild(contentDiv);
        messageDiv.appendChild(messageContentDiv);
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    /**
     * Escapes HTML special characters to prevent XSS attacks.
     * @param {string} unsafe - The string to escape.
     * @returns {string} The escaped string with HTML entities.
     */
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return '';
            return unsafe
                .replace(/&/g, "&")
                .replace(/</g, "<")
                .replace(/>/g, ">")
                .replace(/"/g, "&quot")
                .replace(/'/g, "'");
        }
    
    /**
     * Sends a prompt to the GPT-4 API and returns the response.
     * Handles network errors and API errors gracefully.
     * @param {string} prompt - The prompt to send to GPT-4.
     * @returns {Promise<string>} The AI's response or an error message.
     */
    async function fetchGPT4Response(prompt) {
        const url = 'api/gpt4_request.php';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt })
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Network error: ${response.status} ${response.statusText}. Details: ${errorData}`);
            }
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            return data.response || "No response content received.";
        } catch (error) {
            console.error('Error fetching GPT-4 response:', error.message);
            return `Sorry, an error occurred: ${error.message}.`;
        }
    }

    /**
     * Displays the final enhanced prompt with a copy button.
     * Shows the completed prompt in a formatted code block with copy functionality.
     * @param {HTMLElement} container - The chat container to display the prompt in.
     * @param {string} promptText - The final enhanced prompt text.
     * @param {string} [headingText="Thanks! Here's the enhanced prompt..."] - The heading text to display.
     */
    function displayEnhancedPromptWithOptions(container, promptText, headingText = "Thanks! Here's the enhanced prompt...") {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message-bubble';
        const messageContentDiv = document.createElement('div');
        messageContentDiv.className = 'message-content';
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar ai-avatar';
        const icon = document.createElement('i');
        icon.className = 'fas fa-magic'; 
        avatarDiv.appendChild(icon);
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        const infoP = document.createElement('p');
        // Ensure headingText is also escaped if it can contain special characters, though here it's mostly fixed.
        infoP.innerHTML = escapeHtml(headingText).replace(/\n/g, '<br />') + " You can copy it and paste it into the <strong>Direct Interaction</strong> panel:";
        contentDiv.appendChild(infoP);

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = promptText;
        pre.appendChild(code);
        contentDiv.appendChild(pre);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Final Prompt';
        copyButton.className = 'copy-prompt-button';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(promptText).then(() => {
                copyButton.textContent = 'Copied!';
                copyButton.disabled = true;
                setTimeout(() => { copyButton.textContent = 'Copy Final Prompt'; copyButton.disabled = false; }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                copyButton.textContent = 'Copy Failed';
                setTimeout(() => { copyButton.textContent = 'Copy Final Prompt'; }, 2000);
            });
        });
        contentDiv.appendChild(copyButton);
        messageContentDiv.appendChild(avatarDiv);
        messageContentDiv.appendChild(contentDiv);
        messageDiv.appendChild(messageContentDiv);
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }
});

