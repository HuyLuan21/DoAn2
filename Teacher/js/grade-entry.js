import { getClassById } from '../../src/database/class.db.js'
import { getStudentById } from '../../src/database/student.db.js'
import { getStudentListByClassId } from '../../src/database/enrollment.db.js'
import { getExamsByClassId, getExamById } from '../../src/database/exam.db.js'
import { getExamPartsByExamId } from '../../src/database/examPart.db.js'
import { getExamResultByStudentAndExam, createOrUpdateExamResult } from '../../src/database/examResult.db.js'
import { getExamPartResultsByResultId, saveOrUpdatePartResult } from '../../src/database/examPartResult.db.js'

// Get classId from URL
const urlParams = new URLSearchParams(window.location.search)
const currentClassId = parseInt(urlParams.get('classId'))

// State
let currentExamId = null
let currentExamParts = []
let studentList = []

// DOM Elements
const DOM = {
    className: document.getElementById('className'),
    examSelect: document.getElementById('examSelect'),
    examInfo: document.getElementById('examInfo'),
    examDate: document.getElementById('examDate'),
    examTime: document.getElementById('examTime'),
    examRoom: document.getElementById('examRoom'),
    gradeTableContainer: document.getElementById('gradeTableContainer'),
    tableHeader: document.getElementById('tableHeader'),
    tableBody: document.getElementById('tableBody'),
    emptyState: document.getElementById('emptyState'),
    actionButtons: document.getElementById('actionButtons'),
    saveBtn: document.getElementById('saveBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    backBtn: document.getElementById('backBtn'),
}

/**
 * Khởi tạo trang
 */
function init() {
    if (!currentClassId) {
        showToast('Không tìm thấy thông tin lớp học', 'error')
        return
    }

    // Load class name
    const classroom = getClassById(currentClassId)
    if (classroom) {
        DOM.className.textContent = classroom.className
    }

    // Load student list
    const studentIds = getStudentListByClassId(currentClassId)
    studentList = studentIds.map(id => getStudentById(id)).filter(Boolean)

    // Load exams dropdown
    loadExamsDropdown()

    // Setup event listeners
    setupEventListeners()
}

/**
 * Load danh sách kỳ thi vào dropdown
 */
function loadExamsDropdown() {
    const exams = getExamsByClassId(currentClassId)

    DOM.examSelect.innerHTML = '<option value="">-- Chọn kỳ thi --</option>'

    exams.forEach(exam => {
        const option = document.createElement('option')
        option.value = exam.examId
        option.textContent = `${exam.examName} (${formatDate(exam.examDate)})`
        DOM.examSelect.appendChild(option)
    })
}

/**
 * Format date string
 */
function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

/**
 * Xử lý khi chọn kỳ thi
 */
function handleExamSelect(examId) {
    if (!examId) {
        // Reset view
        DOM.examInfo.classList.add('hidden')
        DOM.gradeTableContainer.classList.add('hidden')
        DOM.actionButtons.classList.add('hidden')
        DOM.emptyState.classList.remove('hidden')
        currentExamId = null
        currentExamParts = []
        return
    }

    currentExamId = parseInt(examId)
    const exam = getExamById(currentExamId)

    if (!exam) {
        showToast('Không tìm thấy thông tin kỳ thi', 'error')
        return
    }

    // Show exam info
    DOM.examDate.textContent = formatDate(exam.examDate)
    DOM.examTime.textContent = `${exam.startTime} - ${exam.endTime}`
    DOM.examRoom.textContent = exam.room || 'Chưa xác định'
    DOM.examInfo.classList.remove('hidden')

    // Load exam parts
    currentExamParts = getExamPartsByExamId(currentExamId)

    // Render grade table
    renderGradeTable()

    // Show table and action buttons
    DOM.gradeTableContainer.classList.remove('hidden')
    DOM.actionButtons.classList.remove('hidden')
    DOM.emptyState.classList.add('hidden')
}

/**
 * Render bảng nhập điểm
 */
function renderGradeTable() {
    // Render header
    let headerHTML = `
        <tr>
            <th class="col-stt">STT</th>
            <th class="col-name">Họ và tên</th>
    `

    currentExamParts.forEach(part => {
        const weightPercent = Math.round(part.weighttage * 100)
        headerHTML += `
            <th class="col-part">
                <div class="part-header">
                    <span class="part-name">${part.partName}</span>
                    <span class="part-info">${weightPercent}% | max: ${part.maxScore}</span>
                </div>
            </th>
        `
    })

    headerHTML += '</tr>'
    DOM.tableHeader.innerHTML = headerHTML

    // Render body
    let bodyHTML = ''

    studentList.forEach((student, index) => {
        // Get existing exam result for this student
        const existingResult = getExamResultByStudentAndExam(student.studentId, currentExamId)

        // Get existing part results if exam result exists
        let partResults = []
        if (existingResult) {
            partResults = getExamPartResultsByResultId(existingResult.resultId)
        }

        bodyHTML += `
            <tr data-student-id="${student.studentId}">
                <td class="col-stt">${index + 1}</td>
                <td class="col-name">${student.fullName}</td>
        `

        currentExamParts.forEach((part, partIndex) => {
            // Find existing score for this part
            const existingPartResult = partResults.find(pr => pr.examPartId === part.partId)
            const existingScore = existingPartResult ? existingPartResult.score : ''

            bodyHTML += `
                <td>
                    <input 
                        type="number"
                        class="score-input"
                        data-student-id="${student.studentId}"
                        data-part-id="${part.partId}"
                        data-max-score="${part.maxScore}"
                        data-row="${index}"
                        data-col="${partIndex}"
                        placeholder="—"
                        step="0.1"
                        min="0"
                        max="${part.maxScore}"
                        value="${existingScore}"
                    />
                </td>
            `
        })

        bodyHTML += '</tr>'
    })

    DOM.tableBody.innerHTML = bodyHTML

    // Setup input event listeners
    setupInputListeners()
}

/**
 * Setup event listeners cho các ô input
 */
function setupInputListeners() {
    const inputs = document.querySelectorAll('.score-input')

    inputs.forEach(input => {
        // Validate on input
        input.addEventListener('input', e => {
            validateInput(e.target)
        })

        // Quick entry: Enter to move to next input
        input.addEventListener('keydown', e => {
            handleQuickEntry(e, inputs)
        })

        // Blur: format value
        input.addEventListener('blur', e => {
            formatInputValue(e.target)
        })
    })
}

/**
 * Validate input value
 */
function validateInput(input) {
    const value = parseFloat(input.value)
    const maxScore = parseFloat(input.dataset.maxScore)

    input.classList.remove('is-valid', 'is-invalid')

    if (input.value === '') {
        return // Empty is allowed
    }

    if (isNaN(value) || value < 0 || value > maxScore) {
        input.classList.add('is-invalid')
    } else {
        input.classList.add('is-valid')
    }
}

/**
 * Format input value to 1 decimal place
 */
function formatInputValue(input) {
    if (input.value === '') return

    const value = parseFloat(input.value)
    const maxScore = parseFloat(input.dataset.maxScore)

    if (isNaN(value)) {
        input.value = ''
        return
    }

    // Clamp value
    const clampedValue = Math.min(Math.max(0, value), maxScore)

    // Format to 1 decimal place
    input.value = Math.round(clampedValue * 10) / 10

    validateInput(input)
}

/**
 * Handle quick entry navigation
 */
function handleQuickEntry(e, inputs) {
    const input = e.target
    const row = parseInt(input.dataset.row)
    const col = parseInt(input.dataset.col)
    const numCols = currentExamParts.length
    const numRows = studentList.length

    let nextRow = row
    let nextCol = col

    if (e.key === 'Enter') {
        e.preventDefault()

        if (e.shiftKey) {
            // Shift+Enter: go to previous
            nextCol--
            if (nextCol < 0) {
                nextCol = numCols - 1
                nextRow--
            }
        } else {
            // Enter: go to next
            nextCol++
            if (nextCol >= numCols) {
                nextCol = 0
                nextRow++
            }
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        nextRow++
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        nextRow--
    } else {
        return // Don't handle other keys
    }

    // Find and focus next input
    if (nextRow >= 0 && nextRow < numRows && nextCol >= 0 && nextCol < numCols) {
        const nextInput = document.querySelector(`.score-input[data-row="${nextRow}"][data-col="${nextCol}"]`)
        if (nextInput) {
            nextInput.focus()
            nextInput.select()
        }
    }
}

/**
 * Lưu điểm
 */
function saveGrades() {
    const inputs = document.querySelectorAll('.score-input')
    const invalidInputs = document.querySelectorAll('.score-input.is-invalid')

    if (invalidInputs.length > 0) {
        showToast('Vui lòng sửa các điểm không hợp lệ trước khi lưu', 'error')
        invalidInputs[0].focus()
        return
    }

    // Group inputs by student
    const studentScores = new Map()

    inputs.forEach(input => {
        const studentId = parseInt(input.dataset.studentId)
        const partId = parseInt(input.dataset.partId)
        const value = input.value.trim()

        if (!studentScores.has(studentId)) {
            studentScores.set(studentId, [])
        }

        if (value !== '') {
            studentScores.set(studentId, [...studentScores.get(studentId), { partId, score: parseFloat(value) }])
        }
    })

    // Save each student's scores
    let savedCount = 0

    studentScores.forEach((scores, studentId) => {
        if (scores.length === 0) return

        // Create or get exam result
        const examResult = createOrUpdateExamResult(currentExamId, studentId, null)

        // Save each part score
        scores.forEach(({ partId, score }) => {
            saveOrUpdatePartResult(examResult.resultId, partId, score)
        })

        // Calculate and update total score
        const totalScore = calculateTotalScore(scores)
        createOrUpdateExamResult(currentExamId, studentId, totalScore)

        savedCount++
    })

    showToast(`Đã lưu điểm cho ${savedCount} học sinh!`, 'success')

    // Redirect back after a short delay
    setTimeout(() => {
        window.location.href = `classroom-detail.html?classId=${currentClassId}`
    }, 1500)
}

/**
 * Tính điểm tổng từ các parts
 */
function calculateTotalScore(scores) {
    let total = 0

    scores.forEach(({ partId, score }) => {
        const part = currentExamParts.find(p => p.partId === partId)
        if (part) {
            total += score * part.weighttage
        }
    })

    return Math.round(total * 10) / 10
}

/**
 * Hủy và quay lại
 */
function cancel() {
    if (confirm('Bạn có chắc muốn hủy? Các thay đổi chưa lưu sẽ bị mất.')) {
        window.location.href = `classroom-detail.html?classId=${currentClassId}`
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast')
    existingToasts.forEach(t => t.remove())

    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `
    document.body.appendChild(toast)

    setTimeout(() => {
        toast.remove()
    }, 3000)
}

/**
 * Setup main event listeners
 */
function setupEventListeners() {
    // Exam select change
    DOM.examSelect.addEventListener('change', e => {
        handleExamSelect(e.target.value)
    })

    // Save button
    DOM.saveBtn.addEventListener('click', saveGrades)

    // Cancel button
    DOM.cancelBtn.addEventListener('click', cancel)

    // Back button
    DOM.backBtn.addEventListener('click', () => {
        window.location.href = `classroom-detail.html?classId=${currentClassId}`
    })
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init)
