import { getAllClasses, addClass, updateClass, deleteClass, getClassById } from '../../src/database/classes.db.js'
import { getEnrollmentCountByClassId } from '../../src/database/enrollment.db.js'
const urlParams = new URLSearchParams(window.location.search)
const courseId = urlParams.get('id')
// ============= HELPER FUNCTIONS =============
const GetClassesbyCourseId = courseId => {
    const classes = getAllClasses()
    const classesByCourseId = classes.filter(classItem => classItem.coursesId == Number(courseId))
    return classesByCourseId
}

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
                <div class="class-card__menu">
                    <button class="class-card__menu-btn" aria-label="Menu">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <div class="class-card__menu-dropdown">
                        <button class="class-card__menu-item edit-btn">
                            <i class="fa-solid fa-pen"></i> Sửa lớp
                        </button>
                        <button class="class-card__menu-item delete-btn">
                            <i class="fa-solid fa-trash"></i> Xóa lớp
                        </button>
                    </div>
                </div>
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

    let classes = GetClassesbyCourseId(courseId)
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

// ============= MODAL FUNCTIONALITY =============

const modal = {
    overlay: null,
    form: null,
    mode: 'add', // 'add' or 'edit'
    currentClassId: null,

    init() {
        this.overlay = document.getElementById('add-class-modal')
        this.form = document.getElementById('add-class-form')
    },

    open(mode = 'add', classData = null) {
        this.mode = mode
        if (this.overlay) {
            this.overlay.style.display = 'flex'

            // Update UI based on mode
            const titleEl = this.overlay.querySelector('.modal-title')
            const submitBtn = this.overlay.querySelector('button[type="submit"]')

            if (mode === 'edit' && classData) {
                this.currentClassId = classData.classId
                if (titleEl) titleEl.textContent = 'Cập nhật thông tin lớp học'
                if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Lưu thay đổi'

                // Fill form data
                document.getElementById('className').value = classData.className
                document.getElementById('coursesId').value = classData.coursesId
                document.getElementById('teacherId').value = classData.teacherId
                document.getElementById('startDate').value = classData.startDate
                document.getElementById('endDate').value = classData.endDate
                document.getElementById('status').value = classData.status
                document.getElementById('maxStudents').value = classData.maxStudents
            } else {
                this.currentClassId = null
                if (titleEl) titleEl.textContent = 'Thêm lớp học mới'
                if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Lưu'
                this.form?.reset()
            }
        }
    },

    close() {
        if (this.overlay) {
            this.overlay.style.display = 'none'
            this.form?.reset()
            this.mode = 'add'
            this.currentClassId = null
        }
    },
}

const validateForm = formData => {
    const errors = []

    if (!formData.className.trim()) errors.push('Tên lớp không được để trống')
    if (!formData.coursesId || formData.coursesId < 1) errors.push('Khóa học ID phải lớn hơn 0')
    if (!formData.teacherId || formData.teacherId < 1) errors.push('Giáo viên ID phải lớn hơn 0')
    if (!formData.startDate) errors.push('Ngày bắt đầu không được để trống')
    if (!formData.endDate) errors.push('Ngày kết thúc không được để trống')
    if (!formData.status) errors.push('Trạng thái không được để trống')
    if (!formData.maxStudents || formData.maxStudents < 1) errors.push('Sĩ số tối đa phải lớn hơn 0')

    if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate)
        const end = new Date(formData.endDate)
        if (start >= end) {
            errors.push('Ngày kết thúc phải sau ngày bắt đầu')
        }
    }

    return errors
}

const showSuccessMessage = message => {
    const successDiv = document.createElement('div')
    successDiv.className = 'success-message'
    successDiv.textContent = message
    document.body.appendChild(successDiv)

    setTimeout(() => {
        successDiv.remove()
    }, 3000)
}

const handleSaveClass = event => {
    event.preventDefault()

    const formData = {
        className: document.getElementById('className').value,
        coursesId: parseInt(document.getElementById('coursesId').value),
        teacherId: parseInt(document.getElementById('teacherId').value),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        status: document.getElementById('status').value,
        maxStudents: parseInt(document.getElementById('maxStudents').value),
    }

    // Validate form
    const errors = validateForm(formData)
    if (errors.length > 0) {
        alert('Vui lòng kiểm tra lại:\n\n' + errors.join('\n'))
        return
    }

    try {
        if (modal.mode === 'edit' && modal.currentClassId) {
            const updatedClass = updateClass(modal.currentClassId, formData)
            if (updatedClass) {
                console.log('Đã cập nhật lớp học:', updatedClass)
                showSuccessMessage(`Đã cập nhật lớp "${formData.className}" thành công!`)
            } else {
                throw new Error('Không thể cập nhật lớp học')
            }
        } else {
            const newClass = addClass(formData)
            console.log('Đã thêm lớp học:', newClass)
            showSuccessMessage(`Đã thêm lớp "${formData.className}" thành công!`)
        }

        modal.close()
        renderClasses()
    } catch (error) {
        console.error('Lỗi khi lưu lớp học:', error)
        alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }
}

const setupAddClass = () => {
    modal.init()

    const addBtn = document.getElementById('add-class-btn')
    if (addBtn) {
        addBtn.addEventListener('click', () => modal.open('add'))
    }

    const closeBtn = document.getElementById('modal-close-btn')
    const cancelBtn = document.getElementById('cancel-btn')

    if (closeBtn) closeBtn.addEventListener('click', () => modal.close())
    if (cancelBtn) cancelBtn.addEventListener('click', () => modal.close())

    modal.overlay?.addEventListener('click', e => {
        if (e.target === modal.overlay) modal.close()
    })

    modal.form?.addEventListener('submit', handleSaveClass)

    console.log('Add/Edit class functionality đã được thiết lập')
}

// ============= CLICK HANDLER =============

/**
 * Thiết lập sự kiện click cho các class card
 * Khi click vào card, chuyển hướng tới trang classroom-detail.html với classId tương ứng
 */
const setupClassCardInteractions = () => {
    const classList = document.querySelector('.class-section__classList')
    if (!classList) return console.error('Không tìm thấy container .class-section__classList')

    // Close dropdowns when clicking outside
    document.addEventListener('click', e => {
        if (!e.target.closest('.class-card__menu')) {
            document.querySelectorAll('.class-card__menu-dropdown').forEach(dropdown => {
                dropdown.classList.remove('show')
            })
        }
    })

    classList.addEventListener('click', e => {
        // 1. Handle Menu Button Click
        const menuBtn = e.target.closest('.class-card__menu-btn')
        if (menuBtn) {
            e.stopPropagation()
            const dropdown = menuBtn.nextElementSibling

            // Close other dropdowns
            document.querySelectorAll('.class-card__menu-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('show')
            })

            dropdown.classList.toggle('show')
            return
        }

        // 2. Handle Edit Button Click
        const editBtn = e.target.closest('.edit-btn')
        if (editBtn) {
            e.stopPropagation()
            const card = editBtn.closest('.class-card')
            const classId = Number(card.getAttribute('data-class-id'))

            const classData = getClassById(classId)
            if (classData) {
                modal.open('edit', classData)
                // Close dropdown
                editBtn.closest('.class-card__menu-dropdown').classList.remove('show')
            } else {
                alert('Không tìm thấy thông tin lớp học')
            }
            return
        }

        // 3. Handle Delete Button Click
        const deleteBtn = e.target.closest('.delete-btn')
        if (deleteBtn) {
            e.stopPropagation()
            const card = deleteBtn.closest('.class-card')
            const classId = Number(card.getAttribute('data-class-id'))
            const className = card.querySelector('.class-card__title').textContent

            if (confirm(`Bạn có chắc chắn muốn xóa lớp "${className}" không?`)) {
                const result = deleteClass(classId)
                if (result) {
                    showSuccessMessage('Đã xóa lớp học thành công')
                    renderClasses()
                } else {
                    alert('Xóa lớp học thất bại')
                }
            }
            // Close dropdown
            return
        }

        // 4. Handle Card Click (Navigation)
        const card = e.target.closest('.class-card')
        // Only navigate if we're not clicking inside the menu
        if (card && !e.target.closest('.class-card__menu')) {
            const classId = card.getAttribute('data-class-id')
            if (classId) {
                window.location.href = `classroom-detail.html?classId=${classId}`
            }
        }
    })

    console.log('Class card interactions đã được thiết lập')
}

// ============= INITIALIZATION =============

document.addEventListener('DOMContentLoaded', () => {
    renderClasses()
    setupSearch()
    setupClassCardInteractions()
    setupAddClass()
})
