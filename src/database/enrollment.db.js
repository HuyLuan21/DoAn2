import mockEnrollments from '../mocks/enrollments.js'

const ENROLLMENT_KEY = 'enrollments'

function getEnrollmentList() {
    return JSON.parse(localStorage.getItem(ENROLLMENT_KEY))
}

function saveEnrollmentList(list) {
    localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(list))
}

function initEnrollmentDB() {
    const existing = getEnrollmentList()
    if (!existing) {
        saveEnrollmentList(mockEnrollments)
    }
}

initEnrollmentDB()

export function getAllEnrollments() {
    return getEnrollmentList()
}

export function getEnrollmentById(id) {
    const enrollments = getEnrollmentList()
    return enrollments.find(enrollment => enrollment.enrollmentId === id) || null
}

export function addEnrollment(enrollment) {
    const enrollments = getEnrollmentList()
    const newId = enrollments.length > 0 ? Math.max(...enrollments.map(e => e.enrollmentId)) + 1 : 1
    const newEnrollment = { enrollmentId: newId, ...enrollment }
    enrollments.push(newEnrollment)
    saveEnrollmentList(enrollments)
    return newEnrollment
}

export function updateEnrollment(id, updatedInfo) {
    const enrollments = getEnrollmentList()

    const index = enrollments.findIndex(enrollment => enrollment.enrollmentId === id)
    if (index === -1) {
        return null
    }
    enrollments[index] = { ...enrollments[index], ...updatedInfo }

    saveEnrollmentList(enrollments)
    return enrollments[index]
}

export function deleteEnrollment(id) {
    const enrollments = getEnrollmentList()

    const index = enrollments.findIndex(enrollment => enrollment.enrollmentId === id)
    if (index === -1) {
        return false
    }
    enrollments.splice(index, 1)

    saveEnrollmentList(enrollments)
    return true
}

export function getEnrollmentCountByClassId(classId) {
    const enrollments = getEnrollmentList()
    return enrollments.filter(enrollment => enrollment.classId === classId).length
}

export function getStudentListByClassId(classId) {
    const enrollments = getEnrollmentList()
    return enrollments
        .filter(
            enrollment =>
                enrollment.classId === classId &&
                (enrollment.status === 'learning' ||
                    enrollment.status === 'completed' ||
                    enrollment.status === 'failed')
        )
        .map(enrollment => enrollment.studentId)
}

