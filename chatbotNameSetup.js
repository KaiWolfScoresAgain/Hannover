// A huge percentage of this code is AI generated

// Save the chatbot name to localStorage and redirect to the chatbot page
function saveChatbotName(event) {
    event.preventDefault(); // Prevent form submission

    const botName = document.getElementById("botNameInput").value;
    localStorage.setItem("chatbotName", botName); // Save the name to localStorage

    // Redirect to the chatbot page
    window.location.href = "chatbot.html";
}

// Redirect to chatbot.html if the bot name is already set
window.onload = function() {
    if (localStorage.getItem("chatbotName")) {
        window.location.href = "chatbot.html";
    }
};
