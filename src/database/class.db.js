import classes from '../mocks/classes.js'

const CLASS_KEY = 'classes'

function getClasses() {
    return JSON.parse(localStorage.getItem(CLASS_KEY))
}

function saveClasses(classes) {
    localStorage.setItem(CLASS_KEY, JSON.stringify(classes))
}

function initClassDB() {
    const existing = getClasses()
    if (!existing) {
        saveClasses(classes)
    }
}
initClassDB()

export function getAllClasses() {
    return getClasses()
}

export function getClassById(classId) {
    const classes = getClasses()
    return classes.find(c => c.classId === classId)
}

export function addClass(classInfo) {
    const classes = getClasses()
    const newId = classes.length > 0 ? Math.max(...classes.map(c => c.classId)) + 1 : 1
    const newClass = { classId: newId, ...classInfo }
    classes.push(newClass)
    saveClasses(classes)

    return newClass
}

export function updateClass(classId, updatedInfo) {
    const classes = getClasses()

    const index = classes.findIndex(c => c.classId === classId)
    if (index === -1) {
        return null
    }
    classes[index] = { ...classes[index], ...updatedInfo }
    saveClasses(classes)
    return classes[index]
}

export function deleteClass(classId) {
    const classes = getClasses()

    const index = classes.findIndex(c => c.classId === classId)
    if (index === -1) {
        return false
    }
    classes.splice(index, 1)
    saveClasses(classes)
    return true
}

export function getClassesByTeacherId(teacherId) {
    const classes = getClasses()
    return classes.filter(cls => cls.teacherId === teacherId)
}

export function getClassesByCourseId(courseId) {
    const classes = getClasses()
    return classes.filter(cls => cls.courseId === courseId)
}
