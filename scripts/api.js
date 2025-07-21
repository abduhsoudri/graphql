import { redirectToLogin } from './utlis.js';

const API_ENDPOINT = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql';

export async function fetchGraphQL(query) {
    const token = localStorage.getItem('JWT');
    if (!token) {
        redirectToLogin();
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
        console.error('GraphQL request failed:', await response.text());
        if (response.status === 401) {
            localStorage.removeItem('JWT');
            redirectToLogin();
        }
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return response.json();
}