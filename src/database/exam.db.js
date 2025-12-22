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

/**
 * Lấy tất cả các bài thi
 * @returns {Array} Danh sách tất cả bài thi
 */
export function getAllExams() {
    return getExamList() || []
}

export function getExamsByClassId(classId) {
    const exams = getExamList()
    return exams.filter(exam => exam.classId === classId)
}

/**
 * Lấy các bài thi theo teacherId
 * @param {number} teacherId - ID của giáo viên
 * @returns {Array} Danh sách bài thi của giáo viên
 */
export function getExamsByTeacherId(teacherId) {
    const exams = getExamList()
    return exams.filter(exam => exam.teacherId === teacherId)
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

/**
 * Thêm bài thi mới
 * @param {Object} examData - Dữ liệu bài thi mới
 * @returns {Object} Bài thi vừa được tạo
 */
export function addExam(examData) {
    const exams = getExamList()
    const newId = exams.length > 0 ? Math.max(...exams.map(e => e.examId)) + 1 : 1
    const newExam = { examId: newId, ...examData }
    exams.push(newExam)
    saveExamList(exams)
    return newExam
}

/**
 * Cập nhật thông tin bài thi
 * @param {number} examId - ID của bài thi cần cập nhật
 * @param {Object} examData - Dữ liệu mới
 * @returns {Object|null} Bài thi đã được cập nhật hoặc null
 */
export function updateExam(examId, examData) {
    const exams = getExamList()
    const index = exams.findIndex(e => e.examId === examId)
    if (index === -1) {
        return null
    }
    exams[index] = { ...exams[index], ...examData }
    saveExamList(exams)
    return exams[index]
}

/**
 * Xóa bài thi
 * @param {number} examId - ID của bài thi cần xóa
 * @returns {boolean} true nếu xóa thành công, false nếu không tìm thấy
 */
export function deleteExam(examId) {
    const exams = getExamList()
    const index = exams.findIndex(e => e.examId === examId)
    if (index === -1) {
        return false
    }
    exams.splice(index, 1)
    saveExamList(exams)
    return true
}
