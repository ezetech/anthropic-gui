// let currentChatId = null;

// // DOM elements
// const apiKeyScreen = document.getElementById('api-key-screen');
// const apiKeyInput = document.getElementById('api_key');
// const submitApiKeyButton = document.getElementById('submit-api-key');
// const mainInterface = document.getElementById('main-interface');
// const savedChats = document.getElementById('saved-chats');
// const modelSelect = document.getElementById('model');
// const parameter1Input = document.getElementById('parameter1');
// const parameter2Input = document.getElementById('parameter2');
// const submitPromptButton = document.getElementById('submit-prompt');
// const maxTokensInput = document.getElementById('max_tokens_to_sample');
// const temperatureInput = document.getElementById('temperature');
// const topKInput = document.getElementById('top_k');
// const topPInput = document.getElementById('top_p');
// const promptContainer = document.getElementById('prompt-container');
// const addPromptRowButton = document.getElementById('add-prompt-row');
// const newChatButton = document.getElementById('new-chat');
// const saveChatButton = document.getElementById('save-chat');

// // Event listeners
// submitApiKeyButton.addEventListener('click', saveApiKey);
// apiKeyInput.addEventListener('keypress', event => {
//   if (event.key === 'Enter') {
//     saveApiKey();
//   }
// });

// const logoutButton = document.getElementById('logout');
// logoutButton.addEventListener('click', () => {
//   localStorage.removeItem('api_key');
//   apiKeyScreen.style.display = 'flex';
//   mainInterface.style.display = 'none';
// });

// promptContainer.addEventListener('input', saveCurrentChat);
// promptContainer.addEventListener('paste', handlePaste);
// saveChatButton.addEventListener('click', () => {
//   currentChatId = Date.now();
//   saveCurrentChat();
// });
// newChatButton.addEventListener('click', newChat);
// addPromptRowButton.addEventListener('click', () => {
//   addPromptRow();
//   focusLastPrompt();
// });

// submitPromptButton.addEventListener('click', submitPrompt);

// // Functions
// function handlePaste(event) {
//   event.preventDefault();

//   const pastedText = event.clipboardData.getData('text/plain');
//   const preprocessedText = pastedText
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/\n/g, '<br>')
//     .replace(/ /g, '&nbsp; ');

//   const selection = window.getSelection();
//   if (!selection.rangeCount) return false;
//   selection.deleteFromDocument();
//   const range = selection.getRangeAt(0);
//   const tempDiv = document.createElement('div');
//   tempDiv.innerHTML = preprocessedText;
//   const fragment = document.createDocumentFragment();
//   while (tempDiv.firstChild) {
//     fragment.appendChild(tempDiv.firstChild);
//   }
//   range.insertNode(fragment);

//   // Set the cursor to the end of the pasted content
//   const lastNode = range.endContainer;
//   if (lastNode.nodeType === Node.TEXT_NODE) {
//     range.setStart(lastNode, lastNode.length);
//     range.setEnd(lastNode, lastNode.length);
//   } else {
//     range.setStartAfter(lastNode);
//     range.setEndAfter(lastNode);
//   }
//   selection.removeAllRanges();
//   selection.addRange(range);
//   selection.extend(range.endContainer, range.endOffset);
// }

// function newChat() {
//   currentChatId = null;
//   promptContainer.innerHTML = '';
//   addPromptRow('human');
//   focusLastPrompt();
// }

// function saveApiKey() {
//   const apiKey = apiKeyInput.value;
//   if (apiKey) {
//     localStorage.setItem('api_key', apiKey);
//     apiKeyScreen.style.display = 'none';
//     mainInterface.style.display = 'flex';
//   } else {
//     alert('Please enter a valid API key.');
//   }
// }

// function deleteChat(chatId) {
//   if (!confirm('Are you sure you want to delete this chat?')) {
//     return;
//   }
//   const savedChats = JSON.parse(localStorage.getItem('saved_chats')) || [];
//   const updatedChats = savedChats.filter(chat => chat.id !== parseInt(chatId));
//   localStorage.setItem('saved_chats', JSON.stringify(updatedChats));

//   const chatElement = document.querySelector(
//     `#saved-chats li[data-id="${chatId}"]`,
//   );
//   if (chatElement) {
//     chatElement.remove();
//   }
//   newChat();
// }

// function saveCurrentChat() {
//   if (!currentChatId) {
//     console.log('No chat selected');
//     return;
//   }
//   const prompts = Array.from(
//     promptContainer.querySelectorAll('.editable-prompt'),
//   );
//   const chatContent = prompts.map(prompt => {
//     const type = prompt.dataset.type;
//     const text = prompt.innerHTML
//       .trim()
//       .replace(/<br>/g, '\n')
//       .replace(/<div>/g, '\n')
//       .replace(/<\/div>/g, '');
//     console.log(text);
//     return { type, text };
//   });

//   const chat = {
//     id: currentChatId || Date.now(),
//     name: chatContent[0].text.substring(0, 20)
//       ? chatContent[0].text.substring(0, 20)
//       : 'Untitled',
//     content: chatContent,
//   };

//   const savedChats = JSON.parse(localStorage.getItem('saved_chats')) || [];

//   // Update the existing chat
//   const chatIndex = savedChats.findIndex(
//     savedChat => savedChat.id === currentChatId,
//   );
//   if (chatIndex !== -1) {
//     savedChats[chatIndex] = chat;
//   } else {
//     // Add a new chat
//     savedChats.push(chat);
//     displaySavedChat(chat);
//     currentChatId = chat.id;
//   }

//   localStorage.setItem('saved_chats', JSON.stringify(savedChats));

//   // Update the chat list
// }
// function loadSelectedChat(chatId) {
//   const savedChats = JSON.parse(localStorage.getItem('saved_chats')) || [];
//   const selectedChat = savedChats.find(chat => chat.id === parseInt(chatId));

//   if (selectedChat) {
//     // Highlight the selected chat
//     const chatElements = document.querySelectorAll('#saved-chats li');
//     chatElements.forEach(chatElement => {
//       if (chatElement.dataset.id === chatId) {
//         chatElement.classList.add('bg-blue-200');
//       } else {
//         chatElement.classList.remove('bg-blue-200');
//       }
//     });

//     // Update the current chat ID
//     currentChatId = parseInt(chatId);

//     promptContainer.innerHTML = '';
//     selectedChat.content.forEach(item => {
//       addPromptRow(item.type);
//       const lastPromptRow = promptContainer.lastElementChild;
//       const lastPromptDiv = lastPromptRow.querySelector('.editable-prompt');
//       lastPromptDiv.innerHTML = item.text
//         .replace(/</g, '&lt;')
//         .replace(/>/g, '&gt;')
//         .replace(/\n/g, '<br>')
//         .replace(/  /g, '&nbsp; ');
//     });

//     focusLastPrompt();
//   }
// }

// function focusLastPrompt() {
//   const prompts = promptContainer.querySelectorAll('.editable-prompt');
//   const lastPrompt = prompts[prompts.length - 1];
//   if (lastPrompt) {
//     lastPrompt.focus();
//   }
// }
// function displaySavedChat(chat) {
//   const li = document.createElement('li');
//   li.textContent = chat.name;
//   li.dataset.id = chat.id;
//   li.classList.add('relative'); // Add this line

//   // Add the following code to create the delete icon
//   const deleteIcon = document.createElement('span');
//   deleteIcon.innerHTML = '&#10005;'; // Unicode character for a cross mark
//   deleteIcon.classList.add('absolute');
//   deleteIcon.classList.add('right-0');
//   deleteIcon.classList.add('mr-2');
//   deleteIcon.classList.add('cursor-pointer');
//   deleteIcon.style.opacity = 0;
//   deleteIcon.addEventListener('click', event => {
//     event.stopPropagation();
//     deleteChat(chat.id);
//   });

//   li.addEventListener('mouseenter', () => {
//     deleteIcon.style.opacity = 1;
//   });

//   li.addEventListener('mouseleave', () => {
//     deleteIcon.style.opacity = 0;
//   });

//   li.addEventListener('click', () => {
//     loadSelectedChat(chat.id);
//   });

//   li.appendChild(deleteIcon); // Add this line
//   savedChats.appendChild(li);
// }
// function loadSavedChats() {
//   const savedChats = JSON.parse(localStorage.getItem('saved_chats')) || [];

//   savedChats.forEach(chat => {
//     displaySavedChat(chat);
//   });
// }

// function escapeHtml(unsafe) {
//   return unsafe
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#039;');
// }

// function addPromptRow(promptType) {
//   const lastPromptRow = promptContainer.lastElementChild;
//   const lastPromptType = lastPromptRow
//     ? lastPromptRow.querySelector('.editable-prompt').dataset.type
//     : null;
//   let newPromptType =
//     promptType || (lastPromptType === 'human' ? 'assistant' : 'human');

//   newPromptType = newPromptType.toLowerCase();

//   const newRow = document.createElement('div');
//   newRow.classList.add('prompt-row');

//   const label = document.createElement('label');
//   label.textContent =
//     newPromptType.charAt(0).toUpperCase() + newPromptType.slice(1);
//   +':';

//   const editablePrompt = document.createElement('div');
//   editablePrompt.classList.add('editable-prompt');
//   editablePrompt.classList.add('rounded');
//   editablePrompt.classList.add('border');
//   editablePrompt.classList.add('border-gray-300');
//   editablePrompt.classList.add('px-3');
//   editablePrompt.classList.add('py-2');
//   editablePrompt.classList.add('w-full');
//   editablePrompt.classList.add(
//     newPromptType == 'assistant' ? 'bg-blue-100' : 'x',
//   );
//   newRow.classList.add(newPromptType == 'assistant' ? 'assistant' : 'human');
//   editablePrompt.dataset.type = newPromptType.toLowerCase();
//   editablePrompt.contentEditable = 'true';

//   const removeIcon = document.createElement('span');
//   removeIcon.innerHTML = '&#10005;'; // Unicode character for a cross mark
//   removeIcon.classList.add('absolute');
//   removeIcon.classList.add('right-0');
//   removeIcon.classList.add('mr-2');
//   removeIcon.classList.add('cursor-pointer');
//   removeIcon.style.opacity = 0;
//   removeIcon.addEventListener('click', event => {
//     event.stopPropagation();
//     newRow.remove();
//   });

//   newRow.addEventListener('mouseenter', () => {
//     removeIcon.style.opacity = 1;
//   });

//   newRow.addEventListener('mouseleave', () => {
//     removeIcon.style.opacity = 0;
//   });

//   newRow.appendChild(label);
//   newRow.appendChild(editablePrompt);
//   newRow.appendChild(removeIcon); // Add this line
//   promptContainer.appendChild(newRow);
// }

// async function submitPrompt() {
//   const prompts = Array.from(
//     promptContainer.querySelectorAll('.editable-prompt'),
//   );
//   const promptTexts = prompts.map(prompt => {
//     const type = prompt.dataset.type;
//     const text = prompt.innerHTML
//       .trim()
//       .replace(/<br>/g, '\n')
//       .replace(/<div>/g, '\n')
//       .replace(/<\/div>/g, '');

//     return `\n\n${type}: ${text}`;
//   });

//   const prompt = promptTexts.join('');
//   if (prompt) {
//     const apiKey = localStorage.getItem('api_key');
//     const model = modelSelect.value;
//     const maxTokens = parseInt(maxTokensInput.value);
//     const temperature = parseFloat(temperatureInput.value);
//     const topK = parseInt(topKInput.value);
//     const topP = parseFloat(topPInput.value);

//     const requestBody = {
//       prompt: `\n\nHuman: ${prompt}\n\nAssistant: `,
//       model: model,
//       max_tokens_to_sample: maxTokens,
//       stop_sequences: ['\n\nHuman:'],
//       temperature: temperature,
//       top_k: topK,
//       top_p: topP,
//       stream: true,
//     };

//     const requestOptions = {
//       method: 'POST',
//       headers: {
//         'x-api-key': apiKey,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestBody),
//     };

//     try {
//       const response = await fetch(
//         'https://api.anthropic.com/v1/complete',
//         requestOptions,
//       );

//       if (response.ok) {
//         const reader = response.body.getReader();
//         const decoder = new TextDecoder('utf-8');
//         const data = '';
//         addPromptRow('Assistant');
//         const lastPromptRow = promptContainer.lastElementChild;
//         const lastPromptDiv = lastPromptRow.querySelector('.editable-prompt');

//         while (true) {
//           const { value, done } = await reader.read();
//           if (done) break;
//           let lastLine = '';
//           const lastLineData = decoder.decode(value);
//           if (lastLine.indexOf('\n') != -1) {
//             lastLine = lastLineData.split('\n').pop();
//           } else {
//             lastLine = lastLineData;
//           }

//           console.log(lastLine, 'last line');

//           if (
//             lastLine.startsWith('data:') &&
//             lastLine.indexOf('[DONE]') == -1
//           ) {
//             try {
//               const eventData = JSON.parse(lastLine.slice(5));
//               if (eventData.completion) {
//                 const sanitizedCompletion = escapeHtml(
//                   eventData.completion,
//                 ).replace(/\t/g, '    ');
//                 lastPromptDiv.innerHTML = sanitizedCompletion
//                   .replace(/</g, '&lt;')
//                   .replace(/>/g, '&gt;')
//                   .replace(/\n/g, '<br>')
//                   .replace(/  /g, '&nbsp; ');
//               } else if (eventData.error) {
//                 alert('Error: ' + eventData.error.message);
//               }
//             } catch (error) {}
//           }
//         }
//       } else {
//         alert('Error: ' + response.statusText);
//       }
//     } catch (error) {
//       alert('Error: ' + error.message);
//     }
//     addPromptRow();
//     focusLastPrompt();
//     saveCurrentChat();
//   }
// }

// function preloadModels() {
//   modelSelect.innerHTML = '';

//   models.forEach(model => {
//     const option = document.createElement('option');
//     option.value = model.name; // Change this line to use model.name instead of model.id
//     option.textContent = model.name;
//     if (model.name === 'claude-v1.3-100k') {
//       option.selected = true;
//     }
//     modelSelect.appendChild(option);
//   });
// }

// // Initialization
// if (localStorage.getItem('api_key')) {
//   apiKeyScreen.style.display = 'none';
//   mainInterface.style.display = 'flex';
// }
// loadSavedChats();
// preloadModels();
