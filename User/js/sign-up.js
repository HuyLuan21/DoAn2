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

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        let isValid = true;

        // Validate email
        if (email === '') {
            emailError.textContent = 'Email is required';
            emailError.style.color = 'red';
            emailError.style.fontSize = '12px';
            emailError.style.marginTop = '5px';
            emailInput.style.borderColor = 'red';
            isValid = false;
        } else if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.color = 'red';
            emailError.style.fontSize = '12px';
            emailError.style.marginTop = '5px';
            emailInput.style.borderColor = 'red';
            isValid = false;
        }

        // Validate password match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            isValid = false;
        }

        if (!isValid) {
            return false;
        }

        // If validation passes, you can proceed with form submission
        console.log('Form submitted successfully');
        // Add your sign-up logic here
    });
});
