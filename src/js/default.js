const mobileMenuButton = document.querySelector('#mobile-menu-btn')
const mobileMenuCloseButton = document.querySelector('#mobile-menu-close-btn')
const mobileMenuContainer = document.querySelector('.header__container-mobile')
const mobileMenuPanel = document.querySelector('.header__container-mobile-panel')
const mobileProductToggle = document.querySelector('#mobile-product-toggle')
const mobileProductSubmenu = document.querySelector('#mobile-product-submenu')

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

// Tab Navigation
document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('#testing .content_item')
    const tabItems = document.querySelectorAll('#testing .Tab_Navigation_Item')

    items[0].classList.remove('hidden')
    tabItems[0].classList.add('active')

    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.add('hidden'))
            items[item.dataset.index].classList.remove('hidden')
        })
    })
    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            tabItems.forEach(i => i.classList.remove('active'))
            item.classList.add('active')
        })
    })
})

document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('#question-bank .content_item')
    const tabItems = document.querySelectorAll('#question-bank .Tab_Navigation_Item')

    items[0].classList.remove('hidden')
    tabItems[0].classList.add('active')

    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.add('hidden'))
            items[item.dataset.index - 1].classList.remove('hidden')
        })
    })
    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            tabItems.forEach(i => i.classList.remove('active'))
            item.classList.add('active')
        })
    })
})

document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('#lms .content_item')
    const tabItems = document.querySelectorAll('#lms .Tab_Navigation_Item')

    items[0].classList.remove('hidden')
    tabItems[0].classList.add('active')

    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.add('hidden'))
            items[item.dataset.index].classList.remove('hidden')
        })
    })
    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            tabItems.forEach(i => i.classList.remove('active'))
            item.classList.add('active')
        })
    })
})
// show all section
// document.addEventListener('DOMContentLoaded', function () {
//     const items = document.querySelectorAll('.content_item')
//     items.forEach(item => {
//         item.classList.add('active')
//     })
// })
// // Carousel Slider
// Infinite smooth carousel (one element per slide)
document.addEventListener('DOMContentLoaded', function () {
    const carouselList = document.querySelector('.carousel__item_list')
    const items = document.querySelectorAll('.carousel__item')
    if (!carouselList || items.length === 0) return

    let itemWidth = items[0].offsetWidth + 20 // 20px = khoảng gap
    let isMoving = false

    function slideOnce() {
        if (isMoving) return
        isMoving = true

        // trượt 1 item sang trái
        carouselList.style.transition = 'transform 0.7s ease-in-out'
        carouselList.style.transform = `translateX(-${itemWidth}px)`

        // sau khi trượt xong, đưa item đầu xuống cuối và reset transform
        setTimeout(() => {
            carouselList.appendChild(carouselList.firstElementChild)
            carouselList.style.transition = 'none'
            carouselList.style.transform = 'translateX(0)'
            isMoving = false
        }, 700) // khớp với thời gian transition
    }

    // Auto slide mỗi 2 giây
    let interval = setInterval(slideOnce, 2000)

    // Dừng khi hover
    carouselList.addEventListener('mouseenter', () => clearInterval(interval))
    carouselList.addEventListener('mouseleave', () => {
        interval = setInterval(slideOnce, 2000)
    })
})
