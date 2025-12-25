import { getInvoiceById, addInvoice, updateInvoice } from '/src/database/invoice.db.js'
import { getCourseById } from '/src/database/courses.db.js'
import { getClassById } from '/src/database/class.db.js'
import { getEnrollmentById, updateEnrollment, deleteEnrollment } from '/src/database/enrollment.db.js'

// ==================== STATE MANAGEMENT ====================
let currentInvoice = null
let currentEnrollment = null
let currentCourse = null
let currentClass = null

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get URL parameters
 */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search)
    return {
        enrollmentId: params.get('enrollmentId'),
        courseId: params.get('courseId'),
        classId: params.get('classId'),
        amount: params.get('amount'),
    }
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

// ==================== RENDER FUNCTIONS ====================

/**
 * Render invoice status badge
 */
function renderStatusBadge(status) {
    const statusConfig = {
        Paid: { class: 'status-paid', text: 'Đã thanh toán' },
        Unpaid: { class: 'status-unpaid', text: 'Chưa thanh toán' },
        Cancelled: { class: 'status-cancelled', text: 'Đã hủy' },
    }
    const config = statusConfig[status] || { class: '', text: status }
    return `<span class="status-badge ${config.class}">${config.text}</span>`
}

/**
 * Render invoice details card
 */
function renderInvoiceCard() {
    const invoiceCard = document.getElementById('invoiceCard')

    invoiceCard.innerHTML = `
        <div class="invoice-card__section">
            <h3 class="invoice-card__section-title">Thông tin khóa học</h3>
            <div class="invoice-card__row">
                <span class="invoice-card__label">Khóa học:</span>
                <span class="invoice-card__value">${currentCourse.courseName}</span>
            </div>
            <div class="invoice-card__row">
                <span class="invoice-card__label">Lớp học:</span>
                <span class="invoice-card__value">${currentClass.className}</span>
            </div>
            <div class="invoice-card__row">
                <span class="invoice-card__label">Thời gian:</span>
                <span class="invoice-card__value">${formatDate(currentClass.startDate)} - ${formatDate(
        currentClass.endDate
    )}</span>
            </div>
        </div>

        <div class="invoice-card__section">
            <h3 class="invoice-card__section-title">Chi tiết thanh toán</h3>
            <div class="invoice-card__row">
                <span class="invoice-card__label">Học phí gốc:</span>
                <span class="invoice-card__value">${formatCurrency(currentCourse.tuitionFee)}</span>
            </div>
            <div class="invoice-card__row">
                <span class="invoice-card__label">Giảm giá:</span>
                <span class="invoice-card__value">- ${formatCurrency(currentInvoice.discountAmount || 0)}</span>
            </div>
            <div class="invoice-card__total">
                <span class="invoice-card__label">Tổng cộng:</span>
                <span class="invoice-card__value">${formatCurrency(currentInvoice.finalAmount)}</span>
            </div>
        </div>

        <div class="invoice-card__section">
            <h3 class="invoice-card__section-title">Thông tin hóa đơn</h3>
            <div class="invoice-card__row">
                <span class="invoice-card__label">Mã hóa đơn:</span>
                <span class="invoice-card__value">#INV${String(currentInvoice.invoiceId).padStart(5, '0')}</span>
            </div>
            <div class="invoice-card__row">
                <span class="invoice-card__label">Ngày tạo:</span>
                <span class="invoice-card__value">${formatDate(new Date())}</span>
            </div>
        </div>
    `
}

/**
 * Update UI based on invoice status
 */
function updateUIBasedOnStatus(status) {
    const invoiceStatus = document.getElementById('invoiceStatus')
    const paymentSection = document.getElementById('paymentSection')
    const cancelBtn = document.getElementById('cancelBtn')
    const payBtn = document.getElementById('payBtn')

    invoiceStatus.innerHTML = renderStatusBadge(status)

    if (status === 'Paid') {
        paymentSection.style.display = 'none'
        cancelBtn.style.display = 'none'
        payBtn.textContent = 'Đã thanh toán'
        payBtn.disabled = true
    } else if (status === 'Cancelled') {
        paymentSection.style.display = 'none'
        cancelBtn.style.display = 'none'
        payBtn.style.display = 'none'
    }
}

// ==================== EVENT HANDLERS ====================

/**
 * Handle payment
 */
function handlePayment() {
    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked')

    if (!selectedPaymentMethod) {
        alert('Vui lòng chọn phương thức thanh toán')
        return
    }

    const paymentMethod = selectedPaymentMethod.value

    // Update invoice status
    updateInvoice(currentInvoice.invoiceId, {
        status: 'Paid',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: paymentMethod,
    })

    // Update enrollment status
    updateEnrollment(currentEnrollment.enrollmentId, {
        status: 'learning',
    })

    alert('Thanh toán thành công!')

    // Redirect to courses page
    window.location.href = 'courses.html'
}

/**
 * Handle cancel enrollment
 */
function handleCancel() {
    const confirm = window.confirm(
        'Bạn có chắc chắn muốn hủy thanh toán này?\n\nKhóa học sẽ được chuyển về giỏ khóa học để bạn có thể thanh toán sau.'
    )

    if (!confirm) return

    // Update enrollment status to pendingPayment (move to cart)
    updateEnrollment(currentEnrollment.enrollmentId, {
        status: 'pendingPayment',
    })

    // Update invoice status
    updateInvoice(currentInvoice.invoiceId, {
        status: 'Cancelled',
    })

    alert('Khóa học đã được chuyển vào giỏ khóa học')

    // Redirect to registered courses page (cart)
    window.location.href = 'registered-courses.html'
}

// ==================== DATA LOADING ====================

/**
 * Load invoice and related data
 */
function loadInvoiceData() {
    const params = getUrlParams()

    if (!params.enrollmentId) {
        alert('Không tìm thấy thông tin đăng ký')
        window.location.href = 'courses.html'
        return
    }

    // Load enrollment
    currentEnrollment = getEnrollmentById(parseInt(params.enrollmentId))
    if (!currentEnrollment) {
        alert('Không tìm thấy thông tin đăng ký')
        window.location.href = 'courses.html'
        return
    }

    // Load course
    currentCourse = getCourseById(parseInt(params.courseId))
    if (!currentCourse) {
        alert('Không tìm thấy khóa học')
        window.location.href = 'courses.html'
        return
    }

    // Load class
    currentClass = getClassById(parseInt(params.classId))
    if (!currentClass) {
        alert('Không tìm thấy lớp học')
        window.location.href = 'courses.html'
        return
    }

    // Create or load invoice
    const finalAmount = parseInt(params.amount) || currentCourse.tuitionFee

    currentInvoice = {
        enrollmentId: currentEnrollment.enrollmentId,
        discountAmount: 0,
        finalAmount: finalAmount,
        status: 'Unpaid',
        paymentDate: null,
    }

    // Add invoice to database
    currentInvoice = addInvoice(currentInvoice)

    // Render UI
    renderInvoiceCard()
    updateUIBasedOnStatus(currentInvoice.status)
}

// ==================== INITIALIZATION ====================

/**
 * Initialize event listeners
 */
function initEventListeners() {
    const payBtn = document.getElementById('payBtn')
    const cancelBtn = document.getElementById('cancelBtn')

    payBtn.addEventListener('click', handlePayment)
    cancelBtn.addEventListener('click', handleCancel)
}

/**
 * Initialize the invoice page
 */
function init() {
    loadInvoiceData()
    initEventListeners()
    console.log('Invoice page loaded')
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', init)
