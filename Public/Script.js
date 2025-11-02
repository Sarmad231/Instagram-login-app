// Get all the elements we need to work with
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const switchText = document.getElementById('switch-text');
const messageDiv = document.getElementById('message');

// This function toggles between the login and signup forms
function toggleForms() {
    // If the login form is hidden, show it and hide the signup form
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        // Update the text at the bottom
        switchText.innerHTML = `Don't have an account? <a id="show-signup">Sign up</a>`;
        // We need to re-add the event listener to the new link
        document.getElementById('show-signup').addEventListener('click', toggleForms);
    } else {
        // Otherwise, hide the login form and show the signup form
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        // Update the text at the bottom
        switchText.innerHTML = `Have an account? <a id="show-login">Log in</a>`;
        // Re-add the event listener to the new link
        document.getElementById('show-login').addEventListener('click', toggleForms);
    }
}

// Add the click event to the first "Sign up" link
showSignup.addEventListener('click', toggleForms);

// This part checks the URL for any messages from the server
const params = new URLSearchParams(window.location.search);
if (params.has('message')) {
    // If a message exists, display it in the message div
    messageDiv.textContent = params.get('message');
    // Change the color based on whether it was a success or an error
    messageDiv.className = params.get('success') === 'true' ? 'success' : 'error';
}
