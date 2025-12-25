import { getAllCourses, deleteCourse, addCourse } from '/src/database/courses.db.js'
import { getAllClasses } from '/src/database/classes.db.js'
import { getAllLanguages } from '/src/database/language.db.js'
import { getAllLanguageLevels } from '/src/database/language_level.db.js'

const classes = getAllClasses()
const courses = getAllCourses()
// Hàm hỗ trợ: Đảm bảo giá trị là số hợp lệ cho việc sắp xếp
function cleanAndParseFloat(value) {
    if (typeof value === 'string') {
        const cleanedValue = value.replace(/[^0-9.]/g, '') // Loại bỏ ký tự không phải số/dấu chấm
        return parseFloat(cleanedValue) || 0
    }
    return parseFloat(value) || 0
}
document.addEventListener('DOMContentLoaded', function () {
    const course__list = document.querySelector('.course__list')
    course__list.innerHTML = ''
    const grid = document.createElement('div')
    grid.classList.add('grid')
    course__list.appendChild(grid)
})
// =======================================================
// Các Hàm Logic Chính (Core Logic Functions)
// =======================================================

function getClassCountByCourseId(courseId) {
    if (!classes) return 0
    const targetCourseId = parseInt(courseId)
    return classes.filter(cls => parseInt(cls.coursesId) === targetCourseId).length
}

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

/**
 * Áp dụng logic lọc và sắp xếp cho danh sách khóa học.
 */
function applyFilterAndSort() {
    const categoryValue = document.getElementById('category')?.value
    const languageValue = document.getElementById('language')?.value
    const sortValue = document.getElementById('sort')?.value
    const coursesData = getAllCourses()
    let filteredCourses = [...coursesData]

    // --- BƯỚC 1: LỌC DỮ LIỆU (FILTER) ---
    if (categoryValue !== 'all' || languageValue !== 'all') {
        filteredCourses = filteredCourses.filter(course => {
            let matchesCategory = true
            let matchesLanguage = true

            if (categoryValue && categoryValue !== 'all') {
                matchesCategory = String(course.inputLevel) === categoryValue
            }

            if (languageValue && languageValue !== 'all') {
                matchesLanguage = (course.languageCode || '').toLowerCase() === languageValue.toLowerCase()
            }

            return matchesCategory && matchesLanguage
        })
    }

    // --- BƯỚC 2: SẮP XẾP DỮ LIỆU (SORT) ---
    if (sortValue) {
        filteredCourses.sort((a, b) => {
            // Giả định cleanAndParseFloat() là hàm global/có sẵn
            const priceA = cleanAndParseFloat(a.tuitionFee)
            const priceB = cleanAndParseFloat(b.tuitionFee)

            switch (sortValue) {
                case 'price_asc':
                    return priceA - priceB
                case 'price_desc':
                    return priceB - priceA
                default:
                    return 0
            }
        })
    }

    // --- BƯỚC 3: TÁI TẠO DOM ---
    renderCourses(filteredCourses)

    const filterDropdown = document.getElementById('filter__dropdown')
    if (filterDropdown) {
        filterDropdown.classList.remove('active')
    }
}

/**
 * Áp dụng logic tìm kiếm dựa trên input.
 */
function searchCourse() {
    const searchInput = document.getElementById('search__input')
    if (!searchInput) return

    const searchValue = searchInput.value.toLowerCase().trim()

    const searchResults = courses.filter(course => course.courseName.toLowerCase().includes(searchValue))
    renderCourses(searchResults)
}

// =======================================================
// DOMContentLoaded: Khởi tạo và Gắn Event Listeners
// =======================================================
document.addEventListener('DOMContentLoaded', function () {
    // 1. Khởi tạo Dữ liệu và DOM
    // Lấy dữ liệu và gán vào các biến dùng chung
    const courses = getAllCourses() // Gọi hàm lấy dữ liệu gốc
    const classes = getAllClasses() // Gọi hàm lấy dữ liệu lớp
    const courseGridContainer = document.querySelector('.course__list .grid')

    if (!courseGridContainer) {
        console.error("Lỗi: Không tìm thấy container '.course__list .grid' để hiển thị khóa học.")
        return
    }

    // Hiển thị lần đầu
    renderCourses(courses)

    // 2. Gắn Event Listeners

    // LỌC & SẮP XẾP
    const applyFilterButton = document.getElementById('apply_filter')
    if (applyFilterButton) {
        applyFilterButton.addEventListener('click', applyFilterAndSort)
    }

    // TÌM KIẾM
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

    handleFilterDropdown()
    handleModalLogic()

    handleCourseItemClick(courseGridContainer)

    handleDeleteCourseLogic(courseGridContainer)

    handleImageUpload()
})

// -----------------------------------------------------
// CÁC HÀM XỬ LÝ EVENT LOGIC (Được gọi từ DOMContentLoaded)
// -----------------------------------------------------
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
    // 1. Khởi tạo đối tượng modal để lấy các phần tử DOM
    modal.init()

    // Kiểm tra xem đối tượng 'modal' đã tìm thấy các phần tử cần thiết chưa
    if (!modal.form || !modal.overlay) {
        console.error('Không thể tìm thấy Form hoặc Overlay của Modal. Kiểm tra lại class và ID trong HTML.')
        return
    }

    // 2. Lấy các nút kích hoạt
    const addBtn = document.getElementById('add__course')
    const btnSubmit = document.querySelector('.btn-submit')
    const form = document.getElementById('add_course_modal')
    // --- GẮN SỰ KIỆN ---

    if (addBtn) {
        // Gắn modal.open() trực tiếp (Không cần hàm openModal() cục bộ nữa)
        addBtn.addEventListener('click', () => modal.open())
    }

    if (btnSubmit) {
        // Sử dụng hàm handleAddCourse đã có (nhớ phải định nghĩa hàm này ở ngoài)
        btnSubmit.addEventListener('click', handleAddCourse)
    }

    modal.closeButtons.forEach(btn => btn.addEventListener('click', () => modal.close()))

    modal.overlay.addEventListener('click', e => {
        // Đảm bảo chỉ đóng khi click chính xác vào overlay, không phải nội dung bên trong
        if (e.target === modal.overlay) {
            modal.close()
        }
    })

    document.addEventListener('keydown', function (e) {
        // Kiểm tra xem phím là Escape VÀ Modal có đang mở không (kiểm tra class 'active' trên form/overlay)
        if (e.key === 'Escape' && modal.form.classList.contains('active')) {
            modal.close()
        }
    })
    // lay su kien submit cua form
    if (form) {
        form.addEventListener('submit', handleAddCourse)
    }
    console.log('Modal Logic đã được thiết lập thành công!')
}

function handleFilterDropdown() {
    const filterButton = document.getElementById('filter__button')
    const filterDropdown = document.getElementById('filter__dropdown')
    if (!filterButton || !filterDropdown) return

    filterButton.addEventListener('click', () => {
        filterDropdown.classList.toggle('active')
    })
    document.addEventListener('click', event => {
        const isClickInside = filterButton.contains(event.target) || filterDropdown.contains(event.target)
        if (!isClickInside && filterDropdown.classList.contains('active')) {
            filterDropdown.classList.remove('active')
        }
    })
}
// hàm tạo danh sách chọn ngôn ngữ và cấp độ
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
function handleAddCourse(event) {
    event.preventDefault()
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
        addCourse(formData)
        console.log(' đã thêm khóa học')
        const courses = getAllCourses()
        modal.close()
        renderCourses(courses)
    } catch {
        console.log('không thêm được khóa học')
    }
}

function handleCourseItemClick(container) {
    container.addEventListener('click', e => {
        const item = e.target.closest('.course__item')
        if (!item) return // Không click vào item

        // Ngăn chặn chuyển hướng nếu click vào checkbox hoặc nút khác
        if (
            e.target.closest('.checkbox') ||
            e.target.closest('#remove__course') ||
            e.target.closest('#confirm__remove')
        ) {
            return
        } else if (e.target.closest('#view-classes')) {
            const courseId = item.dataset.courseId
            if (courseId) {
                window.location.href = `/Admin/manage-classes?id=${courseId}`
            }
        } else {
            const courseId = item.dataset.courseId
            if (courseId) {
                window.location.href = `/Admin/courses_detail?id=${courseId}`
            }
        }
    })
}

function handleDeleteCourseLogic(container) {
    const removeCourseButton = document.getElementById('remove__course')
    const confirmRemoveButton = document.getElementById('confirm__remove')

    // --- Biến cờ (flag) để theo dõi trạng thái xóa ---
    let isDeleteModeActive = false

    // --- 1. Xử lý nút "Xóa khóa học" (Hiển thị Checkbox) ---
    if (removeCourseButton && confirmRemoveButton && container) {
        removeCourseButton.addEventListener('click', function () {
            // Đảo ngược trạng thái
            isDeleteModeActive = !isDeleteModeActive

            // Toggle hiển thị các phần tử UI
            confirmRemoveButton.classList.toggle('active')
            container.classList.toggle('delete-mode-active', isDeleteModeActive) // Thêm class để quản lý trạng thái

            const checkboxes = container.querySelectorAll('.course__item .course__image > .checkbox')
            checkboxes.forEach(element => {
                element.classList.toggle('active')
            })
        })
    }

    // --- 2. Logic Ngăn chặn Tương tác (Chặn click ngoài Checkbox/Confirm) ---
    if (container) {
        container.addEventListener(
            'click',
            function (e) {
                if (isDeleteModeActive) {
                    const target = e.target
                    const isCheckbox = target.classList.contains('checkbox')
                    const isConfirmButton = target.id === 'confirm__remove' || target.closest('#confirm__remove')

                    const isViewClassesButton = target.closest('#view-classes')

                    if (!isCheckbox && !isConfirmButton && !isViewClassesButton) {
                        e.preventDefault()
                        e.stopPropagation()
                    }
                }
            },
            true
        )
    }

    // Xử lý nút "Xác nhận Xóa"
    if (confirmRemoveButton) {
        confirmRemoveButton.addEventListener('click', function () {
            const checkedBoxes = document.querySelectorAll('.course__item .course__image > .checkbox:checked')
            checkedBoxes.forEach(checkedBox => {
                const itemToRemove = checkedBox.closest('.course__item')
                if (itemToRemove) {
                    deleteCourse(itemToRemove.dataset.courseId)
                }
            })
            const courses = getAllCourses()
            renderCourses(courses)
            confirmRemoveButton.classList.remove('active')
            document.querySelectorAll('.course__item .checkbox').forEach(cb => cb.classList.remove('active'))
        })
    }
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
