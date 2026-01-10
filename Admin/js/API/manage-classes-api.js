/**
 * =======================================================
 * 1. CẤU HÌNH & DỮ LIỆU CỐ ĐỊNH (CONFIG)
 * =======================================================
 */
const API_BASE_URL = 'https://localhost:44394/api'
const urlParams = new URLSearchParams(window.location.search)
const courseId = urlParams.get('id')

let allClasses = []

// Cấu hình trạng thái khớp với Constraint DB và CSS
const STATUS_CONFIG = {
    scheduled: { class: 'status-pending', text: 'CHỜ BẮT ĐẦU' },
    ongoing: { class: 'status-ongoing', text: 'ONGOING' },
    completed: { class: 'status-completed', text: 'ĐÃ HOÀN THÀNH' },
    canceled: { class: 'status-canceled', text: 'ĐÃ HỦY' },
}

/**
 * =======================================================
 * 2. LỚP TIỆN ÍCH (MODAL CLASS)
 * =======================================================
 */
class Modal {
    constructor(modalId) {
        this.formContainer = document.getElementById(modalId)
        if (!this.formContainer) return
        this.closeButtons = this.formContainer.querySelectorAll(
            '.close-modal, .close-modal-btn, #modal-close-btn, #cancel-btn'
        )
        this.initEvents()
    }
    initEvents() {
        this.closeButtons.forEach(btn => btn.addEventListener('click', () => this.close()))
        window.addEventListener('click', e => {
            if (e.target === this.formContainer) this.close()
        })
    }
    open(mode = 'add', id = null) {
        this.mode = mode
        this.currentId = id
        this.formContainer.style.display = 'flex'
        this.formContainer.classList.add('active')
        const title = this.formContainer.querySelector('.modal-title')
        if (title) title.innerText = mode === 'edit' ? 'Cập nhật lớp học' : 'Thêm lớp học mới'
    }
    close() {
        this.formContainer.style.display = 'none'
        this.formContainer.classList.remove('active')
        this.formContainer.querySelector('form')?.reset()
    }
}

const classModal = new Modal('add-class-modal')

/**
 * =======================================================
 * 3. XỬ LÝ API & DỮ LIỆU
 * =======================================================
 */

async function fetchAllData() {
    try {
        const response = await fetch(`${API_BASE_URL}/Classes`)
        const result = await response.json()
        allClasses = result.data || []
        renderClasses()
    } catch (err) {
        console.error('Lỗi tải dữ liệu:', err)
    }
}

async function handleSaveClass(e) {
    e.preventDefault()

    const payload = {
        class_id: classModal.mode === 'edit' ? classModal.currentId : '00000000-0000-0000-0000-000000000000',
        course_id: document.getElementById('coursesId').value,
        teacher_id: document.getElementById('teacherId').value,
        class_name: document.getElementById('className').value,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        max_students: Number(document.getElementById('maxStudents').value),
        class_status: document.getElementById('status').value.toLowerCase(),
    }

    const isEdit = classModal.mode === 'edit'
    const method = isEdit ? 'PUT' : 'POST'
    const url = isEdit ? `${API_BASE_URL}/Classes/${classModal.currentId}` : `${API_BASE_URL}/Classes`

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        const result = await res.json()
        if (res.ok && result.success) {
            alert(isEdit ? 'Cập nhật lớp học thành công!' : 'Thêm lớp học thành công!')
            classModal.close()
            fetchAllData()
        } else {
            alert('Lỗi: ' + (result.message || 'Không thể lưu lớp học'))
        }
    } catch (err) {
        alert('Có lỗi xảy ra khi kết nối máy chủ.')
    }
}

/**
 * =======================================================
 * 4. RENDERING & UI LOGIC
 * =======================================================
 */

function renderClasses(filterQuery = '') {
    const container = document.querySelector('.class-section__classList')
    if (!container) return

    let classes = allClasses.filter(c => c.course_id === courseId)

    if (filterQuery) {
        classes = classes.filter(c => c.class_name.toLowerCase().includes(filterQuery.toLowerCase()))
    }

    container.innerHTML = classes
        .map(c => {
            const statusKey = c.class_status ? c.class_status.toLowerCase() : 'scheduled'
            const statusInfo = STATUS_CONFIG[statusKey] || {
                class: 'status-default',
                text: c.class_status.toUpperCase(),
            }

            return `
        <div class="class-card" data-class-id="${c.class_id}">
            <div class="class-card__header">
                <div class="class-card__header-left">
                    <h3 class="class-card__title">${c.class_name}</h3>
                    <span class="class-card__status ${statusInfo.class}">${statusInfo.text}</span>
                </div>
                <div class="class-card__menu">
                    <button class="class-card__menu-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    <div class="class-card__menu-dropdown">
                        <button class="class-card__menu-item edit-btn"><i class="fa-solid fa-pen"></i> Sửa lớp</button>
                        <button class="class-card__menu-item delete-btn"><i class="fa-solid fa-trash"></i> Xóa lớp</button>
                    </div>
                </div>
            </div>
            <div class="class-card__body">
                <div class="class-card__info-row">
                    <i class="fa-solid fa-calendar-days"></i>
                    <span>${new Date(c.start_date).toLocaleDateString('vi-VN')} - ${new Date(
                c.end_date
            ).toLocaleDateString('vi-VN')}</span>
                </div>
            </div>
            <div class="class-card__footer">
                <div class="class-card__footer-item">
                    <i class="fa-solid fa-users"></i>
                    <span>Sĩ số: ${c.max_students} học viên</span>
                </div>
            </div>
        </div>`
        })
        .join('')
}

/**
 * =======================================================
 * 5. KHỞI TẠO & SỰ KIỆN
 * =======================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    fetchAllData()

    document.querySelector('.class-section__classList')?.addEventListener('click', async e => {
        const card = e.target.closest('.class-card')
        const id = card?.dataset.classId

        if (e.target.closest('.class-card__menu-btn')) {
            e.stopPropagation()
            card.querySelector('.class-card__menu-dropdown').classList.toggle('show')
        } else if (e.target.closest('.edit-btn')) {
            e.stopPropagation()
            const res = await fetch(`${API_BASE_URL}/Classes/${id}`)
            const result = await res.json()
            const data = result.data

            document.getElementById('className').value = data.class_name
            document.getElementById('teacherId').value = data.teacher_id
            document.getElementById('startDate').value = data.start_date.split('T')[0]
            document.getElementById('endDate').value = data.end_date.split('T')[0]
            document.getElementById('maxStudents').value = data.max_students
            document.getElementById('coursesId').value = courseId
            document.getElementById('status').value = data.class_status

            classModal.open('edit', id)
            card.querySelector('.class-card__menu-dropdown').classList.remove('show')
        } else if (e.target.closest('.delete-btn')) {
            e.stopPropagation()
            if (confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
                try {
                    const res = await fetch(`${API_BASE_URL}/Classes/${id}`, { method: 'DELETE' })

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}))
                        throw new Error(
                            errorData.message || 'Không thể xóa lớp học do có ràng buộc dữ liệu (bảng điểm).'
                        )
                    }

                    alert('Xóa lớp học thành công!')
                    fetchAllData()
                } catch (err) {
                    alert('Lỗi: ' + err.message)
                }
            }
        } else if (card) {
            window.location.href = `classroom-detail.html?classId=${id}`
        }
    })

    document.getElementById('add-class-btn')?.addEventListener('click', () => {
        classModal.open('add')
        if (document.getElementById('coursesId')) document.getElementById('coursesId').value = courseId
    })

    document.getElementById('add-class-form')?.addEventListener('submit', handleSaveClass)
    document.querySelector('.search-box__input')?.addEventListener('input', e => renderClasses(e.target.value))
})
