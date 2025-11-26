import student_languages from '../mocks/student_languages.js'
import mockTeacheranguages from '../mocks/teacher_languages.js'

const TEACHER_LANGUAGE_KEY = 'teacher_languages'

function getTeacherLanguageList() {
    return JSON.parse(localStorage.getItem(TEACHER_LANGUAGE_KEY))
}

function saveTeacherLanguageList(list) {
    localStorage.setItem(TEACHER_LANGUAGE_KEY, JSON.stringify(list))
}

function initTeacherLanguageDB() {
    const existing = getTeacherLanguageList()
    if (!existing) {
        saveStudentLanguageList(mockTeacheranguages)
    }
}
initTeacherLanguageDB()

export function getAllTeacherLanguages() {
    return getTeacherLanguageList()
}

export function getTeacherLanguageById(teacherId) {
    const teacherLanguages = getTeacherLanguageList()
    return teacherLanguages.filter(tl => tl.teacherId === teacherId)
}

export function addTeacherLanguage(teacherLanguage) {
    const teacherLanguages = getTeacherLanguageList()
    const newId = teacherLanguages.length > 0 ? Math.max(...teacherLanguages.map(tl => tl.id)) + 1 : 1
    const newTeacherLanguage = { id: newId, ...teacherLanguage }
    teacherLanguages.push(newTeacherLanguage)
    saveTeacherLanguageList()
}

export function deleteTeacherLanguage(teacherId, languageCode) {
    const teacherLanguages = getTeacherLanguageList()

    const index = teacherLanguages.findIndex(tl => tl.teacherId === teacherId && tl.languageCode === languageCode)
    if (index === -1) {
        return false
    }
    teacherLanguages.splice(index, 1)
    saveTeacherLanguageList(teacherLanguages)
    return true
}
