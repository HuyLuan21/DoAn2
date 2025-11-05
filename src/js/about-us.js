const mobileMenuButton = document.querySelector('#mobile-menu-btn')
const mobileMenuCloseButton = document.querySelector('#mobile-menu-close-btn')
const mobileMenuContainer = document.querySelector('.header__container-mobile')
const mobileMenuPanel = document.querySelector('.header__container-mobile-panel')

console.log(mobileMenuContainer)

document.addEventListener('DOMContentLoaded', () => {
    mobileMenuButton.addEventListener('click', handleOpenMobileMenu)
    mobileMenuCloseButton.addEventListener('click', handleCloseMobileMenu)
})

function handleOpenMobileMenu() {
    mobileMenuContainer.classList.add('active')
    mobileMenuPanel.classList.add('show')
}

function handleCloseMobileMenu() {
    mobileMenuContainer.classList.remove('active')
    mobileMenuPanel.classList.remove('show')
}
