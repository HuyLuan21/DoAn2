import { getAllCourses, updateCourse, deleteCourse } from '/src/database/courses.db.js'
import { getAllClasses } from '/src/database/classes.db.js'
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

function GetTimenow() {
    // Khởi tạo Date() bên trong hàm để lấy thời gian mới nhất khi gọi
    const now = new Date()
    const hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
}

function getClassCountByCourseId(courseId) {
    if (!classes) return 0
    const targetCourseId = parseInt(courseId)
    return classes.filter(cls => parseInt(cls.coursesId) === targetCourseId).length
}

// =======================================================
// 3. LOGIC XỬ LÝ MODAL (Cập nhật / Chi tiết)
// =======================================================

const modal = {
    // Đảm bảo các thuộc tính được thiết lập là null ban đầu
    overlay: null,
    form: null,
    closeButtons: [],

    // Hàm khởi tạo được gọi trong DOMContentLoaded
    init() {
        this.form = document.getElementById('update_modal')
        if (!this.form) {
            console.error('Modal form #update_modal không tồn tại.')
            return
        }
        this.overlay = this.form.querySelector('.modal-overlay')
        this.closeButtons = this.form.querySelectorAll('.close-modal, .close-modal-btn')
    },
    open() {
        if (this.overlay) this.overlay.classList.add('active')
        if (this.form) this.form.classList.add('active')
        // OPTIONAL: Tải dữ liệu khóa học vào form khi mở (chưa triển khai ở đây)
    },
    close() {
        if (this.overlay) this.overlay.classList.remove('active')
        if (this.form) this.form.classList.remove('active')
    },
}

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
        modal.close()
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
        modal.close()
    }
}
function handleModalLogic() {
    modal.init()

    const openModal_btn = document.getElementById('setting')
    const deleteModal_btn = document.querySelector('.btn-delete')
    if (openModal_btn) openModal_btn.addEventListener('click', () => modal.open())

    // Gắn sự kiện đóng modal
    if (modal.closeButtons.length > 0) {
        modal.closeButtons.forEach(btn => btn.addEventListener('click', () => modal.close()))
    }
    if (modal.overlay) {
        modal.overlay.addEventListener('click', e => {
            if (e.target === modal.overlay) {
                modal.close()
            }
        })
    }

    // Gắn sự kiện SUBMIT vào FORM của modal
    if (modal.form) {
        modal.form.addEventListener('submit', handleUpdateCourse)
    }
    if (deleteModal_btn) {
        deleteModal_btn.addEventListener('click', () => {
            handleDeleteCourseLogic()
        })
    }

    // Sự kiện phím ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.form && modal.form.classList.contains('active')) {
            modal.close()
        }
    })
}

// =======================================================
// 4. CÁC HÀM RENDER (Hiển thị DOM)
// =======================================================

/**
 * Đổ danh sách tên lớp học vào thẻ select.
 */
function renderclassList() {
    const className = classes.filter(classItem => classItem.coursesId === Number(courseId))
    const select = document.querySelector('.class_name')

    if (select) {
        select.innerHTML = className
            .map(item => `<option value="${item.className}">${item.className}</option>`)
            .join('')
    }
}
function GenerrateComboBox() {
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
GenerrateComboBox()

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

// =======================================================
// 5. DOMCONTENTLOADED (Khởi tạo khi tải trang)
// =======================================================
document.addEventListener('DOMContentLoaded', function () {
    // 1. Hiển thị thời gian
    const timeElement = document.querySelector('.time')
    if (timeElement) {
        timeElement.textContent = GetTimenow()
    }

    // 2. Thiết lập logic modal và submit form
    handleModalLogic()

    // 3. Hiển thị nội dung khóa học và danh sách lớp
    renderCourseContent()
    renderclassList()
})
