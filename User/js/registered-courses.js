import { getAllEnrollments, updateEnrollment, deleteEnrollment } from '/src/database/enrollment.db.js'
import { getAllCourses, getCourseById } from '/src/database/courses.db.js'
import { getAllClasses, getClassById } from '/src/database/class.db.js'

// ==================== STATE MANAGEMENT ====================
let pendingEnrollments = []

// ==================== UTILITY FUNCTIONS ====================

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

// ==================== DATA PROCESSING ====================

/**
 * Get user's pending enrollments (awaiting payment)
 */
function getPendingEnrollments(studentId) {
    const enrollments = getAllEnrollments() || []
    const courses = getAllCourses() || []
    const classes = getAllClasses() || []

    // Filter enrollments for this student with pendingPayment status
    const myPendingEnrollments = enrollments.filter(
        enrollment => enrollment.studentId === studentId && enrollment.status === 'pendingPayment'
    )

    // Map enrollments with course and class details
    return myPendingEnrollments.map(enrollment => {
        const classData = classes.find(c => c.classId === enrollment.classId)
        if (!classData) return null

        const course = courses.find(c => c.courseId === classData.coursesId)
        if (!course) return null

        return {
            ...enrollment,
            course,
            class: classData
        }
    }).filter(item => item !== null)
}

/**
 * Calculate total amount for all pending enrollments
 */
function calculateTotalAmount(enrollments) {
    return enrollments.reduce((total, enrollment) => {
        return total + (enrollment.course?.tuitionFee || 0)
    }, 0)
}

// ==================== RENDER FUNCTIONS ====================

/**
 * Render summary card
 */
function renderSummaryCard() {
    const summaryCard = document.getElementById('summaryCard')
    const totalCourses = pendingEnrollments.length
    const totalAmount = calculateTotalAmount(pendingEnrollments)

    if (totalCourses === 0) {
        summaryCard.style.display = 'none'
        return
    }

    summaryCard.style.display = 'flex'
    summaryCard.innerHTML = `
        <div class="summary-card__info">
            <div class="summary-card__label">Tổng tiền cần thanh toán</div>
            <div class="summary-card__value">${formatCurrency(totalAmount)}</div>
        </div>
        <div class="summary-card__stats">
            <div class="summary-card__stat">
                <div class="summary-card__label">Số khóa học</div>
                <div class="summary-card__value">${totalCourses}</div>
            </div>
        </div>
    `
}

/**
 * Create enrollment card HTML
 */
function createEnrollmentCard(enrollment) {
    const course = enrollment.course
    const classData = enrollment.class

    return `
        <div class="enrollment-card" data-enrollment-id="${enrollment.enrollmentId}">
            <div class="enrollment-card__image">
                <img src="${course.imgUrl}" alt="${course.courseName}">
                <div class="enrollment-card__badge">
                    <i class="fas fa-clock"></i> Chờ thanh toán
                </div>
            </div>
            <div class="enrollment-card__content">
                <h3 class="enrollment-card__title">${course.courseName}</h3>
                <div class="enrollment-card__class">
                    <i class="fas fa-users"></i>
                    <span>${classData.className}</span>
                </div>
                
                <div class="enrollment-card__info">
                    <div class="enrollment-card__info-item">
                        <div class="enrollment-card__info-label">
                            <i class="fas fa-calendar"></i>
                            <span>Bắt đầu</span>
                        </div>
                        <div class="enrollment-card__info-value">${formatDate(classData.startDate)}</div>
                    </div>
                    <div class="enrollment-card__info-item">
                        <div class="enrollment-card__info-label">
                            <i class="fas fa-calendar-check"></i>
                            <span>Kết thúc</span>
                        </div>
                        <div class="enrollment-card__info-value">${formatDate(classData.endDate)}</div>
                    </div>
                    <div class="enrollment-card__info-item">
                        <div class="enrollment-card__info-label">
                            <i class="fas fa-clock"></i>
                            <span>Thời lượng</span>
                        </div>
                        <div class="enrollment-card__info-value">${course.duration}</div>
                    </div>
                    <div class="enrollment-card__info-item">
                        <div class="enrollment-card__info-label">
                            <i class="fas fa-calendar-plus"></i>
                            <span>Ngày đăng ký</span>
                        </div>
                        <div class="enrollment-card__info-value">${formatDate(enrollment.enrollmentDate)}</div>
                    </div>
                </div>

                <div class="enrollment-card__price">
                    <div class="enrollment-card__price-label">Học phí</div>
                    <div class="enrollment-card__price-value">${formatCurrency(course.tuitionFee)}</div>
                </div>

                <div class="enrollment-card__actions">
                    <button class="btn btn-danger" onclick="handleRemoveEnrollment(${enrollment.enrollmentId})">
                        <i class="fas fa-trash"></i>
                        Xóa
                    </button>
                    <button class="btn btn-primary" onclick="handlePayment(${enrollment.enrollmentId}, ${course.courseId}, ${classData.classId}, ${course.tuitionFee})">
                        <i class="fas fa-credit-card"></i>
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    `
}

/**
 * Render all enrollments
 */
function renderEnrollments() {
    const container = document.getElementById('enrollmentsContainer')
    const emptyState = document.getElementById('emptyState')

    if (!pendingEnrollments || pendingEnrollments.length === 0) {
        container.style.display = 'none'
        emptyState.style.display = 'block'
        return
    }

    container.style.display = 'grid'
    emptyState.style.display = 'none'
    container.innerHTML = pendingEnrollments.map(createEnrollmentCard).join('')
}

/**
 * Refresh the page data
 */
function refreshData() {
    // TODO: Replace with actual student ID from authentication
    const mockStudentId = 1

    pendingEnrollments = getPendingEnrollments(mockStudentId)
    renderSummaryCard()
    renderEnrollments()
}

// ==================== EVENT HANDLERS ====================

/**
 * Handle payment button click
 */
window.handlePayment = function (enrollmentId, courseId, classId, amount) {
    // Redirect to invoice page with parameters
    window.location.href = `invoices.html?enrollmentId=${enrollmentId}&courseId=${courseId}&classId=${classId}&amount=${amount}`
}

/**
 * Handle remove enrollment
 */
window.handleRemoveEnrollment = function (enrollmentId) {
    const confirm = window.confirm(
        'Bạn có chắc chắn muốn xóa khóa học này khỏi danh sách đăng ký?\n\nHành động này không thể hoàn tác.'
    )

    if (!confirm) return

    try {
        // Update enrollment status to cancelled instead of deleting
        const updated = updateEnrollment(enrollmentId, {
            status: 'cancelled'
        })

        if (updated) {
            // Show success message
            alert('Đã xóa khóa học khỏi danh sách đăng ký')

            // Refresh the page
            refreshData()
        } else {
            alert('Có lỗi xảy ra khi xóa khóa học')
        }
    } catch (error) {
        console.error('Error removing enrollment:', error)
        alert('Có lỗi xảy ra khi xóa khóa học')
    }
}

// ==================== DATA LOADING ====================

/**
 * Load pending enrollments
 */
function loadData() {
    refreshData()
    console.log('Pending enrollments:', pendingEnrollments)
}

// ==================== INITIALIZATION ====================

/**
 * Initialize the registered courses page
 */
function init() {
    loadData()
    console.log('Registered courses page loaded')
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', init)
