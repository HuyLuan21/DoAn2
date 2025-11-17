import { mockStudents } from '../mocks/students.js'

const STUDENT_KEY = 'students'

function getStudentList() {
    return JSON.parse(localStorage.getItem(STUDENT_KEY)) || []
}

function saveStudentList(list) {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(list))
}

function initStudentDB() {
    const existing = getStudentList()
    if (!existing || existing.length === 0) {
        saveStudentList(mockStudents)
    }
}
initStudentDB()

export function getAllStudents() {
    return getStudentList()
}

export function getStudentById(id) {
    const students = getStudentList()
    return students.find(student => student.id === id) || null
}

export function addStudent(student) {
    const students = getStudentList()

    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1
    const newStudent = { id: newId, ...student }

    students.push(newStudent)
    saveStudentList(students)
    return newStudent
}

export function updateStudent(id, updatedInfo) {
    const students = getStudentList()

    const index = students.findIndex(student => student.id === id)
    if (index === -1) {
        return null
    }
    students[index] = { ...students[index], ...updatedInfo }

    saveStudentList(students)
    return students[index]
}

export function deleteStudent(id) {
    const students = getStudentList()

    const index = students.findIndex(student => student.id === id)
    if (index === -1) {
        return false
    }
    students.splice(index, 1)

    saveStudentList(students)
    return true
}
