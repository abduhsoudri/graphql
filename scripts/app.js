import { loginPage } from './login.js';
import { profilePage } from './profile.js';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('index.html') || path.endsWith('/')) {
        loginPage();
    } else if (path.includes('profile.html')) {
        profilePage();
    }
});