import Navbar from '../navbar.js'
import customFooter from '../nonStickyFooter.js'
import seperator from '../lineSeperator.js'

export default ({
    template: `
        <Navbar />

        <div class="row justify-content-center">
            <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                <h3 style="margin-right: 6%;">Where services come to you.</h3>
                <h5><button onclick="window.location.href='/login'" type="button" class="btn">Sign in to <span class="logo-font" style="font-size: 1.15em;">TON MAISON</span></button></h5>
            </div>
        </div>

        <customFooter />
    `,

    components: {
        Navbar,
        customFooter,
        seperator
    },

    methods: {
        getToken: function() {
            return localStorage.getItem('token')
        }
    },

    data() {
        return {
            token: ''
        }
    },

    mounted() {
        this.token = this.getToken()
        console.log(this.token)
        if (!this.token) {
            alert('You are not logged in. Redirecting to login page.')
            window.location.href = '/adminLogin'
        }
    }
})
