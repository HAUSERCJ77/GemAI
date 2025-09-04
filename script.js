 const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chat-input');
const chatBox = document.querySelector('.chat-box');
const welcomeMessage = document.querySelector('.welcome-message');
const newChatBtn = document.querySelector('.new-chat-btn');
const conversationList = document.querySelector('.conversation-list');
const sidebar = document.querySelector('.sidebar'); // For potential sidebar toggling
const menuBtn = document.getElementById('menu-btn'); // Assuming you might add a mobile menu button

// Gemini API Configuration
// Replace with your actual API key obtained from Google AI Studio
// For production, you'd want to manage this more securely (e.g., environment variables)
const API_KEY = 'AIzaSyBCcIiZPO0WxvIYgVsSfqvlgQjRRRP4wcY';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`; // Or other Gemini models

// Function to add a message to the chat
function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user' : 'bot');

    const avatarElement = document.createElement('div');
    avatarElement.classList.add('message-avatar');
    avatarElement.textContent = sender === 'user' ? 'U' : 'G'; // U for User, G for Gemini

    const bubbleElement = document.createElement('div');
    bubbleElement.classList.add('message-bubble');

    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content');
    contentElement.textContent = text; // Use textContent for security and to prevent HTML injection

    bubbleElement.appendChild(contentElement);
    messageElement.appendChild(avatarElement);
    messageElement.appendChild(bubbleElement);
    chatBox.appendChild(messageElement);

    // Scroll to the bottom of the chat
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to handle sending messages
async function sendMessage() {
    const userInput = chatInput.value.trim();
    if (!userInput) return;

    // Add user message to the chat
    addMessage('user', userInput);
    chatInput.value = ''; // Clear the input field

    // Simulate a typing indicator (optional)
    // addMessage('bot', 'Gemini is typing...');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userInput }] }],
                // You can add generationConfig here for more control (temperature, maxTokens, etc.)
                // generationConfig: {
                //     temperature: 0.7,
                //     maxOutputTokens: 500,
                // }
            }),
        });

        const data = await response.json();

        if (response.ok && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            const botResponse = data.candidates[0].content.parts[0].text;
            addMessage('bot', botResponse);
        } else {
            console.error('Error from Gemini API:', data);
            addMessage('bot', 'Sorry, I encountered an error. Please try again.');
        }
    } catch (error) {
        console.error('Network or API error:', error);
        addMessage('bot', 'Sorry, I could not connect to the AI. Please check your connection or try again later.');
    }
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent default Enter key behavior (like new line)
        sendMessage();
    }
});

// Handle "New Chat" button (basic functionality: clear chat box and welcome message)
newChatBtn.addEventListener('click', () => {
    chatBox.innerHTML = ''; // Clear previous messages
    welcomeMessage.style.display = 'block'; // Show welcome message again
    // In a more advanced setup, you'd manage conversation history here
});

// Optional: Sidebar toggle (if you add a hamburger menu button)
// if (menuBtn) {
//     menuBtn.addEventListener('click', () => {
//         sidebar.classList.toggle('collapsed'); // You'll need CSS for .collapsed
//     });
// }

// Initial display of welcome message (if chat box is empty)
if (chatBox.children.length === 0) {
    welcomeMessage.style.display = 'block';
} else {
    welcomeMessage.style.display = 'none';
}
