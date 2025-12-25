import mockAccount from '../mocks/account.js'
const Account_KEY = 'accounts'
function getAccountList() {
    return JSON.parse(localStorage.getItem(Account_KEY))
}
function saveAccountList(list) {
    localStorage.setItem(Account_KEY, JSON.stringify(list))
}
function initAccountDB() {
    const existing = getAccountList()
    if (!existing) {
        saveAccountList(mockAccount)
    }
}
initAccountDB()
export function getAllAccounts() {
    return getAccountList()
}
export function getAccountById(id) {
    const accounts = getAccountList()
    return accounts.find(account => account.accountId === id) || null
}
export function addAccount(account) {
    const accounts = getAccountList()
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.accountId)) + 1 : 1
    const newAccount = { accountId: newId, ...account }
    accounts.push(newAccount)
    saveAccountList(accounts)
}
export function updateAccount(id, updatedInfo) {
    const accounts = getAccountList()
    const index = accounts.findIndex(account => account.accountId === id)
    if (index === -1) {
        return null
    }
    accounts[index] = { ...accounts[index], ...updatedInfo }
    saveAccountList(accounts)
    return accounts[index]
}
export function deleteAccount(id) {
    const accounts = getAccountList()
    const index = accounts.findIndex(account => account.accountId === id)
    if (index === -1) {
        return false
    }
    accounts.splice(index, 1)
    saveAccountList(accounts)
    return true
}
