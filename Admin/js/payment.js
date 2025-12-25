import { getAllInvoices, getInvoiceById, deleteInvoice } from '../../src/database/invoice.db.js'
import { getStudentById } from '../../src/database/student.db.js'
import { getEnrollmentById } from '../../src/database/enrollment.db.js'
import { getClassById } from '../../src/database/classes.db.js'
import { getCourseById } from '../../src/database/courses.db.js'

function GetStudentNameById(enrollmentId) {
    const enrollment = getEnrollmentById(enrollmentId)
    if (!enrollment) return 'Không xác định'

    const student = getStudentById(enrollment.studentId)
    return student ? student.fullName : 'Không xác định'
}

// =======================================================
// 3. RENDER TABLE
// =======================================================
// =======================================================
// 3. RENDER TABLE
// =======================================================
function renderInvoicesTable(invoices = getAllInvoices()) {
    const tableBody = document.querySelector('.invoice__table_body')
    tableBody.innerHTML = ''

    if (invoices.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Không tìm thấy kết quả</td></tr>'
        return
    }

    invoices.forEach(invoice => {
        const formatted = invoice.finalAmount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        })

        tableBody.innerHTML += `
            <tr>
                <td data-label="Mã Hóa đơn">${invoice.invoiceId}</td>
                <td data-label="Tên Học Viên">${GetStudentNameById(invoice.enrollmentId)}</td>
                <td data-label="Thành tiền">${formatted}</td>
                <td data-label="Ngày thanh toán">${
                    invoice.paymentDate ? invoice.paymentDate.split('-').reverse().join('-') : 'null'
                }</td>
                <td data-label="Trạng thái">${invoice.status}</td>
                <td data-label="Thao tác">
                    <button class="view-payment" data-id="${invoice.invoiceId}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="delete-invoice" data-id="${invoice.invoiceId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
    })
}

// =======================================================
// 8. SEARCH AND FILTER
// =======================================================
function setupSearchAndFilter() {
    const searchInput = document.getElementById('search__input')
    const typeSelect = document.getElementById('type')
    const dateInput = document.getElementById('date')
    const clearBtn = document.getElementById('clear')

    function filterData() {
        const searchTerm = searchInput.value.toLowerCase().trim()
        const statusFilter = typeSelect.value
        const dateFilter = dateInput.value

        let filtered = getAllInvoices()

        // Filter by Search Term (Invoice ID or Student Name)
        if (searchTerm) {
            filtered = filtered.filter(invoice => {
                const studentName = GetStudentNameById(invoice.enrollmentId).toLowerCase()
                const invoiceId = invoice.invoiceId.toString()
                return studentName.includes(searchTerm) || invoiceId.includes(searchTerm)
            })
        }

        // Filter by Status
        if (statusFilter !== 'all') {
            const mappedStatus = statusFilter === 'paid' ? 'Paid' : 'Unpaid'
            filtered = filtered.filter(invoice => invoice.status === mappedStatus)
        }

        // Filter by Date
        if (dateFilter) {
            filtered = filtered.filter(invoice => invoice.paymentDate === dateFilter)
        }

        renderInvoicesTable(filtered)
    }

    searchInput.addEventListener('input', filterData)
    typeSelect.addEventListener('change', filterData)
    dateInput.addEventListener('change', filterData)

    clearBtn.addEventListener('click', () => {
        searchInput.value = ''
        typeSelect.value = 'all'
        dateInput.value = ''
        renderInvoicesTable(getAllInvoices())
    })
}

// =======================================================
// 4. MODAL
// =======================================================
const modal = {
    overlay: null,
    form: null,
    closeButton: null,

    init() {
        this.overlay = document.querySelector('.modal-overlay')
        this.form = document.getElementById('payment_modal')
        this.closeButton = this.form?.querySelector('.close-modal')

        this.closeButton?.addEventListener('click', () => this.close())
        this.overlay?.addEventListener('click', e => {
            if (e.target === this.overlay) this.close()
        })

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.form?.classList.contains('active')) {
                this.close()
            }
        })
    },

    open() {
        this.overlay?.classList.add('active')
        this.form?.classList.add('active')
    },

    close() {
        this.overlay?.classList.remove('active')
        this.form?.classList.remove('active')
    },
}

// =======================================================
// 5. ACTION HANDLERS
// =======================================================
function HandleViewInvoice(invoiceId) {
    const invoice = getInvoiceById(invoiceId)
    const enrollment = getEnrollmentById(invoice.enrollmentId)
    const student = getStudentById(enrollment.studentId)
    const classes = getClassById(enrollment.classId)
    const course = getCourseById(classes.coursesId)
    const courseName = course.courseName

    if (!invoice) return

    const studentName = document.querySelector('.form-group .student__Name')
    const studentEmail = document.querySelector('.form-group .student__email')
    const studentContact = document.querySelector('.form-group .student__contact')
    studentName.innerHTML = `<b>Tên học viên:</b> ${student.fullName}`
    studentEmail.innerHTML = `<b>Email:</b> ${student.email}`
    studentContact.innerHTML = `<b>Số điện thoại:</b> ${student.phone}`

    const paymentId = document.querySelector('.form-group .payment__id')
    const paymentDetail = document.querySelector('.form-group .payment__detail')
    const paymentAmount = document.querySelector('.form-group .payment__amount')
    const paymentDate = document.querySelector('.form-group .payment__date')
    const paymentStatus = document.querySelector('.form-group .payment__status')
    paymentId.innerHTML = `<b>Mã hóa đơn:</b> ${invoice.invoiceId}`
    paymentDetail.innerHTML = `<b>Khóa học:</b> ${courseName}`
    paymentAmount.innerHTML = `<b>Thành tiền:</b> ${invoice.finalAmount.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    })}`
    paymentDate.innerHTML = `<b>Ngày thanh toán:</b> ${
        invoice.paymentDate ? invoice.paymentDate.split('-').reverse().join('-') : 'null'
    }`
    paymentStatus.innerHTML = `<b>Trạng thái:</b> ${invoice.status}`
    modal.open()
}

function HandleDeleteInvoice(invoiceId) {
    const invoice = getInvoiceById(invoiceId)
    if (!invoice) return

    if (!['Cancelled', 'Unpaid'].includes(invoice.status)) {
        alert('Chỉ được xóa hóa đơn chưa thanh toán hoặc đã hủy')
        return
    }

    deleteInvoice(invoiceId)
    // Re-run filter to update table correctly with current filters
    const searchInput = document.getElementById('search__input')
    if (searchInput.value || document.getElementById('type').value !== 'all' || document.getElementById('date').value) {
        searchInput.dispatchEvent(new Event('input')) // Trigger filter update
    } else {
        renderInvoicesTable()
    }
}

// =======================================================
// 6. EVENT DELEGATION (QUAN TRỌNG)
// =======================================================
function setupInvoiceEvents() {
    const tableBody = document.querySelector('.invoice__table_body')

    tableBody.addEventListener('click', e => {
        const viewBtn = e.target.closest('.view-payment')
        const deleteBtn = e.target.closest('.delete-invoice')

        if (viewBtn) {
            HandleViewInvoice(Number(viewBtn.dataset.id))
        }

        if (deleteBtn) {
            HandleDeleteInvoice(Number(deleteBtn.dataset.id))
        }
    })
}

// =======================================================
// 7. INIT
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    renderInvoicesTable()
    setupSearchAndFilter()
    modal.init()
    setupInvoiceEvents()
})
