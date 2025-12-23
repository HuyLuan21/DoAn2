import { getAllCourses, getCourseById } from '/src/database/courses.db.js'
import { getAllClasses } from '/src/database/classes.db.js'
import { getAllLanguages } from '/src/database/language.db.js'
import { getEnrollmentCountByClassId, addEnrollment, getAllEnrollments } from '/src/database/enrollment.db.js'
import { getAllTeachers } from '/src/database/teacher.db.js'

// ==================== STATE MANAGEMENT ====================
let currentCourse = null
let currentClasses = []
let selectedClass = null

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get course ID from URL
 */
function getCourseIdFromURL() {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
}

/**
 * Format currency to Vietnamese Dong
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

/**
 * Format date to Vietnamese format
 */
function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

/**
 * Get language name from code
 */
function getLanguageName(code) {
    const languages = getAllLanguages() || []
    const language = languages.find(lang => lang.languageCode === code)
    return language ? language.languageName : code
}

/**
 * Get teacher name by ID
 */
function getTeacherName(teacherId) {
    const teachers = getAllTeachers() || []
    const teacher = teachers.find(t => t.id === teacherId)
    return teacher ? teacher.fullName || teacher.name : 'Đang cập nhật'
}

/**
 * Get status configuration
 */
function getStatusConfig(status) {
    const configs = {
        Pending: { class: 'status-pending', text: 'Sắp khai giảng' },
        Ongoing: { class: 'status-ongoing', text: 'Đang học' },
        Completed: { class: 'status-completed', text: 'Đã kết thúc' },
    }
    return configs[status] || { class: '', text: status }
}

/**
 * Check if student is already enrolled in a class
 */
function isStudentEnrolled(classId, studentId) {
    const enrollments = getAllEnrollments() || []
    return enrollments.some(
        enrollment =>
            enrollment.classId === classId &&
            enrollment.studentId === studentId &&
            enrollment.status !== 'cancelled'
    )
}

// ==================== RENDER FUNCTIONS ====================

/**
 * Render course hero section
 */
function renderCourseHero(course) {
    const courseHero = document.getElementById('courseHero')
    const languageName = getLanguageName(course.languageCode)

    courseHero.innerHTML = `
        <div class="course-hero__content">
            <div class="course-hero__image">
                <img src="${course.imgUrl}" alt="${course.courseName}">
            </div>
            <div class="course-hero__info">
                <div class="course-hero__badge">${languageName}</div>
                <h1 class="course-hero__title">${course.courseName}</h1>
                <p class="course-hero__description">${course.description}</p>
                <div class="course-hero__meta">
                    <div class="course-hero__meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${course.duration}</span>
                    </div>
                    <div class="course-hero__meta-item">
                        <i class="fas fa-signal"></i>
                        <span>Level ${course.inputLevel} → ${course.outPutLevel}</span>
                    </div>
                </div>
                <div class="course-hero__price">${formatCurrency(course.tuitionFee)}</div>
            </div>
        </div>
    `
}

/**
 * Create a single class card
 */
function createClassCard(classData) {
    const enrollmentCount = getEnrollmentCountByClassId(classData.classId)
    const availableSeats = classData.maxStudents - enrollmentCount
    const isFull = availableSeats <= 0
    const statusConfig = getStatusConfig(classData.status)
    const teacherName = getTeacherName(classData.teacherId)

    // TODO: Replace with actual student ID from authentication
    const mockStudentId = 1
    const alreadyEnrolled = isStudentEnrolled(classData.classId, mockStudentId)

    return `
        <div class="class-card" data-class-id="${classData.classId}">
            <div class="class-card__header">
                <h3 class="class-card__title">${classData.className}</h3>
                <span class="class-card__status ${statusConfig.class}">${statusConfig.text}</span>
            </div>
            <div class="class-card__info">
                <div class="class-card__info-item">
                    <i class="fas fa-user-tie"></i>
                    <span>Giảng viên: ${teacherName}</span>
                </div>
                <div class="class-card__info-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formatDate(classData.startDate)} - ${formatDate(classData.endDate)}</span>
                </div>
                <div class="class-card__info-item">
                    <i class="fas fa-users"></i>
                    <span>Sĩ số: ${enrollmentCount}/${classData.maxStudents}</span>
                </div>
            </div>
            <div class="class-card__footer">
                <div class="class-card__seats">
                    Còn <strong>${availableSeats}</strong> chỗ
                </div>
                <button 
                    class="class-card__button enroll-btn" 
                    data-class-id="${classData.classId}"
                    ${isFull || classData.status === 'Completed' || alreadyEnrolled ? 'disabled' : ''}
                >
                    ${alreadyEnrolled ? 'Đã đăng ký' : isFull ? 'Đã đầy' : classData.status === 'Completed' ? 'Đã kết thúc' : 'Đăng ký'}
                </button>
            </div>
        </div>
    `
}

/**
 * Render all classes for the course
 */
function renderClasses(classes) {
    const classGrid = document.getElementById('classGrid')
    const emptyState = document.getElementById('emptyState')

    if (!classes || classes.length === 0) {
        classGrid.style.display = 'none'
        emptyState.style.display = 'block'
        return
    }

    classGrid.style.display = 'grid'
    emptyState.style.display = 'none'
    classGrid.innerHTML = classes.map(createClassCard).join('')

    // Attach event listeners to enroll buttons
    attachEnrollButtonEvents()
}

// ==================== MODAL FUNCTIONS ====================

/**
 * Open enrollment modal
 */
function openEnrollmentModal(classData) {
    selectedClass = classData
    const modal = document.getElementById('enrollmentModal')
    const modalBody = document.getElementById('modalBody')
    const teacherName = getTeacherName(classData.teacherId)

    modalBody.innerHTML = `
        <div class="modal-info-item">
            <span class="modal-info-label">Khóa học:</span>
            <span class="modal-info-value">${currentCourse.courseName}</span>
        </div>
        <div class="modal-info-item">
            <span class="modal-info-label">Lớp học:</span>
            <span class="modal-info-value">${classData.className}</span>
        </div>
        <div class="modal-info-item">
            <span class="modal-info-label">Giảng viên:</span>
            <span class="modal-info-value">${teacherName}</span>
        </div>
        <div class="modal-info-item">
            <span class="modal-info-label">Thời gian:</span>
            <span class="modal-info-value">${formatDate(classData.startDate)} - ${formatDate(classData.endDate)}</span>
        </div>
        <div class="modal-info-item">
            <span class="modal-info-label">Học phí:</span>
            <span class="modal-info-value">${formatCurrency(currentCourse.tuitionFee)}</span>
        </div>
    `

    modal.style.display = 'flex'
}

/**
 * Close enrollment modal
 */
function closeEnrollmentModal() {
    const modal = document.getElementById('enrollmentModal')
    modal.style.display = 'none'
    selectedClass = null
}

/**
 * Handle enrollment confirmation
 */
function handleEnrollment() {
    if (!selectedClass) return

    // Save class and course info before closing modal
    const classId = selectedClass.classId
    const courseId = currentCourse.courseId
    const tuitionFee = currentCourse.tuitionFee

    // TODO: Replace with actual student ID from authentication
    const mockStudentId = 1

    const enrollmentData = {
        studentId: mockStudentId,
        classId: classId,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'pendingPayment',
    }

    try {
        const newEnrollment = addEnrollment(enrollmentData)
        closeEnrollmentModal() // This sets selectedClass = null

        // Redirect to invoices page with enrollment info
        const baseUrl = window.location.origin + window.location.pathname.replace('course-detail.html', '')
        const invoiceUrl = new URL('invoices.html', baseUrl)
        invoiceUrl.searchParams.set('enrollmentId', newEnrollment.enrollmentId)
        invoiceUrl.searchParams.set('courseId', courseId)
        invoiceUrl.searchParams.set('classId', classId)
        invoiceUrl.searchParams.set('amount', tuitionFee)

        console.log('Redirecting to:', invoiceUrl.toString())
        window.location.href = invoiceUrl.toString()
    } catch (error) {
        console.error('Enrollment error:', error)
        alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }
}

// ==================== EVENT HANDLERS ====================

/**
 * Attach events to enroll buttons
 */
function attachEnrollButtonEvents() {
    const enrollButtons = document.querySelectorAll('.enroll-btn')
    enrollButtons.forEach(button => {
        button.addEventListener('click', () => {
            const classId = parseInt(button.dataset.classId)
            const classData = currentClasses.find(c => c.classId === classId)
            if (classData) {
                openEnrollmentModal(classData)
            }
        })
    })
}

/**
 * Initialize modal event listeners
 */
function initModalEvents() {
    const closeBtn = document.getElementById('closeModal')
    const cancelBtn = document.getElementById('cancelEnroll')
    const confirmBtn = document.getElementById('confirmEnroll')
    const modal = document.getElementById('enrollmentModal')

    closeBtn.addEventListener('click', closeEnrollmentModal)
    cancelBtn.addEventListener('click', closeEnrollmentModal)
    confirmBtn.addEventListener('click', handleEnrollment)

    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEnrollmentModal()
        }
    })
}

// ==================== DATA LOADING ====================

/**
 * Load course and class data
 */
function loadCourseData() {
    const courseId = getCourseIdFromURL()

    if (!courseId) {
        alert('Không tìm thấy khóa học')
        window.location.href = 'courses.html'
        return
    }

    // Load course
    currentCourse = getCourseById(parseInt(courseId))
    if (!currentCourse) {
        alert('Không tìm thấy khóa học')
        window.location.href = 'courses.html'
        return
    }

    // Load classes for this course
    const allClasses = getAllClasses() || []
    currentClasses = allClasses.filter(cls => cls.coursesId === parseInt(courseId))

    // Render UI
    renderCourseHero(currentCourse)
    renderClasses(currentClasses)
}

// ==================== INITIALIZATION ====================

/**
 * Initialize the course detail page
 */
function init() {
    loadCourseData()
    initModalEvents()
    console.log('Course detail page loaded')
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', init)
