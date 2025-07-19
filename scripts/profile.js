import { QUERIES } from './queries.js';

const API_ENDPOINT = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql';

async function fetchGraphQL(query) {
    const token = localStorage.getItem('JWT');
    if (!token) {
        window.location.href = 'login.html';
        throw new Error('JWT token not found');
    }

    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('GraphQL request failed:', errorBody);
        if (response.status === 401) {
            localStorage.removeItem('JWT');
            window.location.href = 'login.html';
        }
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return response.json();
}


function renderProjectsGrid(projects) {
    const projectGridElement = document.getElementById('last-projects-grid');
    projectGridElement.innerHTML = ''; // Clear previous content

    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';

        const projectName = document.createElement('span');
        projectName.className = 'name';
        projectName.textContent = `Project - ${project.object.name}`;

        const projectXp = document.createElement('span');
        projectXp.className = 'xp';
        projectXp.textContent = formatXpForProject(project.amount);
        
        projectItem.appendChild(projectName);
        projectItem.appendChild(projectXp);
        projectGridElement.appendChild(projectItem);
    });
}

function updateCards(user, level, totalXp, projects) {
    // Profile Card
    document.getElementById('user-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('user-login').textContent = `@${user.login}`;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-campus').textContent = user.campus;
    document.getElementById('user-level').textContent = level ? `${level}` : 'N/A';
    
    // XP Card
    const formattedXp = formatXpForCard(totalXp);
    const totalXpElement = document.getElementById('total-xp');
    totalXpElement.innerHTML = `${formattedXp.value} <span class="unit">${formattedXp.unit}</span>`;
    
    renderProjectsGrid(projects);
}


async function fetchAndDisplayUserData() {
    try {
        const [profileData, levelData, xpData, projectsData] = await Promise.all([
            fetchGraphQL(QUERIES.USER_PROFILE),
            fetchGraphQL(QUERIES.USER_LEVEL),
            fetchGraphQL(QUERIES.USER_XP_AGGREGATE),
            fetchGraphQL(QUERIES.USER_LAST_PROJECTS)
        ]);

        if (profileData.errors || levelData.errors || xpData.errors || projectsData.errors) {
            console.error('GraphQL Errors:', profileData.errors, levelData.errors, xpData.errors, projectsData.errors);
            throw new Error('Failed to fetch user data.');
        }
        
        const user = profileData.data.user[0];
        const level = levelData.data.transaction[0]?.amount;
        const totalXp = xpData.data.transaction_aggregate.aggregate.sum.amount;
        const projects = projectsData.data.user[0].transactions;

        updateCards(user, level, totalXp, projects);

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('JWT')) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('JWT');
        alert('You have been logged out.');
        window.location.href = 'login.html';
    });

    fetchAndDisplayUserData();
});
