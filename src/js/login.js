import { getAllAccounts } from '../../src/database/account.db.js'
const username = document.getElementById('username')
const password = document.getElementById('password')
const submitBtn = document.querySelector('.btn-primary')
submitBtn.addEventListener('click', () => {
    console.log(username.value, password.value)
    const account = getAllAccounts().find(
        account => account.username === username.value && account.password === password.value
    )
    if (account.role === 'admin') {
        alert('Login successful')
        window.location.href = './Admin/dashboard.html'
    } else if (account.role === 'teacher') {
        alert('Login successful')
        window.location.href = './Teacher/dashboard.html'
    } else if (account.role === 'student') {
        alert('Login successful')
        window.location.href = './User/home.html'
    }
})
