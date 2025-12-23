import { getClassById } from '/src/database/class.db.js'
import { getCourseById } from '/src/database/courses.db.js'
import { getAllEnrollments } from '/src/database/enrollment.db.js'
import { getTeacherById } from '/src/database/teacher.db.js'
import { getSchedulesByClassId } from '/src/database/classSchedule.db.js'

// ==================== STATE MANAGEMENT ====================
let currentClass = null
let currentCourse = null
let currentEnrollment = null
let currentTeacher = null
let currentSchedules = []

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get classId from URL
 */
function getClassIdFromURL() {
    const params = new URLSearchParams(window.location.search)
    return params.get('classId')
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
 * Format currency to Vietnamese Dong
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

/**
 * Get enrollment status config
 */
function getEnrollmentStatusConfig(status) {
    const configs = {
        learning: { class: 'status-learning', text: 'Đang học' },
        completed: { class: 'status-completed', text: 'Đã hoàn thành' },
        pendingPayment: { class: 'status-pending', text: 'Chờ thanh toán' },
        failed: { class: 'status-pending', text: 'Chưa hoàn thành' },
    }
    return configs[status] || { class: '', text: status }
}

/**
 * Get class status config
 */
function getClassStatusConfig(status) {
    const configs = {
        Pending: { text: 'Sắp khai giảng' },
        Ongoing: { text: 'Đang học' },
        Completed: { text: 'Đã kết thúc' },
    }
    return configs[status] || { text: status }
}

/**
 * Calculate progress percentage
 */
function calculateProgress(startDate, endDate) {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = Date.now()

    if (now < start) return 0
    if (now > end) return 100

    const progress = ((now - start) / (end - start)) * 100
    return Math.round(progress)
}

// ==================== RENDER FUNCTIONS ====================

/**
 * Render class header
 */
function renderClassHeader() {
    const classHeader = document.getElementById('classHeader')
    const enrollmentStatusConfig = getEnrollmentStatusConfig(currentEnrollment.status)
    const classStatusConfig = getClassStatusConfig(currentClass.status)
    const progress = calculateProgress(currentClass.startDate, currentClass.endDate)

    classHeader.innerHTML = `
        <h1 class="class-header__title">${currentClass.className}</h1>
        <p class="class-header__course">${currentCourse.courseName}</p>
        <div class="class-header__meta">
            <div class="class-header__meta-item">
                <i class="fas fa-calendar"></i>
                <span>${formatDate(currentClass.startDate)} - ${formatDate(currentClass.endDate)}</span>
            </div>
            <div class="class-header__meta-item">
                <i class="fas fa-users"></i>
                <span>Sĩ số: ${currentClass.maxStudents} học viên</span>
            </div>
            <div class="class-header__meta-item">
                <span class="class-header__status">${classStatusConfig.text}</span>
            </div>
        </div>
    `
}

/**
 * Render course info
 */
function renderCourseInfo() {
    const courseInfo = document.getElementById('courseInfo')

    courseInfo.innerHTML = `
        <div class="info-row">
            <span class="info-row__label">Tên khóa học:</span>
            <span class="info-row__value">${currentCourse.courseName}</span>
        </div>
        <div class="info-row">
            <span class="info-row__label">Mô tả:</span>
            <span class="info-row__value">${currentCourse.description}</span>
        </div>
        <div class="info-row">
            <span class="info-row__label">Thời lượng:</span>
            <span class="info-row__value">${currentCourse.duration}</span>
        </div>
        <div class="info-row">
            <span class="info-row__label">Trình độ:</span>
            <span class="info-row__value">Level ${currentCourse.inputLevel} → ${currentCourse.outPutLevel}</span>
        </div>
        <div class="info-row">
            <span class="info-row__label">Học phí:</span>
            <span class="info-row__value">${formatCurrency(currentCourse.tuitionFee)}</span>
        </div>
    `
}

/**
 * Get day of week in Vietnamese
 */
function getDayOfWeek(dateString) {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
    const date = new Date(dateString)
    return days[date.getDay()]
}

/**
 * Render schedule info
 */
function renderScheduleInfo() {
    const scheduleInfo = document.getElementById('scheduleInfo')

    if (!currentSchedules || currentSchedules.length === 0) {
        scheduleInfo.innerHTML = `
            <div class="info-row">
                <span class="info-row__label">Ngày bắt đầu:</span>
                <span class="info-row__value">${formatDate(currentClass.startDate)}</span>
            </div>
            <div class="info-row">
                <span class="info-row__label">Ngày kết thúc:</span>
                <span class="info-row__value">${formatDate(currentClass.endDate)}</span>
            </div>
            <div class="info-row">
                <span class="info-row__label">Lịch học:</span>
                <span class="info-row__value">Chưa có lịch học cụ thể</span>
            </div>
        `
        return
    }

    const scheduleItems = currentSchedules.map(schedule => `
        <div class="schedule-item">
            <div class="schedule-item__day">
                <i class="fas fa-calendar-day"></i>
                <span>${getDayOfWeek(schedule.studyDate)}</span>
            </div>
            <div class="schedule-item__time">
                <i class="fas fa-clock"></i>
                <span>${schedule.startTime} - ${schedule.endTime}</span>
            </div>
            <div class="schedule-item__room">
                <i class="fas fa-door-open"></i>
                <span>Phòng ${schedule.room}</span>
            </div>
        </div>
    `).join('')

    scheduleInfo.innerHTML = `
        <div class="schedule-list">
            ${scheduleItems}
        </div>
    `
}

/**
 * Render enrollment info
 */
function renderEnrollmentInfo() {
    const enrollmentInfo = document.getElementById('enrollmentInfo')
    const statusConfig = getEnrollmentStatusConfig(currentEnrollment.status)

    enrollmentInfo.innerHTML = `
        <div class="info-row">
            <span class="info-row__label">Ngày đăng ký:</span>
            <span class="info-row__value">${formatDate(currentEnrollment.enrollmentDate)}</span>
        </div>
        <div class="info-row">
            <span class="info-row__label">Trạng thái học tập:</span>
            <span class="info-row__value">
                <span class="status-badge ${statusConfig.class}">${statusConfig.text}</span>
            </span>
        </div>
    `
}

/**
 * Render teacher info
 */
function renderTeacherInfo() {
    const teacherInfo = document.getElementById('teacherInfo')
    const teacherName = currentTeacher ? (currentTeacher.fullName || currentTeacher.name) : 'Đang cập nhật'
    const teacherEmail = currentTeacher ? currentTeacher.email : 'N/A'
    const initials = teacherName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    teacherInfo.innerHTML = `
        <div class="teacher-card">
            <div class="teacher-card__avatar">${initials}</div>
            <div class="teacher-card__info">
                <div class="teacher-card__name">${teacherName}</div>
                <div class="teacher-card__email">
                    <i class="fas fa-envelope"></i>
                    <span>${teacherEmail}</span>
                </div>
            </div>
        </div>
    `
}

// ==================== DATA LOADING ====================

/**
 * Load class and related data
 */
function loadClassData() {
    const classId = getClassIdFromURL()

    if (!classId) {
        alert('Không tìm thấy thông tin lớp học')
        window.location.href = 'my-courses.html'
        return
    }

    // TODO: Replace with actual student ID from authentication
    const mockStudentId = 1

    // Load class
    currentClass = getClassById(parseInt(classId))
    if (!currentClass) {
        alert('Không tìm thấy lớp học')
        window.location.href = 'my-courses.html'
        return
    }

    // Load course
    currentCourse = getCourseById(currentClass.coursesId)
    if (!currentCourse) {
        alert('Không tìm thấy khóa học')
        window.location.href = 'my-courses.html'
        return
    }

    // Load enrollment
    const enrollments = getAllEnrollments() || []
    currentEnrollment = enrollments.find(
        e => e.classId === parseInt(classId) && e.studentId === mockStudentId
    )
    if (!currentEnrollment) {
        alert('Bạn chưa đăng ký lớp học này')
        window.location.href = 'my-courses.html'
        return
    }

    // Load teacher
    currentTeacher = getTeacherById(currentClass.teacherId)

    // Load schedules
    currentSchedules = getSchedulesByClassId(parseInt(classId))

    // Render all sections
    renderClassHeader()
    renderCourseInfo()
    renderScheduleInfo()
    renderEnrollmentInfo()
    renderTeacherInfo()
}

// ==================== INITIALIZATION ====================

/**
 * Initialize the my class page
 */
function init() {
    loadClassData()
    console.log('My class page loaded')
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', init)
