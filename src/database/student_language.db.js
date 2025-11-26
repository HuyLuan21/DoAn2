import mockStudentLanguages from '../mocks/student_languages.js'

const STUDENT_LANGUAGE_KEY = 'student_languages'

function getStudentLanguageList() {
    return JSON.parse(localStorage.getItem(STUDENT_LANGUAGE_KEY))
}

function saveStudentLanguageList(list) {
    localStorage.setItem(STUDENT_LANGUAGE_KEY, JSON.stringify(list))
}

function initStudentLanguageDB() {
    const existing = getStudentLanguageList()
    if (!existing) {
        saveStudentLanguageList(mockStudentLanguages)
    }
}
initStudentLanguageDB()

export function getAllStudentLanguages() {
    return getStudentLanguageList()
}

export function getStudentLanguageByStudentId(studentId) {
    const studentLanguages = getStudentLanguageList()
    return studentLanguages.filter(sl => sl.studentId === studentId)
}

export function addStudentLanguage(studentLanguage) {
    const studentLanguages = getStudentLanguageList()
    const newId = studentLanguages.length > 0 ? Math.max(...studentLanguages.map(sl => sl.id)) + 1 : 1
    const newStudentLanguage = { id: newId, ...studentLanguage }
    studentLanguages.push(newStudentLanguage)
    saveStudentLanguageList(studentLanguages)

    return newStudentLanguage
}

export function updateStudentLanguage(studentId, languageCode, updatedInfo) {
    const studentLanguages = getStudentLanguageList()

    const index = studentLanguages.findIndex(sl => sl.studentId === studentId && sl.languageCode === languageCode)
    if (index === -1) {
        return null
    }
    studentLanguages[index] = { ...studentLanguages[index], ...updatedInfo }
    saveStudentLanguageList(studentLanguages)
    return studentLanguages[index]
}

export function deleteStudentLanguage(studentId, languageCode) {
    const studentLanguages = getStudentLanguageList()

    const index = studentLanguages.findIndex(sl => sl.studentId === studentId && sl.languageCode === languageCode)
    if (index === -1) {
        return false
    }
    studentLanguages.splice(index, 1)
    saveStudentLanguageList(studentLanguages)
    return true
}
