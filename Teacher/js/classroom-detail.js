import { getStudentById } from '../../src/database/student.db.js'
import { getClassById } from '../../src/database/class.db.js'
import { getStudentListByClassId } from '../../src/database/enrollment.db.js'
import { getExamsByClassId } from '../../src/database/exam.db.js'
import { getExamResultByStudentId } from '../../src/database/examResult.db.js'

let currentClassId = parseInt(new URLSearchParams(window.location.search).get('classId'))

const DOM = {
    currentPageName: document.querySelector('.topbar__current-page'),
    classroomSidebarItems: document.querySelectorAll('.classroom-sidebar__item'),
    classroomContentItems: document.querySelectorAll('.classroom-content__item'),
    studentList: document.querySelector('.studentList__list'),
    examResultList: document.querySelector('.grade__list'),
    studentSearchInput: document.getElementById('studentSearchInput'),
    gradeSearchInput: document.getElementById('gradeSearchInput'),
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
                tableHTML += `<td class="col-exam ${scoreClass}">${score}</td>`
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
}

document.addEventListener('DOMContentLoaded', init)
