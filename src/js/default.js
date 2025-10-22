// Responsive nav toggle
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.header__toggle')
    const nav = document.querySelector('.header__nav')
    toggle.addEventListener('click', function () {
        nav.classList.toggle('header__nav--open')
    })
})

// Tab Navigation
document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('.content_item')
    const tabItems = document.querySelectorAll('.Tab_Navigation_Item')

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
//show all section
// document.addEventListener('DOMContentLoaded', function () {
//     const items = document.querySelectorAll('.content_item')
//     items.forEach(item => {
//         item.classList.add('active')
//     })
// })
