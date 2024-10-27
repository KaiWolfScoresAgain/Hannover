// A huge percentage of this code is AI generated

// auth.js

// Predefined credentials (in a production app, handle this securely via a backend)
const validUsername = "user";
const validPassword = "password";

// Authentication function
function authenticate(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    if (username === validUsername && password === validPassword) {
        // Set logged-in state in localStorage
        localStorage.setItem("isAuthenticated", "true");
        // Redirect to main app page
        window.location.href = "home.html";
    } else {
        errorMessage.textContent = "Invalid username or password.";
    }
}

// Check if the user is authenticated before loading main app pages
function checkAuthentication() {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        window.location.href = "login.html";
    }
}

// Run checkAuthentication on any main page that requires login, like chatbot.html, calendar.html, etc.
