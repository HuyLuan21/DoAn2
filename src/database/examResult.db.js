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

/**
 * Lấy exam result của một học sinh cho một bài thi cụ thể
 * @param {number} studentId - ID học sinh
 * @param {number} examId - ID bài thi
 * @returns {Object|null} Exam result hoặc null
 */
export function getExamResultByStudentAndExam(studentId, examId) {
    const examResults = getExamResultList()
    return examResults.find(r => r.studentId === studentId && r.examId === examId) || null
}

/**
 * Tạo hoặc cập nhật exam result
 * @param {number} examId - ID bài thi
 * @param {number} studentId - ID học sinh
 * @param {number|null} totalScore - Điểm tổng (có thể null)
 * @returns {Object} Exam result đã lưu
 */
export function createOrUpdateExamResult(examId, studentId, totalScore = null) {
    const results = getExamResultList()
    const existingIndex = results.findIndex(r => r.examId === examId && r.studentId === studentId)

    if (existingIndex !== -1) {
        // Update existing
        if (totalScore !== null) {
            results[existingIndex].totalScore = totalScore
        }
        saveExamResultList(results)
        return results[existingIndex]
    } else {
        // Create new
        const newId = results.length > 0 ? Math.max(...results.map(r => r.resultId)) + 1 : 1
        const newRecord = {
            resultId: newId,
            examId,
            studentId,
            totalScore,
        }
        results.push(newRecord)
        saveExamResultList(results)
        return newRecord
    }
}

/**
 * Lấy tất cả exam results của một bài thi
 * @param {number} examId - ID bài thi
 * @returns {Array} Danh sách exam results
 */
export function getExamResultsByExamId(examId) {
    const examResults = getExamResultList()
    return examResults.filter(r => r.examId === examId)
}
