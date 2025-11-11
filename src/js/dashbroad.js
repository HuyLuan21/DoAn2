// // Dashboard View Switching
// document.addEventListener('DOMContentLoaded', function () {
//     // Get all sidebar navigation items
//     const navItems = document.querySelectorAll('.sidebar__nav-item')
//     const viewContents = document.querySelectorAll('.view-content')

//     // Handle navigation clicks
//     navItems.forEach(item => {
//         item.addEventListener('click', function (e) {
//             e.preventDefault()

//             // Get the view name from data attribute
//             const viewName = this.getAttribute('data-view')

//             // Remove active class from all nav items
//             navItems.forEach(nav => nav.classList.remove('active'))

//             // Add active class to clicked item
//             this.classList.add('active')

//             // Hide all views
//             viewContents.forEach(view => {
//                 view.style.display = 'none'
//             })

//             // Show selected view
//             const targetView = document.getElementById(`view-${viewName}`)
//             if (targetView) {
//                 targetView.style.display = 'block'
//             }
//         })
//     })

//     // Handle class detail panel - show when clicking view button
//     const viewButtons = document.querySelectorAll(
//         '.btn-icon[title="View Details"]'
//     )
//     const detailPanel = document.getElementById('classDetailPanel')
//     const closeDetailPanel = document.getElementById('closeDetailPanel')

//     viewButtons.forEach(button => {
//         button.addEventListener('click', function () {
//             if (detailPanel) {
//                 detailPanel.style.display = 'block'
//             }
//         })
//     })

//     // Close detail panel
//     if (closeDetailPanel) {
//         closeDetailPanel.addEventListener('click', function () {
//             if (detailPanel) {
//                 detailPanel.style.display = 'none'
//             }
//         })
//     }

//     // Close detail panel when clicking outside (optional)
//     if (detailPanel) {
//         detailPanel.addEventListener('click', function (e) {
//             if (e.target === this) {
//                 this.style.display = 'none'
//             }
//         })
//     }

//     // Sidebar toggle for mobile (if needed)
//     const sidebarClose = document.querySelector('.sidebar__close')
//     if (sidebarClose) {
//         sidebarClose.addEventListener('click', function () {
//             const sidebar = document.querySelector('.sidebar')
//             sidebar.classList.remove('sidebar--open')
//         })
//     }

//     // Student Management Functionality
//     const studentSearchInput = document.getElementById('studentSearchInput')
//     const classFilter = document.getElementById('classFilter')
//     const enrolmentFilter = document.getElementById('enrolmentFilter')
//     const paymentFilter = document.getElementById('paymentFilter')
//     const clearFiltersBtn = document.getElementById('clearFiltersBtn')
//     const studentTableBody = document.getElementById('studentTableBody')
//     const closeStudentPanel = document.getElementById('closeStudentPanel')
//     const studentDetailPanel = document.getElementById('studentDetailPanel')
//     const addStudentBtn = document.getElementById('addStudentBtn')

//     // Sample student data (in a real app, this would come from an API)
//     const studentData = [
//         {
//             id: 1,
//             name: 'John Doe',
//             phone: '555-123-4567',
//             email: 'john.doe@example.com',
//             address: '123 Main St, City, State',
//             enrolmentStatus: 'Enrolling',
//             paymentStatus: 'Paid',
//             classes: ['Math B1', 'Physics 101'],
//             attendance: '25/8',
//             lastInvoice: '$120.00',
//             balance: '$0.00',
//             avatar: 'JD',
//         },
//         {
//             id: 2,
//             name: 'Sarah Doe',
//             phone: '555-987-4567',
//             email: 'sarah.doe@example.com',
//             address: '456 Oak Ave, City, State',
//             enrolmentStatus: 'Active',
//             paymentStatus: 'Active',
//             classes: ['English A2'],
//             attendance: '30/8',
//             lastInvoice: '$150.00',
//             balance: '$0.00',
//             avatar: 'SD',
//         },
//         {
//             id: 3,
//             name: 'Sarah Lee',
//             phone: '555-987-6643',
//             email: 'sarah.lee@example.com',
//             address: '789 Pine Rd, City, State',
//             enrolmentStatus: 'Enrolling',
//             paymentStatus: 'Paid',
//             classes: ['Math B1'],
//             attendance: '20/8',
//             lastInvoice: '$100.00',
//             balance: '$0.00',
//             avatar: 'SL',
//         },
//         {
//             id: 4,
//             name: 'Sarah Lee',
//             phone: '555-987-6643',
//             email: 'sarah.lee2@example.com',
//             address: '321 Elm St, City, State',
//             enrolmentStatus: 'Pending',
//             paymentStatus: 'Unpaid',
//             classes: ['English A2'],
//             attendance: '15/8',
//             lastInvoice: '$120.00',
//             balance: '$120.00',
//             avatar: 'SL2',
//         },
//         {
//             id: 5,
//             name: 'Michate 5',
//             phone: '555-456-7890',
//             email: 'michate5@example.com',
//             address: '654 Maple Dr, City, State',
//             enrolmentStatus: 'Dropped',
//             paymentStatus: 'Inactive',
//             classes: ['Physics 101'],
//             attendance: '10/8',
//             lastInvoice: '$0.00',
//             balance: '$0.00',
//             avatar: 'M5',
//         },
//         {
//             id: 6,
//             name: 'Michael Kim',
//             phone: '555-456-7590',
//             email: 'michael.kim@example.com',
//             address: '987 Cedar Ln, City, State',
//             enrolmentStatus: 'Unpaid',
//             paymentStatus: 'Unpaid',
//             classes: [],
//             attendance: '0/0',
//             lastInvoice: '$200.00',
//             balance: '$200.00',
//             avatar: 'MK',
//         },
//     ]

//     // Function to filter students
//     function filterStudents() {
//         const searchTerm = studentSearchInput
//             ? studentSearchInput.value.toLowerCase()
//             : ''
//         const classValue = classFilter ? classFilter.value : ''
//         const enrolmentValue = enrolmentFilter ? enrolmentFilter.value : ''
//         const paymentValue = paymentFilter ? paymentFilter.value : ''

//         const rows = studentTableBody
//             ? studentTableBody.querySelectorAll('.student-table__row')
//             : []

//         rows.forEach(row => {
//             const name =
//                 row
//                     .querySelector('td:nth-child(2)')
//                     ?.textContent.toLowerCase() || ''
//             const phone =
//                 row
//                     .querySelector('td:nth-child(3)')
//                     ?.textContent.toLowerCase() || ''
//             const enrolmentBadge =
//                 row
//                     .querySelector('td:nth-child(4) .badge')
//                     ?.textContent.trim() || ''
//             const paymentBadge =
//                 row
//                     .querySelector('td:nth-child(5) .badge')
//                     ?.textContent.trim() || ''

//             const matchesSearch =
//                 !searchTerm ||
//                 name.includes(searchTerm) ||
//                 phone.includes(searchTerm)
//             const matchesEnrolment =
//                 !enrolmentValue || enrolmentBadge === enrolmentValue
//             const matchesPayment =
//                 !paymentValue || paymentBadge === paymentValue

//             if (matchesSearch && matchesEnrolment && matchesPayment) {
//                 row.style.display = ''
//             } else {
//                 row.style.display = 'none'
//             }
//         })
//     }

//     // Search input event
//     if (studentSearchInput) {
//         studentSearchInput.addEventListener('input', filterStudents)
//     }

//     // Filter select events
//     if (classFilter) {
//         classFilter.addEventListener('change', filterStudents)
//     }

//     if (enrolmentFilter) {
//         enrolmentFilter.addEventListener('change', filterStudents)
//     }

//     if (paymentFilter) {
//         paymentFilter.addEventListener('change', filterStudents)
//     }

//     // Clear filters
//     if (clearFiltersBtn) {
//         clearFiltersBtn.addEventListener('click', function () {
//             if (studentSearchInput) studentSearchInput.value = ''
//             if (classFilter) classFilter.value = ''
//             if (enrolmentFilter) enrolmentFilter.value = ''
//             if (paymentFilter) paymentFilter.value = ''
//             filterStudents()
//         })
//     }

//     // Function to open student detail panel
//     function openStudentDetail(studentId) {
//         const student = studentData.find(s => s.id === parseInt(studentId))
//         if (!student || !studentDetailPanel) return

//         // Update panel content
//         document.getElementById('studentDetailName').textContent = student.name
//         document.getElementById(
//             'studentDetailId'
//         ).textContent = `ID-00${student.id}`
//         document.getElementById('studentAvatarInitials').textContent =
//             student.avatar
//         document.getElementById('studentEmail').textContent = student.email
//         document.getElementById('studentPhone').textContent = student.phone
//         document.getElementById('studentAddress').textContent = student.address

//         // Update classes
//         const classesContainer = document.getElementById('studentClasses')
//         if (classesContainer) {
//             classesContainer.innerHTML = student.classes
//                 .map(
//                     cls =>
//                         `<div class="student-class-item"><span class="badge badge--active">${cls}</span></div>`
//                 )
//                 .join('')
//         }

//         // Show panel
//         studentDetailPanel.style.display = 'block'
//     }

//     // View student buttons (using event delegation for better reliability)
//     if (studentTableBody) {
//         studentTableBody.addEventListener('click', function (e) {
//             if (e.target.closest('.view-student-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.student-table__row')
//                 if (row) {
//                     const studentId = row.getAttribute('data-student-id')
//                     openStudentDetail(studentId)
//                 }
//             }
//         })
//     }

//     // Close student panel
//     if (closeStudentPanel && studentDetailPanel) {
//         closeStudentPanel.addEventListener('click', function () {
//             studentDetailPanel.style.display = 'none'
//         })
//     }

//     // Close panel when clicking outside
//     if (studentDetailPanel) {
//         studentDetailPanel.addEventListener('click', function (e) {
//             if (e.target === this) {
//                 this.style.display = 'none'
//             }
//         })
//     }

//     // Add new student button
//     if (addStudentBtn) {
//         addStudentBtn.addEventListener('click', function () {
//             alert('Add New Student functionality will be implemented here')
//             // In a real app, this would open a modal/form
//         })
//     }

//     // Edit and Delete student buttons (using event delegation)
//     if (studentTableBody) {
//         studentTableBody.addEventListener('click', function (e) {
//             // Handle edit button
//             if (e.target.closest('.edit-student-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.student-table__row')
//                 if (row) {
//                     const studentId = row.getAttribute('data-student-id')
//                     alert(
//                         `Edit student ${studentId} functionality will be implemented here`
//                     )
//                     // In a real app, this would open an edit modal/form
//                 }
//             }
//             // Handle delete button
//             if (e.target.closest('.delete-student-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.student-table__row')
//                 if (row) {
//                     const studentName =
//                         row.querySelector('td:nth-child(2)')?.textContent ||
//                         'this student'
//                     if (
//                         confirm(
//                             `Are you sure you want to delete ${studentName}?`
//                         )
//                     ) {
//                         // In a real app, this would make an API call to delete
//                         row.remove()
//                     }
//                 }
//             }
//         })
//     }

//     // Pagination functionality (basic implementation)
//     const prevPageBtn = document.getElementById('prevPage')
//     const nextPageBtn = document.getElementById('nextPage')
//     const paginationPages = document.getElementById('paginationPages')

//     if (prevPageBtn) {
//         prevPageBtn.addEventListener('click', function () {
//             const activePage = paginationPages?.querySelector(
//                 '.pagination__page--active'
//             )
//             if (activePage) {
//                 const currentPage = parseInt(activePage.textContent)
//                 if (currentPage > 1) {
//                     activePage.classList.remove('pagination__page--active')
//                     const prevPage = paginationPages?.querySelector(
//                         `.pagination__page:nth-child(${currentPage - 1})`
//                     )
//                     if (prevPage)
//                         prevPage.classList.add('pagination__page--active')
//                 }
//             }
//         })
//     }

//     if (nextPageBtn) {
//         nextPageBtn.addEventListener('click', function () {
//             const activePage = paginationPages?.querySelector(
//                 '.pagination__page--active'
//             )
//             if (activePage) {
//                 const currentPage = parseInt(activePage.textContent)
//                 const totalPages =
//                     paginationPages?.querySelectorAll('.pagination__page')
//                         .length || 10
//                 if (currentPage < totalPages) {
//                     activePage.classList.remove('pagination__page--active')
//                     const nextPage = paginationPages?.querySelector(
//                         `.pagination__page:nth-child(${currentPage + 1})`
//                     )
//                     if (nextPage)
//                         nextPage.classList.add('pagination__page--active')
//                 }
//             }
//         })
//     }

//     // Pagination page buttons
//     if (paginationPages) {
//         const pageButtons =
//             paginationPages.querySelectorAll('.pagination__page')
//         pageButtons.forEach(button => {
//             button.addEventListener('click', function () {
//                 pageButtons.forEach(btn =>
//                     btn.classList.remove('pagination__page--active')
//                 )
//                 this.classList.add('pagination__page--active')
//                 // In a real app, this would load the corresponding page data
//             })
//         })
//     }

//     // Settings Management Functionality
//     const settingsTabs = document.querySelectorAll('.settings-tab')
//     const settingsTabContents = document.querySelectorAll(
//         '.settings-tab-content'
//     )

//     // Settings tab switching
//     if (settingsTabs.length > 0) {
//         settingsTabs.forEach(tab => {
//             tab.addEventListener('click', function () {
//                 const targetTab = this.getAttribute('data-tab')

//                 // Remove active class from all tabs
//                 settingsTabs.forEach(t =>
//                     t.classList.remove('settings-tab--active')
//                 )
//                 // Add active class to clicked tab
//                 this.classList.add('settings-tab--active')

//                 // Hide all tab contents
//                 settingsTabContents.forEach(content => {
//                     content.classList.remove('settings-tab-content--active')
//                 })

//                 // Show selected tab content
//                 const targetContent = document.getElementById(
//                     `tab-${targetTab}`
//                 )
//                 if (targetContent) {
//                     targetContent.classList.add('settings-tab-content--active')
//                 }
//             })
//         })
//     }

//     // Save Profile Button
//     const saveProfileBtn = document.getElementById('saveProfileBtn')
//     if (saveProfileBtn) {
//         saveProfileBtn.addEventListener('click', function () {
//             const name = document.getElementById('profileName')?.value
//             const username = document.getElementById('profileUsername')?.value
//             const email = document.getElementById('profileEmail')?.value
//             const phone = document.getElementById('profilePhone')?.value
//             const bio = document.getElementById('profileBio')?.value

//             // In a real app, this would make an API call to save
//             alert('Profile settings saved successfully!')
//             console.log({ name, username, email, phone, bio })
//         })
//     }

//     // Change Avatar Button
//     const changeAvatarBtn = document.getElementById('changeAvatarBtn')
//     if (changeAvatarBtn) {
//         changeAvatarBtn.addEventListener('click', function () {
//             // In a real app, this would open a file picker
//             alert('Avatar upload functionality will be implemented here')
//         })
//     }

//     // Save Password Button
//     const savePasswordBtn = document.getElementById('savePasswordBtn')
//     if (savePasswordBtn) {
//         savePasswordBtn.addEventListener('click', function () {
//             const currentPassword =
//                 document.getElementById('currentPassword')?.value
//             const newPassword = document.getElementById('newPassword')?.value
//             const confirmPassword =
//                 document.getElementById('confirmPassword')?.value

//             if (!currentPassword || !newPassword || !confirmPassword) {
//                 alert('Please fill in all password fields')
//                 return
//             }

//             if (newPassword !== confirmPassword) {
//                 alert('New passwords do not match')
//                 return
//             }

//             if (newPassword.length < 8) {
//                 alert('Password must be at least 8 characters long')
//                 return
//             }

//             // In a real app, this would make an API call to change password
//             alert('Password updated successfully!')
//             document.getElementById('currentPassword').value = ''
//             document.getElementById('newPassword').value = ''
//             document.getElementById('confirmPassword').value = ''
//         })
//     }

//     // Save Security Settings Button
//     const saveSecurityBtn = document.getElementById('saveSecurityBtn')
//     if (saveSecurityBtn) {
//         saveSecurityBtn.addEventListener('click', function () {
//             const twoFactor = document.getElementById('twoFactorAuth')?.checked
//             const loginNotif =
//                 document.getElementById('loginNotifications')?.checked
//             const sessionTimeout =
//                 document.getElementById('sessionTimeout')?.checked

//             // In a real app, this would make an API call to save
//             alert('Security settings saved successfully!')
//             console.log({ twoFactor, loginNotif, sessionTimeout })
//         })
//     }

//     // Save Notifications Button
//     const saveNotificationsBtn = document.getElementById('saveNotificationsBtn')
//     if (saveNotificationsBtn) {
//         saveNotificationsBtn.addEventListener('click', function () {
//             const emailNotif =
//                 document.getElementById('emailNotifications')?.checked
//             const pushNotif =
//                 document.getElementById('pushNotifications')?.checked
//             const enrollmentNotif = document.getElementById(
//                 'enrollmentNotifications'
//             )?.checked
//             const paymentNotif = document.getElementById(
//                 'paymentNotifications'
//             )?.checked
//             const scheduleNotif = document.getElementById(
//                 'scheduleNotifications'
//             )?.checked

//             // In a real app, this would make an API call to save
//             alert('Notification settings saved successfully!')
//             console.log({
//                 emailNotif,
//                 pushNotif,
//                 enrollmentNotif,
//                 paymentNotif,
//                 scheduleNotif,
//             })
//         })
//     }

//     // Save General Settings Button
//     const saveGeneralBtn = document.getElementById('saveGeneralBtn')
//     if (saveGeneralBtn) {
//         saveGeneralBtn.addEventListener('click', function () {
//             const language = document.getElementById('languageSelect')?.value
//             const timezone = document.getElementById('timezoneSelect')?.value
//             const dateFormat =
//                 document.getElementById('dateFormatSelect')?.value
//             const timeFormat =
//                 document.getElementById('timeFormatSelect')?.value

//             // In a real app, this would make an API call to save
//             alert('General settings saved successfully!')
//             console.log({ language, timezone, dateFormat, timeFormat })
//         })
//     }

//     // Save Appearance Settings Button
//     const saveAppearanceBtn = document.getElementById('saveAppearanceBtn')
//     if (saveAppearanceBtn) {
//         saveAppearanceBtn.addEventListener('click', function () {
//             const theme = document.querySelector(
//                 'input[name="theme"]:checked'
//             )?.value

//             // In a real app, this would make an API call to save and apply theme
//             alert(`Appearance settings saved! Theme: ${theme}`)
//             console.log({ theme })
//         })
//     }

//     // Delete Account Button
//     const deleteAccountBtn = document.getElementById('deleteAccountBtn')
//     if (deleteAccountBtn) {
//         deleteAccountBtn.addEventListener('click', function () {
//             const confirmDelete = confirm(
//                 'Are you absolutely sure you want to delete your account? This action cannot be undone.'
//             )
//             if (confirmDelete) {
//                 const finalConfirm = prompt(
//                     'Type "DELETE" to confirm account deletion:'
//                 )
//                 if (finalConfirm === 'DELETE') {
//                     // In a real app, this would make an API call to delete account
//                     alert(
//                         'Account deletion requested. This will be processed shortly.'
//                     )
//                 } else {
//                     alert('Account deletion cancelled.')
//                 }
//             }
//         })
//     }

//     // Attendance Management Functionality
//     const attendanceSearchInput = document.getElementById(
//         'attendanceSearchInput'
//     )
//     const attendanceClassFilter = document.getElementById(
//         'attendanceClassFilter'
//     )
//     const attendanceDateFilter = document.getElementById('attendanceDateFilter')
//     const attendanceStatusFilter = document.getElementById(
//         'attendanceStatusFilter'
//     )
//     const clearAttendanceFiltersBtn = document.getElementById(
//         'clearAttendanceFiltersBtn'
//     )
//     const attendanceTableBody = document.getElementById('attendanceTableBody')
//     const attendanceDetailPanel = document.getElementById(
//         'attendanceDetailPanel'
//     )
//     const closeAttendancePanel = document.getElementById('closeAttendancePanel')
//     const markAttendanceBtn = document.getElementById('markAttendanceBtn')

//     // Sample attendance data (in a real app, this would come from an API)
//     const attendanceData = [
//         {
//             id: 1,
//             studentName: 'John Doe',
//             studentId: 'ID-001',
//             studentEmail: 'john.doe@example.com',
//             studentPhone: '555-123-4567',
//             className: 'Math B1',
//             date: '2024-01-25',
//             time: '09:00 AM',
//             status: 'Present',
//             notes: 'Student arrived on time and participated actively in class.',
//         },
//         {
//             id: 2,
//             studentName: 'Sarah Doe',
//             studentId: 'ID-002',
//             studentEmail: 'sarah.doe@example.com',
//             studentPhone: '555-987-4567',
//             className: 'English A2',
//             date: '2024-01-25',
//             time: '09:15 AM',
//             status: 'Late',
//             notes: 'Student arrived 15 minutes late due to traffic.',
//         },
//         {
//             id: 3,
//             studentName: 'Sarah Lee',
//             studentId: 'ID-003',
//             studentEmail: 'sarah.lee@example.com',
//             studentPhone: '555-987-6643',
//             className: 'Math B1',
//             date: '2024-01-25',
//             time: '09:00 AM',
//             status: 'Present',
//             notes: 'Student attended class on time.',
//         },
//         {
//             id: 4,
//             studentName: 'Michael Kim',
//             studentId: 'ID-006',
//             studentEmail: 'michael.kim@example.com',
//             studentPhone: '555-456-7590',
//             className: 'Physics 101',
//             date: '2024-01-25',
//             time: '09:00 AM',
//             status: 'Absent',
//             notes: 'Student did not attend class. No prior notice.',
//         },
//         {
//             id: 5,
//             studentName: 'Michate 5',
//             studentId: 'ID-005',
//             studentEmail: 'michate5@example.com',
//             studentPhone: '555-456-7890',
//             className: 'Physics 101',
//             date: '2024-01-24',
//             time: '02:00 PM',
//             status: 'Excused',
//             notes: 'Student had a medical appointment. Excused absence.',
//         },
//         {
//             id: 6,
//             studentName: 'Sarah Lee',
//             studentId: 'ID-004',
//             studentEmail: 'sarah.lee2@example.com',
//             studentPhone: '555-987-6643',
//             className: 'English A2',
//             date: '2024-01-24',
//             time: '09:00 AM',
//             status: 'Present',
//             notes: 'Student attended class on time.',
//         },
//     ]

//     // Function to filter attendance
//     function filterAttendance() {
//         const searchTerm = attendanceSearchInput
//             ? attendanceSearchInput.value.toLowerCase()
//             : ''
//         const classValue = attendanceClassFilter
//             ? attendanceClassFilter.value
//             : ''
//         const dateValue = attendanceDateFilter ? attendanceDateFilter.value : ''
//         const statusValue = attendanceStatusFilter
//             ? attendanceStatusFilter.value
//             : ''

//         const rows = attendanceTableBody
//             ? attendanceTableBody.querySelectorAll('.attendance-table__row')
//             : []

//         rows.forEach(row => {
//             const studentName =
//                 row
//                     .querySelector('.attendance-student__name')
//                     ?.textContent.toLowerCase() || ''
//             const className =
//                 row
//                     .querySelector('.attendance-class')
//                     ?.textContent.toLowerCase() || ''
//             const dateText =
//                 row.querySelector('td:nth-child(3)')?.textContent || ''
//             const statusBadge =
//                 row
//                     .querySelector('td:nth-child(5) .badge')
//                     ?.textContent.trim() || ''

//             const matchesSearch =
//                 !searchTerm ||
//                 studentName.includes(searchTerm) ||
//                 className.includes(searchTerm) ||
//                 dateText.includes(searchTerm)
//             const matchesClass =
//                 !classValue || className === classValue.toLowerCase()
//             const matchesDate = !dateValue || dateText === dateValue
//             const matchesStatus = !statusValue || statusBadge === statusValue

//             if (matchesSearch && matchesClass && matchesDate && matchesStatus) {
//                 row.style.display = ''
//             } else {
//                 row.style.display = 'none'
//             }
//         })
//     }

//     // Search input event
//     if (attendanceSearchInput) {
//         attendanceSearchInput.addEventListener('input', filterAttendance)
//     }

//     // Filter select events
//     if (attendanceClassFilter) {
//         attendanceClassFilter.addEventListener('change', filterAttendance)
//     }

//     if (attendanceDateFilter) {
//         attendanceDateFilter.addEventListener('change', filterAttendance)
//     }

//     if (attendanceStatusFilter) {
//         attendanceStatusFilter.addEventListener('change', filterAttendance)
//     }

//     // Clear filters
//     if (clearAttendanceFiltersBtn) {
//         clearAttendanceFiltersBtn.addEventListener('click', function () {
//             if (attendanceSearchInput) attendanceSearchInput.value = ''
//             if (attendanceClassFilter) attendanceClassFilter.value = ''
//             if (attendanceDateFilter) attendanceDateFilter.value = ''
//             if (attendanceStatusFilter) attendanceStatusFilter.value = ''
//             filterAttendance()
//         })
//     }

//     // Function to open attendance detail panel
//     function openAttendanceDetail(attendanceId) {
//         const attendance = attendanceData.find(
//             a => a.id === parseInt(attendanceId)
//         )
//         if (!attendance || !attendanceDetailPanel) return

//         // Update panel content
//         document.getElementById('attendanceStudentName').textContent =
//             attendance.studentName
//         document.getElementById('attendanceClass').textContent =
//             attendance.className
//         document.getElementById('attendanceDate').textContent = attendance.date
//         document.getElementById('attendanceTime').textContent = attendance.time
//         document.getElementById('attendanceStudentId').textContent =
//             attendance.studentId
//         document.getElementById('attendanceClassName').textContent =
//             attendance.className
//         document.getElementById('attendanceStudentEmail').textContent =
//             attendance.studentEmail
//         document.getElementById('attendanceStudentPhone').textContent =
//             attendance.studentPhone
//         document.getElementById('attendanceNotes').textContent =
//             attendance.notes

//         // Update status badge
//         const statusBadge = document.getElementById('attendanceStatusBadge')
//         if (statusBadge) {
//             let badgeClass = 'badge--present'
//             if (attendance.status === 'Absent') badgeClass = 'badge--absent'
//             if (attendance.status === 'Late') badgeClass = 'badge--late'
//             if (attendance.status === 'Excused') badgeClass = 'badge--excused'
//             statusBadge.innerHTML = `<span class="badge ${badgeClass}">${attendance.status}</span>`
//         }

//         // Show panel
//         attendanceDetailPanel.style.display = 'block'
//     }

//     // View attendance buttons (using event delegation)
//     if (attendanceTableBody) {
//         attendanceTableBody.addEventListener('click', function (e) {
//             if (e.target.closest('.view-attendance-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.attendance-table__row')
//                 if (row) {
//                     const attendanceId = row.getAttribute('data-attendance-id')
//                     openAttendanceDetail(attendanceId)
//                 }
//             }
//         })
//     }

//     // Close attendance panel
//     if (closeAttendancePanel && attendanceDetailPanel) {
//         closeAttendancePanel.addEventListener('click', function () {
//             attendanceDetailPanel.style.display = 'none'
//         })
//     }

//     // Close panel when clicking outside
//     if (attendanceDetailPanel) {
//         attendanceDetailPanel.addEventListener('click', function (e) {
//             if (e.target === this) {
//                 this.style.display = 'none'
//             }
//         })
//     }

//     // Mark Attendance button
//     if (markAttendanceBtn) {
//         markAttendanceBtn.addEventListener('click', function () {
//             alert('Mark Attendance functionality will be implemented here')
//             // In a real app, this would open a modal/form to mark attendance for a class
//         })
//     }

//     // Edit Attendance Detail Button
//     const editAttendanceDetailBtn = document.getElementById(
//         'editAttendanceDetailBtn'
//     )
//     if (editAttendanceDetailBtn) {
//         editAttendanceDetailBtn.addEventListener('click', function () {
//             const studentName = document.getElementById(
//                 'attendanceStudentName'
//             )?.textContent
//             alert(
//                 `Edit attendance for ${studentName} functionality will be implemented here`
//             )
//             // In a real app, this would open an edit modal/form
//         })
//     }

//     // Edit and Delete attendance buttons in table (using event delegation)
//     if (attendanceTableBody) {
//         attendanceTableBody.addEventListener('click', function (e) {
//             // Handle edit button
//             if (e.target.closest('.edit-attendance-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.attendance-table__row')
//                 if (row) {
//                     const studentName =
//                         row.querySelector('.attendance-student__name')
//                             ?.textContent || 'this attendance'
//                     alert(
//                         `Edit attendance for ${studentName} functionality will be implemented here`
//                     )
//                     // In a real app, this would open an edit modal/form
//                 }
//             }
//             // Handle delete button
//             if (e.target.closest('.delete-attendance-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.attendance-table__row')
//                 if (row) {
//                     const studentName =
//                         row.querySelector('.attendance-student__name')
//                             ?.textContent || 'this attendance'
//                     if (
//                         confirm(
//                             `Are you sure you want to delete attendance record for ${studentName}?`
//                         )
//                     ) {
//                         // In a real app, this would make an API call to delete
//                         row.remove()
//                     }
//                 }
//             }
//         })
//     }

//     // Pagination functionality
//     const attendancePrevPageBtn = document.getElementById('attendancePrevPage')
//     const attendanceNextPageBtn = document.getElementById('attendanceNextPage')
//     const attendancePaginationPages = document.getElementById(
//         'attendancePaginationPages'
//     )

//     if (attendancePrevPageBtn) {
//         attendancePrevPageBtn.addEventListener('click', function () {
//             const activePage = attendancePaginationPages?.querySelector(
//                 '.pagination__page--active'
//             )
//             if (activePage) {
//                 const currentPage = parseInt(activePage.textContent)
//                 if (currentPage > 1) {
//                     activePage.classList.remove('pagination__page--active')
//                     const prevPage = attendancePaginationPages?.querySelector(
//                         `.pagination__page:nth-child(${currentPage - 1})`
//                     )
//                     if (prevPage)
//                         prevPage.classList.add('pagination__page--active')
//                 }
//             }
//         })
//     }

//     if (attendanceNextPageBtn) {
//         attendanceNextPageBtn.addEventListener('click', function () {
//             const activePage = attendancePaginationPages?.querySelector(
//                 '.pagination__page--active'
//             )
//             if (activePage) {
//                 const currentPage = parseInt(activePage.textContent)
//                 const totalPages =
//                     attendancePaginationPages?.querySelectorAll(
//                         '.pagination__page'
//                     ).length || 10
//                 if (currentPage < totalPages) {
//                     activePage.classList.remove('pagination__page--active')
//                     const nextPage = attendancePaginationPages?.querySelector(
//                         `.pagination__page:nth-child(${currentPage + 1})`
//                     )
//                     if (nextPage)
//                         nextPage.classList.add('pagination__page--active')
//                 }
//             }
//         })
//     }

//     // Pagination page buttons
//     if (attendancePaginationPages) {
//         const pageButtons =
//             attendancePaginationPages.querySelectorAll('.pagination__page')
//         pageButtons.forEach(button => {
//             button.addEventListener('click', function () {
//                 pageButtons.forEach(btn =>
//                     btn.classList.remove('pagination__page--active')
//                 )
//                 this.classList.add('pagination__page--active')
//                 // In a real app, this would load the corresponding page data
//             })
//         })
//     }

//     // Reports Management Functionality
//     const reportsTabs = document.querySelectorAll('.reports-tab')
//     const reportsTabContents = document.querySelectorAll('.reports-tab-content')
//     const exportReportBtn = document.getElementById('exportReportBtn')
//     const generateReportBtn = document.getElementById('generateReportBtn')
//     const reportStartDate = document.getElementById('reportStartDate')
//     const reportEndDate = document.getElementById('reportEndDate')
//     const reportTypeFilter = document.getElementById('reportTypeFilter')

//     // Reports tab switching
//     if (reportsTabs.length > 0) {
//         reportsTabs.forEach(tab => {
//             tab.addEventListener('click', function () {
//                 const targetReport = this.getAttribute('data-report')

//                 // Remove active class from all tabs
//                 reportsTabs.forEach(t =>
//                     t.classList.remove('reports-tab--active')
//                 )
//                 // Add active class to clicked tab
//                 this.classList.add('reports-tab--active')

//                 // Hide all tab contents
//                 reportsTabContents.forEach(content => {
//                     content.classList.remove('reports-tab-content--active')
//                 })

//                 // Show selected tab content
//                 const targetContent = document.getElementById(
//                     `report-${targetReport}`
//                 )
//                 if (targetContent) {
//                     targetContent.classList.add('reports-tab-content--active')
//                 }
//             })
//         })
//     }

//     // Export Report Button
//     if (exportReportBtn) {
//         exportReportBtn.addEventListener('click', function () {
//             const reportType = reportTypeFilter ? reportTypeFilter.value : 'all'
//             const startDate = reportStartDate ? reportStartDate.value : ''
//             const endDate = reportEndDate ? reportEndDate.value : ''

//             // In a real app, this would generate and download the report
//             alert(
//                 `Exporting ${reportType} report from ${startDate} to ${endDate}...`
//             )
//             console.log({ reportType, startDate, endDate })
//         })
//     }

//     // Generate Report Button
//     if (generateReportBtn) {
//         generateReportBtn.addEventListener('click', function () {
//             const startDate = reportStartDate ? reportStartDate.value : ''
//             const endDate = reportEndDate ? reportEndDate.value : ''
//             const reportType = reportTypeFilter ? reportTypeFilter.value : 'all'

//             if (!startDate || !endDate) {
//                 alert('Please select a date range')
//                 return
//             }

//             // In a real app, this would fetch and generate the report data
//             alert(
//                 `Generating ${reportType} report from ${startDate} to ${endDate}...`
//             )
//             console.log({ reportType, startDate, endDate })
//         })
//     }

//     // Enrolment Management Functionality
//     const enrolmentSearchInput = document.getElementById('enrolmentSearchInput')
//     const enrolmentStatusFilter = document.getElementById(
//         'enrolmentStatusFilter'
//     )
//     const enrolmentClassFilter = document.getElementById('enrolmentClassFilter')
//     const enrolmentDateFilter = document.getElementById('enrolmentDateFilter')
//     const clearEnrolmentFiltersBtn = document.getElementById(
//         'clearEnrolmentFiltersBtn'
//     )
//     const enrolmentTableBody = document.getElementById('enrolmentTableBody')
//     const enrolmentDetailPanel = document.getElementById('enrolmentDetailPanel')
//     const closeEnrolmentPanel = document.getElementById('closeEnrolmentPanel')
//     const createEnrolmentBtn = document.getElementById('createEnrolmentBtn')
//     const gradesPanel = document.getElementById('gradesPanel')
//     const closeGradesPanel = document.getElementById('closeGradesPanel')

//     // Sample enrolment data
//     const enrolmentData = [
//         {
//             id: 1,
//             studentName: 'John Doe',
//             studentId: 'ID-001',
//             studentEmail: 'john.doe@example.com',
//             studentPhone: '555-123-4567',
//             className: 'Math B1',
//             requestDate: '2024-01-20',
//             status: 'Pending',
//             scheduledDate: null,
//             notes: 'Student has completed prerequisite courses. Ready for enrollment.',
//         },
//         {
//             id: 2,
//             studentName: 'Sarah Doe',
//             studentId: 'ID-002',
//             studentEmail: 'sarah.doe@example.com',
//             studentPhone: '555-987-4567',
//             className: 'English A2',
//             requestDate: '2024-01-18',
//             status: 'Approved',
//             scheduledDate: '2024-02-01',
//             notes: 'Enrollment approved. Scheduled for periodic check.',
//         },
//         {
//             id: 3,
//             studentName: 'Sarah Lee',
//             studentId: 'ID-003',
//             studentEmail: 'sarah.lee@example.com',
//             studentPhone: '555-987-6643',
//             className: 'Math B1',
//             requestDate: '2024-01-22',
//             status: 'Pending',
//             scheduledDate: '2024-02-05',
//             notes: 'Awaiting approval. Check scheduled.',
//         },
//         {
//             id: 4,
//             studentName: 'Michael Kim',
//             studentId: 'ID-006',
//             studentEmail: 'michael.kim@example.com',
//             studentPhone: '555-456-7590',
//             className: 'Physics 101',
//             requestDate: '2024-01-15',
//             status: 'Rejected',
//             scheduledDate: null,
//             notes: 'Enrollment rejected due to incomplete prerequisites.',
//         },
//         {
//             id: 5,
//             studentName: 'Michate 5',
//             studentId: 'ID-005',
//             studentEmail: 'michate5@example.com',
//             studentPhone: '555-456-7890',
//             className: 'Physics 101',
//             requestDate: '2024-01-19',
//             status: 'Approved',
//             scheduledDate: '2024-02-10',
//             notes: 'Enrollment approved.',
//         },
//     ]

//     // Sample grades data
//     const gradesData = {
//         'Math B1': [
//             {
//                 studentName: 'John Doe',
//                 midterm: 88,
//                 final: 92,
//                 assignment: 90,
//                 average: 90.0,
//                 grade: 'A',
//             },
//             {
//                 studentName: 'Sarah Doe',
//                 midterm: 85,
//                 final: 88,
//                 assignment: 87,
//                 average: 86.7,
//                 grade: 'B',
//             },
//             {
//                 studentName: 'Sarah Lee',
//                 midterm: 82,
//                 final: 85,
//                 assignment: 83,
//                 average: 83.3,
//                 grade: 'B',
//             },
//             {
//                 studentName: 'Michael Kim',
//                 midterm: 75,
//                 final: 78,
//                 assignment: 76,
//                 average: 76.3,
//                 grade: 'C',
//             },
//         ],
//         'English A2': [
//             {
//                 studentName: 'Sarah Doe',
//                 midterm: 90,
//                 final: 92,
//                 assignment: 91,
//                 average: 91.0,
//                 grade: 'A',
//             },
//             {
//                 studentName: 'John Doe',
//                 midterm: 87,
//                 final: 89,
//                 assignment: 88,
//                 average: 88.0,
//                 grade: 'B',
//             },
//         ],
//         'Physics 101': [
//             {
//                 studentName: 'Michate 5',
//                 midterm: 80,
//                 final: 85,
//                 assignment: 82,
//                 average: 82.3,
//                 grade: 'B',
//             },
//         ],
//     }

//     // Function to filter enrolments
//     function filterEnrolments() {
//         const searchTerm = enrolmentSearchInput
//             ? enrolmentSearchInput.value.toLowerCase()
//             : ''
//         const statusValue = enrolmentStatusFilter
//             ? enrolmentStatusFilter.value
//             : ''
//         const classValue = enrolmentClassFilter
//             ? enrolmentClassFilter.value
//             : ''
//         const dateValue = enrolmentDateFilter ? enrolmentDateFilter.value : ''

//         const rows = enrolmentTableBody
//             ? enrolmentTableBody.querySelectorAll('.enrolment-table__row')
//             : []

//         rows.forEach(row => {
//             const studentName =
//                 row
//                     .querySelector('.enrolment-student__name')
//                     ?.textContent.toLowerCase() || ''
//             const className =
//                 row
//                     .querySelector('.enrolment-class')
//                     ?.textContent.toLowerCase() || ''
//             const dateText =
//                 row.querySelector('td:nth-child(3)')?.textContent || ''
//             const statusBadge =
//                 row
//                     .querySelector('td:nth-child(4) .badge')
//                     ?.textContent.trim() || ''

//             const matchesSearch =
//                 !searchTerm ||
//                 studentName.includes(searchTerm) ||
//                 className.includes(searchTerm) ||
//                 dateText.includes(searchTerm)
//             const matchesStatus = !statusValue || statusBadge === statusValue
//             const matchesClass =
//                 !classValue || className === classValue.toLowerCase()
//             const matchesDate = !dateValue || dateText === dateValue

//             if (matchesSearch && matchesStatus && matchesClass && matchesDate) {
//                 row.style.display = ''
//             } else {
//                 row.style.display = 'none'
//             }
//         })
//     }

//     // Search input event
//     if (enrolmentSearchInput) {
//         enrolmentSearchInput.addEventListener('input', filterEnrolments)
//     }

//     // Filter select events
//     if (enrolmentStatusFilter) {
//         enrolmentStatusFilter.addEventListener('change', filterEnrolments)
//     }

//     if (enrolmentClassFilter) {
//         enrolmentClassFilter.addEventListener('change', filterEnrolments)
//     }

//     if (enrolmentDateFilter) {
//         enrolmentDateFilter.addEventListener('change', filterEnrolments)
//     }

//     // Clear filters
//     if (clearEnrolmentFiltersBtn) {
//         clearEnrolmentFiltersBtn.addEventListener('click', function () {
//             if (enrolmentSearchInput) enrolmentSearchInput.value = ''
//             if (enrolmentStatusFilter) enrolmentStatusFilter.value = ''
//             if (enrolmentClassFilter) enrolmentClassFilter.value = ''
//             if (enrolmentDateFilter) enrolmentDateFilter.value = ''
//             filterEnrolments()
//         })
//     }

//     // Function to open enrolment detail panel
//     function openEnrolmentDetail(enrolmentId) {
//         const enrolment = enrolmentData.find(
//             e => e.id === parseInt(enrolmentId)
//         )
//         if (!enrolment || !enrolmentDetailPanel) return

//         // Update panel content
//         document.getElementById('enrolmentStudentName').textContent =
//             enrolment.studentName
//         document.getElementById('enrolmentClassName').textContent =
//             enrolment.className
//         document.getElementById('enrolmentRequestDate').textContent =
//             enrolment.requestDate
//         document.getElementById('enrolmentStudentId').textContent =
//             enrolment.studentId
//         document.getElementById('enrolmentClassDetail').textContent =
//             enrolment.className
//         document.getElementById('enrolmentStudentEmail').textContent =
//             enrolment.studentEmail
//         document.getElementById('enrolmentStudentPhone').textContent =
//             enrolment.studentPhone
//         document.getElementById('enrolmentNotes').textContent = enrolment.notes
//         document.getElementById('enrolmentScheduledDate').textContent =
//             enrolment.scheduledDate || 'Not Scheduled'

//         // Update status badge
//         const statusBadge = document.getElementById('enrolmentStatusBadge')
//         if (statusBadge) {
//             let badgeClass = 'badge--pending'
//             if (enrolment.status === 'Approved') badgeClass = 'badge--approved'
//             if (enrolment.status === 'Rejected') badgeClass = 'badge--rejected'
//             statusBadge.innerHTML = `<span class="badge ${badgeClass}">${enrolment.status}</span>`
//         }

//         // Show panel
//         enrolmentDetailPanel.style.display = 'block'
//     }

//     // View enrolment buttons (using event delegation)
//     if (enrolmentTableBody) {
//         enrolmentTableBody.addEventListener('click', function (e) {
//             if (e.target.closest('.view-enrolment-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.enrolment-table__row')
//                 if (row) {
//                     const enrolmentId = row.getAttribute('data-enrolment-id')
//                     openEnrolmentDetail(enrolmentId)
//                 }
//             }
//         })
//     }

//     // Close enrolment panel
//     if (closeEnrolmentPanel && enrolmentDetailPanel) {
//         closeEnrolmentPanel.addEventListener('click', function () {
//             enrolmentDetailPanel.style.display = 'none'
//         })
//     }

//     // Close panel when clicking outside
//     if (enrolmentDetailPanel) {
//         enrolmentDetailPanel.addEventListener('click', function (e) {
//             if (e.target === this) {
//                 this.style.display = 'none'
//             }
//         })
//     }

//     // Create new enrolment button
//     if (createEnrolmentBtn) {
//         createEnrolmentBtn.addEventListener('click', function () {
//             alert(
//                 'New Enrollment Request functionality will be implemented here'
//             )
//             // In a real app, this would open a modal/form
//         })
//     }

//     // Approve enrolment button
//     const approveEnrolmentDetailBtn = document.getElementById(
//         'approveEnrolmentDetailBtn'
//     )
//     if (approveEnrolmentDetailBtn) {
//         approveEnrolmentDetailBtn.addEventListener('click', function () {
//             const studentName = document.getElementById(
//                 'enrolmentStudentName'
//             )?.textContent
//             if (confirm(`Approve enrollment for ${studentName}?`)) {
//                 // In a real app, this would make an API call
//                 alert('Enrollment approved successfully!')
//                 enrolmentDetailPanel.style.display = 'none'
//             }
//         })
//     }

//     // Reject enrolment button
//     const rejectEnrolmentDetailBtn = document.getElementById(
//         'rejectEnrolmentDetailBtn'
//     )
//     if (rejectEnrolmentDetailBtn) {
//         rejectEnrolmentDetailBtn.addEventListener('click', function () {
//             const studentName = document.getElementById(
//                 'enrolmentStudentName'
//             )?.textContent
//             if (confirm(`Reject enrollment for ${studentName}?`)) {
//                 // In a real app, this would make an API call
//                 alert('Enrollment rejected.')
//                 enrolmentDetailPanel.style.display = 'none'
//             }
//         })
//     }

//     // Schedule Check button
//     const scheduleCheckBtn = document.getElementById('scheduleCheckBtn')
//     if (scheduleCheckBtn) {
//         scheduleCheckBtn.addEventListener('click', function () {
//             const checkDate = prompt(
//                 'Enter check date (YYYY-MM-DD):',
//                 '2024-02-01'
//             )
//             if (checkDate) {
//                 // In a real app, this would make an API call
//                 alert(`Periodic check scheduled for ${checkDate}`)
//                 document.getElementById('enrolmentScheduledDate').textContent =
//                     checkDate
//             }
//         })
//     }

//     // View Grades functionality
//     function openGradesPanel(className) {
//         const grades = gradesData[className] || []
//         if (!grades.length || !gradesPanel) return

//         // Update panel title
//         document.getElementById(
//             'gradesClassName'
//         ).textContent = `${className} - Grades`

//         // Update grades table
//         const gradesTableBody = document.getElementById('gradesTableBody')
//         if (gradesTableBody) {
//             gradesTableBody.innerHTML = grades
//                 .map(
//                     grade =>
//                         `<tr>
//                             <td>
//                                 <div class="grades-student">
//                                     <div class="student-avatar student-avatar--small">${grade.studentName
//                                         .split(' ')
//                                         .map(n => n[0])
//                                         .join('')}</div>
//                                     <span>${grade.studentName}</span>
//                                 </div>
//                             </td>
//                             <td>${grade.midterm}</td>
//                             <td>${grade.final}</td>
//                             <td>${grade.assignment}</td>
//                             <td>${grade.average.toFixed(1)}</td>
//                             <td><span class="badge badge--grade-${grade.grade.toLowerCase()}">${
//                             grade.grade
//                         }</span></td>
//                         </tr>`
//                 )
//                 .join('')
//         }

//         // Calculate statistics
//         const avgScore =
//             grades.reduce((sum, g) => sum + g.average, 0) / grades.length
//         const passCount = grades.filter(g => g.average >= 60).length
//         const passRate = (passCount / grades.length) * 100

//         // Update stats (if elements exist)
//         const statItems = document.querySelectorAll('.grades-stat-item')
//         if (statItems.length >= 3) {
//             statItems[0].querySelector('.grades-stat__value').textContent =
//                 avgScore.toFixed(1)
//             statItems[1].querySelector('.grades-stat__value').textContent =
//                 grades.length
//             statItems[2].querySelector(
//                 '.grades-stat__value'
//             ).textContent = `${passRate.toFixed(0)}%`
//         }

//         // Show panel
//         gradesPanel.style.display = 'block'
//     }

//     // View grades buttons (using event delegation)
//     if (enrolmentTableBody) {
//         enrolmentTableBody.addEventListener('click', function (e) {
//             if (e.target.closest('.view-grades-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.enrolment-table__row')
//                 if (row) {
//                     const className =
//                         row.querySelector('.enrolment-class')?.textContent || ''
//                     openGradesPanel(className)
//                 }
//             }
//         })
//     }

//     // Close grades panel
//     if (closeGradesPanel && gradesPanel) {
//         closeGradesPanel.addEventListener('click', function () {
//             gradesPanel.style.display = 'none'
//         })
//     }

//     // Close grades panel when clicking outside
//     if (gradesPanel) {
//         gradesPanel.addEventListener('click', function (e) {
//             if (e.target === this) {
//                 this.style.display = 'none'
//             }
//         })
//     }

//     // Approve, Reject, Schedule, Delete buttons in table (using event delegation)
//     if (enrolmentTableBody) {
//         enrolmentTableBody.addEventListener('click', function (e) {
//             const row = e.target.closest('.enrolment-table__row')
//             if (!row) return

//             const studentName =
//                 row.querySelector('.enrolment-student__name')?.textContent ||
//                 'this enrollment'
//             const className =
//                 row.querySelector('.enrolment-class')?.textContent || ''

//             // Handle approve button
//             if (e.target.closest('.approve-enrolment-btn')) {
//                 e.stopPropagation()
//                 if (confirm(`Approve enrollment for ${studentName}?`)) {
//                     // In a real app, this would make an API call
//                     const statusBadge = row.querySelector(
//                         'td:nth-child(4) .badge'
//                     )
//                     if (statusBadge) {
//                         statusBadge.textContent = 'Approved'
//                         statusBadge.className = 'badge badge--approved'
//                     }
//                     alert('Enrollment approved successfully!')
//                 }
//             }

//             // Handle reject button
//             if (e.target.closest('.reject-enrolment-btn')) {
//                 e.stopPropagation()
//                 if (confirm(`Reject enrollment for ${studentName}?`)) {
//                     // In a real app, this would make an API call
//                     const statusBadge = row.querySelector(
//                         'td:nth-child(4) .badge'
//                     )
//                     if (statusBadge) {
//                         statusBadge.textContent = 'Rejected'
//                         statusBadge.className = 'badge badge--rejected'
//                     }
//                     alert('Enrollment rejected.')
//                 }
//             }

//             // Handle schedule button
//             if (e.target.closest('.schedule-enrolment-btn')) {
//                 e.stopPropagation()
//                 const checkDate = prompt(
//                     'Enter periodic check date (YYYY-MM-DD):',
//                     '2024-02-01'
//                 )
//                 if (checkDate) {
//                     // In a real app, this would make an API call
//                     const scheduleCell = row.querySelector('td:nth-child(5)')
//                     if (scheduleCell) {
//                         scheduleCell.querySelector(
//                             '.enrolment-schedule'
//                         ).textContent = checkDate
//                     }
//                     alert(`Periodic check scheduled for ${checkDate}`)
//                 }
//             }

//             // Handle delete button
//             if (e.target.closest('.delete-enrolment-btn')) {
//                 e.stopPropagation()
//                 if (
//                     confirm(
//                         `Are you sure you want to delete enrollment request for ${studentName}?`
//                     )
//                 ) {
//                     // In a real app, this would make an API call to delete
//                     row.remove()
//                 }
//             }
//         })
//     }

//     // Pagination functionality
//     const enrolmentPrevPageBtn = document.getElementById('enrolmentPrevPage')
//     const enrolmentNextPageBtn = document.getElementById('enrolmentNextPage')
//     const enrolmentPaginationPages = document.getElementById(
//         'enrolmentPaginationPages'
//     )

//     if (enrolmentPrevPageBtn) {
//         enrolmentPrevPageBtn.addEventListener('click', function () {
//             const activePage = enrolmentPaginationPages?.querySelector(
//                 '.pagination__page--active'
//             )
//             if (activePage) {
//                 const currentPage = parseInt(activePage.textContent)
//                 if (currentPage > 1) {
//                     activePage.classList.remove('pagination__page--active')
//                     const prevPage = enrolmentPaginationPages?.querySelector(
//                         `.pagination__page:nth-child(${currentPage - 1})`
//                     )
//                     if (prevPage)
//                         prevPage.classList.add('pagination__page--active')
//                 }
//             }
//         })
//     }

//     if (enrolmentNextPageBtn) {
//         enrolmentNextPageBtn.addEventListener('click', function () {
//             const activePage = enrolmentPaginationPages?.querySelector(
//                 '.pagination__page--active'
//             )
//             if (activePage) {
//                 const currentPage = parseInt(activePage.textContent)
//                 const totalPages =
//                     enrolmentPaginationPages?.querySelectorAll(
//                         '.pagination__page'
//                     ).length || 10
//                 if (currentPage < totalPages) {
//                     activePage.classList.remove('pagination__page--active')
//                     const nextPage = enrolmentPaginationPages?.querySelector(
//                         `.pagination__page:nth-child(${currentPage + 1})`
//                     )
//                     if (nextPage)
//                         nextPage.classList.add('pagination__page--active')
//                 }
//             }
//         })
//     }

//     // Pagination page buttons
//     if (enrolmentPaginationPages) {
//         const pageButtons =
//             enrolmentPaginationPages.querySelectorAll('.pagination__page')
//         pageButtons.forEach(button => {
//             button.addEventListener('click', function () {
//                 pageButtons.forEach(btn =>
//                     btn.classList.remove('pagination__page--active')
//                 )
//                 this.classList.add('pagination__page--active')
//                 // In a real app, this would load the corresponding page data
//             })
//         })
//     }
// })
