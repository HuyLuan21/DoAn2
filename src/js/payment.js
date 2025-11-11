// // Payment Management Functionality
// document.addEventListener('DOMContentLoaded', function () {
//     const paymentSearchInput = document.getElementById('paymentSearchInput')
//     const statusFilter = document.getElementById('statusFilter')
//     const methodFilter = document.getElementById('methodFilter')
//     const dateFilter = document.getElementById('dateFilter')
//     const clearPaymentFiltersBtn = document.getElementById('clearPaymentFiltersBtn')
//     const paymentTableBody = document.getElementById('paymentTableBody')
//     const paymentDetailPanel = document.getElementById('paymentDetailPanel')
//     const closePaymentPanel = document.getElementById('closePaymentPanel')
//     const createPaymentBtn = document.getElementById('createPaymentBtn')

//     // Sample payment data (in a real app, this would come from an API)
//     const paymentData = [
//         {
//             id: 1,
//             invoiceId: 'INV-001',
//             studentName: 'John Doe',
//             studentId: 'ID-001',
//             studentEmail: 'john.doe@example.com',
//             studentPhone: '555-123-4567',
//             amount: 120.00,
//             paymentDate: '2024-01-15',
//             paymentMethod: 'Credit Card',
//             status: 'Paid',
//             transactionId: 'TXN-123456789',
//             courses: [
//                 { name: 'Math B1', amount: 60.00 },
//                 { name: 'Physics 101', amount: 60.00 },
//             ],
//             notes: 'Payment received successfully. Thank you for your payment.',
//             avatar: 'JD',
//         },
//         {
//             id: 2,
//             invoiceId: 'INV-002',
//             studentName: 'Sarah Doe',
//             studentId: 'ID-002',
//             studentEmail: 'sarah.doe@example.com',
//             studentPhone: '555-987-4567',
//             amount: 150.00,
//             paymentDate: '2024-01-18',
//             paymentMethod: 'Bank Transfer',
//             status: 'Paid',
//             transactionId: 'TXN-123456790',
//             courses: [
//                 { name: 'English A2', amount: 150.00 },
//             ],
//             notes: 'Payment received via bank transfer.',
//             avatar: 'SD',
//         },
//         {
//             id: 3,
//             invoiceId: 'INV-003',
//             studentName: 'Sarah Lee',
//             studentId: 'ID-003',
//             studentEmail: 'sarah.lee@example.com',
//             studentPhone: '555-987-6643',
//             amount: 100.00,
//             paymentDate: '2024-01-20',
//             paymentMethod: 'Cash',
//             status: 'Paid',
//             transactionId: 'TXN-123456791',
//             courses: [
//                 { name: 'Math B1', amount: 100.00 },
//             ],
//             notes: 'Cash payment received.',
//             avatar: 'SL',
//         },
//         {
//             id: 4,
//             invoiceId: 'INV-004',
//             studentName: 'Michael Kim',
//             studentId: 'ID-006',
//             studentEmail: 'michael.kim@example.com',
//             studentPhone: '555-456-7590',
//             amount: 200.00,
//             paymentDate: '2024-01-22',
//             paymentMethod: 'Online Payment',
//             status: 'Pending',
//             transactionId: 'TXN-123456792',
//             courses: [
//                 { name: 'Math B1', amount: 100.00 },
//                 { name: 'Physics 101', amount: 100.00 },
//             ],
//             notes: 'Payment is being processed.',
//             avatar: 'MK',
//         },
//         {
//             id: 5,
//             invoiceId: 'INV-005',
//             studentName: 'Sarah Lee',
//             studentId: 'ID-004',
//             studentEmail: 'sarah.lee2@example.com',
//             studentPhone: '555-987-6643',
//             amount: 120.00,
//             paymentDate: '2024-01-10',
//             paymentMethod: 'Credit Card',
//             status: 'Overdue',
//             transactionId: 'TXN-123456793',
//             courses: [
//                 { name: 'English A2', amount: 120.00 },
//             ],
//             notes: 'Payment is overdue. Please contact student.',
//             avatar: 'SL2',
//         },
//         {
//             id: 6,
//             invoiceId: 'INV-006',
//             studentName: 'Michate 5',
//             studentId: 'ID-005',
//             studentEmail: 'michate5@example.com',
//             studentPhone: '555-456-7890',
//             amount: 80.00,
//             paymentDate: '2024-01-25',
//             paymentMethod: 'Bank Transfer',
//             status: 'Paid',
//             transactionId: 'TXN-123456794',
//             courses: [
//                 { name: 'Physics 101', amount: 80.00 },
//             ],
//             notes: 'Payment received successfully.',
//             avatar: 'M5',
//         },
//     ]

//     // Function to filter payments
//     function filterPayments() {
//         const searchTerm = paymentSearchInput
//             ? paymentSearchInput.value.toLowerCase()
//             : ''
//         const statusValue = statusFilter ? statusFilter.value : ''
//         const methodValue = methodFilter ? methodFilter.value : ''
//         const dateValue = dateFilter ? dateFilter.value : ''

//         const rows = paymentTableBody
//             ? paymentTableBody.querySelectorAll('.payment-table__row')
//             : []

//         rows.forEach(row => {
//             const invoiceId =
//                 row.querySelector('.invoice-id')?.textContent.toLowerCase() ||
//                 ''
//             const studentName =
//                 row
//                     .querySelector('.payment-student span')
//                     ?.textContent.toLowerCase() || ''
//             const amount =
//                 row
//                     .querySelector('.payment-amount')
//                     ?.textContent.toLowerCase() || ''
//             const statusBadge =
//                 row.querySelector('td:nth-child(6) .badge')?.textContent.trim() ||
//                 ''
//             const methodText =
//                 row
//                     .querySelector('.payment-method')
//                     ?.textContent.trim()
//                     .toLowerCase() || ''
//             const dateText = row.querySelector('td:nth-child(4)')?.textContent || ''

//             const matchesSearch =
//                 !searchTerm ||
//                 invoiceId.includes(searchTerm) ||
//                 studentName.includes(searchTerm) ||
//                 amount.includes(searchTerm)
//             const matchesStatus = !statusValue || statusBadge === statusValue
//             const matchesMethod =
//                 !methodValue || methodText.includes(methodValue.toLowerCase())
//             const matchesDate = !dateValue || dateText === dateValue

//             if (
//                 matchesSearch &&
//                 matchesStatus &&
//                 matchesMethod &&
//                 matchesDate
//             ) {
//                 row.style.display = ''
//             } else {
//                 row.style.display = 'none'
//             }
//         })
//     }

//     // Search input event
//     if (paymentSearchInput) {
//         paymentSearchInput.addEventListener('input', filterPayments)
//     }

//     // Filter select events
//     if (statusFilter) {
//         statusFilter.addEventListener('change', filterPayments)
//     }

//     if (methodFilter) {
//         methodFilter.addEventListener('change', filterPayments)
//     }

//     if (dateFilter) {
//         dateFilter.addEventListener('change', filterPayments)
//     }

//     // Clear filters
//     if (clearPaymentFiltersBtn) {
//         clearPaymentFiltersBtn.addEventListener('click', function () {
//             if (paymentSearchInput) paymentSearchInput.value = ''
//             if (statusFilter) statusFilter.value = ''
//             if (methodFilter) methodFilter.value = ''
//             if (dateFilter) dateFilter.value = ''
//             filterPayments()
//         })
//     }

//     // Function to open payment detail panel
//     function openPaymentDetail(paymentId) {
//         const payment = paymentData.find(
//             p => p.id === parseInt(paymentId)
//         )
//         if (!payment || !paymentDetailPanel) return

//         // Update panel content
//         document.getElementById('paymentInvoiceId').textContent =
//             payment.invoiceId
//         document.getElementById('paymentStudentName').textContent =
//             payment.studentName
//         document.getElementById('paymentAmount').textContent = `$${payment.amount.toFixed(2)}`
//         document.getElementById('paymentDate').textContent = payment.paymentDate
//         document.getElementById('paymentMethod').textContent =
//             payment.paymentMethod
//         document.getElementById('paymentTransactionId').textContent =
//             payment.transactionId
//         document.getElementById('paymentStudentId').textContent =
//             payment.studentId
//         document.getElementById('paymentStudentEmail').textContent =
//             payment.studentEmail
//         document.getElementById('paymentStudentPhone').textContent =
//             payment.studentPhone
//         document.getElementById('paymentNotes').textContent = payment.notes

//         // Update status badge
//         const statusBadge = document.getElementById('paymentStatusBadge')
//         if (statusBadge) {
//             let badgeClass = 'badge--paid'
//             if (payment.status === 'Pending') badgeClass = 'badge--pending'
//             if (payment.status === 'Overdue') badgeClass = 'badge--overdue'
//             statusBadge.innerHTML = `<span class="badge ${badgeClass}">${payment.status}</span>`
//         }

//         // Update courses
//         const coursesContainer = document.getElementById('paymentCourseDetails')
//         if (coursesContainer) {
//             coursesContainer.innerHTML = payment.courses
//                 .map(
//                     course =>
//                         `<div class="payment-course-item">
//                             <span class="payment-course-name">${course.name}</span>
//                             <span class="payment-course-amount">$${course.amount.toFixed(2)}</span>
//                         </div>`
//                 )
//                 .join('')
//         }

//         // Show panel
//         paymentDetailPanel.style.display = 'block'
//     }

//     // View payment buttons (using event delegation)
//     if (paymentTableBody) {
//         paymentTableBody.addEventListener('click', function (e) {
//             if (e.target.closest('.view-payment-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.payment-table__row')
//                 if (row) {
//                     const paymentId = row.getAttribute('data-payment-id')
//                     openPaymentDetail(paymentId)
//                 }
//             }
//         })
//     }

//     // Close payment panel
//     if (closePaymentPanel && paymentDetailPanel) {
//         closePaymentPanel.addEventListener('click', function () {
//             paymentDetailPanel.style.display = 'none'
//         })
//     }

//     // Close panel when clicking outside
//     if (paymentDetailPanel) {
//         paymentDetailPanel.addEventListener('click', function (e) {
//             if (e.target === this) {
//                 this.style.display = 'none'
//             }
//         })
//     }

//     // Create new payment button
//     if (createPaymentBtn) {
//         createPaymentBtn.addEventListener('click', function () {
//             alert('Create New Payment functionality will be implemented here')
//             // In a real app, this would open a modal/form
//         })
//     }

//     // Print invoice button
//     const printInvoiceBtn = document.getElementById('printInvoiceBtn')
//     if (printInvoiceBtn) {
//         printInvoiceBtn.addEventListener('click', function () {
//             window.print()
//             // In a real app, this would generate and print the invoice
//         })
//     }

//     // Edit payment button
//     const editPaymentBtn = document.getElementById('editPaymentBtn')
//     if (editPaymentBtn) {
//         editPaymentBtn.addEventListener('click', function () {
//             const invoiceId = document.getElementById('paymentInvoiceId')
//                 ?.textContent
//             alert(
//                 `Edit payment ${invoiceId} functionality will be implemented here`
//             )
//             // In a real app, this would open an edit modal/form
//         })
//     }

//     // Edit and Delete payment buttons in table (using event delegation)
//     if (paymentTableBody) {
//         paymentTableBody.addEventListener('click', function (e) {
//             // Handle edit button
//             if (e.target.closest('.edit-payment-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.payment-table__row')
//                 if (row) {
//                     const invoiceId =
//                         row.querySelector('.invoice-id')?.textContent ||
//                         'this payment'
//                     alert(
//                         `Edit payment ${invoiceId} functionality will be implemented here`
//                     )
//                     // In a real app, this would open an edit modal/form
//                 }
//             }
//             // Handle delete button
//             if (e.target.closest('.delete-payment-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.payment-table__row')
//                 if (row) {
//                     const invoiceId =
//                         row.querySelector('.invoice-id')?.textContent ||
//                         'this payment'
//                     if (
//                         confirm(
//                             `Are you sure you want to delete payment ${invoiceId}?`
//                         )
//                     ) {
//                         // In a real app, this would make an API call to delete
//                         row.remove()
//                     }
//                 }
//             }
//             // Handle print button
//             if (e.target.closest('.print-payment-btn')) {
//                 e.stopPropagation()
//                 const row = e.target.closest('.payment-table__row')
//                 if (row) {
//                     const paymentId = row.getAttribute('data-payment-id')
//                     openPaymentDetail(paymentId)
//                     setTimeout(() => {
//                         window.print()
//                     }, 300)
//                 }
//             }
//         })
//     }

//     // Pagination functionality
//     const paymentPrevPageBtn = document.getElementById('paymentPrevPage')
//     const paymentNextPageBtn = document.getElementById('paymentNextPage')
//     const paymentPaginationPages = document.getElementById(
//         'paymentPaginationPages'
//     )

//     if (paymentPrevPageBtn) {
//         paymentPrevPageBtn.addEventListener('click', function () {
//             const activePage = paymentPaginationPages?.querySelector(
//                 '.pagination__page--active'
//             )
//             if (activePage) {
//                 const currentPage = parseInt(activePage.textContent)
//                 if (currentPage > 1) {
//                     activePage.classList.remove('pagination__page--active')
//                     const prevPage = paymentPaginationPages?.querySelector(
//                         `.pagination__page:nth-child(${currentPage - 1})`
//                     )
//                     if (prevPage)
//                         prevPage.classList.add('pagination__page--active')
//                 }
//             }
//         })
//     }

//     if (paymentNextPageBtn) {
//         paymentNextPageBtn.addEventListener('click', function () {
//             const activePage = paymentPaginationPages?.querySelector(
//                 '.pagination__page--active'
//             )
//             if (activePage) {
//                 const currentPage = parseInt(activePage.textContent)
//                 const totalPages =
//                     paymentPaginationPages?.querySelectorAll(
//                         '.pagination__page'
//                     ).length || 10
//                 if (currentPage < totalPages) {
//                     activePage.classList.remove('pagination__page--active')
//                     const nextPage = paymentPaginationPages?.querySelector(
//                         `.pagination__page:nth-child(${currentPage + 1})`
//                     )
//                     if (nextPage)
//                         nextPage.classList.add('pagination__page--active')
//                 }
//             }
//         })
//     }

//     // Pagination page buttons
//     if (paymentPaginationPages) {
//         const pageButtons =
//             paymentPaginationPages.querySelectorAll('.pagination__page')
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
