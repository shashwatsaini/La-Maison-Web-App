import home from './components/home/home.js'
import login from './components/login/login.js'
import adminLogin from './components/login/adminLogin.js'
import register from './components/login/register.js'
import adminDash from './components/admin/adminDash.js'
import adminStats1 from './components/admin/adminStats1.js'
import customerDash from './components/customer/customerDash.js'
import payment from './components/customer/payment.js'
import serviceProfessionalDash from './components/serviceProfessional/serviceProfessionalDash.js'

const routes = [
    { path: '/', component: home, name: 'home' },
    { path: '/login', component: login, name: 'login' },
    { path: '/adminLogin', component: adminLogin, name: 'adminLogin' },
    { path: '/register', component: register, name: 'register' },
    { path: '/adminDash', component: adminDash, name: 'adminDash' },
    { path: '/adminStats1', component: adminStats1, name: 'adminStats1' },
    { path: '/customerDash', component: customerDash, name: 'customerDash' },
    { path: '/payment', component: payment, name: 'payment' },
    { path: '/serviceProfessionalDash', component: serviceProfessionalDash, name: 'serviceProfessionalDash' }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
})

export default router
