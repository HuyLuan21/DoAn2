import { getAllEnrollments } from '/src/database/enrollment.db.js'
import { getAllCourses, getCourseById } from '/src/database/courses.db.js'
import { getAllClasses, getClassById } from '/src/database/class.db.js'

// ==================== STATE MANAGEMENT ====================
let myEnrolledCourses = []

// ==================== UTILITY FUNCTIONS ====================

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

// ==================== DATA PROCESSING ====================

/**
 * Get user's enrolled courses with their classes
 */
function getMyEnrolledCourses(studentId) {
    const enrollments = getAllEnrollments() || []
    const courses = getAllCourses() || []
    const classes = getAllClasses() || []

    // Filter enrollments for this student (excluding cancelled)
    const myEnrollments = enrollments.filter(
        enrollment => enrollment.studentId === studentId && enrollment.status !== 'cancelled'
    )

    // Group enrollments by course
    const courseMap = {}

    myEnrollments.forEach(enrollment => {
        const classData = classes.find(c => c.classId === enrollment.classId)
        if (!classData) return

        const courseId = classData.coursesId

        if (!courseMap[courseId]) {
            const course = courses.find(c => c.courseId === courseId)
            if (!course) return

            courseMap[courseId] = {
                ...course,
                classes: []
            }
        }

        courseMap[courseId].classes.push({
            ...classData,
            enrollmentStatus: enrollment.status,
            enrollmentDate: enrollment.enrollmentDate
        })
    })

    return Object.values(courseMap)
}

// ==================== RENDER FUNCTIONS ====================

/**
 * Create course card HTML
 */
function createCourseCard(course) {
    const classCount = course.classes.length

    return `
        <div class="course-card" data-course-id="${course.courseId}">
            <div class="course-card__header" onclick="toggleCourseClasses(${course.courseId})">
                <div class="course-card__image">
                    <img src="${course.imgUrl}" alt="${course.courseName}">
                </div>
                <div class="course-card__info">
                    <h3 class="course-card__title">${course.courseName}</h3>
                    <div class="course-card__meta">
                        <div class="course-card__meta-item">
                            <i class="fas fa-book"></i>
                            <span>${classCount} lớp học</span>
                        </div>
                        <div class="course-card__meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${course.duration}</span>
                        </div>
                    </div>
                </div>
                <i class="fas fa-chevron-down course-card__toggle"></i>
            </div>
            <div class="course-card__classes" id="classes-${course.courseId}">
                <div class="class-list">
                    ${course.classes.map(createClassItem).join('')}
                </div>
            </div>
        </div>
    `
}

/**
 * Create class item HTML
 */
function createClassItem(classData) {
    const statusConfig = getEnrollmentStatusConfig(classData.enrollmentStatus)

    return `
        <div class="class-item" onclick="goToMyClass(${classData.classId})">
            <div class="class-item__info">
                <div class="class-item__name">${classData.className}</div>
                <div class="class-item__details">
                    <div class="class-item__detail">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(classData.startDate)} - ${formatDate(classData.endDate)}</span>
                    </div>
                </div>
            </div>
            <div class="class-item__status ${statusConfig.class}">${statusConfig.text}</div>
            <i class="fas fa-chevron-right class-item__arrow"></i>
        </div>
    `
}

/**
 * Render all enrolled courses
 */
function renderMyCourses() {
    const container = document.getElementById('coursesContainer')
    const emptyState = document.getElementById('emptyState')

    if (!myEnrolledCourses || myEnrolledCourses.length === 0) {
        container.style.display = 'none'
        emptyState.style.display = 'block'
        return
    }

    container.style.display = 'flex'
    emptyState.style.display = 'none'
    container.innerHTML = myEnrolledCourses.map(createCourseCard).join('')
}

// ==================== EVENT HANDLERS ====================

/**
 * Toggle course classes visibility
 */
window.toggleCourseClasses = function (courseId) {
    const header = document.querySelector(`[data-course-id="${courseId}"] .course-card__header`)
    const classes = document.getElementById(`classes-${courseId}`)

    header.classList.toggle('active')
    classes.classList.toggle('active')
}

/**
 * Navigate to my-class page
 */
window.goToMyClass = function (classId) {
    window.location.href = `my-class.html?classId=${classId}`
}

// ==================== DATA LOADING ====================

/**
 * Load user's enrolled courses
 */
function loadData() {
    // TODO: Replace with actual student ID from authentication
    const mockStudentId = 1

    myEnrolledCourses = getMyEnrolledCourses(mockStudentId)

    console.log('My enrolled courses:', myEnrolledCourses)

    renderMyCourses()
}

// ==================== INITIALIZATION ====================

/**
 * Initialize the my courses page
 */
function init() {
    loadData()
    console.log('My courses page loaded')
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', init)
