import mockSchedules from '../mocks/classSchedules.js'

const SCHEDULE_KEY = 'classSchedules'

function getScheduleList() {
    return JSON.parse(localStorage.getItem(SCHEDULE_KEY))
}

function saveScheduleList(list) {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(list))
}

function initScheduleDB() {
    const existing = getScheduleList()
    if (!existing) {
        saveScheduleList(mockSchedules)
    }
}
initScheduleDB()

export function getAllSchedules() {
    return getScheduleList()
}

export function getScheduleById(id) {
    const schedules = getScheduleList()
    return schedules.find(schedule => schedule.scheduleId === Number(id)) || null
}

export function getSchedulesByClassId(classId) {
    const schedules = getScheduleList() || []
    return schedules.filter(schedule => schedule.classId === Number(classId))
}

export function addSchedule(schedule) {
    const schedules = getScheduleList()
    const newId = schedules.length > 0 ? Math.max(...schedules.map(s => s.scheduleId)) + 1 : 1
    const newSchedule = { scheduleId: newId, ...schedule }
    schedules.push(newSchedule)
    saveScheduleList(schedules)
    return newSchedule
}

export function updateSchedule(id, updatedInfo) {
    const schedules = getScheduleList()
    const index = schedules.findIndex(schedule => schedule.scheduleId === Number(id))
    if (index === -1) {
        return null
    }
    schedules[index] = { ...schedules[index], ...updatedInfo }
    saveScheduleList(schedules)
    return schedules[index]
}

export function deleteSchedule(id) {
    const schedules = getScheduleList()
    const index = schedules.findIndex(schedule => schedule.scheduleId === Number(id))
    if (index === -1) {
        return false
    }
    schedules.splice(index, 1)
    saveScheduleList(schedules)
    return true
}
