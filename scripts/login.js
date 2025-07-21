import { redirectToProfile } from './utlis.js';

const SIGNIN_ENDPOINT = 'https://learn.zone01oujda.ma/api/auth/signin';

export function loginPage() {
    const loginForm = document.querySelector(".login-form");
    if (!loginForm) return;

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
        
        submitButton.disabled = true;
        submitButton.innerHTML = `<span>Signing In...</span><i class='bx bx-loader-alt bx-spin' ></i>`;
        
        try {
            const encodedCredentials = btoa(`${username}:${password}`);
            const response = await fetch(SIGNIN_ENDPOINT, {
                method: 'POST',
                headers: { 'Authorization': `Basic ${encodedCredentials}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Invalid credentials.");
            }
            
            const token = await response.json();
            localStorage.setItem('JWT', token);

            submitButton.innerHTML = `<span>Success!</span><i class='bx bx-check-circle'></i>`;
            setTimeout(() => {
                redirectToProfile();
            }, 1000);

        } catch (error) {
            console.error("Login failed:", error.message);
            errorDisplay.textContent = error.message;
            submitButton.disabled = false;
            submitButton.innerHTML = `<span>Submit</span><i class='bx bx-log-in-circle'></i>`;
        }
    });

    togglePasswordIcon.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePasswordIcon.classList.toggle('bx-show', !isPassword);
        togglePasswordIcon.classList.toggle('bx-hide', isPassword);
    });
}