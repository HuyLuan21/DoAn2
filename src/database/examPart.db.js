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

/**
 * Thêm exam part mới
 * @param {Object} partData - Dữ liệu exam part
 * @returns {Object} Part vừa được tạo
 */
export function addExamPart(partData) {
    const parts = getExamPartList()
    const newId = parts.length > 0 ? Math.max(...parts.map(p => p.partId)) + 1 : 1
    const newPart = { partId: newId, ...partData }
    parts.push(newPart)
    saveExamPartList(parts)
    return newPart
}

/**
 * Thêm nhiều exam parts cho một exam
 * @param {number} examId - ID của exam
 * @param {Array} partsArray - Mảng các part data
 * @returns {Array} Các parts vừa được tạo
 */
export function addExamParts(examId, partsArray) {
    const parts = getExamPartList()
    let nextId = parts.length > 0 ? Math.max(...parts.map(p => p.partId)) + 1 : 1

    const newParts = partsArray.map(partData => ({
        partId: nextId++,
        examId: examId,
        ...partData,
    }))

    parts.push(...newParts)
    saveExamPartList(parts)
    return newParts
}

/**
 * Cập nhật exam part
 * @param {number} partId - ID của part cần cập nhật
 * @param {Object} partData - Dữ liệu mới
 * @returns {Object|null} Part đã được cập nhật hoặc null
 */
export function updateExamPart(partId, partData) {
    const parts = getExamPartList()
    const index = parts.findIndex(p => p.partId === partId)
    if (index === -1) {
        return null
    }
    parts[index] = { ...parts[index], ...partData }
    saveExamPartList(parts)
    return parts[index]
}

/**
 * Xóa exam part
 * @param {number} partId - ID của part cần xóa
 * @returns {boolean} true nếu xóa thành công
 */
export function deleteExamPart(partId) {
    const parts = getExamPartList()
    const index = parts.findIndex(p => p.partId === partId)
    if (index === -1) {
        return false
    }
    parts.splice(index, 1)
    saveExamPartList(parts)
    return true
}

/**
 * Xóa tất cả parts của một exam
 * @param {number} examId - ID của exam
 * @returns {boolean} true nếu xóa thành công
 */
export function deleteExamPartsByExamId(examId) {
    const parts = getExamPartList()
    const filteredParts = parts.filter(p => p.examId !== examId)
    saveExamPartList(filteredParts)
    return true
}
