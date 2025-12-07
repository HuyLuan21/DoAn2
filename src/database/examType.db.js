import mockExamTypes from '../mocks/examTypes.js'

const EXAM_TYPE_KEY = 'examTypes'

function getExamTypeList() {
    return JSON.parse(localStorage.getItem(EXAM_TYPE_KEY))
}

function saveExamTypeList(list) {
    localStorage.setItem(EXAM_TYPE_KEY, JSON.stringify(list))
}
function initExamTypeDB() {
    const existing = getExamTypeList()
    if (!existing || existing.length === 0) {
        saveExamTypeList(mockExamTypes)
    }
}
initExamTypeDB()


export function getExamTypeList() {
    return JSON.parse(localStorage.getItem(EXAM_TYPE_KEY))
}

