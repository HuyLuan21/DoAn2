import mockExamParts from '../mocks/examParts.js'

const EXAM_PART_KEY = 'examParts'

function getExamPartList() {
    return JSON.parse(localStorage.getItem(EXAM_PART_KEY))
}

function saveExamPartList(list) {
    localStorage.setItem(EXAM_PART_KEY, JSON.stringify(list))
}

function initExamPartDB() {
    const existing = getExamPartList()
    if (!existing || existing.length === 0) {
        saveExamPartList(mockExamParts)
    }
}
initExamPartDB()

/**
 * Lấy danh sách các phần (parts) của một bài thi
 * @param {number} examId - ID của bài thi
 * @returns {Array} Danh sách các parts (Listening, Reading, Writing, Speaking...)
 */
export function getExamPartsByExamId(examId) {
    const examParts = getExamPartList()
    return examParts.filter(part => part.examId === examId)
}

/**
 * Lấy thông tin một part theo ID
 * @param {number} partId - ID của part
 * @returns {Object|null} Thông tin part hoặc null
 */
export function getExamPartById(partId) {
    const examParts = getExamPartList()
    return examParts.find(part => part.partId === partId) || null
}
