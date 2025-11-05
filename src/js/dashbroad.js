// Dashboard View Switching
document.addEventListener('DOMContentLoaded', function () {
    // Get all sidebar navigation items
    const navItems = document.querySelectorAll('.sidebar__nav-item')
    const viewContents = document.querySelectorAll('.view-content')

    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault()

            // Get the view name from data attribute
            const viewName = this.getAttribute('data-view')

            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'))

            // Add active class to clicked item
            this.classList.add('active')

            // Hide all views
            viewContents.forEach(view => {
                view.style.display = 'none'
            })

            // Show selected view
            const targetView = document.getElementById(`view-${viewName}`)
            if (targetView) {
                targetView.style.display = 'block'
            }
        })
    })

    // Handle class detail panel - show when clicking view button
    const viewButtons = document.querySelectorAll(
        '.btn-icon[title="View Details"]'
    )
    const detailPanel = document.getElementById('classDetailPanel')
    const closeDetailPanel = document.getElementById('closeDetailPanel')

    viewButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (detailPanel) {
                detailPanel.style.display = 'block'
            }
        })
    })

    // Close detail panel
    if (closeDetailPanel) {
        closeDetailPanel.addEventListener('click', function () {
            if (detailPanel) {
                detailPanel.style.display = 'none'
            }
        })
    }

    // Close detail panel when clicking outside (optional)
    if (detailPanel) {
        detailPanel.addEventListener('click', function (e) {
            if (e.target === this) {
                this.style.display = 'none'
            }
        })
    }

    // Sidebar toggle for mobile (if needed)
    const sidebarClose = document.querySelector('.sidebar__close')
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function () {
            const sidebar = document.querySelector('.sidebar')
            sidebar.classList.remove('sidebar--open')
        })
    }
})
