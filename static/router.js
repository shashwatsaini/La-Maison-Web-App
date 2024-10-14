import home from './components/home/home.js'
import login from './components/login/login.js'
import adminLogin from './components/login/adminLogin.js'
import register from './components/login/register.js'
import adminDash from './components/admin/adminDash.js'
import customerDash from './components/customer/customerDash.js'

const routes = [
    { path: '/', component: home, name: 'home' },
    { path: '/login', component: login, name: 'login' },
    { path: '/adminLogin', component: adminLogin, name: 'adminLogin' },
    { path: '/register', component: register, name: 'register' },
    { path: '/adminDash', component: adminDash, name: 'adminDash' },
    { path: '/customerDash', component: customerDash, name: 'customerDash' }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
})

export default router
