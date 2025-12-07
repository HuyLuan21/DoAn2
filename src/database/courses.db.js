import mockCourses from '../mocks/courses.js'
const COURSE_KEY = 'courses'
function getCourseList() {
    return JSON.parse(localStorage.getItem(COURSE_KEY))
}
function saveCourseList(list) {
    localStorage.setItem(COURSE_KEY, JSON.stringify(list))
}
function initCourseDB() {
    const existing = getCourseList()
    if (!existing) {
        saveCourseList(mockCourses)
    }
}
initCourseDB()
export function getAllCourses() {
    return getCourseList()
}
export function getCourseById(id) {
    const courses = getCourseList()
    return courses.find(course => course.id === id) || null
}
export function addCourse(course) {
    const courses = getCourseList()
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1
    const newCourse = { id: newId, ...course }
    courses.push(newCourse)
    saveCourseList(courses)
}
export function updateCourse(id, updatedInfo) {
    const courses = getCourseList()
    const index = courses.findIndex(course => course.id === id)
    if (index === -1) {
        return null
    }
    courses[index] = { ...courses[index], ...updatedInfo }
    saveCourseList(courses)
    return courses[index]
}
export function deleteCourse(id) {
    const courses = getCourseList()
    const index = courses.findIndex(course => course.id === id)
    if (index === -1) {
        return false
    }
    courses.splice(index, 1)
    saveCourseList(courses)
    return true
}
