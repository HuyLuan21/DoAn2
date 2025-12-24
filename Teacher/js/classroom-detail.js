import { getStudentById } from '../../src/database/student.db.js'
import { getClassById } from '../../src/database/class.db.js'
import { getStudentListByClassId } from '../../src/database/enrollment.db.js'
import { getExamsByClassId } from '../../src/database/exam.db.js'
import { getExamResultByStudentId, getExamResultByStudentAndExam } from '../../src/database/examResult.db.js'
import { getExamPartsByExamId } from '../../src/database/examPart.db.js'
import { getExamPartResultsByResultId } from '../../src/database/examPartResult.db.js'
import { getSchedulesByClassId, getScheduleById } from '../../src/database/classSchedule.db.js'
import {
    getAttendancesByScheduleId,
    getAttendanceByScheduleAndStudent,
    bulkUpdateAttendances,
} from '../../src/database/attendance.db.js'

let currentClassId = parseInt(new URLSearchParams(window.location.search).get('classId'))

// Schedule state management
let scheduleState = {
    currentView: 'today', // 'today', 'week', 'month'
    currentFilter: 'all', // 'all', 'teaching', 'exam'
    selectedDate: new Date(), // Current date for filtering
}

const DOM = {
    currentPageName: document.querySelector('.topbar__current-page'),
    classroomSidebarItems: document.querySelectorAll('.classroom-sidebar__item'),
    classroomContentItems: document.querySelectorAll('.classroom-content__item'),
    studentList: document.querySelector('.studentList__list'),
    examResultList: document.querySelector('.grade__list'),
    studentSearchInput: document.getElementById('studentSearchInput'),
    gradeSearchInput: document.getElementById('gradeSearchInput'),

    // Schedule elements
    scheduleTimeline: document.querySelector('.schedule-timeline'),
    attendanceView: document.querySelector('.attendance-view'),
    scheduleContentWrapper: document.querySelector('.schedule-content-wrapper'),
    scheduleDateTitle: document.getElementById('schedule-date-title'),
    scheduleDateSubtitle: document.getElementById('schedule-date-subtitle'),
    scheduleDatePicker: document.getElementById('schedule-date-picker'),
    scheduleFilterBtns: document.querySelectorAll('.filter-btn'),
    scheduleTabs: document.querySelectorAll('.schedule-tab'), // Changed from scheduleSidebarTabs
}

const renderClassroomName = () => {
    const classroom = getClassById(currentClassId)
    DOM.currentPageName.textContent = classroom.className
}

const renderStudentList = () => {
    const studentList = getStudentListByClassId(currentClassId)
    DOM.studentList.innerHTML = ''

    studentList.forEach(studentId => {
        const student = getStudentById(studentId)
        if (student) {
            // Tạo avatar từ tên học sinh
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                student.fullName
            )}&background=random&size=80`

            DOM.studentList.innerHTML += `
                <li class="classroom-content__student-item">
                    <div class="classroom-content__student-item__avatar">
                        <img src="${avatarUrl}" alt="${student.fullName}">
                    </div>
                    <div class="classroom-content__student-item__info">
                        <div class="student-info__header">
                            <h3>${student.fullName}</h3>
                            <span class="student-badge student-badge--${student.status.toLowerCase()}">${
                student.status
            }</span>
                        </div>
                        <div class="student-info__details">
                            <span class="student-detail"><i class="fa-solid fa-venus-mars"></i> ${student.gender}</span>
                            <span class="student-detail"><i class="fa-solid fa-phone"></i> ${student.phone}</span>
                            ${
                                student.email
                                    ? `<span class="student-detail"><i class="fa-solid fa-envelope"></i> ${student.email}</span>`
                                    : ''
                            }
                        </div>
                    </div>
                </li>
            `
        }
    })
}

const renderExamResultList = () => {
    // Lấy danh sách học sinh và các kỳ thi của lớp
    const studentIds = getStudentListByClassId(currentClassId)
    const exams = getExamsByClassId(currentClassId)

    // Tạo table structure
    let tableHTML = `
        <table class="grade-table">
            <thead>
                <tr>
                    <th class="col-stt">STT</th>
                    <th class="col-name">Họ và tên</th>
    `

    // Tạo header cho mỗi kỳ thi
    exams.forEach(exam => {
        tableHTML += `<th class="col-exam">${exam.examName}</th>`
    })

    tableHTML += `
                    <th class="col-average">Trung bình</th>
                </tr>
            </thead>
            <tbody>
    `

    // Tạo row cho mỗi học sinh
    studentIds.forEach((studentId, index) => {
        const student = getStudentById(studentId)
        if (!student) return

        const examResults = getExamResultByStudentId(studentId)

        tableHTML += `
            <tr>
                <td class="col-stt">${index + 1}</td>
                <td class="col-name">${student.fullName}</td>
        `

        // Thêm điểm cho mỗi kỳ thi
        let totalScore = 0
        let examCount = 0

        exams.forEach(exam => {
            const result = examResults.find(r => r.examId === exam.examId)
            const score = result ? result.score || result.totalScore || 0 : null

            if (score !== null) {
                totalScore += score
                examCount++
                const scoreClass = score >= 50 ? 'score-pass' : 'score-fail'
                tableHTML += `<td class="col-exam ${scoreClass} score-clickable" 
                    data-student-id="${studentId}" 
                    data-exam-id="${exam.examId}"
                    data-student-name="${student.fullName}"
                    data-exam-name="${exam.examName}">
                    ${score}
                </td>`
            } else {
                tableHTML += `<td class="col-exam score-empty">-</td>`
            }
        })

        // Tính và hiển thị điểm trung bình
        const average = examCount > 0 ? (totalScore / examCount).toFixed(1) : '-'
        const avgClass = average !== '-' ? (average >= 50 ? 'score-pass' : 'score-fail') : 'score-empty'
        tableHTML += `<td class="col-average ${avgClass}">${average}</td>`

        tableHTML += `</tr>`
    })

    tableHTML += `
            </tbody>
        </table>
    `

    DOM.examResultList.innerHTML = tableHTML

    // Setup click listeners cho các ô điểm
    setupScoreClickListeners()
}

// ================================================= SCHEDULE RENDERING =================================================

// Main render function
const renderSchedule = () => {
    // Update header (date title, subtitle)
    updateScheduleHeader()

    // Get filtered items (teaching + exams combined)
    const scheduleItems = getFilteredScheduleItems()

    // Render based on view
    if (scheduleItems.length === 0) {
        showEmptySchedule()
        return
    }

    renderScheduleItems(scheduleItems)
}

// Get filtered schedule items (teaching sessions + exams)
const getFilteredScheduleItems = () => {
    let items = []

    // Get teaching sessions for this class
    const schedules = getSchedulesByClassId(currentClassId)
    const teachingSessions = schedules.map(schedule => ({
        type: 'teaching',
        date: new Date(schedule.studyDate),
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        title: `Buổi học ${formatDateShort(new Date(schedule.studyDate))}`,
        room: schedule.room,
        scheduleId: schedule.scheduleId,
    }))

    // Get exams for this class
    const exams = getExamsByClassId(currentClassId)
    const examSessions = exams.map(exam => ({
        type: 'exam',
        date: new Date(exam.examDate),
        startTime: exam.startTime,
        endTime: exam.endTime,
        title: exam.examName,
        room: exam.room,
        examId: exam.examId,
    }))

    items = [...teachingSessions, ...examSessions]

    // Filter by date range based on view
    items = filterByView(items, scheduleState.currentView, scheduleState.selectedDate)

    // Filter by type
    if (scheduleState.currentFilter === 'teaching') {
        items = items.filter(item => item.type === 'teaching')
    } else if (scheduleState.currentFilter === 'exam') {
        items = items.filter(item => item.type === 'exam')
    }

    // Sort by date and time
    items.sort((a, b) => {
        const dateCompare = a.date - b.date
        if (dateCompare !== 0) return dateCompare
        return a.startTime.localeCompare(b.startTime)
    })

    return items
}

// Filter by view (today/week/month)
const filterByView = (items, view, selectedDate) => {
    if (view === 'today') {
        return items.filter(item => isSameDay(item.date, selectedDate))
    } else if (view === 'week') {
        const weekRange = getWeekRange(selectedDate)
        return items.filter(item => item.date >= weekRange.start && item.date <= weekRange.end)
    } else if (view === 'month') {
        const monthRange = getMonthRange(selectedDate)
        // Month view: group by week, then by date
        DOM.scheduleTimeline.innerHTML = renderMonthView(items)
    }

    // Add click listeners ONLY to teaching cards (not exams)
    document.querySelectorAll('.schedule-item:not(.exam)').forEach(card => {
        card.addEventListener('click', () => {
            const scheduleId = parseInt(card.dataset.scheduleId)
            showAttendanceUI(scheduleId)
        })
    })
}

// Render week view (grouped by date)
const renderWeekView = items => {
    // Group by date
    const groupedByDate = {}
    items.forEach(item => {
        const dateKey = item.date.toDateString()
        if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = []
        }
        groupedByDate[dateKey].push(item)
    })

    // Render each date group
    let html = ''
    Object.keys(groupedByDate)
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach(dateKey => {
            const date = new Date(dateKey)
            const itemsForDate = groupedByDate[dateKey]

            html += `
            <div class="schedule-date-group">
                <div class="schedule-date-header">${formatDateFull(date)}</div>
                ${itemsForDate.map(item => createScheduleCard(item)).join('')}
            </div>
        `
        })

    return html
}

// Render month view (grouped by week, then by date)
const renderMonthView = items => {
    // Get class info for start date
    const classInfo = getClassById(currentClassId)
    const classStartDate = classInfo ? new Date(classInfo.startDate) : new Date()

    // Group by week number (relative to class start)
    const groupedByWeek = {}
    items.forEach(item => {
        const weekNum = getWeekNumberFromDate(item.date, classStartDate)
        if (!groupedByWeek[weekNum]) {
            groupedByWeek[weekNum] = []
        }
        groupedByWeek[weekNum].push(item)
    })

    // Render each week
    let html = ''
    Object.keys(groupedByWeek)
        .sort((a, b) => a - b)
        .forEach(weekNum => {
            const weekItems = groupedByWeek[weekNum]

            // Group items in this week by date
            const groupedByDate = {}
            weekItems.forEach(item => {
                const dateKey = item.date.toDateString()
                if (!groupedByDate[dateKey]) {
                    groupedByDate[dateKey] = []
                }
                groupedByDate[dateKey].push(item)
            })

            html += `<div class="schedule-week-group">`
            html += `<div class="schedule-week-header">Tuần ${weekNum}</div>`

            // Render each date in this week
            Object.keys(groupedByDate)
                .sort((a, b) => new Date(a) - new Date(b))
                .forEach(dateKey => {
                    const date = new Date(dateKey)
                    const itemsForDate = groupedByDate[dateKey]

                    html += `
                <div class="schedule-date-group">
                    <div class="schedule-date-header">${formatDateFull(date)}</div>
                    ${itemsForDate.map(item => createScheduleCard(item)).join('')}
                </div>
            `
                })

            html += `</div>`
        })

    return html
}

// Get week number relative to class start date
const getWeekNumberFromDate = (targetDate, classStartDate) => {
    const oneDay = 24 * 60 * 60 * 1000
    const diffDays = Math.floor((targetDate - classStartDate) / oneDay)
    return Math.ceil((diffDays + 1) / 7)
}

// Create schedule card HTML
const createScheduleCard = item => {
    const icon = item.type === 'teaching' ? 'fa-chalkboard-user' : 'fa-clipboard-list'
    const typeLabel = item.type === 'teaching' ? 'Lịch học' : 'Kiểm tra'

    return `
        <div class="schedule-item ${item.type}" 
             data-schedule-id="${item.scheduleId || ''}"
             data-exam-id="${item.examId || ''}"
             data-type="${item.type}">
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
                        <i class="fa-regular fa-calendar"></i>
                        <span>${formatDateFull(item.date)}</span>
                    </div>
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

// Show empty state
const showEmptySchedule = () => {
    DOM.scheduleTimeline.innerHTML = `
        <div class="schedule-empty">
            <i class="fa-solid fa-calendar-xmark"></i>
            <p>Không có lịch trình nào</p>
        </div>
    `
}

// Update schedule header (title và subtitle)
const updateScheduleHeader = () => {
    const today = new Date()
    const selected = scheduleState.selectedDate

    // Update title với prefix "Lịch trình - "
    if (scheduleState.currentView === 'today') {
        if (isSameDay(selected, today)) {
            DOM.scheduleDateTitle.textContent = 'Lịch trình - Hôm nay'
        } else {
            DOM.scheduleDateTitle.textContent = 'Lịch trình - Ngày đã chọn'
        }
    } else if (scheduleState.currentView === 'week') {
        DOM.scheduleDateTitle.textContent = 'Lịch trình - Tuần này'
    } else {
        DOM.scheduleDateTitle.textContent = 'Lịch trình - Tháng này'
    }

    // Update subtitle
    DOM.scheduleDateSubtitle.textContent = formatDateFull(selected)

    // Update date picker value
    DOM.scheduleDatePicker.valueAsDate = selected
}

// Date formatting helpers
const formatDateFull = date => {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    const day = days[date.getDay()]
    const dateStr = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}, ${dateStr}/${month}/${year}`
}

const formatDateShort = date => {
    const dateStr = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${dateStr}/${month}/${year}`
}

// Date comparison utilities
const isSameDay = (date1, date2) => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    )
}

const getWeekRange = date => {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Monday as first day
    const monday = new Date(date)
    monday.setDate(diff)
    monday.setHours(0, 0, 0, 0)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    return { start: monday, end: sunday }
}

const getMonthRange = date => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    end.setHours(23, 59, 59, 999)

    return { start, end }
}

// ================================================= ATTENDANCE UI =================================================

const showAttendanceUI = scheduleId => {
    const schedule = getScheduleById(scheduleId)
    if (!schedule) return

    // Hide schedule list, show attendance view
    DOM.scheduleContentWrapper.style.display = 'none'
    DOM.attendanceView.style.display = 'block'
    // DOM.backToSchedulesBtn.style.display = 'flex' // This button is not defined in DOM object

    renderAttendanceUI(scheduleId)
}

const renderAttendanceUI = scheduleId => {
    const schedule = getScheduleById(scheduleId)
    const studentIds = getStudentListByClassId(currentClassId)
    const attendances = getAttendancesByScheduleId(scheduleId)

    const date = new Date(schedule.studyDate)

    let html = `
        <div class="attendance__header">
            <h3>Điểm danh - ${formatDateFull(date)}</h3>
            <div class="attendance__info">
                <div class="attendance__info-item">
                    <i class="fa-regular fa-clock"></i>
                    <span>${schedule.startTime} - ${schedule.endTime}</span>
                </div>
                <div class="attendance__info-item">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${schedule.room}</span>
                </div>
                <div class="attendance__info-item">
                    <i class="fa-solid fa-users"></i>
                    <span>${studentIds.length} học sinh</span>
                </div>
            </div>
        </div>
        <div class="attendance-list">
    `

    studentIds.forEach(studentId => {
        const student = getStudentById(studentId)
        if (!student) return

        const existingAttendance = getAttendanceByScheduleAndStudent(scheduleId, studentId)
        const currentStatus = existingAttendance ? existingAttendance.status : 'Present'

        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            student.fullName
        )}&background=random&size=80`

        html += `
            <div class="attendance-item" data-student-id="${studentId}">
                <div class="attendance-item__student">
                    <div class="attendance-item__avatar">
                        <img src="${avatarUrl}" alt="${student.fullName}">
                    </div>
                    <span class="attendance-item__name">${student.fullName}</span>
                </div>
                <div class="attendance-status-selector">
                    <button class="status-btn present ${currentStatus === 'Present' ? 'active' : ''}" 
                            data-status="Present">
                        <i class="fa-solid fa-check"></i>
                        Có mặt
                    </button>
                    <button class="status-btn absent ${currentStatus === 'Absent' ? 'active' : ''}" 
                            data-status="Absent">
                        <i class="fa-solid fa-xmark"></i>
                        Vắng
                    </button>
                    <button class="status-btn late ${currentStatus === 'Late' ? 'active' : ''}" 
                            data-status="Late">
                        <i class="fa-solid fa-clock"></i>
                        Muộn
                    </button>
                    <button class="status-btn excused ${currentStatus === 'Excused' ? 'active' : ''}" 
                            data-status="Excused">
                        <i class="fa-solid fa-circle-info"></i>
                        Có phép
                    </button>
                </div>
            </div>
        `
    })

    html += `
        </div>
        <div class="attendance-actions">
            <button class="attendance-save-btn" id="save-attendance">
                <i class="fa-solid fa-save"></i>
                Lưu điểm danh
            </button>
        </div>
    `

    DOM.attendanceView.innerHTML = html

    // Setup event listeners for status buttons
    setupAttendanceStatusListeners()

    // Save button
    document.getElementById('save-attendance').addEventListener('click', () => {
        saveAttendances(scheduleId)
    })
}

const setupAttendanceStatusListeners = () => {
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const button = e.currentTarget
            const attendanceItem = button.closest('.attendance-item')
            const statusButtons = attendanceItem.querySelectorAll('.status-btn')

            // Remove active from all buttons in this item
            statusButtons.forEach(b => b.classList.remove('active'))

            // Add active to clicked button
            button.classList.add('active')
        })
    })
}

const saveAttendances = scheduleId => {
    const attendanceItems = document.querySelectorAll('.attendance-item')
    const attendanceUpdates = []

    attendanceItems.forEach(item => {
        const studentId = parseInt(item.dataset.studentId)
        const activeButton = item.querySelector('.status-btn.active')
        const status = activeButton ? activeButton.dataset.status : 'Present'

        attendanceUpdates.push({
            scheduleId: scheduleId,
            studentId: studentId,
            status: status,
        })
    })

    bulkUpdateAttendances(attendanceUpdates)

    // Show success message (simple alert for now)
    alert('Đã lưu điểm danh thành công!')

    // Go back to schedule list
    backToScheduleList()
}

const backToScheduleList = () => {
    DOM.scheduleContentWrapper.style.display = 'block'
    DOM.attendanceView.style.display = 'none'
    // DOM.backToSchedulesBtn.style.display = 'none' // This button is not defined in DOM object
}

// ================================================= SCORE DETAILS POPUP =================================================

/**
 * Hiển thị popup chi tiết điểm thành phần
 */
const showScoreDetails = (studentId, examId, studentName, examName, targetElement) => {
    // Xóa popup cũ nếu có
    const existingPopup = document.querySelector('.score-popup')
    if (existingPopup) {
        existingPopup.remove()
    }

    // Lấy exam result
    const examResult = getExamResultByStudentAndExam(studentId, examId)
    if (!examResult) {
        return
    }

    // Lấy exam parts và part results
    const examParts = getExamPartsByExamId(examId)
    const partResults = getExamPartResultsByResultId(examResult.resultId)

    // Tạo popup content
    let popupHTML = `
        <div class="score-popup">
            <div class="score-popup__header">
                <h4>${studentName}</h4>
                <span class="score-popup__exam">${examName}</span>
                <button class="score-popup__close">&times;</button>
            </div>
            <div class="score-popup__body">
    `

    if (examParts.length > 0) {
        popupHTML += `<ul class="score-popup__list">`

        examParts.forEach(part => {
            const partResult = partResults.find(pr => pr.examPartId === part.partId)
            const score = partResult ? partResult.score : '-'
            const weightPercent = Math.round(part.weighttage * 100)
            const scoreClass = partResult && score >= part.maxScore * 0.5 ? 'popup-score-pass' : 'popup-score-fail'

            popupHTML += `
                <li class="score-popup__item">
                    <span class="score-popup__part-name">${part.partName}</span>
                    <span class="score-popup__part-weight">${weightPercent}%</span>
                    <span class="score-popup__part-score ${scoreClass}">${score}/${part.maxScore}</span>
                </li>
            `
        })

        popupHTML += `</ul>`
    } else {
        popupHTML += `<p class="score-popup__no-parts">Kỳ thi này không có điểm thành phần</p>`
    }

    popupHTML += `
            </div>
        </div>
    `

    // Thêm popup vào body
    document.body.insertAdjacentHTML('beforeend', popupHTML)

    // Định vị popup
    const popup = document.querySelector('.score-popup')
    const rect = targetElement.getBoundingClientRect()

    popup.style.position = 'fixed'
    popup.style.top = `${rect.bottom + 8}px`
    popup.style.left = `${rect.left}px`

    // Điều chỉnh nếu popup vượt ra ngoài viewport
    const popupRect = popup.getBoundingClientRect()
    if (popupRect.right > window.innerWidth) {
        popup.style.left = `${window.innerWidth - popupRect.width - 16}px`
    }
    if (popupRect.bottom > window.innerHeight) {
        popup.style.top = `${rect.top - popupRect.height - 8}px`
    }

    // Close button
    popup.querySelector('.score-popup__close').addEventListener('click', () => {
        popup.remove()
    })

    // Click outside to close
    setTimeout(() => {
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target) && !targetElement.contains(e.target)) {
                popup.remove()
                document.removeEventListener('click', closePopup)
            }
        })
    }, 0)
}

/**
 * Setup event listeners cho các ô điểm có thể click
 */
const setupScoreClickListeners = () => {
    const scoreElements = document.querySelectorAll('.score-clickable')

    scoreElements.forEach(element => {
        element.addEventListener('click', e => {
            e.stopPropagation()
            const studentId = parseInt(element.dataset.studentId)
            const examId = parseInt(element.dataset.examId)
            const studentName = element.dataset.studentName
            const examName = element.dataset.examName

            showScoreDetails(studentId, examId, studentName, examName, element)
        })
    })
}

const setupEventListeners = () => {
    // Tab switching
    DOM.classroomSidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class từ tất cả sidebar items
            DOM.classroomSidebarItems.forEach(i => i.classList.remove('active'))
            item.classList.add('active')

            // Remove active class từ tất cả content items
            DOM.classroomContentItems.forEach(content => content.classList.remove('active'))

            // Hiển thị content tương ứng và render data
            if (item.id === 'studentList-btn') {
                document.getElementById('studentListContent').classList.add('active')
                renderStudentList()
            } else if (item.id === 'gradeList-btn') {
                document.getElementById('gradeListContent').classList.add('active')
                renderExamResultList()
            }
        })
    })

    // Schedule tabs (today/week/month) - now in navbar instead of sidebar
    DOM.scheduleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            DOM.scheduleTabs.forEach(t => t.classList.remove('active'))
            tab.classList.add('active')

            // Update state và show schedule content
            scheduleState.currentView = tab.dataset.view
            document.getElementById('scheduleContent').classList.add('active')
            DOM.classroomContentItems.forEach(content => {
                if (content.id !== 'scheduleContent') {
                    content.classList.remove('active')
                }
            })

            // Show schedule content wrapper (hide attendance if showing)
            DOM.scheduleContentWrapper.style.display = 'block'
            DOM.attendanceView.style.display = 'none'

            // Re-render
            renderSchedule()
        })
    })

    // Sidebar click handler for schedule button
    document.getElementById('scheduleList-btn').addEventListener('click', () => {
        // Show schedule content
        DOM.classroomSidebarItems.forEach(i => i.classList.remove('active'))
        document.getElementById('scheduleList-btn').classList.add('active')

        DOM.classroomContentItems.forEach(content => content.classList.remove('active'))
        document.getElementById('scheduleContent').classList.add('active')

        // Show schedule list view
        DOM.scheduleContentWrapper.style.display = 'block'
        DOM.attendanceView.style.display = 'none'

        // Render
        renderSchedule()
    })

    // Filter buttons
    DOM.scheduleFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.scheduleFilterBtns.forEach(b => b.classList.remove('active'))
            btn.classList.add('active')

            scheduleState.currentFilter = btn.dataset.filter
            renderSchedule()
        })
    })

    // Date picker
    if (DOM.scheduleDatePicker) {
        DOM.scheduleDatePicker.addEventListener('change', e => {
            scheduleState.selectedDate = e.target.valueAsDate || new Date()
            renderSchedule()
        })
    }

    // Student search functionality
    DOM.studentSearchInput.addEventListener('input', e => {
        const searchTerm = e.target.value.toLowerCase().trim()
        const studentItems = document.querySelectorAll('.classroom-content__student-item')

        studentItems.forEach(item => {
            const studentName = item.querySelector('.student-info__header h3').textContent.toLowerCase()

            if (studentName.includes(searchTerm)) {
                item.style.display = 'flex'
            } else {
                item.style.display = 'none'
            }
        })
    })

    // Grade search functionality
    DOM.gradeSearchInput.addEventListener('input', e => {
        const searchTerm = e.target.value.toLowerCase().trim()
        const gradeTable = document.querySelector('.grade-table')

        if (!gradeTable) return

        const rows = gradeTable.querySelectorAll('tbody tr')

        rows.forEach(row => {
            const studentName = row.querySelector('.col-name')?.textContent.toLowerCase() || ''

            if (studentName.includes(searchTerm)) {
                row.style.display = ''
            } else {
                row.style.display = 'none'
            }
        })
    })
}

const init = () => {
    // render mặc định
    renderClassroomName()
    renderStudentList()

    setupEventListeners()

    // Grade entry button
    const gradeEntryBtn = document.getElementById('gradeEntry-btn')
    if (gradeEntryBtn) {
        gradeEntryBtn.addEventListener('click', () => {
            window.location.href = `grade-entry.html?classId=${currentClassId}`
        })
    }
}

document.addEventListener('DOMContentLoaded', init)
