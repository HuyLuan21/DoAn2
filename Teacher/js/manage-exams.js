// Import database methods
import { getAllExams, addExam, updateExam, deleteExam } from '../../src/database/exam.db.js'
import { getAllClasses } from '../../src/database/class.db.js'
import examTypes from '../../src/mocks/examTypes.js'

// DOM Elements
const examList = document.getElementById('examList')
const examEmpty = document.getElementById('examEmpty')
const createExamBtn = document.getElementById('createExamBtn')
const examModal = document.getElementById('examModal')
const deleteModal = document.getElementById('deleteModal')
const closeModalBtn = document.getElementById('closeModalBtn')
const cancelFormBtn = document.getElementById('cancelFormBtn')
const examForm = document.getElementById('examForm')
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn')
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn')
const resetFilterBtn = document.getElementById('resetFilterBtn')

// Wizard elements
const nextBtn = document.getElementById('nextBtn')
const backBtn = document.getElementById('backBtn')
const submitFormBtn = document.getElementById('submitFormBtn')
const step1 = document.getElementById('step1')
const step2 = document.getElementById('step2')
const addPartBtn = document.getElementById('addPartBtn')
const examPartsList = document.getElementById('examPartsList')
const partsEmptyState = document.getElementById('partsEmptyState')
const totalWeightageEl = document.getElementById('totalWeightage')
const weightageWarning = document.getElementById('weightageWarning')

// Filter elements
const filterClass = document.getElementById('filterClass')
const filterType = document.getElementById('filterType')
const filterDateFrom = document.getElementById('filterDateFrom')
const filterDateTo = document.getElementById('filterDateTo')

// State
let currentExams = []
let currentExamId = null
let deleteExamId = null
let currentStep = 1
let examParts = []

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters()
    loadExams()
    attachEventListeners()
})

// Initialize filter dropdowns
function initializeFilters() {
    // Populate class filter
    const classes = getAllClasses()
    classes.forEach(cls => {
        const option = document.createElement('option')
        option.value = cls.classId
        option.textContent = cls.className
        filterClass.appendChild(option)
    })

    // Populate exam type filter
    examTypes.forEach(type => {
        const option = document.createElement('option')
        option.value = type.examTypeId
        option.textContent = type.typeLabel
        filterType.appendChild(option)
    })

    // Populate form dropdowns
    populateFormDropdowns()
}

// Populate form dropdowns (for create/edit modal)
function populateFormDropdowns() {
    const examTypeSelect = document.getElementById('examType')
    const examClassSelect = document.getElementById('examClass')

    // Clear existing options except first one
    examTypeSelect.innerHTML = '<option value="">-- Chọn loại --</option>'
    examClassSelect.innerHTML = '<option value="">-- Chọn lớp --</option>'

    // Add exam types
    examTypes.forEach(type => {
        const option = document.createElement('option')
        option.value = type.examTypeId
        option.textContent = type.typeLabel
        examTypeSelect.appendChild(option)
    })

    // Add classes
    const classes = getAllClasses()
    classes.forEach(cls => {
        const option = document.createElement('option')
        option.value = cls.classId
        option.textContent = cls.className
        examClassSelect.appendChild(option)
    })
}

// Load and render exams
function loadExams() {
    const allExams = getAllExams()
    currentExams = sortExamsByDate(allExams)
    applyFilters()
}

// Sort exams by date (newest first)
function sortExamsByDate(exams) {
    return exams.sort((a, b) => {
        const dateA = new Date(a.examDate)
        const dateB = new Date(b.examDate)
        return dateB - dateA // Descending order
    })
}

// Apply filters
function applyFilters() {
    let filteredExams = [...currentExams]

    // Filter by class
    const classId = filterClass.value
    if (classId) {
        filteredExams = filteredExams.filter(exam => exam.classId === parseInt(classId))
    }

    // Filter by exam type
    const typeId = filterType.value
    if (typeId) {
        filteredExams = filteredExams.filter(exam => exam.examTypeId === parseInt(typeId))
    }

    // Filter by date range
    const dateFrom = filterDateFrom.value
    const dateTo = filterDateTo.value
    if (dateFrom) {
        filteredExams = filteredExams.filter(exam => exam.examDate >= dateFrom)
    }
    if (dateTo) {
        filteredExams = filteredExams.filter(exam => exam.examDate <= dateTo)
    }

    renderExams(filteredExams)
}

// Render exams
function renderExams(exams) {
    examList.innerHTML = ''

    if (exams.length === 0) {
        examList.classList.add('hidden')
        examEmpty.classList.remove('hidden')
        return
    }

    examList.classList.remove('hidden')
    examEmpty.classList.add('hidden')

    exams.forEach(exam => {
        const card = createExamCard(exam)
        examList.appendChild(card)
    })
}

// Create exam card
function createExamCard(exam) {
    const card = document.createElement('div')
    card.className = 'exam-card'

    // Get exam type info
    const examType = examTypes.find(t => t.examTypeId === exam.examTypeId)
    const badgeClass = `exam-card__badge--${examType?.typeCode.toLowerCase() || 'regular'}`

    // Get class info
    const classes = getAllClasses()
    const classInfo = classes.find(c => c.classId === exam.classId)

    // Format date
    const formattedDate = formatDate(exam.examDate)

    card.innerHTML = `
        <div class="exam-card__header">
            <div>
                <h3 class="exam-card__title">${exam.examName}</h3>
                <span class="exam-card__badge ${badgeClass}">${examType?.typeLabel || 'N/A'}</span>
            </div>
        </div>
        <div class="exam-card__info">
            <div class="exam-card__info-item">
                <i class="fa-solid fa-layer-group"></i>
                <span>${classInfo?.className || 'N/A'}</span>
            </div>
            <div class="exam-card__info-item">
                <i class="fa-solid fa-calendar"></i>
                <span>${formattedDate}</span>
            </div>
            <div class="exam-card__info-item">
                <i class="fa-solid fa-clock"></i>
                <span>${exam.startTime} - ${exam.endTime}</span>
            </div>
            <div class="exam-card__info-item">
                <i class="fa-solid fa-location-dot"></i>
                <span>${exam.room}</span>
            </div>
        </div>
        <div class="exam-card__actions">
            <button class="exam-card__btn exam-card__btn--edit" data-exam-id="${exam.examId}">
                <i class="fa-solid fa-pen"></i>
                Sửa
            </button>
            <button class="exam-card__btn exam-card__btn--delete" data-exam-id="${exam.examId}">
                <i class="fa-solid fa-trash"></i>
                Xóa
            </button>
        </div>
    `

    // Attach event listeners to buttons
    const editBtn = card.querySelector('.exam-card__btn--edit')
    const deleteBtn = card.querySelector('.exam-card__btn--delete')

    editBtn.addEventListener('click', e => {
        e.stopPropagation()
        openEditModal(exam.examId)
    })

    deleteBtn.addEventListener('click', e => {
        e.stopPropagation()
        openDeleteModal(exam.examId)
    })

    return card
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

// Open create modal
function openCreateModal() {
    currentExamId = null
    examParts = []
    currentStep = 1

    document.getElementById('modalTitle').textContent = 'Tạo bài kiểm tra mới'
    examForm.reset()
    document.getElementById('examId').value = ''
    document.getElementById('maxScore').value = '100'

    showStep(1)
    examModal.classList.remove('hidden')
}

// Open edit modal
function openEditModal(examId) {
    currentExamId = examId
    const exam = getAllExams().find(e => e.examId === examId)

    if (!exam) return

    document.getElementById('modalTitle').textContent = 'Sửa bài kiểm tra'

    // Fill step 1 data
    document.getElementById('examId').value = exam.examId
    document.getElementById('examName').value = exam.examName
    document.getElementById('examType').value = exam.examTypeId
    document.getElementById('examClass').value = exam.classId || ''
    document.getElementById('examDate').value = exam.examDate
    document.getElementById('startTime').value = exam.startTime
    document.getElementById('endTime').value = exam.endTime
    document.getElementById('examRoom').value = exam.room
    document.getElementById('maxScore').value = exam.maxScore

    // Load exam parts
    import('../../src/database/examPart.db.js').then(module => {
        const parts = module.getExamPartsByExamId(examId)
        examParts = parts.map(part => ({
            partName: part.partName,
            maxScore: part.maxScore,
            weightage: (part.weighttage || 0) * 100, // Convert decimal to percentage
        }))
    })

    currentStep = 1
    showStep(1)
    examModal.classList.remove('hidden')
}

// Show specific wizard step
function showStep(stepNumber) {
    currentStep = stepNumber

    // Update step indicators
    document.querySelectorAll('.wizard-step').forEach(step => {
        const stepNum = parseInt(step.dataset.step)
        if (stepNum === stepNumber) {
            step.classList.add('active')
        } else {
            step.classList.remove('active')
        }
    })

    // Show/hide step content
    if (stepNumber === 1) {
        step1.classList.remove('hidden')
        step2.classList.add('hidden')
        nextBtn.classList.remove('hidden')
        backBtn.classList.add('hidden')
        submitFormBtn.classList.add('hidden')
    } else if (stepNumber === 2) {
        step1.classList.add('hidden')
        step2.classList.remove('hidden')
        nextBtn.classList.add('hidden')
        backBtn.classList.remove('hidden')
        submitFormBtn.classList.remove('hidden')
        renderExamParts()
    }
}

// Go to step 2
function goToStep2() {
    // Validate step 1
    const formData = getStep1Data()
    if (!validateStep1(formData)) {
        return
    }

    showStep(2)
}

// Go back to step 1
function goToStep1() {
    showStep(1)
}

// Get step 1 data
function getStep1Data() {
    return {
        examName: document.getElementById('examName').value.trim(),
        examTypeId: parseInt(document.getElementById('examType').value),
        classId: parseInt(document.getElementById('examClass').value) || null,
        examDate: document.getElementById('examDate').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        room: document.getElementById('examRoom').value.trim(),
        maxScore: parseInt(document.getElementById('maxScore').value) || 100,
    }
}

// Validate step 1
function validateStep1(formData) {
    // Clear previous error highlights
    document.querySelectorAll('.exam-form__input, .exam-form__select').forEach(el => {
        el.style.borderColor = ''
    })

    if (!formData.examName) {
        highlightField('examName')
        return false
    }

    if (formData.examTypeId === undefined || isNaN(formData.examTypeId)) {
        highlightField('examType')
        return false
    }

    if (!formData.examDate) {
        highlightField('examDate')
        return false
    }

    if (!formData.startTime || !formData.endTime) {
        if (!formData.startTime) highlightField('startTime')
        if (!formData.endTime) highlightField('endTime')
        return false
    }

    if (formData.startTime >= formData.endTime) {
        highlightField('startTime')
        highlightField('endTime')
        return false
    }

    if (!formData.room) {
        highlightField('examRoom')
        return false
    }

    return true
}

// Highlight invalid field
function highlightField(fieldId) {
    const field = document.getElementById(fieldId)
    if (field) {
        field.style.borderColor = '#dc2626'
        field.focus()
    }
}

// Add exam part row
function addExamPart() {
    const newPart = {
        partName: '',
        maxScore: 100,
        weightage: 0,
    }
    examParts.push(newPart)

    // Auto-distribute weightage evenly
    autoDistributeWeightage()
    renderExamParts()
}

// Remove exam part
function removeExamPart(index) {
    examParts.splice(index, 1)
    renderExamParts()
}

// Render exam parts list
function renderExamParts() {
    // Clear list except empty state
    examPartsList.innerHTML = ''
    examPartsList.appendChild(partsEmptyState)

    if (examParts.length === 0) {
        partsEmptyState.classList.remove('hidden')
    } else {
        partsEmptyState.classList.add('hidden')

        examParts.forEach((part, index) => {
            const partItem = createExamPartItem(part, index)
            examPartsList.appendChild(partItem)
        })
    }

    calculateTotalWeightage()
}

// Create exam part item element
function createExamPartItem(part, index) {
    const div = document.createElement('div')
    div.className = 'exam-part-item'
    div.innerHTML = `
        <div class="exam-part-item__group">
            <label>Tên phần thi</label>
            <input 
                type="text" 
                class="part-name" 
                placeholder="VD: Listening, Reading..."
                value="${part.partName}"
                data-index="${index}"
            />
        </div>
        <div class="exam-part-item__group">
            <label>Điểm tối đa</label>
            <input 
                type="number" 
                class="part-score" 
                value="${part.maxScore}"
                min="0"
                data-index="${index}"
            />
        </div>
        <div class="exam-part-item__group">
            <label>Trọng số (%)</label>
            <input 
                type="number" 
                class="part-weightage" 
                value="${part.weightage}"
                min="0"
                max="100"
                step="0.01"
                data-index="${index}"
            />
        </div>
        <button 
            type="button" 
            class="exam-part-item__remove" 
            data-index="${index}"
        >
            <i class="fa-solid fa-trash"></i>
        </button>
    `

    // Attach event listeners
    div.querySelector('.part-name').addEventListener('input', e => {
        examParts[index].partName = e.target.value
    })

    div.querySelector('.part-score').addEventListener('input', e => {
        examParts[index].maxScore = parseInt(e.target.value) || 0
    })

    // Use blur event instead of input to avoid issues while typing
    div.querySelector('.part-weightage').addEventListener('blur', e => {
        examParts[index].weightage = parseFloat(e.target.value) || 0

        // Auto-adjust other parts and re-render
        autoAdjustOtherParts(index)
        renderExamParts()
    })

    div.querySelector('.exam-part-item__remove').addEventListener('click', () => {
        removeExamPart(index)
    })

    return div
}

// Auto-distribute weightage evenly among all parts
function autoDistributeWeightage() {
    const count = examParts.length
    if (count === 0) return

    const evenWeight = 100 / count
    examParts.forEach(part => {
        part.weightage = parseFloat(evenWeight.toFixed(2))
    })
}

// Auto-adjust other parts when one is changed
function autoAdjustOtherParts(changedIndex) {
    const count = examParts.length
    if (count <= 1) return

    const changedWeight = examParts[changedIndex].weightage || 0
    const remainingWeight = 100 - changedWeight
    const otherPartsCount = count - 1

    if (otherPartsCount === 0) return

    const weightPerOtherPart = remainingWeight / otherPartsCount

    examParts.forEach((part, index) => {
        if (index !== changedIndex) {
            part.weightage = parseFloat(weightPerOtherPart.toFixed(2))
        }

        // Update weightage input values without re-rendering
        function updateWeightageInputs() {
            const inputs = document.querySelectorAll('.part-weightage')
            inputs.forEach((input, idx) => {
                if (examParts[idx]) {
                    input.value = examParts[idx].weightage.toFixed(2)
                }
            })
            calculateTotalWeightage()
        }
    })
}

// Calculate total weightage
function calculateTotalWeightage() {
    const total = examParts.reduce((sum, part) => sum + (part.weightage || 0), 0)
    totalWeightageEl.textContent = `${total.toFixed(2)}%`

    // Show warning if not 100%
    if (Math.abs(total - 100) > 0.01 && examParts.length > 0) {
        weightageWarning.classList.remove('hidden')
    } else {
        weightageWarning.classList.add('hidden')
    }
}

// Validate exam parts
function validateExamParts() {
    if (examParts.length === 0) {
        return false
    }

    // Check if all parts have names
    for (let i = 0; i < examParts.length; i++) {
        const part = examParts[i]
        if (!part.partName || !part.partName.trim()) {
            return false
        }
    }

    // Check if total weightage is 100%
    const total = examParts.reduce((sum, part) => sum + (part.weightage || 0), 0)
    if (Math.abs(total - 100) > 0.01) {
        return false
    }

    return true
}

// Close exam modal
function closeExamModal() {
    examModal.classList.add('hidden')
    examForm.reset()
    currentExamId = null
    examParts = []
    currentStep = 1
}

// Open delete modal
function openDeleteModal(examId) {
    deleteExamId = examId
    const exam = getAllExams().find(e => e.examId === examId)

    if (!exam) return

    document.getElementById('deleteExamName').textContent = exam.examName
    deleteModal.classList.remove('hidden')
}

// Close delete modal
function closeDeleteModal() {
    deleteModal.classList.add('hidden')
    deleteExamId = null
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault()

    // Validate exam parts
    if (!validateExamParts()) {
        return
    }

    const examData = getStep1Data()
    examData.teacherId = 1 // Hardcoded for now
    examData.courseId = null

    // Prepare parts data
    const partsData = examParts.map(part => ({
        partName: part.partName,
        maxScore: part.maxScore,
        weighttage: part.weightage / 100, // Convert percentage to decimal
    }))

    if (currentExamId) {
        // Update existing exam
        const updated = updateExam(currentExamId, examData)

        if (updated) {
            // Delete old parts and create new ones
            import('../../src/database/examPart.db.js').then(module => {
                module.deleteExamPartsByExamId(currentExamId)
                module.addExamParts(currentExamId, partsData)

                alert('Cập nhật bài kiểm tra thành công!')
                closeExamModal()
                loadExams()
            })
        } else {
            alert('Có lỗi xảy ra khi cập nhật!')
        }
    } else {
        // Create new exam
        const createdExam = addExam(examData)

        if (createdExam) {
            // Create exam parts
            import('../../src/database/examPart.db.js').then(module => {
                module.addExamParts(createdExam.examId, partsData)

                alert('Tạo bài kiểm tra thành công!')
                closeExamModal()
                loadExams()
            })
        } else {
            alert('Có lỗi xảy ra khi tạo bài kiểm tra!')
        }
    }
}

// Handle delete confirmation
function handleDeleteConfirm() {
    if (!deleteExamId) return

    const success = deleteExam(deleteExamId)

    if (success) {
        alert('Xóa bài kiểm tra thành công!')
        closeDeleteModal()
        loadExams()
    } else {
        alert('Có lỗi xảy ra khi xóa!')
    }
}

// Reset filters
function resetFilters() {
    filterClass.value = ''
    filterType.value = ''
    filterDateFrom.value = ''
    filterDateTo.value = ''
    applyFilters()
}

// Attach event listeners
function attachEventListeners() {
    // Create exam button
    createExamBtn.addEventListener('click', openCreateModal)

    // Close modal buttons
    closeModalBtn.addEventListener('click', closeExamModal)
    cancelFormBtn.addEventListener('click', closeExamModal)

    // Click outside modal to close
    examModal.addEventListener('click', e => {
        if (e.target === examModal || e.target.classList.contains('exam-modal__overlay')) {
            closeExamModal()
        }
    })

    // Wizard navigation
    nextBtn.addEventListener('click', goToStep2)
    backBtn.addEventListener('click', goToStep1)

    // Add part button
    addPartBtn.addEventListener('click', addExamPart)

    // Form submit
    examForm.addEventListener('submit', handleFormSubmit)

    // Delete modal buttons
    cancelDeleteBtn.addEventListener('click', closeDeleteModal)
    confirmDeleteBtn.addEventListener('click', handleDeleteConfirm)

    // Click outside delete modal to close
    deleteModal.addEventListener('click', e => {
        if (e.target === deleteModal || e.target.classList.contains('delete-modal__overlay')) {
            closeDeleteModal()
        }
    })

    // Filter changes
    filterClass.addEventListener('change', applyFilters)
    filterType.addEventListener('change', applyFilters)
    filterDateFrom.addEventListener('change', applyFilters)
    filterDateTo.addEventListener('change', applyFilters)

    // Reset filter button
    resetFilterBtn.addEventListener('click', resetFilters)
}
