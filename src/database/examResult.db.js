import mockExamResults from '../mocks/examResults.js'

const EXAM_RESULT_KEY = 'examResults'

function getExamResultList() {
    return JSON.parse(localStorage.getItem(EXAM_RESULT_KEY))
}

function saveExamResultList(list) {
    localStorage.setItem(EXAM_RESULT_KEY, JSON.stringify(list))
}
function initExamResultDB() {
    const existing = getExamResultList()
    if (!existing || existing.length === 0) {
        saveExamResultList(mockExamResults)
    }
}
initExamResultDB()

export function getExamResultByStudentId(studentId) {
    const examResults = getExamResultList()
    return examResults.filter(examResult => examResult.studentId === studentId)
}
