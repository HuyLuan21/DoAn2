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

/**
 * Lấy thông tin một bài thi theo ID
 * @param {number} examId - ID của bài thi
 * @returns {Object|null} Thông tin bài thi hoặc null
 */
export function getExamById(examId) {
    const exams = getExamList()
    return exams.find(exam => exam.examId === examId) || null
}
