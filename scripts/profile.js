import { QUERIES } from './queries.js';
import { formatXpForCard, formatXpForProject } from './formatXp.js';
import { fetchGraphQL } from './api.js';
import { redirectToLogin } from './utlis.js';
import { createPieChart } from './pieChart.js';
import { createBarChart } from './barChart.js';

export function profilePage() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;
    
    function renderProjectsGrid(projects) {
        const projectGridElement = document.getElementById('last-projects-grid');
        projectGridElement.innerHTML = ''; 

        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.innerHTML = `
                <span class="name">Project - ${project.object.name}</span>
                <span class="xp">${formatXpForProject(project.amount)}</span>
            `;
            projectGridElement.appendChild(projectItem);
        });
    }

    function updateCards(user, level, totalXp, projects) {
        document.getElementById('user-name').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('user-login').textContent = `@${user.login}`;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-campus').textContent = user.campus;
        document.getElementById('user-level').textContent = level ? `${level}` : 'N/A';
        const formattedXp = formatXpForCard(totalXp);
        const totalXpElement = document.getElementById('total-xp');
        totalXpElement.innerHTML = `${formattedXp.value} <span class="unit">${formattedXp.unit}</span>`;
        renderProjectsGrid(projects);
    }
    
    async function fetchAndDisplayUserData() {
        try {
            const profileData = await fetchGraphQL(QUERIES.USER_PROFILE);
            const user = profileData.data.user[0];

            const [levelData, xpData, projectsData, auditData, projectXpData] = await Promise.all([
                fetchGraphQL(QUERIES.USER_LEVEL),
                fetchGraphQL(QUERIES.USER_XP_AGGREGATE),
                fetchGraphQL(QUERIES.USER_LAST_PROJECTS),
                fetchGraphQL(QUERIES.USER_AUDITS),
                fetchGraphQL(QUERIES.PROJECT_XP.replace('userId: { _eq: 2 }', `userId: { _eq: ${user.id} }`))
            ]);
            const level = levelData.data.transaction[0]?.amount;
            const totalXp = xpData.data.transaction_aggregate.aggregate.sum.amount;
            const projects = projectsData.data.user[0].transactions;

            updateCards(user, level, totalXp, projects);
            
            console.log('Audit Data:', auditData);
            const auditsDone = auditData.data.user[0].sucess.aggregate.count || 0;
            const auditsReceived = auditData.data.user[0].failed.aggregate.count || 0;
            console.log('Audits Done:', auditsDone, 'Audits Received:', auditsReceived);

            const pieChartData = [
                { label: 'Succeeded Audits', value: auditsDone, color: 'green' },
                { label: 'Failed Audits', value: auditsReceived, color: 'red' }
            ];

            createPieChart('audit-pie-chart-container', 'audit-legend', pieChartData);

            const projectXp = projectXpData.data.transaction;
            console.log('Filtered Projects:', projectXp);
            createBarChart('projects-bar-chart-container', projectXp);

        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
    
    if (!localStorage.getItem('JWT')) {
        redirectToLogin();
        return;
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('JWT');
        redirectToLogin();
    });

    fetchAndDisplayUserData();
}
