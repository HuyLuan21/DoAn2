import { getAllCourses, getCourseById } from '/src/database/courses.db.js'
import { getAllClasses } from '/src/database/classes.db.js'

// Hàm hỗ trợ: Đảm bảo giá trị là số hợp lệ cho việc sắp xếp
function cleanAndParseFloat(value) {
    if (typeof value === 'string') {
        const cleanedValue = value.replace(/[^0-9.]/g, '') // Loại bỏ ký tự không phải số/dấu chấm
        return parseFloat(cleanedValue) || 0
    }
    return parseFloat(value) || 0
}

// -----------------------------------------------------
// KHỐI CODE CHÍNH - XỬ LÝ KHI DOM ĐÃ TẢI XONG
// -----------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    // 1. Dữ liệu Gốc & DOM
    const courses = getAllCourses()
    const classes = getAllClasses()
    const courseGridContainer = document.querySelector('.course__list .grid')

    if (!courseGridContainer) {
        console.error("Lỗi: Không tìm thấy container '.course__list .grid' để hiển thị khóa học.")
        return
    }

    function getClassCountByCourseId(courseId) {
        if (!classes) return 0
        // Đảm bảo so sánh số nguyên: cls.coursesId (số) === courseId (số)
        const targetCourseId = parseInt(courseId)
        return classes.filter(cls => parseInt(cls.coursesId) === targetCourseId).length
    }

    // 2. Hàm Tái tạo (Render) DOM
    function renderCourses(courseListToRender) {
        courseGridContainer.innerHTML = ''

        if (courseListToRender.length === 0) {
            courseGridContainer.innerHTML = '<p class="no-results">Không tìm thấy khóa học nào</p>'
            return
        }

        courseListToRender.forEach(course => {
            const classCount = getClassCountByCourseId(course.courseId)
            const courseItem = document.createElement('div')
            courseItem.classList.add('course__item')

            courseItem.dataset.courseId = course.courseId

            courseItem.innerHTML = `
                <div class="course__image">
                    <img src="https://storage.googleapis.com/liveazotastoragept032025/avatar/m11_2025/d17/91812313/21ab2b05ccc815556170e018c5b330b6.jpeg" alt="" />
                    <input class="checkbox" type="checkbox" />
                </div>
                <div class="course__info flex">
                    <div class="course__name"><span>${course.courseName}</span></div>
                    <div class="course__description"><p>${course.description}</p></div>
                    <div class="price"><span>${course.tuitionFee.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}</span></div>
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
            courseGridContainer.appendChild(courseItem)
        })
    }

    // Hiển thị lần đầu
    renderCourses(courses)

    // -----------------------------------------------------
    // 3. Logic Lọc và Sắp xếp (applyFilterAndSort)
    // -----------------------------------------------------
    function applyFilterAndSort() {
        const categoryValue = document.getElementById('category').value
        const languageValue = document.getElementById('language').value
        const sortValue = document.getElementById('sort').value

        let filteredCourses = [...courses]

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
                switch (sortValue) {
                    case 'price_asc':
                        const priceA_asc = cleanAndParseFloat(a.tuitionFee)
                        const priceB_asc = cleanAndParseFloat(b.tuitionFee)
                        return priceA_asc - priceB_asc
                    case 'price_desc':
                        const priceA_desc = cleanAndParseFloat(a.tuitionFee)
                        const priceB_desc = cleanAndParseFloat(b.tuitionFee)
                        return priceB_desc - priceA_desc
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

    // -----------------------------------------------------
    // 4. Gắn Event Listeners
    // -----------------------------------------------------

    // LỌC & SẮP XẾP
    const applyFilterButton = document.getElementById('apply_filter')
    if (applyFilterButton) {
        applyFilterButton.addEventListener('click', applyFilterAndSort)
    }

    // TÌM KIẾM
    const searchInput = document.getElementById('search__input')
    const searchbutton = document.querySelector('.lucide-search')

    function searchCourse() {
        const searchValue = searchInput.value.toLowerCase()
        // Gọi lại renderCourses sau khi lọc mảng courses, không cần querySelectorAll mỗi lần
        const searchResults = courses.filter(course => course.courseName.toLowerCase().includes(searchValue))
        renderCourses(searchResults)
    }

    if (searchbutton) searchbutton.addEventListener('click', searchCourse)
    if (searchInput) {
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                searchCourse()
            }
        })
    }

    // THAO TÁC MODAL THÊM KHÓA HỌC
    handleModalLogic()

    // MỞ/ĐÓNG DROPDOWN LỌC
    handleFilterDropdown()

    // XỬ LÝ CHUYỂN HƯỚNG & CHI TIẾT KHÓA HỌC (EVENT DELEGATION)
    handleCourseItemClick(courseGridContainer)

    // XỬ LÝ CHECKBOX và DELETE LOGIC
    handleDeleteCourseLogic(courseGridContainer)

    // XỬ LÝ UPLOAD HÌNH ẢNH
    handleImageUpload()
})

// -----------------------------------------------------
// CÁC HÀM XỬ LÝ EVENT LOGIC (Được gọi từ DOMContentLoaded)
// -----------------------------------------------------

function handleModalLogic() {
    const addBtn = document.getElementById('add__course')
    const modal = document.getElementById('add_course_modal')

    if (!modal) return

    const closeBtns = modal.querySelectorAll('.close-modal, .close-modal-btn')
    const overlay = modal.querySelector('.modal-overlay')

    function openModal() {
        modal.classList.add('active')
    }
    function closeModal() {
        modal.classList.remove('active')
    }

    if (addBtn) addBtn.addEventListener('click', openModal)
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal))
    overlay.addEventListener('click', closeModal)

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal()
        }
    })
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

function handleCourseItemClick(container) {
    const id = getCourseById()
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
    const removeCourse = document.getElementById('remove__course')
    const confirmRemove = document.getElementById('confirm__remove')

    // Xử lý nút "Xóa khóa học" (Hiển thị Checkbox)
    if (removeCourse && confirmRemove) {
        removeCourse.addEventListener('click', function () {
            confirmRemove.classList.toggle('active')
            const checkboxes = document.querySelectorAll('.course__item .course__image > .checkbox')
            checkboxes.forEach(element => {
                element.classList.toggle('active')
            })
        })
    }

    // Xử lý nút "Xác nhận Xóa"
    if (confirmRemove) {
        confirmRemove.addEventListener('click', function () {
            const checkedBoxes = document.querySelectorAll('.course__item .course__image > .checkbox:checked')

            checkedBoxes.forEach(checkedBox => {
                // Lấy phần tử course__item cha
                const itemToRemove = checkedBox.closest('.course__item')
                if (itemToRemove) {
                    // itemToRemove.remove()
                    // NOTE: Ở đây, bạn cần gọi hàm xóa dữ liệu khỏi database/local storage
                    deleteCourse(itemToRemove.dataset.id)
                }
            })
            // Ẩn nút xác nhận và checkbox sau khi xóa xong (tùy chọn)
            confirmRemove.classList.remove('active')
            document.querySelectorAll('.course__item .checkbox').forEach(cb => cb.classList.remove('active'))
        })
    }
}

async function handleImageUpload() {
    const courseImageInput = document.getElementById('course-image')
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
        formData.append('public_id', e.target.files[0].name)

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            })
            if (!response.ok) {
                throw new Error('Upload failed: ' + response.statusText)
            }
            return await response.json()
        } catch (error) {
            console.error('Lỗi khi tải ảnh lên Cloudinary:', error)
            // Xử lý lỗi người dùng ở đây
        }
    }
}
