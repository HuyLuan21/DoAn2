import mockExamPartResults from '../mocks/examPartResults.js'

const EXAM_PART_RESULT_KEY = 'examPartResults'

function getExamPartResultList() {
    return JSON.parse(localStorage.getItem(EXAM_PART_RESULT_KEY))
}

function saveExamPartResultList(list) {
    localStorage.setItem(EXAM_PART_RESULT_KEY, JSON.stringify(list))
}

function initExamPartResultDB() {
    const existing = getExamPartResultList()
    if (!existing || existing.length === 0) {
        saveExamPartResultList(mockExamPartResults)
    }
}
initExamPartResultDB()

/**
 * Lấy điểm các phần theo examResultId
 * @param {number} examResultId - ID của exam result
 * @returns {Array} Danh sách điểm từng phần
 */
export function getExamPartResultsByResultId(examResultId) {
    const results = getExamPartResultList()
    return results.filter(r => r.examResultId === examResultId)
}

/**
 * Lấy điểm một phần cụ thể
 * @param {number} examResultId - ID của exam result
 * @param {number} examPartId - ID của exam part
 * @returns {Object|null} Điểm phần đó hoặc null
 */
export function getExamPartResult(examResultId, examPartId) {
    const results = getExamPartResultList()
    return results.find(r => r.examResultId === examResultId && r.examPartId === examPartId) || null
}

/**
 * Lưu hoặc cập nhật điểm một phần
 * @param {number} examResultId - ID của exam result
 * @param {number} examPartId - ID của exam part
 * @param {number} score - Điểm số
 * @returns {Object} Record đã lưu
 */
export function saveOrUpdatePartResult(examResultId, examPartId, score) {
    const results = getExamPartResultList()
    const existingIndex = results.findIndex(r => r.examResultId === examResultId && r.examPartId === examPartId)

    if (existingIndex !== -1) {
        // Update existing
        results[existingIndex].score = score
        saveExamPartResultList(results)
        return results[existingIndex]
    } else {
        // Create new
        const newId = results.length > 0 ? Math.max(...results.map(r => r.examPartResultId)) + 1 : 1
        const newRecord = {
            examPartResultId: newId,
            examResultId,
            examPartId,
            score,
        }
        results.push(newRecord)
        saveExamPartResultList(results)
        return newRecord
    }
}

/**
 * Xóa tất cả điểm parts của một exam result
 * @param {number} examResultId - ID của exam result
 */
export function deletePartResultsByResultId(examResultId) {
    const results = getExamPartResultList()
    const filtered = results.filter(r => r.examResultId !== examResultId)
    saveExamPartResultList(filtered)
}
