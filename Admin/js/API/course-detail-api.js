/**
 * =======================================================
 * 1. CẤU HÌNH & DỮ LIỆU MẪU (CONFIG & DATA)
 * =======================================================
 */
const API_BASE_URL = 'https://localhost:44394/api'
const urlParams = new URLSearchParams(window.location.search)
const courseId = urlParams.get('id')

let allClasses = []

// Dữ liệu dùng để đổ vào Combobox Ngôn ngữ
const LANGUAGES = [
    { code: 'EN', name: 'English' },
    { code: 'JP', name: 'Japanese' },
    { code: 'KR', name: 'Korean' },
    { code: 'FR', name: 'French' },
    { code: 'DE', name: 'German' },
]

const LANGUAGE_LEVEL_ID_MAP = {
    EN: {
        A1: '1B8ED75E-3BA9-495A-9420-45FD712959D2',
        A2: '0BF518C6-7A06-49CF-8AB3-A82E0274AF8B',
        B1: 'DA7629BE-270A-4899-BF1D-C6665BB6AC41',
        B2: '66EA9722-C6F1-4DA3-977B-F9B05F060396',
        C1: '4555425B-FD34-4426-82A2-2F74394AE096',
    },
    JP: { N5: '925E8561-9455-4D32-B2CF-954971F18121', N4: 'D12BB338-FE72-436C-AAF7-12FDEC701256' },
    KR: { L1: '5F4FB93D-11E7-4B4B-A924-519C7C5ADE2E', L2: '8FBBF10E-84A3-431A-9216-1A5B3B35C0FA' },
    FR: {
        A1: '771F1CAD-74D8-42B6-992D-F62B737C070C',
        A2: 'F88D40E7-6473-40FE-9DC2-83A7BDE35813',
        B1: 'D92C3CA8-8470-4100-AAE7-0723800F54AE',
    },
    DE: { A1: 'B4D411BB-10D6-4AA6-8E85-4CE78B05F955', A2: '969870EF-288E-4D5D-87F0-0E31B0D96056' },
}

const LANGUAGE_LEVEL_MAP = {
    EN: [
        { id: 'A1', name: 'Beginner A1' },
        { id: 'A2', name: 'Elementary A2' },
        { id: 'B1', name: 'Intermediate B1' },
        { id: 'B2', name: 'Upper-Intermediate B2' },
        { id: 'C1', name: 'Advanced C1' },
    ],
    JP: [
        { id: 'N5', name: 'Beginner N5' },
        { id: 'N4', name: 'Elementary N4' },
    ],
    KR: [
        { id: 'L1', name: 'Beginner Level 1' },
        { id: 'L2', name: 'Elementary Level 2' },
    ],
    FR: [
        { id: 'A1', name: 'Débutant A1' },
        { id: 'A2', name: 'Élémentaire A2' },
        { id: 'B1', name: 'Intermédiaire B1' },
    ],
    DE: [
        { id: 'A1', name: 'Anfänger A1' },
        { id: 'A2', name: 'Grundlagen A2' },
    ],
}

/**
 * =======================================================
 * 2. LỚP TIỆN ÍCH (MODAL)
 * =======================================================
 */
class Modal {
    constructor(modalId) {
        this.form = document.getElementById(modalId)
        if (!this.form) return
        this.overlay = this.form.querySelector('.modal-overlay')
        this.closeButtons = this.form.querySelectorAll('.close-modal, .close-modal-btn')
        this.initEvents()
    }
    initEvents() {
        this.closeButtons.forEach(btn => btn.addEventListener('click', () => this.close()))
        if (this.overlay) this.overlay.addEventListener('click', e => e.target === this.overlay && this.close())
        document.addEventListener('keydown', e => e.key === 'Escape' && this.close())
    }
    open() {
        this.overlay?.classList.add('active')
        this.form?.classList.add('active')
    }
    close() {
        this.overlay?.classList.remove('active')
        this.form?.classList.remove('active')
    }
}

const updateModal = new Modal('update_modal')

/**
 * =======================================================
 * 3. XỬ LÝ API (COURSE DETAIL & UPDATE)
 * =======================================================
 */
async function fetchCourseDetail(id) {
    try {
        const [courseRes, classesRes] = await Promise.all([
            fetch(`${API_BASE_URL}/Course/${id}`),
            fetch(`${API_BASE_URL}/Classes`),
        ])

        const courseResult = await courseRes.json()
        const classesResult = await classesRes.json()

        allClasses = classesResult.data || []

        if (courseResult?.data) {
            const data = courseResult.data
            const mappedData = {
                courseId: data.course_id,
                courseName: data.course_name,
                description: data.description,
                tuitionFee: data.fee,
                imgUrl:
                    data.thumbnail_url ||
                    'https://res.cloudinary.com/dkeeelvpa/image/upload/v1765332193/image001_fmw9gt.jpg',
                duration: `${data.duration_hours} giờ`,
            }
            renderCourseContent(mappedData)
        }
    } catch (err) {
        console.error('Lỗi tải dữ liệu:', err)
    }
}

async function handleUpdateCourse(event) {
    event.preventDefault()
    const lang = document.getElementById('course-languages-select').value
    const level = document.getElementById('course-type-select').value
    const languageLevelId = LANGUAGE_LEVEL_ID_MAP[lang]?.[level]

    if (!languageLevelId) return alert('Vui lòng chọn ngôn ngữ và cấp độ!')

    const payload = {
        course_name: document.getElementById('course-name').value,
        description: document.getElementById('course-desc').value,
        fee: Number(document.getElementById('course-price').value),
        duration_hours: Number(document.getElementById('course-hours').value),
        thumbnail_url: document.getElementById('course-image-url').value,
        language_level_id: languageLevelId,
        course_status: document.getElementById('course-status').value || 'active',
    }

    try {
        const res = await fetch(`${API_BASE_URL}/Course/${courseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(payload),
        })

        if (res.ok) {
            alert('Cập nhật thành công!')
            updateModal.close()
            fetchCourseDetail(courseId)
        } else {
            const err = await res.json()
            throw new Error(err.message)
        }
    } catch (err) {
        alert('Lỗi: ' + err.message)
    }
}

/**
 * =======================================================
 * 4. XỬ LÝ COMBOBOX & RENDERING (UI)
 * =======================================================
 */
function renderLanguageCombo() {
    const langSelect = document.getElementById('course-languages-select')
    if (!langSelect) return
    langSelect.innerHTML = '<option value="" disabled selected>-- Chọn ngôn ngữ --</option>'
    LANGUAGES.forEach(lang => {
        const option = document.createElement('option')
        option.value = lang.code
        option.textContent = lang.name
        langSelect.appendChild(option)
    })
}

function renderLevelCombo(languageCode) {
    const courseType = document.getElementById('course-type-select')
    if (!courseType) return
    courseType.innerHTML = '<option value="" disabled selected>-- Chọn level --</option>'
    const levels = LANGUAGE_LEVEL_MAP[languageCode]
    if (!levels) return
    levels.forEach(level => {
        const option = document.createElement('option')
        option.value = level.id
        option.textContent = level.name
        courseType.appendChild(option)
    })
}

function GenerrateComboBox() {
    renderLanguageCombo() // Tải ngôn ngữ trước
    const courseLangues = document.getElementById('course-languages-select')
    if (courseLangues) {
        courseLangues.onchange = function () {
            renderLevelCombo(this.value)
        }
    }
}

function renderCourseContent(course) {
    const classCount = allClasses.filter(cls => String(cls.course_id) === String(course.courseId)).length
    const titleEl = document.querySelector('.class__header__title h1')
    if (titleEl) titleEl.innerText = course.courseName

    const formattedFee = (course.tuitionFee || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    const container = document.querySelector('.course__item')
    if (container) {
        container.innerHTML = `
            <div class="course__image"><img src="${course.imgUrl}" alt="${course.courseName}" /></div>
            <div class="course__info flex">
                <div class="course__name"><span>${course.courseName}</span></div>
                <div class="course__description"><p>${course.description}</p></div>
                <div class="price"><span>${formattedFee}</span></div>
                <div class="flex course__details space-between">
                    <div class="hours align-center">
                        <svg data-prefix="fas" data-icon="clock" class="svg-inline--fa fa-clock" role="img" viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path></svg>
                        <span>${course.duration}</span>
                    </div>
                    <div class="class__number align-center">
                        <svg data-prefix="fas" data-icon="users" class="svg-inline--fa fa-users" role="img" viewBox="0 0 640 512" aria-hidden="true"><path fill="currentColor" d="M320 16a104 104 0 1 1 0 208 104 104 0 1 1 0-208zM96 88a72 72 0 1 1 0 144 72 72 0 1 1 0-144zM0 416c0-70.7 57.3-128 128-128 12.8 0 25.2 1.9 36.9 5.4-32.9 36.8-52.9 85.4-52.9 138.6l0 16c0 11.4 2.4 22.2 6.7 32L32 480c-17.7 0-32-14.3-32-32l0-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32l0-16c0-53.2-20-101.8-52.9-138.6 11.7-3.5 24.1-5.4 36.9-5.4 70.7 0 128 57.3 128 128l0 32c0 17.7-14.3 32-32 32l-86.7 0zM472 160a72 72 0 1 1 144 0 72 72 0 1 1 -144 0zM160 432c0-88.4 71.6-160 160-160s160 71.6 160 160l0 16c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-16z"></path></svg>
                        <span>${classCount}</span>
                    </div>
                </div>
            </div>`
    }
}

/**
 * =======================================================
 * 5. QUẢN LÝ LỊCH (CALENDAR MANAGER)
 * =======================================================
 */
class CalendarManager {
    constructor() {
        this.monthYearElement = document.getElementById('monthYear')
        this.datesElement = document.getElementById('dates')
        this.prevBtnElement = document.getElementById('prev')
        this.nextBtnElement = document.getElementById('next')
        this.currentDate = new Date()
        this.scheduleDate = []
        this.initEvents()
    }
    initEvents() {
        this.prevBtnElement?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1)
            this.render()
        })
        this.nextBtnElement?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1)
            this.render()
        })
    }
    render() {
        const year = this.currentDate.getFullYear()
        const month = this.currentDate.getMonth()
        if (this.monthYearElement) {
            this.monthYearElement.textContent = this.currentDate.toLocaleString('vi-VN', {
                month: 'long',
                year: 'numeric',
            })
        }
        // Logic vẽ ngày (giản lược để clean)...
        let datesHTML = ''
        const totalDays = new Date(year, month + 1, 0).getDate()
        for (let i = 1; i <= totalDays; i++) {
            datesHTML += `<div class="date">${i}</div>`
        }
        if (this.datesElement) this.datesElement.innerHTML = datesHTML
    }
}

/**
 * =======================================================
 * 6. KHỞI TẠO CHUNG (DOM READY)
 * =======================================================
 */
function handleControlButton() {
    const buttons = document.querySelectorAll('.control__button')
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isInfo = document.querySelector('.class_info').classList.toggle('active')
            document.querySelector('.class_calender').classList.toggle('active', !isInfo)
            document.querySelector('.course__item').style.display = isInfo ? 'flex' : 'none'
            document.querySelector('.schedule__Management').style.display = isInfo ? 'none' : 'block'
        })
    })
}
async function deleteCourseApi(id) {
    const res = await fetch(`${API_BASE_URL}/Course/${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Lỗi ${res.status}: Không thể xóa khóa học.`)
    }
    return true
}

/**
 * Logic xử lý khi nhấn nút Xóa (có Confirm)
 */
async function handleDeleteCourse() {
    // 1. Xác nhận với người dùng
    const isConfirm = confirm('Bạn có chắc chắn muốn xóa khóa học này không? Hành động này không thể hoàn tác.')

    if (!isConfirm) return

    try {
        // 2. Gọi API xóa
        await deleteCourseApi(courseId)

        // 3. Thông báo và điều hướng về trang danh sách
        alert('Xóa khóa học thành công!')
        window.location.href = 'courses.html'
    } catch (err) {
        console.error('Lỗi khi xóa:', err)
        alert('Không thể xóa khóa học. Lỗi: ' + err.message)
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if (courseId) fetchCourseDetail(courseId)
    GenerrateComboBox()
    handleControlButton()

    // Khởi tạo Lịch
    window.calendarManager = new CalendarManager()
    window.calendarManager.render()

    // Sự kiện nút bấm khác
    document.getElementById('setting')?.addEventListener('click', () => updateModal.open())
    document.getElementById('back__button')?.addEventListener('click', () => (window.location.href = 'courses.html'))
    document.getElementById('today')?.addEventListener('click', () => {
        calendarManager.currentDate = new Date()
        calendarManager.render()
    })
    updateModal.form?.addEventListener('submit', handleUpdateCourse)
    const deleteBtn = document.querySelector('.btn-delete') || document.getElementById('delete-course')
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDeleteCourse)
    }
})
