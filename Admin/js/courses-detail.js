import { getAllCourses } from '/src/database/courses.db.js'
import { getAllClasses } from '/src/database/classes.db.js'
const Datrtime = new Date()
function GetTimenow() {
    const hours = Datrtime.getHours()
    const minutes = String(Datrtime.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
}
document.addEventListener('DOMContentLoaded', function () {
    const time = document.querySelector('.time')
    time.textContent = GetTimenow()
    renderclassList()
})
const urlParams = new URLSearchParams(window.location.search)
const courseId = urlParams.get('id')
const courses = getAllCourses()
const course = courses.find(course => course.courseId === Number(courseId))
const courseName = document.querySelector('.class__header__title')
courseName.innerHTML = `<h1>${course.courseName}</h1>`

// helper function
// đổ dữ liệu vào thẻ select
function renderclassList() {
    const classes = getAllClasses()
    const className = classes.filter(classItem => classItem.coursesId === Number(courseId))
    const select = document.querySelector('.class_name')
    select.innerHTML = className
        .map(className => `<option value="${className.className}">${className.className}</option>`)
        .join('')
}
