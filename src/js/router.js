const role = localStorage.getItem('role')

if (!role) {
    // chưa đăng nhập
    location.href = '/login.html'
} else if (role === 'admin' && !location.pathname.includes('/admin/')) {
    location.href = '/pages/admin/dashboard.html'
} else if (role === 'teacher' && !location.pathname.includes('/teacher/')) {
    location.href = '/pages/teacher/dashboard.html'
} else if (role === 'user' && !location.pathname.includes('/user/')) {
    location.href = '/pages/user/home.html'
}
