// A huge percentage of this code is AI generated

// Load chatbot name from localStorage
const chatbotName = localStorage.getItem("chatbotName") || "Bot";

// Define a knowledge base for responses
const responses = {
    greeting: ["Hello! How can I assist you today?", "Hi there! How are you feeling today?", "Greetings! How can I help?"],
    help: ["I'm here to help! What do you need assistance with?", "Feel free to ask me anything.", "How can I support you?"],
    mood: {
        happy: ["That's great to hear! Keep smiling!", "I'm glad you're feeling good!", "Happiness is important. Cherish it!"],
        sad: ["I'm sorry to hear that. It's okay to feel sad sometimes.", "Would you like to talk about it?", "I'm here to listen if you want to share."],
        anxious: ["Anxiety can be tough. Would you like some tips on coping?", "It's okay to feel anxious. You're not alone.", "How about some breathing exercises to help?"],
        sleepless: ["Insomnia can get difficult to cope with? Have you tried white noise therapy or mandala painting?"],
        suicidal: ["Please understand that you matter. Suicide Hotline: 9152987821"]
    },
    goodbye: ["Take care! I'm here if you need me.", "Goodbye! Don't hesitate to come back.", "Wishing you a wonderful day ahead!"],
    fallback: ["I'm not sure how to respond to that. Can you tell me more?", "Could you clarify your concern?"]
};

// Images for polarity (happy, sad, neutral)
const polarityImages = {
    happy: "HappyGookie.jpg",  // Replace with actual image paths
    sad: "SadGookie.jpg",
    neutral: "GookieWave.jpg"
};

// Function to get a random response from an array
function getRandomResponse(responseArray) {
    const randomIndex = Math.floor(Math.random() * responseArray.length);
    return responseArray[randomIndex];
}



// Function to preprocess the user input prompt
function preprocessPrompt(userInput) {
    const lowercased = userInput.toLowerCase().trim();  // Normalize to lowercase and trim spaces
    const cleaned = lowercased.replace(/[^a-zA-Z0-9\s]/g, "");  // Remove punctuation
    const words = cleaned.split(/\s+/);  // Split by whitespace into an array of words

    return { cleaned, words };
}

// Function to calculate intensity score based on certain keywords
function calculateIntensityScore(words) {
    let intensityScore = 0;
    
    // Words that indicate varying levels of intensity
    const mildIndicators = ["slightly", "a bit", "somewhat"];
    const moderateIndicators = ["quite", "fairly", "really"];
    const highIndicators = ["very", "extremely", "super", "incredibly", "too"];

    // Check words against each intensity category
    words.forEach(word => {
        if (mildIndicators.includes(word)) {
            intensityScore += 1;
        } else if (moderateIndicators.includes(word)) {
            intensityScore += 2;
        } else if (highIndicators.includes(word)) {
            intensityScore += 3;
        }
    });

    return intensityScore;
}

// Function to determine polarity and display corresponding image
function setPolarityImage(polarity) {
    const imageArea = document.getElementById("imageArea");
    imageArea.innerHTML = ""; // Clear previous image

    const img = document.createElement("img");
    img.src = polarityImages[polarity];
    img.alt = `${polarity} image`;
    img.width = 400;  // Set desired dimensions
    img.height = 400;

    imageArea.appendChild(img);
}

// Load chat history from localStorage when the page loads
function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const chatArea = document.getElementById("chatArea");
    
    chatHistory.forEach(({ user, message }) => {
        const messageDiv = document.createElement("div");
        messageDiv.className = user === "You" ? "user-message" : "bot-message";
        messageDiv.textContent = `${user}: ${message}`;
        chatArea.appendChild(messageDiv);
    });
}

// Main function to handle user input and generate responses with intensity scoring
function getResponse(userInput) {
    const { cleaned, words } = preprocessPrompt(userInput);
    const intensityScore = calculateIntensityScore(words);
    let polarity = "neutral";

    // Check for keywords in the cleaned input for prompt processing
    if (words.includes("hello") || words.includes("hi") || words.includes("hey")) {
        setPolarityImage("neutral");
        return { message: getRandomResponse(responses.greeting), intensityScore };
    }
    if (words.includes("help")) {
        setPolarityImage("happy");
        return { message: getRandomResponse(responses.help), intensityScore };
    }
    if (words.includes("happy") || words.includes("excited") || words.includes("delighted") || words.includes("good") || words.includes("awesome") || words.includes("great")) {
        setPolarityImage("happy");
        return { message: getRandomResponse(responses.mood.happy), intensityScore };
    }
    if (words.includes("sad") || words.includes("bad") || words.includes("terrible") || words.includes("awful") || words.includes("horrible") || words.includes("depressed")) {
        setPolarityImage("sad");
        return { message: getRandomResponse(responses.mood.sad), intensityScore };
    }
    if (words.includes("anxious") || words.includes("anxiety")) {
        setPolarityImage("sad");
        return { message: getRandomResponse(responses.mood.anxious), intensityScore };
    }
    if (words.includes("bye") || words.includes("goodbye")) {
        setPolarityImage("neutral");
        return { message: getRandomResponse(responses.goodbye), intensityScore };
    }
    if (words.includes("sleep")) {
        setPolarityImage("sad");
        return { message: getRandomResponse(responses.sleepless), intensityScore };
    }
    if (words.includes("suicidal") || words.includes("suicide") || words.includes("kill")) {
        setPolarityImage("sad");
        return { message: getRandomResponse(responses.suicidal) };
    }

    // Default response if no keywords match
    setPolarityImage("neutral");
    return { message: getRandomResponse(responses.fallback), intensityScore };
}

// Function to handle sending messages
function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    if (!userInput) return;  // Exit if input is empty

    // Display user message in the chat area
    const chatArea = document.getElementById("chatArea");
    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "user-message";
    userMessageDiv.textContent = "You: " + userInput;
    chatArea.appendChild(userMessageDiv);

    // Get chatbot response and intensity score
    const { message: botResponse, intensityScore } = getResponse(userInput);

    // Display bot response and intensity score in the chat area
    const botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";
    botMessageDiv.textContent = `${chatbotName}: ${botResponse} (Intensity: ${intensityScore})`;
    chatArea.appendChild(botMessageDiv);

        // Save chat history
        saveChatHistory(userInput, botResponse);

    // Clear the input field
    document.getElementById("userInput").value = '';
}

// Save chat history to localStorage
function saveChatHistory(userInput, botResponse) {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ user: "You", message: userInput });
    chatHistory.push({ user: "Bot", message: botResponse });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Attach event listener to the send button
document.getElementById("sendButton").addEventListener("click", sendMessage);

// Load chat history when the page loads
window.onload = loadChatHistory;

// Optional: Allow pressing Enter to send a message
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Optional: Clear the chat area and history
document.getElementById("clearButton").addEventListener("click", function() {
    document.getElementById("chatArea").innerHTML = ""; // Clear chat area
    localStorage.removeItem("chatHistory"); // Clear chat history
});
