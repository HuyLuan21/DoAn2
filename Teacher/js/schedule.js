// Import mock data
import classes from '../../src/mocks/classes.js'
import classSchedules from '../../src/mocks/classSchedules.js'
import exams from '../../src/mocks/exams.js'
import teachers from '../../src/mocks/teachers.js'

// State management
let currentView = 'today' // 'today', 'week', 'month'
let currentFilter = 'all' // 'all', 'teaching', 'exam'
let selectedDate = new Date(2025, 11, 8) // December 8, 2025 - default to today
const currentTeacherId = 1 // Assume logged-in teacher ID is 1

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners()
    renderSchedule()
})

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.schedule-tab')
    tabButtons.forEach(button => {
        button.addEventListener('click', e => {
            const view = e.currentTarget.dataset.view
            switchView(view)
        })
    })

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn')
    filterButtons.forEach(button => {
        button.addEventListener('click', e => {
            const filter = e.currentTarget.dataset.filter
            switchFilter(filter)
        })
    })

    // Date picker
    const datePicker = document.getElementById('schedule-date-picker')
    if (datePicker) {
        datePicker.addEventListener('change', e => {
            const value = e.target.value // Format: YYYY-MM-DD
            const [year, month, day] = value.split('-').map(Number)
            selectedDate = new Date(year, month - 1, day)

            renderSchedule()
        })
    }
}

// Switch view (today/week/month)
function switchView(view) {
    currentView = view

    // Reset to actual today when switching views
    // This ensures "Hôm nay", "Tuần này", "Tháng này" always show current date/week/month
    selectedDate = new Date(2025, 11, 8) // December 8, 2025 - today

    // Update active tab
    document.querySelectorAll('.schedule-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === view)
    })

    renderSchedule()
}

// Switch filter (all/teaching/exam)
function switchFilter(filter) {
    currentFilter = filter

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter)
    })

    renderSchedule()
}

// Main render function
function renderSchedule() {
    const contentEl = document.getElementById('schedule-content')

    // Update header title and subtitle
    updateHeader()

    // Get schedule items based on current view and filter
    const scheduleItems = getFilteredScheduleItems()

    // Render based on view type
    if (scheduleItems.length === 0) {
        contentEl.innerHTML = `
            <div class="schedule-empty">
                <i class="fa-solid fa-calendar-xmark"></i>
                <p>Không có lịch trình nào</p>
            </div>
        `
        return
    }

    if (currentView === 'month') {
        renderMonthView(scheduleItems, contentEl)
    } else {
        renderTimelineView(scheduleItems, contentEl)
    }
}

// Update header based on current view
function updateHeader() {
    const titleEl = document.getElementById('schedule-date-title')
    const subtitleEl = document.getElementById('schedule-date-subtitle')
    const datePickerEl = document.getElementById('schedule-date-picker')
    const today = new Date(2025, 11, 8) // December 8, 2025

    // Update date picker to reflect selected date
    if (datePickerEl) {
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.getDate()).padStart(2, '0')
        datePickerEl.value = `${year}-${month}-${day}`
    }

    if (currentView === 'today') {
        // Check if selected date is today
        const isToday = isSameDay(selectedDate, today)
        titleEl.textContent = isToday ? 'Hôm nay' : 'Ngày đã chọn'
        subtitleEl.textContent = formatDateFull(selectedDate)
    } else if (currentView === 'week') {
        titleEl.textContent = 'Tuần này'
        const { start, end } = getWeekRange(selectedDate)
        subtitleEl.textContent = `${formatDateShort(start)} - ${formatDateShort(end)}`
    } else {
        titleEl.textContent = 'Tháng này'
        subtitleEl.textContent = `Tháng ${selectedDate.getMonth() + 1}, ${selectedDate.getFullYear()}`
    }
}

// Get filtered schedule items
function getFilteredScheduleItems() {
    // Combine teaching sessions and exams
    let items = []

    // Add teaching sessions
    const teachingSessions = classSchedules
        .map(schedule => {
            const classInfo = classes.find(c => c.classId === schedule.classId)
            if (!classInfo || classInfo.teacherId !== currentTeacherId) return null

            return {
                type: 'teaching',
                date: new Date(schedule.studyDate),
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                title: classInfo.className,
                room: schedule.room,
                classInfo: classInfo,
            }
        })
        .filter(item => item !== null)

    // Add exam proctoring sessions
    const examSessions = exams
        .filter(exam => exam.teacherId === currentTeacherId)
        .map(exam => ({
            type: 'exam',
            date: new Date(exam.examDate),
            startTime: exam.startTime,
            endTime: exam.endTime,
            title: exam.examName,
            room: exam.room,
            examInfo: exam,
        }))

    items = [...teachingSessions, ...examSessions]

    // Filter by date range based on view
    if (currentView === 'today') {
        items = items.filter(item => isSameDay(item.date, selectedDate))
    } else if (currentView === 'week') {
        const { start, end } = getWeekRange(selectedDate)
        items = items.filter(item => item.date >= start && item.date <= end)
    } else if (currentView === 'month') {
        items = items.filter(
            item =>
                item.date.getMonth() === selectedDate.getMonth() &&
                item.date.getFullYear() === selectedDate.getFullYear()
        )
    }

    // Filter by type
    if (currentFilter === 'teaching') {
        items = items.filter(item => item.type === 'teaching')
    } else if (currentFilter === 'exam') {
        items = items.filter(item => item.type === 'exam')
    }

    // Sort by date and time (nearest to farthest)
    items.sort((a, b) => {
        const dateCompare = a.date - b.date
        if (dateCompare !== 0) return dateCompare
        return a.startTime.localeCompare(b.startTime)
    })

    return items
}

// Render timeline view (for today and week)
function renderTimelineView(items, container) {
    // For week view, group by day. For today view, show as flat list
    if (currentView === 'week') {
        const html = `
            <div class="schedule-timeline">
                ${groupItemsByDay(items)}
            </div>
        `
        container.innerHTML = html
    } else {
        const html = `
            <div class="schedule-timeline">
                ${items.map(item => createScheduleItemCard(item)).join('')}
            </div>
        `
        container.innerHTML = html
    }
}

// Render month view (grouped by weeks)
function renderMonthView(items, container) {
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)

    // Group items by week
    const weeks = []
    let currentWeekStart = getWeekStart(firstDay)

    while (currentWeekStart <= lastDay) {
        const weekEnd = new Date(currentWeekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)

        const weekItems = items.filter(item => item.date >= currentWeekStart && item.date <= weekEnd)

        if (weekItems.length > 0) {
            weeks.push({
                start: new Date(currentWeekStart),
                end: weekEnd > lastDay ? lastDay : weekEnd,
                items: weekItems,
            })
        }

        currentWeekStart.setDate(currentWeekStart.getDate() + 7)
    }

    const html = `
        <div class="schedule-month-view">
            ${weeks
                .map(
                    (week, index) => `
                <div class="schedule-week-group">
                    <div class="schedule-week-group__header">
                        Tuần ${index + 1} (${formatDateShort(week.start)} - ${formatDateShort(week.end)})
                    </div>
                    ${groupItemsByDay(week.items)}
                </div>
            `
                )
                .join('')}
        </div>
    `
    container.innerHTML = html
}

// Group items by day for month view
function groupItemsByDay(items) {
    const groupedByDay = {}

    items.forEach(item => {
        const dayKey = item.date.toISOString().split('T')[0]
        if (!groupedByDay[dayKey]) {
            groupedByDay[dayKey] = {
                date: item.date,
                items: [],
            }
        }
        groupedByDay[dayKey].items.push(item)
    })

    return Object.values(groupedByDay)
        .map(
            day => `
            <div class="schedule-day-group">
                <div class="schedule-day-group__date">${formatDateFull(day.date)}</div>
                ${day.items.map(item => createScheduleItemCard(item)).join('')}
            </div>
        `
        )
        .join('')
}

// Create schedule item card HTML
function createScheduleItemCard(item) {
    const icon = item.type === 'teaching' ? 'fa-chalkboard-user' : 'fa-clipboard-list'
    const typeLabel = item.type === 'teaching' ? 'Giảng dạy' : 'Coi thi'

    return `
        <div class="schedule-item ${item.type}">
            <div class="schedule-item__icon">
                <i class="fa-solid ${icon}"></i>
            </div>
            <div class="schedule-item__content">
                <div class="schedule-item__header">
                    <h4 class="schedule-item__title">${item.title}</h4>
                    <span class="schedule-item__type">${typeLabel}</span>
                </div>
                <div class="schedule-item__details">
                    <div class="schedule-item__detail">
                        <i class="fa-regular fa-clock"></i>
                        <span>${item.startTime} - ${item.endTime}</span>
                    </div>
                    <div class="schedule-item__detail">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${item.room}</span>
                    </div>
                </div>
            </div>
        </div>
    `
}

// ==================== Date Utility Functions ====================

function formatDateFull(date) {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    const day = days[date.getDay()]
    const dateStr = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}, ${dateStr}/${month}/${year}`
}

function formatDateShort(date) {
    const dateStr = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${dateStr}/${month}`
}

function isSameDay(date1, date2) {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    )
}

function getWeekStart(date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    return new Date(d.setDate(diff))
}

function getWeekRange(date) {
    const start = getWeekStart(date)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return { start, end }
}

// Get ISO week number from date
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}

// Get date (Monday) from ISO year and week number
function getDateFromWeek(year, week) {
    const simple = new Date(year, 0, 1 + (week - 1) * 7)
    const dow = simple.getDay()
    const ISOweekStart = simple
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    return ISOweekStart
}
