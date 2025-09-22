 // Responsive nav toggle
 document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.header__toggle');
    const nav = document.querySelector('.header__nav');
    toggle.addEventListener('click', function() {
        nav.classList.toggle('header__nav--open');
    });
});