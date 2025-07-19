const SIGNIN_ENDPOINT = 'https://learn.zone01oujda.ma/api/auth/signin';

const loginForm = document.querySelector(".login-form");
const emailNicknameInput = document.getElementById("log-email-nickname");
const passwordInput = document.getElementById("log-password");
const submitButton = document.getElementById("logInBtn");
const togglePasswordIcon = document.getElementById("toggle-password-icon");
const errorDisplay = document.getElementById('error-message');

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    errorDisplay.textContent = '';
    
    const username = emailNicknameInput.value.trim();
    const password = passwordInput.value;
    
    if (!username || !password) {
        errorDisplay.textContent = "Please fill in all fields.";
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = `<span>Signing In...</span><i class='bx bx-loader-alt bx-spin' ></i>`;
    
    try {
        const encodedCredentials = btoa(`${username}:${password}`);

        const response = await fetch(SIGNIN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Invalid username or password.");
        }

        localStorage.setItem('JWT', data);

        submitButton.innerHTML = `<span>Success!</span><i class='bx bx-check-circle'></i>`;
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1000);


    } catch (error) {
        console.error("Login failed:", error.message);
        
        errorDisplay.textContent = error.message;
        
        submitButton.disabled = false;
        submitButton.innerHTML = `<span>Submit</span><i class='bx bx-log-in-circle'></i>`;
    }
});
