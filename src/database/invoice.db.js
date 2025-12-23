import mockInvoices from '../mocks/invoices.js'

const INVOICE_KEY = 'invoices'

function getInvoiceList() {
    return JSON.parse(localStorage.getItem(INVOICE_KEY))
}

function saveInvoiceList(list) {
    localStorage.setItem(INVOICE_KEY, JSON.stringify(list))
}

function initInvoiceDB() {
    const existing = getInvoiceList()
    if (!existing) {
        saveInvoiceList(mockInvoices)
    }
}
initInvoiceDB()

export function getAllInvoices() {
    return getInvoiceList()
}

export function getInvoiceById(id) {
    const invoices = getInvoiceList()
    return invoices.find(invoice => invoice.invoiceId === Number(id)) || null
}

export function getInvoiceByEnrollmentId(enrollmentId) {
    const invoices = getInvoiceList()
    return invoices.find(invoice => invoice.enrollmentId === Number(enrollmentId)) || null
}

export function addInvoice(invoice) {
    const invoices = getInvoiceList()
    const newId = invoices.length > 0 ? Math.max(...invoices.map(i => i.invoiceId)) + 1 : 1
    const newInvoice = { invoiceId: newId, ...invoice }
    invoices.push(newInvoice)
    saveInvoiceList(invoices)
    return newInvoice
}

export function updateInvoice(id, updatedInfo) {
    const invoices = getInvoiceList()
    const index = invoices.findIndex(invoice => invoice.invoiceId === Number(id))
    if (index === -1) {
        return null
    }
    invoices[index] = { ...invoices[index], ...updatedInfo }
    saveInvoiceList(invoices)
    return invoices[index]
}

export function deleteInvoice(id) {
    const invoices = getInvoiceList()
    const index = invoices.findIndex(invoice => invoice.invoiceId === Number(id))
    if (index === -1) {
        return false
    }
    invoices.splice(index, 1)
    saveInvoiceList(invoices)
    return true
}
