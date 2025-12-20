import { register, isEmailExist } from '../../src/database/user.db.js';

// Email validation function
function validateEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password toggle function
function togglePassword() {
    const passwordInput = event.target.closest('.input-wrapper').querySelector('input');
    const toggleBtn = event.target;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function () {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
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
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        let isValid = true;
        let errorMessage = '';

        // Validate username
        if (username === '') {
            errorMessage = 'Username is required';
            usernameInput.focus();
            isValid = false;
        }
        // Validate email
        else if (email === '') {
            emailError.textContent = 'Email is required';
            emailError.style.color = 'red';
            emailError.style.fontSize = '12px';
            emailError.style.marginTop = '5px';
            emailInput.style.borderColor = 'red';
            emailInput.focus();
            isValid = false;
        } else if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.color = 'red';
            emailError.style.fontSize = '12px';
            emailError.style.marginTop = '5px';
            emailInput.style.borderColor = 'red';
            emailInput.focus();
            isValid = false;
        }
        // Validate password
        else if (password === '') {
            errorMessage = 'Password is required';
            passwordInput.focus();
            isValid = false;
        }
        else if (password.length < 6) {
            errorMessage = 'Password must be at least 6 characters long';
            passwordInput.focus();
            isValid = false;
        }
        // Validate password match
        else if (password !== confirmPassword) {
            errorMessage = 'Passwords do not match!';
            confirmPasswordInput.focus();
            isValid = false;
        }

        if (!isValid) {
            if (errorMessage) {
                alert(errorMessage);
            }
            return false;
        }

        // Create new user object
        const newUser = {
            username: username,
            email: email,
            password: password
        };

        // Attempt registration
        const result = register(newUser);

        if (result.success) {
            alert('Registration successful! Redirecting to login page...');

            // Clear form
            form.reset();

            // Redirect to sign-in page
            setTimeout(() => {
                window.location.href = 'sign-in.html';
            }, 500);
        } else {
            alert(result.message);

            // Focus on appropriate field based on error
            if (result.message.includes('Email')) {
                emailInput.focus();
            } else if (result.message.includes('Username')) {
                usernameInput.focus();
            }
        }
    });
});
