const courseGridContainer = document.querySelector('.course__list .grid')
handleCourseItemClick(courseGridContainer)
let allClasses = []
let courses = []
const LANGUAGE_LEVEL_ID_MAP = {
    EN: {
        A1: '1B8ED75E-3BA9-495A-9420-45FD712959D2', // Beginner A1
        A2: '0BF518C6-7A06-49CF-8AB3-A82E0274AF8B', // Elementary A2
        B1: 'DA7629BE-270A-4899-BF1D-C6665BB6AC41', // Intermediate B1
        B2: '66EA9722-C6F1-4DA3-977B-F9B05F060396', // Upper-Intermediate B2
        C1: '4555425B-FD34-4426-82A2-2F74394AE096', // Advanced C1
    },
    JP: {
        N5: '925E8561-9455-4D32-B2CF-954971F18121', // Beginner N5
        N4: 'D12BB338-FE72-436C-AAF7-12FDEC701256', // Elementary N4
    },
    KR: {
        L1: '5F4FB93D-11E7-4B4B-A924-519C7C5ADE2E', // Beginner Level 1
        L2: '8FBBF10E-84A3-431A-9216-1A5B3B35C0FA', // Elementary Level 2
    },
    FR: {
        A1: '771F1CAD-74D8-42B6-992D-F62B737C070C', // Débutant A1
        A2: 'F88D40E7-6473-40FE-9DC2-83A7BDE35813', // Élémentaire A2
        B1: 'D92C3CA8-8470-4100-AAE7-0723800F54AE', // Intermédiaire B1
    },
    DE: {
        A1: 'B4D411BB-10D6-4AA6-8E85-4CE78B05F955', // Anfänger A1
        A2: '969870EF-288E-4D5D-87F0-0E31B0D96056', // Grundlagen A2
    },
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

Promise.all([
    fetch('https://localhost:44394/api/Classes').then(res => res.json()),
    fetch('https://localhost:44394/api/Course').then(res => res.json()),
])
    .then(([classResult, courseResult]) => {
        allClasses = classResult.data || []

        courses = (courseResult.data || []).map(course => ({
            courseId: course.course_id,
            courseName: course.course_name,
            description: course.description,
            tuitionFee: course.fee,
            imgUrl:
                course.thumbnail_url ||
                'https://res.cloudinary.com/dkeeelvpa/image/upload/v1765332193/image001_fmw9gt.jpg',
            duration: course.duration_hours + ' giờ',
        }))

        renderCourses(courses)
    })
    .catch(err => console.error(err))

function renderCourses(courses) {
    if (!courses) return
    const grid = document.querySelector('.grid')
    grid.innerHTML = ''

    if (courses.length === 0) {
        grid.innerHTML = '<p class="no-results">Không tìm thấy khóa học nào</p>'
        return
    }

    const course_item = document.createElement('div')
    course_item.classList.add('course__item')

    courses.forEach(course => {
        const classCount = getClassCountByCourseId(course.courseId)
        const courseItem = document.createElement('div')
        courseItem.classList.add('course__item')
        courseItem.dataset.courseId = course.courseId

        const formattedTuitionFee = course.tuitionFee.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        })

        // Tối ưu hóa template literals
        courseItem.innerHTML = `
            <div class="course__image">
                <img src="${course.imgUrl}" alt="" />
                <input class="checkbox" type="checkbox" />
            </div>
            <div class="course__info flex">
                <div class="course__name"><span>${course.courseName}</span></div>
                <div class="course__description"><p>${course.description}</p></div>
                <div class="price"><span>${formattedTuitionFee}</span></div>
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
                <button id="view-classes">Danh sách lớp</button>
            </div>
        `
        grid.appendChild(courseItem)
    })
}
function getClassCountByCourseId(courseId) {
    if (!Array.isArray(allClasses)) return 0

    const id = String(courseId)

    return allClasses.reduce((count, cls) => {
        return String(cls.course_id) === id ? count + 1 : count
    }, 0)
}
function handleCourseItemClick(container) {
    container.addEventListener('click', e => {
        const item = e.target.closest('.course__item')
        if (!item) return // Không click vào item

        if (
            e.target.closest('.checkbox') ||
            e.target.closest('#remove__course') ||
            e.target.closest('#confirm__remove')
        ) {
            return
        } else if (e.target.closest('#view-classes')) {
            const courseId = item.dataset.courseId
            if (courseId) {
                window.location.href = `manage-classes.html?id=${courseId}`
            }
        } else {
            const courseId = item.dataset.courseId
            if (courseId) {
                window.location.href = `courses_detail.html?id=${courseId}`
            }
        }
    })
}
function searchCourse() {
    const input = document.getElementById('search__input')
    if (!input) return

    const keyword = input.value.trim()
    if (!keyword) {
        renderCourses(courses)
        return
    }

    fetch(`https://localhost:44394/api/Course/search/${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(result => {
            const searchData = (result.data || []).map(course => ({
                courseId: course.course_id,
                courseName: course.course_name,
                description: course.description,
                tuitionFee: course.fee,
                imgUrl:
                    course.thumbnail_url ||
                    'https://res.cloudinary.com/dkeeelvpa/image/upload/v1765332193/image001_fmw9gt.jpg',
                duration: course.duration_hours + ' giờ',
            }))

            renderCourses(searchData)
        })
        .catch(err => {
            console.error(err)
            renderCourses([])
        })
}

const modal = {
    overlay: document.querySelector('.modal-overlay'),
    form: document.getElementById('add_course_modal'),
    init() {
        // Lấy các phần tử DOM và gán vào thuộc tính của đối tượng 'modal'
        this.overlay = document.querySelector('.modal-overlay')
        this.form = document.getElementById('add_course_modal')

        // *BỔ SUNG*: Lấy nút đóng modal để có thể gắn sự kiện sau
        this.closeButtons = this.form ? this.form.querySelectorAll('.close-modal, .close-modal-btn') : []
    },
    open() {
        if (this.overlay) this.overlay.classList.add('active')
        if (this.form) this.form.classList.add('active')
    },
    close() {
        if (this.overlay) this.overlay.classList.remove('active')
        if (this.form) this.form.classList.remove('active')
    },
}

function handleModalLogic() {
    modal.init()
    if (!modal.form) return

    const addBtn = document.getElementById('add__course')
    const form = document.getElementById('add_course_modal') // Đây là thẻ <form>

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            modal.open()
            GenerrateComboBox()
        })
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const formData = new FormData(e.target)
            const data = Object.fromEntries(formData.entries())

            // Lấy ID từ bản đồ dựa trên lựa chọn của người dùng
            const lang = data.course_languages // Ví dụ: 'DE'
            const level = data.course_type // Ví dụ: 'A1'
            const languageLevelId = LANGUAGE_LEVEL_ID_MAP[lang]?.[level]

            if (!languageLevelId) {
                alert('Vui lòng chọn ngôn ngữ và trình độ hợp lệ!')
                return
            }

            // Xây dựng Payload đúng cấu trúc API yêu cầu
            const payload = {
                course_name: data.course_name,
                description: data.description,
                fee: Number(data.fee.replace(/\D/g, '')), // Loại bỏ ký tự không phải số nếu cần
                duration_hours: Number(data.duration_hours),
                thumbnail_url:
                    data.thumbnail_url ||
                    'https://res.cloudinary.com/dkeeelvpa/image/upload/v1765332193/image001_fmw9gt.jpg',
                language_level_id: languageLevelId,
                course_status: data.course_status || 'active',
            }

            createCourse(payload)
        })
    }

    // Các nút đóng modal...
    modal.closeButtons.forEach(btn => btn.addEventListener('click', () => modal.close()))
}

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
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search__input')
    const searchButton = document.querySelector('.lucide-search')

    if (searchButton) searchButton.addEventListener('click', searchCourse)
    if (searchInput) {
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                searchCourse()
            }
        })
    }
    handleModalLogic()

    handleCourseItemClick(courseGridContainer)
    handleDeleteCourseLogic(courseGridContainer)
    handleImageUpload()
    GenerrateComboBox()
})
function renderLevelCombo(languageCode) {
    const courseType = document.getElementById('course-type-select')
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
    const courseLangues = document.getElementById('course-languages-select')
    const courseType = document.getElementById('course-type-select')

    if (!courseLangues || !courseType) return

    courseLangues.onchange = function () {
        renderLevelCombo(this.value)
    }
}
function createCourse(payload) {
    // Hiển thị loading nếu cần
    console.log('Đang gửi dữ liệu:', payload)

    fetch('https://localhost:44394/api/Course', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
    })
        .then(async res => {
            const result = await res.json()
            if (!res.ok) {
                throw new Error(result.message || 'Lỗi từ phía server')
            }
            return result
        })
        .then(result => {
            alert('Thêm khóa học thành công!')

            // 1. Đóng modal
            modal.close()

            // 2. Reset form
            document.getElementById('add_course_form').reset()

            // 3. Cập nhật danh sách hiển thị mà không cần F5
            const newCourse = {
                courseId: result.data.course_id, // Lấy ID trả về từ DB
                courseName: payload.course_name,
                description: payload.description,
                tuitionFee: payload.fee,
                imgUrl: payload.thumbnail_url,
                duration: payload.duration_hours + ' giờ',
            }

            courses.unshift(newCourse) // Thêm vào đầu mảng
            renderCourses(courses) // Vẽ lại grid
        })
        .catch(err => {
            console.error('Lỗi POST:', err)
            alert('Không thể thêm khóa học: ' + err.message)
        })
}
async function deleteCourse(courseId) {
    try {
        const res = await fetch(`https://localhost:44394/api/Course/${courseId}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            // Đọc thông báo lỗi chi tiết từ server (như lỗi ràng buộc khóa ngoại bạn gặp)
            const errorData = await res.json().catch(() => ({}))
            const errorMessage = errorData.message || `Lỗi ${res.status}: Không thể xóa do ràng buộc dữ liệu.`
            throw new Error(errorMessage)
        }

        return true // Trả về true nếu thực sự đã xóa thành công trong DB
    } catch (err) {
        console.error('Lỗi chi tiết từ Server:', err.message)
        alert(err.message) // Hiển thị lỗi Foreign Key để người dùng biết tại sao không xóa được
        return false // Trả về false nếu thất bại
    }
}
function handleDeleteCourseLogic(container) {
    const removeCourseButton = document.getElementById('remove__course')
    const confirmRemoveButton = document.getElementById('confirm__remove')
    let isDeleteModeActive = false

    if (removeCourseButton && confirmRemoveButton && container) {
        removeCourseButton.addEventListener('click', function () {
            isDeleteModeActive = !isDeleteModeActive

            // Cập nhật UI
            confirmRemoveButton.classList.toggle('active', isDeleteModeActive)
            container.classList.toggle('delete-mode-active', isDeleteModeActive)

            const checkboxes = container.querySelectorAll('.course__item .checkbox')
            checkboxes.forEach(cb => cb.classList.toggle('active', isDeleteModeActive))
        })
    }

    if (confirmRemoveButton) {
        confirmRemoveButton.addEventListener('click', async function () {
            const checkedBoxes = container.querySelectorAll('.checkbox:checked')
            if (checkedBoxes.length === 0) return

            if (!confirm(`Bạn có chắc chắn muốn xóa ${checkedBoxes.length} khóa học?`)) return

            // Duyệt qua từng mục đã chọn
            for (const cb of checkedBoxes) {
                const item = cb.closest('.course__item')
                const id = item.dataset.courseId

                // GỌI API VÀ CHỜ KẾT QUẢ THỰC TẾ
                const isSuccessfullyDeleted = await deleteCourse(id)

                if (isSuccessfullyDeleted) {
                    // CHỈ KHI THÀNH CÔNG: Xóa khỏi mảng dữ liệu local
                    courses = courses.filter(c => String(c.courseId) !== String(id))
                }
                // NẾU THẤT BẠI: Không làm gì cả, khóa học vẫn ở trong mảng 'courses'
            }

            // VẼ LẠI GIAO DIỆN:
            // Những cái xóa thành công sẽ biến mất, những cái lỗi (như lỗi Foreign Key) sẽ xuất hiện trở lại
            renderCourses(courses)

            // Thoát chế độ xóa
            isDeleteModeActive = false
            confirmRemoveButton.classList.remove('active')
            container.classList.remove('delete-mode-active')
            document.querySelectorAll('.checkbox').forEach(cb => cb.classList.remove('active'))
        })
    }
}
