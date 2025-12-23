import mockTeachers from '../mocks/teachers.js'

const TEACHER_KEY = 'teachers'

function getTeacherList() {
    return JSON.parse(localStorage.getItem(TEACHER_KEY))
}

function saveTeacherList(list) {
    localStorage.setItem(TEACHER_KEY, JSON.stringify(list))
}

function initTeacherDB() {
    const existing = getTeacherList()
    if (!existing) {
        saveTeacherList(mockTeachers)
    }
}
initTeacherDB()

export function getAllTeachers() {
    return getTeacherList()
}

export function getTeacherById(id) {
    const teachers = getTeacherList()
    return teachers.find(teacher => teacher.teacherId === id) || null
}

export function addTeacher(teacher) {
    const teachers = getTeacherList()
    const newId = teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1
    const newTeacher = { id: newId, ...teacher }
    teachers.push(newTeacher)
    saveTeacherList(teachers)
}

export function updateTeacher(id, updatedInfo) {
    const teachers = getTeacherList()
    const index = teachers.findIndex(teacher => teacher.id === id)
    if (index === -1) {
        return null
    }
    teachers[index] = { ...teachers[index], ...updatedInfo }
    saveTeacherList(teachers)
    return teachers[index]
}

export function deleteTeacher(id) {
    const teachers = getTeacherList()
    const index = teachers.findIndex(teacher => teacher.id === id)
    if (index === -1) {
        return false
    }
    teachers.splice(index, 1)
    saveTeacherList(teachers)
    return true
}
