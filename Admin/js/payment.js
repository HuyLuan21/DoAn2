import { getAllInvoices, getInvoiceById, deleteInvoice } from '/src/database/invoice.db.js'
import { getAllStudents } from '/src/database/student.db.js'
import { getAllEnrollments } from '/src/database/enrollment.db.js'


let students = getAllStudents()
let enrollments = getAllEnrollments()


function GetStudentNameById(enrollmentId) {
    const enrollment = enrollments.find(e => e.enrollmentId === enrollmentId)
    if (!enrollment) return 'Không xác định'

    const student = students.find(s => s.studentId === enrollment.studentId)
    return student ? student.fullName : 'Không xác định'
}

// =======================================================
// 3. RENDER TABLE
// =======================================================
function renderInvoicesTable() {
    const invoices = getAllInvoices() 
    const tableBody = document.querySelector('.invoice__table_body')
    tableBody.innerHTML = ''

    invoices.forEach(invoice => {
        const formatted = invoice.finalAmount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        })

        tableBody.innerHTML += `
            <tr>
                <td>${invoice.invoiceId}</td>
                <td>${GetStudentNameById(invoice.enrollmentId)}</td>
                <td>${formatted}</td>
                <td>${invoice.paymentDate ? invoice.paymentDate.split('-').reverse().join('-') : 'null'}</td>
                <td>${invoice.status}</td>
                <td>
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
    if (!invoice) return

    const studentName = GetStudentNameById(invoice.enrollmentId)

    console.log('Hóa đơn:', invoice)
    console.log('Học viên:', studentName)

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
    renderInvoicesTable() 
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
    modal.init()
    setupInvoiceEvents()
})
