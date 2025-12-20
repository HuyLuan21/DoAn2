import classSchedules from '../mocks/classSchedules.js'
const classSchedules_KEY = 'classSchedules'

function getScheduleList() {
    return JSON.parse(localStorage.getItem(classSchedules_KEY))
}
function saveScheduleList(list) {
    localStorage.setItem(classSchedules_KEY, JSON.stringify(list))
}
function initScheduleDB() {
    const existing = getScheduleList()
    if (!existing) {
        saveScheduleList(classSchedules)
    }
}
initScheduleDB()
export function getAllSchedules() {
    return getScheduleList()
}
export function getScheduleById(id) {
    const schedules = getScheduleList()
    return schedules.find(schedule => schedule.id === id) || null
}
export function addSchedule(schedule) {
    const schedules = getScheduleList()
    const newId = schedules.length > 0 ? Math.max(...schedules.map(c => c.scheduleId)) + 1 : 1
    const newSchedule = { scheduleId: newId, ...schedule }
    schedules.push(newSchedule)
    saveScheduleList(schedules)
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
