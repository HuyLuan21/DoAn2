import { getAllClasses, getClassesByTeacherId } from '../../src/database/class.db.js'
import { getEnrollmentCountByClassId } from '../../src/database/enrollment.db.js'

const teacherId = 1

// ============= HELPER FUNCTIONS =============

const formatDate = dateString => {
    const date = new Date(dateString)
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(
        2,
        '0'
    )}/${date.getFullYear()}`
}

const getAcademicYear = (startDate, endDate) => {
    const startYear = new Date(startDate).getFullYear()
    const endYear = new Date(endDate).getFullYear()
    if (startYear === endYear) return startYear
    return `${startYear}-${endYear}`
}

const STATUS_CONFIG = {
    Pending: { class: 'status-pending', text: 'Chờ bắt đầu' },
    Ongoing: { class: 'status-ongoing', text: 'Đang học' },
    Completed: { class: 'status-completed', text: 'Đã hoàn thành' },
}

const getStatusInfo = status => STATUS_CONFIG[status] || { class: 'status-default', text: status }

// ========================================== RENDER FUNCTIONS ================================================

const createClassCard = classData => {
    const { classId, className, startDate, endDate, status, maxStudents } = classData
    const studentCount = getEnrollmentCountByClassId(classId)
    const { class: statusClass, text: statusText } = getStatusInfo(status)

    return `
        <div class="class-card" data-class-id="${classId}">
            <div class="class-card__header">
                <div class="class-card__header-left">
                    <h3 class="class-card__title">${className}</h3>
                    <span class="class-card__status ${statusClass}">${statusText}</span>
                </div>
                <button class="class-card__menu-btn" aria-label="Menu">
                    <i class="fa-solid fa-ellipsis"></i>
                </button>
            </div>
            <div class="class-card__body">
                <div class="class-card__info-row">
                    <i class="fa-solid fa-calendar-days"></i>
                    <span class="class-card__info-text">${formatDate(startDate)} - ${formatDate(endDate)}</span>
                </div>
                <div class="class-card__info-row">
                    <i class="fa-solid fa-graduation-cap"></i>
                    <span class="class-card__info-text">Năm học: ${getAcademicYear(startDate, endDate)}</span>
                </div>
            </div>
            <div class="class-card__footer">
                <div class="class-card__footer-item">
                    <i class="fa-solid fa-users"></i>
                    <span>${studentCount}/${maxStudents} học viên</span>
                </div>
            </div>
        </div>
    `
}

const filterClasses = (classes, query) => {
    if (!query.trim()) return classes
    const lowerQuery = query.toLowerCase().trim()
    return classes.filter(c => c.className.toLowerCase().includes(lowerQuery))
}

const renderClasses = (filterQuery = '') => {
    const classList = document.querySelector('.class-section__classList')
    if (!classList) return console.error('Không tìm thấy container .class-section__classList')

    let classes = getClassesByTeacherId(teacherId)
    if (!classes?.length) {
        return (classList.innerHTML = '<p class="no-classes">Chưa có lớp học nào.</p>')
    }

    classes = filterClasses(classes, filterQuery)

    if (!classes.length) {
        return (classList.innerHTML = '<p class="no-classes">Không tìm thấy lớp học nào phù hợp.</p>')
    }

    classList.innerHTML = classes.map(createClassCard).join('')
    console.log(`Đã render ${classes.length} lớp học`)
}

// ============= SEARCH FUNCTIONALITY =============

const debounce = (func, wait) => {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

const setupSearch = () => {
    const searchInput = document.querySelector('.search-box__input')
    if (!searchInput) return console.error('Không tìm thấy search input')

    searchInput.addEventListener(
        'input',
        debounce(e => renderClasses(e.target.value), 300)
    )
    console.log('Search functionality đã được thiết lập')
}

// ============= CLICK HANDLER =============

/**
 * Thiết lập sự kiện click cho các class card
 * Khi click vào card, chuyển hướng tới trang classroom-detail.html với classId tương ứng
 */
const setupClassCardClick = () => {
    const classList = document.querySelector('.class-section__classList')
    if (!classList) return console.error('Không tìm thấy container .class-section__classList')

    // Sử dụng event delegation để handle click cho các card được render động
    classList.addEventListener('click', e => {
        // Tìm class card gần nhất từ element được click
        const card = e.target.closest('.class-card')

        // Nếu không click vào card hoặc click vào menu button thì bỏ qua
        if (!card || e.target.closest('.class-card__menu-btn')) {
            return
        }

        // Lấy classId từ data attribute
        const classId = card.getAttribute('data-class-id')

        if (classId) {
            // Chuyển hướng tới trang classroom-detail với classId query parameter
            window.location.href = `classroom-detail.html?classId=${classId}`
        } else {
            console.error('Không tìm thấy classId trên card')
        }
    })

    console.log('Class card click handler đã được thiết lập')
}

// ============= INITIALIZATION =============

document.addEventListener('DOMContentLoaded', () => {
    renderClasses()
    setupSearch()
    setupClassCardClick()
})
