import Navbar from '../navbar.js'
import customFooter from '../footer.js'

export default ({
    template: `
        <Navbar />

        <div class="row justify-content-center">
            <div class="col-12 col-md-6">
                <h2>Sign in to your admin dash.</h2>
            </div>
        </div>

        <br>

        <div class="row justify-content-center">
            <div class="col-12 col-md-6 form-container">
                <form @submit.prevent="checkForm" action="/adminLogin" method="post">
                    <div class="mb-3">
                        <label for="InputEmail" class="form-label">Email Address</label>
                        <input type="text" class="form-control" id="InputEmail" v-model="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="InputPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="InputPassword" v-model="password" required>
                    </div>
                    <br>
                    <div class="mb-3" style="text-align: center;">
                        <span>Unable to sign in? You may need to check in with the owner.</span>
                    </div>
                    <br>
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn">Continue</button>
                    </div>
                </form>
            </div>
        </div>

        <customFooter />
    `,

    components: {
        Navbar,
        customFooter
    },

    methods: {
        checkForm: function(e) {
            var check = 1
            if (!this.email || !this.password) {
                check = 0
            } 

            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!re.test(this.email)) {
                check = 0
            }

            if (check == 0) {
                e.preventDefault()
                alert('Invalid credentials. Please try again.')
            } else {
                this.handleSubmit()
            }
        },
        
        async handleSubmit() {
            const formData = {
                email: this.email,
                password: this.password,
            }

            try {
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })

                if (response.ok) {
                    const { token } = await response.json()
                    localStorage.setItem('token', token)
                    window.location.href = '/adminDash'
                } else {
                    alert('Invalid credentials. Please try again.')
                }
            } catch (error) {
                alert('Error:', error)
            }
        }
    },

    data() {
        return {
            email: '',
            password: ''
        }
    }
})
