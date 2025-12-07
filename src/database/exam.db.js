import mockExams from '../mocks/exams.js'

const EXAM_KEY = 'exams'

function getExamList() {
    return JSON.parse(localStorage.getItem(EXAM_KEY))
}

function saveExamList(list) {
    localStorage.setItem(EXAM_KEY, JSON.stringify(list))
}

function initExamDB() {
    const existing = getExamList()
    if (!existing) {
        saveExamList(mockExams)
    }
}
initExamDB()

export function getExamsByClassId(classId) {
    const exams = getExamList()
    return exams.filter(exam => exam.classId === classId)
}
