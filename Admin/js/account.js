import { getAllAccounts, getAccountById, updateAccount, deleteAccount } from '../../src/database/account.db.js'
import { getAllTeachers } from '../../src/database/teacher.db.js'
import { getAllStudents } from '../../src/database/student.db.js'
//lay ra email dua tren ma tai khoan
function GetAccountEmail(accountId) {
    const account = getAccountById(accountId)
    if (account.role === 'teacher') {
        const teacher = getAllTeachers().find(teacher => teacher.accountId === account.accountId)
        if (teacher && teacher.email != '') return teacher.email
        else return 'Chưa cập nhật email'
    } else if (account.role === 'student') {
        const student = getAllStudents().find(student => student.accountId === account.accountId)
        if (student.email != '') return student.email
        else {
            return 'Chưa cập nhật email'
        }
    } else {
        return 'Đây là tài khoản admin'
    }
}

function setupSearchAndFilter() {
    const searchInput = document.getElementById('search__input')
    const roleFilter = document.getElementById('type')
    const clearBtn = document.getElementById('clear')

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = ''
            roleFilter.value = 'all'
            renderTable()
        })
    }

    const handleFilter = () => {
        const searchTerm = searchInput.value.toLowerCase()
        const selectedRole = roleFilter.value
        renderTable(searchTerm, selectedRole)
    }

    searchInput?.addEventListener('input', handleFilter)
    roleFilter?.addEventListener('change', handleFilter)
}

function renderTable(searchTerm = '', selectedRole = 'all') {
    const accounts = getAllAccounts()
    const tableBody = document.querySelector('.account__table_body')
    tableBody.innerHTML = ''

    const filteredAccounts = accounts.filter(account => {
        const matchesRole = selectedRole === 'all' || account.role === selectedRole

        const matchesSearch =
            account.username.toLowerCase().includes(searchTerm) || account.accountId.toString().includes(searchTerm)

        return matchesRole && matchesSearch
    })

    if (filteredAccounts.length === 0) {
        const row = document.createElement('tr')
        row.innerHTML = `<td colspan="6" style="text-align:center; padding: 20px;">Không tìm thấy kết quả</td>`
        tableBody.appendChild(row)
        return
    }

    filteredAccounts.forEach(account => {
        const row = document.createElement('tr')

        row.innerHTML = `
            <td data-label="Mã tài khoản">${account.accountId}</td>
            <td data-label="Tên người dùng">${account.username}</td>
            <td data-label="Mật khẩu">${account.password}</td>
            <td data-label="Email">${GetAccountEmail(account.accountId)}</td>
            <td data-label="Vai trò">${account.role}</td>
            <td data-label="Thao tác">
                <button class="edit-account" data-id="${account.accountId}"><i class="fa-solid fa-pencil"></i></button>
                <button class="delete-account" data-id="${account.accountId}"><i class="fa-solid fa-trash"></i></button>
            </td>
        `
        tableBody.appendChild(row)
    })
}
const modal = {
    overlay: null,
    form: null,
    closeButton: null,

    init() {
        this.overlay = document.querySelector('.modal-overlay')
        this.form = document.getElementById('account_modal')
        this.closeButton = this.form?.querySelector('.close-modal')
        this.cancelButton = this.form?.querySelectorAll('.close-modal-btn, .btn-cancel')
        this.closeButton?.addEventListener('click', () => this.close())
        this.cancelButton.forEach(button => {
            button.addEventListener('click', () => this.close())
        })
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
function handleEditAccount(accountId) {
    const account = getAccountById(accountId)
    if (!account) return

    document.getElementById('account-id').value = account.accountId
    document.getElementById('account-username').value = account.username
    document.getElementById('account-password').value = account.password
    document.getElementById('account-email').value = GetAccountEmail(account.accountId)
    document.getElementById('account-role').value = account.role

    if (accountId === 0) {
        document.getElementById('account-role').disabled = true
    } else {
        document.getElementById('account-role').disabled = false
    }

    modal.open()
}
function handleDeleteAccount(accountId) {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
        const result = deleteAccount(accountId)
        if (result) {
            alert('Xóa tài khoản thành công!')
            renderTable()
        } else {
            alert('Có lỗi xảy ra khi xóa tài khoản!')
        }
    }
}
// =======================================================
// 6. EVENT DELEGATION (QUAN TRỌNG)
// =======================================================
function setupAccountEvents() {
    const tableBody = document.querySelector('.account__table_body')

    tableBody.addEventListener('click', e => {
        const editBtn = e.target.closest('.edit-account')
        const deleteBtn = e.target.closest('.delete-account')

        if (editBtn) {
            handleEditAccount(Number(editBtn.dataset.id))
        }

        if (deleteBtn) {
            if (deleteBtn.dataset.id === '0') {
                alert('Không thể xóa tài khoản admin')
            } else {
                handleDeleteAccount(Number(deleteBtn.dataset.id))
            }
        }
    })
}

// =======================================================
// 8. FORM SUBMISSION
// =======================================================
function setupFormSubmit() {
    const submitBtn = document.querySelector('#account_form .btn-submit')

    if (!submitBtn) return

    submitBtn.addEventListener('click', e => {
        e.preventDefault()

        const accountId = Number(document.getElementById('account-id').value)
        const username = document.getElementById('account-username').value
        const password = document.getElementById('account-password').value
        const roleSelect = document.getElementById('account-role')
        // For admin account (id 0), force role to stay as 'admin'
        const role = accountId === 0 ? 'admin' : roleSelect.value

        const updatedInfo = {
            username,
            password,
            role,
            updatedAt: new Date().toISOString().split('T')[0],
        }

        const result = updateAccount(accountId, updatedInfo)

        if (result) {
            modal.close()
            renderTable()
        } else {
            alert('Có lỗi xảy ra khi cập nhật!')
        }
    })
}

// =======================================================
// 7. INIT
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    renderTable()
    setupSearchAndFilter() // Add search init
    modal.init()
    setupAccountEvents()
    setupFormSubmit()
})
