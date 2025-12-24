import { getAllClasses } from '/src/database/classes.db.js'
import { addSchedule, deleteSchedule, getAllSchedules, updateSchedule } from '/src/database/classSchedules.db.js'
import { deleteCourse, getAllCourses, updateCourse } from '/src/database/courses.db.js'
import { getAllLanguages } from '/src/database/language.db.js'
import { getAllLanguageLevels } from '/src/database/language_level.db.js'

// =======================================================
// 1. KHỞI TẠO BIẾN TOÀN CỤC & DỮ LIỆU
// =======================================================

const classes = getAllClasses()
const courses = getAllCourses()
const urlParams = new URLSearchParams(window.location.search)
const courseId = urlParams.get('id')

// Tìm khóa học hiện tại
const course = courses.find(c => c.courseId === Number(courseId))

if (!course) {
    console.error('Lỗi: Không tìm thấy khóa học với ID:', courseId)
}

// =======================================================
// 2. CÁC HÀM HỖ TRỢ (HELPER FUNCTIONS)
// =======================================================

function getClassCountByCourseId(courseId) {
    if (!classes) return 0
    const targetCourseId = parseInt(courseId)
    return classes.filter(cls => parseInt(cls.coursesId) === targetCourseId).length
}

// =======================================================
// 3. LOGIC XỬ LÝ MODAL (Cập nhật / Chi tiết)
// =======================================================

class Modal {
    constructor(modalId) {
        this.form = document.getElementById(modalId)
        this.overlay = this.form ? this.form.querySelector('.modal-overlay') : null
        this.closeButtons = this.form ? this.form.querySelectorAll('.close-modal, .close-modal-btn') : []
        this.initEvents()
    }

    initEvents() {
        if (this.closeButtons.length > 0) {
            this.closeButtons.forEach(btn => btn.addEventListener('click', () => this.close()))
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', e => {
                if (e.target === this.overlay) this.close()
            })
        }
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.form && this.form.classList.contains('active')) {
                this.close()
            }
        })
    }

    open() {
        if (this.overlay) this.overlay.classList.add('active')
        if (this.form) this.form.classList.add('active')
    }

    close() {
        if (this.overlay) this.overlay.classList.remove('active')
        if (this.form) this.form.classList.remove('active')
    }
}

const updateModal = new Modal('update_modal')
const scheduleModal = new Modal('schedule_modal')

function handleUpdateCourse(event) {
    event.preventDefault() // Ngăn chặn tải lại trang
    const formData = {
        courseName: document.getElementById('course-name').value,
        description: document.getElementById('course-desc').value,
        duration: document.getElementById('course-hours').value + ' weeks',
        imgUrl: document.getElementById('course-image-url').value,
        inputLevel: Number(document.getElementById('course-type-select').value),
        languageCode: document.getElementById('course-languages-select').value,
        outPutLevel: Number(document.getElementById('course-type-select').value) + 1,
        status: document.getElementById('course-status').value,
        tuitionFee: Number(document.getElementById('course-price').value),
    }
    try {
        if (formData.imgUrl === '') {
            formData.imgUrl =
                'https://storage.googleapis.com/liveazotastoragept032025/avatar/m11_2025/d17/91812313/21ab2b05ccc815556170e018c5b330b6.jpeg'
        }
        updateCourse(courseId, formData)
        console.log(' cập nhật khóa học thành công')
        const courses = getAllCourses()
        updateModal.close()
        renderCourseContent(courses)
    } catch {
        console.log('không cập nhật được khóa học')
    }
}
function handleDeleteCourseLogic() {
    if (!courseId) {
        console.error('Không tìm thấy Course ID để xóa.')
        return
    }
    try {
        deleteCourse(Number(courseId))
        console.log('Xóa khóa học thành công.')
        window.location.href = '/Admin/courses'
    } catch (error) {
        console.error('Không xóa được khóa học:', error)
        alert('Có lỗi xảy ra khi xóa khóa học.')
        updateModal.close()
    }
}
function handleaddSchedule(event) {
    event.preventDefault()
    const datetimeInput = document.getElementById('datetime-local')
    const durationInput = document.getElementById('Duration')
    const roomInput = document.getElementById('Room')

    const datetimeStr = datetimeInput.value // "YYYY-MM-DDTHH:MM"
    const duration = Number(durationInput.value) // phút
    const room = roomInput.value

    const startDate = new Date(datetimeStr)
    const endDate = new Date(startDate.getTime() + duration * 60000)

    const formData = {
        classId: Number(document.querySelector('.class_name').value),
        studyDate: datetimeStr.split('T')[0],
        startTime: datetimeStr.split('T')[1],
        endTime: endDate.toTimeString().slice(0, 5),
        room: room,
    }
    try {
        addSchedule(formData)
        console.log('Thêm lịch học thành công')
        scheduleModal.close()
        // Cập nhật lại lịch hiển thị
        if (window.calendarManager) {
            window.calendarManager.fetchSchedules()
            window.calendarManager.render()
        }
        handleScheduleAction()
    } catch {
        console.log('không thêm được lịch học')
    }
}
function handleScheduleUpdate(event) {
    event.preventDefault()
    const datetimeInput = document.getElementById('datetime-local')
    const durationInput = document.getElementById('Duration')
    const roomInput = document.getElementById('Room')

    const datetimeStr = datetimeInput.value // "YYYY-MM-DDTHH:MM"
    const duration = Number(durationInput.value) // phút
    const room = roomInput.value

    const startDate = new Date(datetimeStr)
    const endDate = new Date(startDate.getTime() + duration * 60000)

    const formData = {
        classId: Number(document.querySelector('.class_name').value),
        studyDate: datetimeStr.split('T')[0],
        startTime: datetimeStr.split('T')[1],
        endTime: endDate.toTimeString().slice(0, 5),
        room: room,
    }

    const scheduleId = Number(scheduleModal.form.dataset.id)

    try {
        updateSchedule(scheduleId, formData)
        console.log('cập nhật lịch học thành công')
        scheduleModal.close()
        // Cập nhật lại lịch hiển thị
        if (window.calendarManager) {
            window.calendarManager.fetchSchedules()
            window.calendarManager.render()
        }
    } catch (e) {
        console.log('không cập nhật được lịch học', e)
    }
}
function handleDeleteSchedule(scheduleId) {
    try {
        deleteSchedule(scheduleId)
        scheduleModal.close()
        // Cập nhật lại lịch hiển thị
        if (window.calendarManager) {
            window.calendarManager.fetchSchedules()
            window.calendarManager.render()
        }
        handleScheduleAction()
    } catch {
        console.log('không xóa được lịch học')
    }
}

function setupEventHandlers() {
    // Setup Update Modal Triggers
    const openUpdateBtn = document.getElementById('setting')
    if (openUpdateBtn) openUpdateBtn.addEventListener('click', () => updateModal.open())

    const deleteCourseBtn = document.querySelector('.btn-delete')
    if (deleteCourseBtn) {
        deleteCourseBtn.addEventListener('click', handleDeleteCourseLogic)
    }

    if (updateModal.form) {
        updateModal.form.addEventListener('submit', handleUpdateCourse)
    }

    const openScheduleBtn = document.getElementById('add_schedule')
    if (openScheduleBtn) {
        openScheduleBtn.addEventListener('click', () => {
            const modalContainer = scheduleModal.form
            modalContainer.dataset.mode = 'add'
            delete modalContainer.dataset.id
            const realForm = modalContainer.querySelector('form')
            if (realForm) realForm.reset()
            scheduleModal.open()
        })
    }
}
function bindScheduleDelegation() {
    const list = document.querySelector('.schedule__list')
    if (!list) return

    list.addEventListener('click', e => {
        if (e.target.closest('#btn-update-schedule')) {
            const btn = e.target.closest('#btn-update-schedule')
            const id = Number(btn.dataset.id)
            if (isNaN(id)) return

            scheduleModal.form.dataset.mode = 'update'
            scheduleModal.form.dataset.id = id

            scheduleModal.open()
            fillScheduleData(id)
            return
        }

        if (e.target.closest('#btn-delete-schedule')) {
            const btn = e.target.closest('#btn-delete-schedule')
            const id = Number(btn.dataset.id)
            if (isNaN(id)) return

            handleDeleteSchedule(id)
        }
    })
}
bindScheduleDelegation()
//ham xu li action,hien thi danh sach
function handleScheduleAction() {
    const AllSchedules = getAllSchedules()
    const scheduleList = document.querySelector('.schedule__list')
    const select = document.querySelector('.class_name')

    const schedules = AllSchedules.filter(s => Number(s.classId) === Number(select.value))

    scheduleList.innerHTML = schedules
        .map(
            (item, index) => `
            <div class="schedule__item" data-id="${item.scheduleId}">
                <div class="schedule__item_content">
                    <h3>Buổi ${index + 1}</h3>
                    <span class="studydate">
                        <span class="studydate__date">${item.studyDate.split('-').reverse().join('-')}</span>
                        <span class="studydate__time">
                            ${item.startTime} - ${item.endTime}
                        </span>
                        <span class="studydate__room">Phòng${item.room}</span>
                    </span>
                    <i class="fa-solid fa-chevron-down toggle-action"></i>
                </div>

                <div class="schedule__item_action" style="display: none">
                    <button id="btn-update-schedule" data-id="${item.scheduleId}">Sửa</button>
                    <button id="btn-delete-schedule" data-id="${item.scheduleId}">Xóa</button>
                </div>
            </div>
        `
        )
        .join('')
    const opencontrol_btn = document.querySelectorAll('.toggle-action')
    opencontrol_btn.forEach(btn => {
        btn.addEventListener('click', () => {
            const scheduleItem = btn.closest('.schedule__item')
            const actionContainer = scheduleItem.querySelector('.schedule__item_action')
            actionContainer.style.display = actionContainer.style.display === 'none' ? 'block' : 'none'
        })
    })
}
//ham dien du lieu vao form update
function fillScheduleData(scheduleId) {
    const schedule = getAllSchedules().find(s => s.scheduleId === scheduleId)
    if (!schedule) return

    const start = schedule.studyDate + 'T' + schedule.startTime
    document.getElementById('datetime-local').value = start
    document.getElementById('Room').value = schedule.room

    const [sh, sm] = schedule.startTime.split(':')
    const [eh, em] = schedule.endTime.split(':')

    const duration = eh * 60 + +em - (sh * 60 + +sm)
    document.getElementById('Duration').value = duration
}

// =======================================================
// 4. CÁC HÀM RENDER (Hiển thị DOM)
// =======================================================

function renderclassList() {
    const className = classes.filter(classItem => classItem.coursesId === Number(courseId))
    const select = document.querySelector('.class_name')

    if (select) {
        select.innerHTML = className.map(item => `<option value="${item.classId}">${item.className}</option>`).join('')
    }
}

function GenerateComboBox() {
    const languageCode = getAllLanguages()
    const languageLevels = getAllLanguageLevels()
    const select = document.getElementById('course-languages-select')
    for (let i = 0; i < languageCode.length; i++) {
        const option = document.createElement('option')
        option.value = languageCode[i].languageCode
        option.textContent = languageCode[i].languageName
        select.appendChild(option)
    }
    select.addEventListener('change', () => {
        const select2 = document.getElementById('course-type-select')
        select2.innerHTML = ''
        for (let i = 0; i < languageLevels.length; i++) {
            if (languageLevels[i].languageCode === select.value) {
                const option = document.createElement('option')
                option.value = languageLevels[i].levelOrder
                option.textContent = languageLevels[i].levelName
                select2.appendChild(option)
            }
        }
    })
}
GenerateComboBox()

function renderCourseContent(data = courses) {
    const courseToRender = data.find(c => c.courseId === Number(courseId))
    if (!courseToRender) return

    const course__item = document.querySelector('.course__item')
    const classCount = getClassCountByCourseId(courseId)

    // Cập nhật tên khóa học ở tiêu đề chính
    const courseNameEl = document.querySelector('.class__header__title')
    if (courseNameEl) {
        courseNameEl.innerHTML = `<h1>${courseToRender.courseName}</h1>`
    }

    // Định dạng tiền tệ
    const formattedTuitionFee = courseToRender.tuitionFee.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    })

    if (course__item) {
        course__item.innerHTML = `
        <div class="course__image">
            <img src="${courseToRender.imgUrl}" alt="${courseToRender.courseName}" />
        </div>
        <div class="course__info flex">
            <div class="course__name">
                <span>${courseToRender.courseName}</span>
            </div>
            <div class="course__description">
                <p>${courseToRender.description}</p>
            </div>
            <div class="price"><span>${formattedTuitionFee}</span></div>
            <div class="flex course__details space-between">
                <div class="hours align-center">
                    <svg data-prefix="fas" data-icon="clock" class="svg-inline--fa fa-clock" role="img" viewBox="0 0 512 512" aria-hidden="true">
                        <path fill="currentColor" d="M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path>
                    </svg>
                    <span>${courseToRender.duration}</span>
                </div>
                <div class="class__number align-center">
                    <svg data-prefix="fas" data-icon="users" class="svg-inline--fa fa-users" role="img" viewBox="0 0 640 512" aria-hidden="true">
                        <path fill="currentColor" d="M320 16a104 104 0 1 1 0 208 104 104 0 1 1 0-208zM96 88a72 72 0 1 1 0 144 72 72 0 1 1 0-144zM0 416c0-70.7 57.3-128 128-128 12.8 0 25.2 1.9 36.9 5.4-32.9 36.8-52.9 85.4-52.9 138.6l0 16c0 11.4 2.4 22.2 6.7 32L32 480c-17.7 0-32-14.3-32-32l0-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32l0-16c0-53.2-20-101.8-52.9-138.6 11.7-3.5 24.1-5.4 36.9-5.4 70.7 0 128 57.3 128 128l0 32c0 17.7-14.3 32-32 32l-86.7 0zM472 160a72 72 0 1 1 144 0 72 72 0 1 1 -144 0zM160 432c0-88.4 71.6-160 160-160s160 71.6 160 160l0 16c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-16z"></path>
                    </svg>
                    <span>${classCount}</span>
                </div>
            </div>
        </div>
        `
    }
}
class CalendarManager {
    constructor() {
        this.monthYearElement = document.getElementById('monthYear')
        this.datesElement = document.getElementById('dates')
        this.prevBtnElement = document.getElementById('prev')
        this.nextBtnElement = document.getElementById('next')
        this.classSelect = document.querySelector('.class_name')

        this.currentDate = new Date()
        this.scheduleDate = []

        this.initEvents()
    }

    initEvents() {
        if (this.prevBtnElement) {
            this.prevBtnElement.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1)
                this.render()
            })
        }

        if (this.nextBtnElement) {
            this.nextBtnElement.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1)
                this.render()
            })
        }

        if (this.classSelect) {
            this.classSelect.addEventListener('change', () => {
                this.fetchSchedules()
                this.render()
            })
        }
    }

    fetchSchedules() {
        if (!this.classSelect) return
        const AllSchedules = getAllSchedules()
        const schedule = AllSchedules.filter(schedule => schedule.classId === Number(this.classSelect.value))
        this.scheduleDate = schedule.map(schedule => schedule.studyDate)
    }

    render() {
        const currentYear = this.currentDate.getFullYear()
        const currentMonth = this.currentDate.getMonth()

        const FirstDay = new Date(currentYear, currentMonth, 1)

        const LastDay = new Date(currentYear, currentMonth + 1, 0)

        const totalDaysInMonth = LastDay.getDate()
        const startDayIndex = FirstDay.getDay() - 1
        const endDayIndex = LastDay.getDay()

        const monthYearString = this.currentDate.toLocaleString('vi-VN', {
            month: 'long',
            year: 'numeric',
        })

        if (this.monthYearElement) {
            this.monthYearElement.textContent = monthYearString
        }

        let datesHTML = ''
        const today = new Date()

        // ----------- NGÀY THÁNG TRƯỚC (thêm inactive) -----------
        for (let i = startDayIndex; i > 0; i--) {
            const prevDay = new Date(currentYear, currentMonth, 0 - i + 1)
            datesHTML += `<div class="date inactive">${prevDay.getDate()}</div>`
        }

        // ----------- NGÀY TRONG THÁNG HIỆN TẠI -----------
        for (let i = 1; i <= totalDaysInMonth; i++) {
            const date = new Date(currentYear, currentMonth, i)

            const activeClass =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
                    ? 'active'
                    : ''

            const scheduleDateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${i
                .toString()
                .padStart(2, '0')}`

            datesHTML += `<div class="date ${activeClass}" data-day="${i}" data-full-date="${scheduleDateString}">
                ${i}
                </div>`
        }

        const endIndex = endDayIndex === 0 ? 7 : endDayIndex
        for (let i = 1; i < 7 - endIndex; i++) {
            const NextDay = new Date(currentYear, currentMonth + 1, i)
            datesHTML += `<div class="date inactive">${NextDay.getDate()}</div>`
        }

        if (this.datesElement) {
            this.datesElement.innerHTML = datesHTML
            this.highlightSchedule()
        }
    }

    highlightSchedule() {
        const dates = document.querySelectorAll('.date')
        dates.forEach(date => {
            const day = date.dataset.fullDate
            if (this.scheduleDate.includes(day)) {
                date.classList.add('scheduled-day')
            }
        })
    }
}
//hàm xử lí đổi tab bên course detail
function handleControlButton() {
    const buttons = document.querySelectorAll('.control__button')

    const classInfo = document.querySelector('.class_info')
    const classCalendar = document.querySelector('.class_calender')

    const courseItem = document.querySelector('.course__item')
    const scheduleManagement = document.querySelector('.schedule__Management')

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isInfoActive = classInfo.classList.toggle('active')
            classCalendar.classList.toggle('active', !isInfoActive)

            courseItem.style.display = isInfoActive ? 'flex' : 'none'
            scheduleManagement.style.display = isInfoActive ? 'none' : 'block'
        })
    })
}
//hàm xử lí upload ảnh
function handleImageUpload() {
    const courseImageInput = document.getElementById('course-image')
    const courseImage_url = document.getElementById('course-image-url')
    if (!courseImageInput) return

    courseImageInput.onchange = async e => {
        if (e.target.files.length === 0) return

        // Cần đảm bảo rằng các biến VITE_XXX được truy cập đúng cách (ví dụ: thông qua một biến global hoặc bằng cách import)
        // Nếu file này là ESM, import.meta.env là hợp lệ.
        const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD
        const CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME

        const formData = new FormData()
        formData.append('file', e.target.files[0])
        formData.append('upload_preset', UPLOAD_PRESET)
        formData.append('folder', 'DOAN2_UPLOAD/Courses')
        formData.append('public_id', `${e.target.files[0].name}-${Math.random().toString().substring(2, 15)}`)
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            })
            if (!response.ok) {
                throw new Error('Upload failed: ' + response.statusText)
            }
            const results = await response.json()
            courseImage_url.value = results.secure_url
        } catch (error) {
            console.error('Lỗi khi tải ảnh lên Cloudinary:', error)
        }
    }
}
function directBtn() {
    const today_btn = document.getElementById('today')
    if (!today_btn) return

    today_btn.addEventListener('click', () => {
        calendarManager.currentDate = new Date() // 👈 QUAN TRỌNG
        calendarManager.render()
    })
    const back_btn = document.getElementById('back__button')
    if (!back_btn) return

    back_btn.addEventListener('click', () => {
        window.location.href = '/Admin/courses'
    })
}
directBtn()

// =======================================================
// 5. DOMCONTENTLOADED (Khởi tạo khi tải trang)
// =======================================================
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.class_name').addEventListener('change', () => {
        handleScheduleAction()
    })
    // 2. Thiết lập logic modal và submit form
    handleImageUpload()
    // 3. Hiển thị nội dung khóa học và danh sách lớp
    renderCourseContent()
    renderclassList()

    // Initialize Calendar Manager
    window.calendarManager = new CalendarManager()
    window.calendarManager.fetchSchedules() // Load initial schedules
    window.calendarManager.render()

    handleControlButton()
    handleScheduleAction()

    setupEventHandlers()
    if (scheduleModal.form) {
        scheduleModal.form.onsubmit = e => {
            e.preventDefault()

            if (scheduleModal.form.dataset.mode === 'update') {
                handleScheduleUpdate(e)
                handleScheduleAction()
            } else {
                handleaddSchedule(e)
                handleScheduleAction()
            }
        }
    }
})
