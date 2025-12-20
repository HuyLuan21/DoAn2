import { login, getCurrentUser } from '../../src/database/user.db.js';

// Email validation function
function validateEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password toggle function
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = event.target;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Check if already logged in
if (getCurrentUser()) {
    window.location.href = 'User/home.html';
}

// Real-time email validation
document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const form = document.querySelector('form');

    // Validate email on input
    emailInput.addEventListener('input', function () {
        const email = emailInput.value.trim();

        if (email === '') {
            emailError.textContent = '';
            emailInput.style.borderColor = '';
        } else if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.color = 'red';
            emailError.style.fontSize = '12px';
            emailError.style.marginTop = '5px';
            emailInput.style.borderColor = 'red';
        } else {
            emailError.textContent = '✓ Valid email';
            emailError.style.color = 'green';
            emailError.style.fontSize = '12px';
            emailError.style.marginTop = '5px';
            emailInput.style.borderColor = 'green';
        }
    });

    // Validate on form submit
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;

        // Validate email
        if (email === '') {
            emailError.textContent = 'Email is required';
            emailError.style.color = 'red';
            emailError.style.fontSize = '12px';
            emailError.style.marginTop = '5px';
            emailInput.style.borderColor = 'red';
            emailInput.focus();
            return false;
        }

        if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.color = 'red';
            emailError.style.fontSize = '12px';
            emailError.style.marginTop = '5px';
            emailInput.style.borderColor = 'red';
            emailInput.focus();
            return false;
        }

        // Validate password
        if (password === '') {
            alert('Password is required');
            passwordInput.focus();
            return false;
        }

        // Attempt login
        const result = login(email, password);

        if (result.success) {
            // Save remember me preference
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('savedEmail', email);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('savedEmail');
            }

            // Show success message
            alert('Login successful! Redirecting to home page...');

            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'User/home.html';
            }, 500);
        } else {
            // Show error message
            alert(result.message);
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    // Load saved email if "remember me" was checked
    const savedEmail = localStorage.getItem('savedEmail');
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true' && savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }
});
