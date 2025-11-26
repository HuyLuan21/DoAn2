import mockStudents from '../mocks/students.js'
import { addStudentLanguage } from './student_language.db.js'
import { getAllLanguages } from './language.db.js'

const STUDENT_KEY = 'students'

function getStudentList() {
    return JSON.parse(localStorage.getItem(STUDENT_KEY))
}

function saveStudentList(list) {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(list))
}

function initStudentDB() {
    const existing = getStudentList()
    if (!existing) {
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
    // them ban ghi student
    // add student_language cho student tuong ung voi tung ngon ngu (mac dinh level order la thap nhat ~ minimum order)
    const students = getStudentList()
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1
    const newStudent = { id: newId, ...student }
    students.push(newStudent)
    saveStudentList(students)

    const languages = getAllLanguages()
    languages.forEach(lang => {
        addStudentLanguage({
            studentId: newId,
            languageId: lang.id,
            levelOrder: 1,
        })
    })

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

const studentDB = {
    getAllStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
}

export default studentDB
