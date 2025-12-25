import classSchedules from '../mocks/classSchedules.js'

const CLASS_SCHEDULE_KEY = 'classSchedules'

function getClassSchedules() {
    return JSON.parse(localStorage.getItem(CLASS_SCHEDULE_KEY))
}

function saveClassSchedules(schedules) {
    localStorage.setItem(CLASS_SCHEDULE_KEY, JSON.stringify(schedules))
}

function initClassScheduleDB() {
    const existing = getClassSchedules()
    if (!existing) {
        saveClassSchedules(classSchedules)
    }
}
initClassScheduleDB()

export function getAllClassSchedules() {
    return getClassSchedules()
}

export function getScheduleById(scheduleId) {
    const schedules = getClassSchedules()
    return schedules.find(s => s.scheduleId === scheduleId)
}

export function getSchedulesByClassId(classId) {
    const schedules = getClassSchedules()
    return schedules.filter(s => s.classId === classId)
}

export function addSchedule(scheduleInfo) {
    const schedules = getClassSchedules()
    const newId = schedules.length > 0 ? Math.max(...schedules.map(s => s.scheduleId)) + 1 : 1
    const newSchedule = { scheduleId: newId, ...scheduleInfo }
    schedules.push(newSchedule)
    saveClassSchedules(schedules)
    return newSchedule
}

export function updateSchedule(scheduleId, updatedInfo) {
    const schedules = getClassSchedules()
    const index = schedules.findIndex(s => s.scheduleId === scheduleId)
    if (index === -1) {
        return null
    }
    schedules[index] = { ...schedules[index], ...updatedInfo }
    saveClassSchedules(schedules)
    return schedules[index]
}


export function deleteSchedule(scheduleId) {
    const schedules = getClassSchedules()
    const index = schedules.findIndex(s => s.scheduleId === scheduleId)
    if (index === -1) {
        return false
    }
    schedules.splice(index, 1)
    saveClassSchedules(schedules)
    return true
}


