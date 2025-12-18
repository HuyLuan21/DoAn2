import { getStudentById } from '../../src/database/student.db.js'
import { getClassById } from '../../src/database/class.db.js'
import { getStudentListByClassId } from '../../src/database/enrollment.db.js'
import { getExamsByClassId } from '../../src/database/exam.db.js'
import { getExamResultByStudentId, getExamResultByStudentAndExam } from '../../src/database/examResult.db.js'
import { getExamPartsByExamId } from '../../src/database/examPart.db.js'
import { getExamPartResultsByResultId } from '../../src/database/examPartResult.db.js'

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
