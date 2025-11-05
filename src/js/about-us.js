const mobileMenuButton = document.querySelector('#mobile-menu-btn')
const mobileMenuCloseButton = document.querySelector('#mobile-menu-close-btn')
const mobileMenuContainer = document.querySelector('.header__container-mobile')
const mobileMenuPanel = document.querySelector('.header__container-mobile-panel')
const mobileProductToggle = document.querySelector('#mobile-product-toggle')
const mobileProductSubmenu = document.querySelector('#mobile-product-submenu')

console.log(mobileMenuContainer)

document.addEventListener('DOMContentLoaded', () => {
    mobileMenuButton.addEventListener('click', handleOpenMobileMenu)
    mobileMenuCloseButton.addEventListener('click', handleCloseMobileMenu)
    mobileProductToggle.addEventListener('click', handleToggleMobileProductSubmenu)
})

function handleOpenMobileMenu() {
    mobileMenuContainer.classList.add('active')
    mobileMenuPanel.classList.add('show')
}

function handleCloseMobileMenu() {
    mobileMenuContainer.classList.remove('active')
    mobileMenuPanel.classList.remove('show')
}

function handleToggleMobileProductSubmenu() {
    mobileProductSubmenu.classList.toggle('active')
    mobileProductToggle.classList.toggle('active')
}
