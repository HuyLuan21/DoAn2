import { getCurrentUser, logout, isLoggedIn } from '../src/database/user.db.js';

// Check if user is logged in
if (!isLoggedIn()) {
    alert('Please login first');
    window.location.href = '../sign-in.html';
}

// Get current user and display info
const currentUser = getCurrentUser();

document.addEventListener('DOMContentLoaded', function () {
    // Display user info
    const userNameElement = document.querySelector('.user-info .font-medium');
    const roleElement = document.querySelector('.user-info span');

    if (currentUser) {
        userNameElement.textContent = currentUser.username;
        roleElement.textContent = currentUser.role;

        // Set avatar initial
        const avaElement = document.querySelector('.ava');
        if (avaElement) {
            avaElement.textContent = currentUser.username.charAt(0).toUpperCase();
            avaElement.style.display = 'flex';
            avaElement.style.alignItems = 'center';
            avaElement.style.justifyContent = 'center';
            avaElement.style.backgroundColor = '#4f5d70';
            avaElement.style.color = 'white';
            avaElement.style.borderRadius = '50%';
            avaElement.style.width = '40px';
            avaElement.style.height = '40px';
            avaElement.style.fontSize = '18px';
            avaElement.style.fontWeight = 'bold';
        }
    }

    // Add logout functionality
    const accountInfo = document.querySelector('.account_info');
    if (accountInfo) {
        accountInfo.style.cursor = 'pointer';
        accountInfo.addEventListener('click', function () {
            const confirmLogout = confirm('Do you want to logout?');
            if (confirmLogout) {
                logout();
                alert('Logged out successfully');
                window.location.href = '../sign-in.html';
            }
        });
    }

    // Welcome message (optional)
    console.log(`Welcome, ${currentUser.username}!`);
});