import Navbar from '../navbar.js'
import customFooter from '../nonStickyFooter.js'

export default ({
    template: /*html*/`
        <Navbar />
        
        <div class="row justify-content-center">
            <div class="col-12 col-md-6 d-flex justify-content-center">
                <h3 style="margin-right: 6%;">Let's get you an account:</h3>
                <h5 style="margin-right: 10%;"><button @click="registerType=0" type="button" class="btn-register">Create <span class="logo-font" style="font-size: 1.15em;">UN PATRON</span></button></h5>
                <h5><button @click="registerType=1" type="button" class="btn-register">Create <span class="logo-font" style="font-size: 1.15em;">UN PROFESSIONNEL</span></button></h5>
            </div>
        </div>

        <br>

        <div v-if="registerType == 0" class="row justify-content-center">
            <div class="col-12 col-md-6 form-container">
                <form @submit.prevent="checkFormCustomer" action="/register" method="post">
                    <div class="mb-3">
                        <label for="InputEmail" class="form-label">Email Address</label>
                        <input type="text" class="form-control" id="InputEmail" v-model="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="InputPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="InputPassword" v-model="password" required>
                    </div>
                    <div class="mb-3">
                        <label for="InputName" class="form-label">Full Name</label>
                        <input type="text" class="form-control" id="InputName" v-model="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="InputAddress" class="form-label">Home Address</label>
                        <input type="text" class="form-control" id="InputAddress" v-model="address" required>
                    </div>
                    <br>
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn">Continue</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="registerType == 1" class="row justify-content-center">
            <div class="col-12 col-md-6 form-container">
                <form @submit.prevent="checkFormServiceProfessional" action="/register" method="post">
                    <div class="mb-3">
                        <label for="InputEmail" class="form-label">Email Address</label>
                        <input type="text" class="form-control" id="InputEmail" v-model="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="InputPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="InputPassword" v-model="password" required>
                    </div>
                    <div class="mb-3">
                        <label for="InputName" class="form-label">Full Name</label>
                        <input type="text" class="form-control" id="InputName" v-model="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="InputDescription" class="form-label">Description</label>
                        <input type="text" class="form-control" id="InputDescription" v-model="description" required>
                    </div>
                    <div class="mb-3">
                        <label for="InputLoction" class="form-label">Location</label>
                        <input type="text" class="form-control" id="InputLocation" v-model="location" required>
                    </div>
                    <div class="mb-3">
                        <label for="InputServiceType" class="form-label">Service Type</label>
                        <select class="form-control" id="InputServiceType" v-model="serviceType" required>
                            <option value="" selected disabled>Select your service type</option>
                            <option v-for="service in services" :value="service.id">{{ service.name }}</option>
                        </select>
                    </div>
                    <br>
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn">Continue</button>
                    </div>
                </form>
            </div>
        </div>

        <br><br>

        <customFooter />
    `,

    components: {
        Navbar,
        customFooter
    },

    methods : {
        checkFormCustomer: function(e) {
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

        checkFormServiceProfessional: function(e) {
            var check = 1
            if (!this.email || !this.password) {
                check = 0
            } 

            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!re.test(this.email)) {
                check = 0
            }

            if (!this.serviceType) {
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
            if (this.registerType == 0) {
                const formData = {
                    email: this.email,
                    password: this.password,
                    name: this.name,
                    address: this.address,
                    registerType: this.registerType
                }

                try {
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    })

                    if (response.ok) {
                        alert('Account created successfully. Please login to continue.')
                        window.location.href = '/login'
                    } else {
                        var data = await response.json()
                        if (data['message']) {
                            alert(data['message'])
                        } else {
                            alert('Invalid credentials. Please try again.')
                        }
                    }
                } catch (error) {
                    alert('Error:', error)
                }
            }

            else if (this.registerType == 1) {
                const formData = {
                    email: this.email,
                    password: this.password,
                    name: this.name,
                    description: this.description,
                    location: this.location,
                    serviceType: this.serviceType,
                    registerType: this.registerType
                }

                try {
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    })

                    if (response.ok) {
                        alert('Account created successfully. Please login to continue.')
                        window.location.href = '/login'
                    } else {
                        var data = await response.json()
                        if (data["message"]) {
                            alert(data["message"])
                        } else {
                            alert('Invalid credentials. Please try again.')
                        }
                    }
                } catch (error) {
                    alert('Error:', error)
                }
            }
        },

        async getServices() {
            const response = await fetch('/api/services')
            const services = await response.json()
            this.services = services
        }
    },

    data() {
        return {
            registerType: 0,
            email: '',
            password: '',
            name: '',
            address: '',
            description: '',
            location: '',
            serviceType: 0,
            services: []
        }
    },

    mounted() {
        this.getServices()
    }
})