import { getAllCourses } from '../database/courses.db.js'
import { getAllClasses } from '../database/classes.db.js'

//tim kiem khoa hoc
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search__input')
    const searchbutton = document.querySelector('.lucide-search')
    searchbutton.addEventListener('click', searchCourse)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            searchCourse()
        }
    })
    function searchCourse() {
        const searchValue = searchInput.value.toLowerCase()
        const courseItems = document.querySelectorAll('.course__item')
        courseItems.forEach(item => {
            const courseName = item.querySelector('.course__name').textContent.toLowerCase().trim()
            if (courseName.includes(searchValue)) {
                item.style.display = 'flex'
            } else {
                item.style.display = 'none'
            }
        })
    }
})
// ham mo o loc
document.addEventListener('DOMContentLoaded', function () {
    const filterButton = document.getElementById('filter__button')
    const filterDropdown = document.getElementById('filter__dropdown')
    filterButton.addEventListener('click', () => {
        filterDropdown.classList.toggle('active')
    })
    document.addEventListener('click', event => {
        const isClickInside = filterButton.contains(event.target) || filterDropdown.contains(event.target)
        if (!isClickInside && filterDropdown.classList.contains('active')) {
            filterDropdown.classList.remove('active')
        }
    })
})

//--------------------------//
// ham lay du lieu khoa hoc tu local
document.addEventListener('DOMContentLoaded', function () {
    // Giả định hàm này lấy mảng dữ liệu khóa học
    const courses = getAllCourses()
    const classes = getAllClasses()
    function getClassCountByCourseId(courseId) {
        if (!classes) return 0 // Xử lý trường hợp mảng classes không tồn tại
        return classes.filter(cls => cls.courseId === courseId).length
    }
    const courseGridContainer = document.querySelector('.course__list .grid')

    if (courseGridContainer) {
        courseGridContainer.innerHTML = ''
        courses.forEach(course => {
            const classCount = getClassCountByCourseId(course.id)
            const courseItem = document.createElement('div')
            courseItem.classList.add('course__item')

            courseItem.dataset.id = course.id

            courseItem.innerHTML = `
           
                                <div class="course__image">
                                    <img
                                        src="https://storage.googleapis.com/liveazotastoragept032025/avatar/m11_2025/d17/91812313/21ab2b05ccc815556170e018c5b330b6.jpeg"
                                        alt=""
                                    />
                                    <input class="checkbox" type="checkbox" />
                                </div>
                                <div class="course__info flex">
                                    <div class="course__name">
                                        <span>${course.courseName}</span>
                                    </div>
                                    <div class="course__description">
                                        <p>${course.description}</p>
                                    </div>
                                    <div class="price">
                                        <span>${course.tuitionFee}</span>
                                    </div>
                                    <div class="flex course__details space-between">
                                        <div class="hours align-center">
                                            <svg
                                                data-prefix="fas"
                                                data-icon="clock"
                                                class="svg-inline--fa fa-clock"
                                                role="img"
                                                viewBox="0 0 512 512"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
                                                ></path>
                                            </svg>
                                            <span>${course.duration}</span>
                                        </div>
                                        <div class="class__number align-center">
                                            <svg
                                                data-prefix="fas"
                                                data-icon="users"
                                                class="svg-inline--fa fa-users"
                                                role="img"
                                                viewBox="0 0 640 512"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M320 16a104 104 0 1 1 0 208 104 104 0 1 1 0-208zM96 88a72 72 0 1 1 0 144 72 72 0 1 1 0-144zM0 416c0-70.7 57.3-128 128-128 12.8 0 25.2 1.9 36.9 5.4-32.9 36.8-52.9 85.4-52.9 138.6l0 16c0 11.4 2.4 22.2 6.7 32L32 480c-17.7 0-32-14.3-32-32l0-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32l0-16c0-53.2-20-101.8-52.9-138.6 11.7-3.5 24.1-5.4 36.9-5.4 70.7 0 128 57.3 128 128l0 32c0 17.7-14.3 32-32 32l-86.7 0zM472 160a72 72 0 1 1 144 0 72 72 0 1 1 -144 0zM160 432c0-88.4 71.6-160 160-160s160 71.6 160 160l0 16c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-16z"
                                                ></path>
                                            </svg>
                                            <span>${2}</span>
                                        </div>
                                    </div>
                                </div>
                            
            `
            courseGridContainer.appendChild(courseItem)
        })
    } else {
        console.error("Lỗi: Không tìm thấy container '.course__list .grid' để hiển thị khóa học.")
    }
})
//ham xac nhan xoa khoa hoc
document.addEventListener('DOMContentLoaded', function () {
    const confirmRemove = document.getElementById('confirm__remove')
    const checkbox = document.querySelectorAll('.course__item .course__image > .checkbox')
    const course__item = document.querySelectorAll('.course__item')
    if (confirmRemove)
        confirmRemove.addEventListener('click', function (e) {
            checkbox.forEach(element => {
                if (element.checked) {
                    course__item.forEach(item => {
                        if (item.contains(element)) {
                            item.remove()
                        }
                    })
                }
            })
        })
})
// ham xu li xoa khoa hoc
document.addEventListener('DOMContentLoaded', function () {
    const removeCourse = document.getElementById('remove__course')
    const confirmRemove = document.getElementById('confirm__remove')
    const checkbox = document.querySelectorAll('.course__item .course__image > .checkbox')
    if (removeCourse)
        removeCourse.addEventListener('click', function (e) {
            confirmRemove.classList.toggle('active')
            checkbox.forEach(element => {
                element.classList.toggle('active')
            })
        })
})
// xu ly them khoa hoc
document.addEventListener('DOMContentLoaded', function () {
    const addBtn = document.getElementById('add__course')
    const modal = document.getElementById('add_course_modal')
    const closeBtns = modal.querySelectorAll('.close-modal, .close-modal-btn')
    const overlay = modal.querySelector('.modal-overlay')

    function openModal() {
        modal.classList.add('active')
    }

    function closeModal() {
        modal.classList.remove('active')
    }

    if (addBtn) {
        addBtn.addEventListener('click', openModal)
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal)
    })

    overlay.addEventListener('click', closeModal)

    // Optional: Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal()
        }
    })
})
