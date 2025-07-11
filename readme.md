import { renderProfile } from "./handlers.js";
import { displayError, popError } from "./utils/utils.js";

export let apiError = ""
export const API = {
    DATA_ENDPOINT: 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql',
    SIGNIN_ENDPOINT: 'https://learn.zone01oujda.ma/api/auth/signin'
};

// Set up the login form and handle submission request
export async function loginAPI() {
    const form = document.getElementById("login-form");

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = form.username.value.trim();
        const password = form.password.value

        try {
            const encodedAuth = btoa(`${username}:${password}`);

            const response = await fetch(API.SIGNIN_ENDPOINT, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${encodedAuth}`
                }
            });

            const token = await response.json();

            if (token.error) throw token.error;

            localStorage.setItem('JWT', token);
            renderProfile();
        } catch (error) {
            displayError("login-error", error || "Login failed. Please try again.");
        }
    });
};

// GraphQL API service (GraphQL request)
export const graphQLRequest = async (query, token) => {
    try {
        const response = await fetch(API.DATA_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` ,
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`Network error: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors[0]?.message || "GraphQL error");
        }

        return result;
    } catch (error) {
        console.error("GraphQL request failed:", error);
        apiError = "Failed to fetch some data. Please try again.";
    }
};



import { hideShowPassword, removeError, popError, capitalize } from './utils/utils.js';
import { loginAPI, graphQLRequest } from './api.js';
import { QUERIES } from './utils/query.js';
import { bindUserBoardSort } from './utils/userBoardSort.js';
import { apiError } from './api.js';

// Components
import { showLoading, hideLoading } from './components/loading.js';
import { userLevel } from './components/level.js';
import { userXP } from './components/xp.js';
import { userProjects } from './components/projects.js';
import { userBoard, bindProjectsModal } from './components/userBoard.js';
import { userSkills } from './components/svg/skills.js';
import { userAudits } from './components/svg/audits.js';


// Render the login form and bind login API process
export function renderLogin() {
    document.body.innerHTML = `
    <form id="login-form" class="login-container">
        <h2>Login</h2>
        <p>Welcome Back!</p>

        <div class="input-group">
            <input type="text" id="username" name="username" placeholder="Username" required />
        </div>

        <div class="input-group">
            <input type="password" id="password" name="password" placeholder="Password" required />
            <img src="./assets/show.png" id="togglePassword" alt="Toggle password visibility" />
        </div>

        <button type="submit" id="loginBtn">Login</button>
        <div id="login-error" class="error-message"></div>
    </form>
    `;

    hideShowPassword();
    removeError();
    loginAPI();
}

// Render the user profile
export async function renderProfile() {
    const token = localStorage.getItem('JWT');
    if (!token) {
        localStorage.removeItem('JWT');
        renderLogin();
        return;
    }

    showLoading();

    const userName = await graphQLRequest(QUERIES.USER_PROFILE, token);
    const levelCard = await userLevel(token);
    const xpCard = await userXP(token);
    const projectList = await userProjects(token);
    const boardList = await userBoard(token);
    const skillBars = await userSkills(token);
    const auditChart = await userAudits(token);

    const { firstName = '', lastName = '' } = userName?.data?.user?.[0] || {};

    hideLoading();

    document.body.innerHTML = `
    <div class="navbar">
        <div class="navbar-left">
            <span>Hello, <strong>${capitalize(`${firstName} ${lastName}`)}</strong></span>
        </div>
        <div class="navbar-right">
            <button id="logoutBtn">Logout</button>
        </div>
    </div>
    <div class="main-content">
        <div class="stat-grid">
            ${levelCard}
            ${xpCard}
        </div>
        ${projectList}
        ${boardList}
        ${skillBars}
        ${auditChart}
    </div>
    `;

    bindUserBoardSort();
    bindProjectsModal();
    if (apiError) popError(apiError);
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('JWT');
        renderLogin();
    });
};




import { renderLogin, renderProfile } from "./handlers.js"

// Application initialization
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('JWT');
    token ? renderProfile() : renderLogin();
})







// Toggle password visibility.
export function hideShowPassword() {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    togglePassword.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        togglePassword.src = isHidden ? './assets/hide.png' : './assets/show.png';
    });
}

// Display an error message in the specified element
export const displayError = (elementId, message) => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) errorElement.textContent = message;
};

// Remove error messages when the user focuses on the input fields
export function removeError() {
    const fields = ['username', 'password'];

    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener("focus", () => displayError("login-error", ""));
        }
    });
}

// Format the XP amount
export function formatXP(amount, color = "") {
    if (amount < 1000) return `<span class=${color}>${amount}</span> B`;
    amount = amount / 1000;
    if (amount < 1000) return `<span class=${color}>${amount.toFixed(2)}</span> KB`;
    amount = amount / 1000;
    return `<span class=${color}>${amount.toFixed(2)}</span> MB`;
}

// Capitalize the first letter of each word in a string
export function capitalize(text) {
    return text
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Pop up a fading notifation error.
export function popError(message) {
    const errorNotification = document.createElement('div');
    errorNotification.className = "error-notification";
    errorNotification.textContent = message;

    document.body.appendChild(errorNotification);
    setTimeout(() => {
        errorNotification.style.opacity = '0';
        errorNotification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            errorNotification.remove();
        }, 500);
    }, 4000);
}








LEVEL


import { graphQLRequest } from '../api.js';
import { QUERIES } from '../utils/query.js';

export async function userLevel(token) {
    const levelResult = await graphQLRequest(QUERIES.USER_LEVEL, token);
    const currentLevel = levelResult?.data?.transaction?.[0]?.amount ?? 0;

    return `
        <div class="stat-card">
            <p class="stat-title">Current Level</p>
            <div class="stat-circle">${currentLevel}</div>
        </div>
    `;
}





Loading 


export function showLoading() {
    if (document.getElementById('loading-screen')) return;
    const el = document.createElement('div');
    el.id = 'loading-screen';
    el.innerHTML = `
      <div class="loader"></div>
      <p>Fetching data…</p>
    `;
    document.body.innerHTML = '';
    document.body.appendChild(el);
}

export function hideLoading() {
    const el = document.getElementById('loading-screen');
    if (el) el.remove();
}







xp 



import { graphQLRequest } from '../api.js';
import { formatXP } from '../utils/utils.js';
import { QUERIES } from '../utils/query.js';

export async function userXP(token) {
    const xpResult = await graphQLRequest(QUERIES.USER_XP, token);
    const totalXP = xpResult?.data?.transaction_aggregate?.aggregate?.sum?.amount ?? 0;

    return `
        <div class="stat-card">
            <p class="stat-title">Total XP</p>
            <div class="xp-value">${formatXP(totalXP, "amountPurple")}</div>
        </div>
    `;
}






svg audits 


import { graphQLRequest } from '../../api.js';
import { QUERIES } from '../../utils/query.js';

export async function userAudits(token) {
    const result = await graphQLRequest(QUERIES.USER_AUDITS, token);
    const user = result?.data?.user?.[0];

    const success = user?.sucess?.aggregate?.count || 0;
    const failed = user?.failed?.aggregate?.count || 0;
    const total = success + failed;

    if (total === 0) return ''; // nothing to render

    const successPercent = ((success / total) * 100).toFixed(1);
    const failedPercent = ((failed / total) * 100).toFixed(1);

    // Calculate stroke lengths for circle chart
    const r = 70;
    const c = 2 * Math.PI * r;
    const sucessC = (c * successPercent) / 100;
    const failC = (c * failedPercent) / 100;

    return `
    <div class="project-section audit-chart-section">
      <p class="stat-title">Audit Results</p>
      <div class="audit-chart-wrapper">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle
            r="${r}"
            cx="90"
            cy="90"
            fill="transparent"
            stroke="#22c55e"
            stroke-width="30"
            stroke-dasharray="${sucessC} ${c}"
          />
          <circle
            r="${r}"
            cx="90"
            cy="90"
            fill="transparent"
            stroke="#ef4444"
            stroke-width="30"
            stroke-dasharray="${failC} ${c}"
            stroke-dashoffset="${-sucessC}"
          />
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="20px">
            ${total} Audits
          </text>
        </svg>
        <div class="legend">
          <div><span class="legend-box" style="background:#22c55e;"></span> Success (${success} - ${successPercent}%)</div>
          <div><span class="legend-box" style="background:#ef4444;"></span> Failed (${failed} - ${failedPercent}%)</div>
        </div>
      </div>
    </div>
  `;
}



