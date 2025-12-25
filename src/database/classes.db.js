import mockClasses from '../mocks/classes.js'
const CLASS_KEY = 'classes'
function getclassList() {
    return JSON.parse(localStorage.getItem(CLASS_KEY))
}
function saveclassList(list) {
    localStorage.setItem(CLASS_KEY, JSON.stringify(list))
}
function initClassDB() {
    const existing = getclassList()
    if (!existing) {
        saveclassList(mockClasses)
    }
}
initClassDB()
export function getAllClasses() {
    return getclassList()
}
export function getClassById(id) {
    const classes = getclassList()
    return classes.find(cls => cls.classId === id) || null
}
export function addClass(cls) {
    const classes = getclassList()
    const newId = classes.length > 0 ? Math.max(...classes.map(c => c.classId)) + 1 : 1
    const newClass = { classId: newId, ...cls }
    classes.push(newClass)
    saveclassList(classes)
    return newClass
}
export function updateClass(id, updatedInfo) {
    const classes = getclassList()
    const index = classes.findIndex(cls => cls.classId === id)
    if (index === -1) {
        return null
    }
    classes[index] = { ...classes[index], ...updatedInfo }
    saveclassList(classes)
    return classes[index]
}
export function deleteClass(id) {
    const classes = getclassList()
    const index = classes.findIndex(cls => cls.classId === id)
    if (index === -1) {
        return false
    }
    classes.splice(index, 1)
    saveclassList(classes)
    return true
}
