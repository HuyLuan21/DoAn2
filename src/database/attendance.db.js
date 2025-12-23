import attendances from '../mocks/attendances.js'

const ATTENDANCE_KEY = 'attendances'

function getAttendances() {
    return JSON.parse(localStorage.getItem(ATTENDANCE_KEY))
}

function saveAttendances(attendanceList) {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendanceList))
}

function initAttendanceDB() {
    const existing = getAttendances()
    if (!existing) {
        saveAttendances(attendances)
    }
}
initAttendanceDB()

export function getAllAttendances() {
    return getAttendances()
}

export function getAttendanceById(attendenceId) {
    const attendanceList = getAttendances()
    return attendanceList.find(a => a.attendenceId === attendenceId)
}

export function getAttendancesByScheduleId(scheduleId) {
    const attendanceList = getAttendances()
    return attendanceList.filter(a => a.scheduleId === scheduleId)
}

export function getAttendanceByScheduleAndStudent(scheduleId, studentId) {
    const attendanceList = getAttendances()
    return attendanceList.find(a => a.scheduleId === scheduleId && a.studentId === studentId)
}

export function addAttendance(attendanceInfo) {
    const attendanceList = getAttendances()
    const newId = attendanceList.length > 0 ? Math.max(...attendanceList.map(a => a.attendenceId)) + 1 : 1
    const newAttendance = { attendenceId: newId, ...attendanceInfo }
    attendanceList.push(newAttendance)
    saveAttendances(attendanceList)
    return newAttendance
}

export function updateAttendance(attendenceId, updatedInfo) {
    const attendanceList = getAttendances()
    const index = attendanceList.findIndex(a => a.attendenceId === attendenceId)
    if (index === -1) {
        return null
    }
    attendanceList[index] = { ...attendanceList[index], ...updatedInfo }
    saveAttendances(attendanceList)
    return attendanceList[index]
}

export function deleteAttendance(attendenceId) {
    const attendanceList = getAttendances()
    const index = attendanceList.findIndex(a => a.attendenceId === attendenceId)
    if (index === -1) {
        return false
    }
    attendanceList.splice(index, 1)
    saveAttendances(attendanceList)
    return true
}

// Bulk update attendances for a schedule
export function bulkUpdateAttendances(attendanceUpdates) {
    const attendanceList = getAttendances()

    attendanceUpdates.forEach(update => {
        const { scheduleId, studentId, status } = update
        const existing = attendanceList.find(a => a.scheduleId === scheduleId && a.studentId === studentId)

        if (existing) {
            existing.status = status
        } else {
            const newId = attendanceList.length > 0 ? Math.max(...attendanceList.map(a => a.attendenceId)) + 1 : 1
            attendanceList.push({
                attendenceId: newId,
                scheduleId,
                studentId,
                status,
            })
        }
    })

    saveAttendances(attendanceList)
    return true
}
