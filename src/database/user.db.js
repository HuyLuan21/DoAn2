import users from "../mocks/users.js";

const USER_KEY = 'users'

function getUserList() {
    return JSON.parse(localStorage.getItem(USER_KEY)) || []
}

function saveUserList(list) {
    localStorage.setItem(USER_KEY, JSON.stringify(list))
}

function initUserDB() {
    if (!localStorage.getItem(USER_KEY)) {
        localStorage.setItem(USER_KEY, JSON.stringify(users))
    }
}
initUserDB()

// Session management
const CURRENT_USER_KEY = 'currentUser'

export function login(email, password) {
    const userList = getUserList()
    const user = userList.find(u => u.email === email && u.password === password)
    if (user) {
        // Save session
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
        return { success: true, user }
    }
    return { success: false, message: 'Email or password is incorrect' }
}

export function register(newUser) {
    const userList = getUserList()

    // Check if email already exists
    const emailExists = userList.find(u => u.email === newUser.email)
    if (emailExists) {
        return { success: false, message: 'Email already exists' }
    }

    // Check if username already exists
    const usernameExists = userList.find(u => u.username === newUser.username)
    if (usernameExists) {
        return { success: false, message: 'Username already exists' }
    }

    // Add createdAt timestamp
    newUser.createdAt = new Date().toISOString()
    newUser.role = newUser.role || 'student' // Default role

    userList.push(newUser)
    saveUserList(userList)
    return { success: true, message: 'Registration successful' }
}

export function getCurrentUser() {
    const userStr = localStorage.getItem(CURRENT_USER_KEY)
    return userStr ? JSON.parse(userStr) : null
}

export function logout() {
    localStorage.removeItem(CURRENT_USER_KEY)
}

export function isLoggedIn() {
    return getCurrentUser() !== null
}

export function isEmailExist(email) {
    const userList = getUserList()
    return userList.some(u => u.email === email)
}
