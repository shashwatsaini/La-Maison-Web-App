import Navbar from '../navbar.js'
import customFooter from '../nonStickyFooter.js'
import seperator from '../lineSeperator.js'

export default ({
    template: /*html*/`
        <link rel="stylesheet" href="/static/css/serviceProfessionalDash.css">
        <Navbar />

        <div class="row justify-content-center">
            <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                <h3 style="margin-right: 6%;">Welcome, <span class="logo-font">PROFESSIONNEL</span> {{ professional.name }}</h3>
                <h5><button @click="signout()" type="button" class="btn">Sign out</button></h5>
            </div>
        </div>

        <seperator />

        <div v-if="customerRequests[0]">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <h3>Your pending requests are here, you can view & accept them.</h3>
                </div>
            </div>

            <br>

            <div class="container">
                <div class="row justify-content-center g-4">
                    <div v-for="(request, index) in customerRequests" class="col-3 col-md-4">
                        <div class="card d-flex flex-row align-items-center p-3">
                            <div class="d-flex flex-column align-items-center" style="margin-right: 15px;">
                                <img :src="services[request.service_type - 1].icon_path" alt="service logo" class="card-img-left" style="width: 80px; height: 80px; margin-bottom: 30px; padding: 10px;">
                                <div class="d-flex flex-column justify-content-center align-items-center w-100">
                                    <button type="button" @click="acceptCustomerRequest(request.id)" class="btn-serviceProfessionalApprove d-flex align-items-center justify-content-center mb-2 w-100">
                                        <i class="fa fa-check"></i>
                                    </button>
                                    <button type="button" @click="rejectCustomerRequest(request.id)" class="btn-serviceProfessionalReject d-flex align-items-center justify-content-center mb-2 w-100">
                                        <i class="fa fa-times"></i>
                                    </button>
                                    <button type="button" class="btn-serviceProfessionalWhite d-flex align-items-center justify-content-center mb-2 w-100">
                                        $ {{ services[request.service_type - 1].price }}
                                    </button>
                                </div>
                            </div>

                            <div class="d-flex flex-column justify-content-between" style="flex-grow: 1;">
                                <h6 class="card-title">{{ request.service_name }} Service</h6>
                                <br>
                                <p class="card-text">{{ request.description }}</p>
                                <p class="card-text">Booked for: {{ request.for_day }}, {{ request.for_date }}</p>
                                <p class="card-text"><span class="logo-font">PATRON</span> address: {{ request.customer_address }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <seperator />
        </div>

        <div class="row justify-content-center">
            <div class="col-12 col-md-6 d-flex justify-content-center">
                <h3 style="margin-right: 6%;"><span class="logo-font" style="font-size: 1.15em;">10,000 + PATRONS.</span></h3>
                <h3><span class="logo-font" style="font-size: 1.15em;">100 + PROFESSIONNELS.</span></h3>
            </div>
        </div>

        <br>

        <div class="row justify-content-center">
            <div class="col-12 d-flex justify-content-center">
                <h4>Our reach speaks for itself,</h4>
            </div>
            <div class="col-12 d-flex justify-content-center">
                <h4>glad you're in the community.</h4>
            </div>
        </div>

        <seperator />

        <div class="row justify-content-center">
            <div class="col-12 col-md-6 d-flex justify-content-center">
                <h4>Don't trust us? Check our reviews.</h4>
            </div>

            <br><br>

            <div class="col-12 col-md-9 d-flex flex-wrap justify-content-center">                
                <div v-for="review in reviews" class="card d-flex flex-row align-items-center p-3" style="width: 18rem; margin: 10px;">
                    <div class="card-body p-0">
                        <h6 class="card-title">{{ review.name }}</h6>
                        <p v-if="review.type" class="card-text">{{ review.type }}, <span class="logo-font" style="font-size: 1.15em">UN {{ review.user }}</span></p>
                        <p v-if="!review.type" class="card-text"><span class="logo-font" style="font-size: 1.15em">UN {{ review.user }}</span></p>
                        <p class="card-text">{{ review.review }}</p>
                    </div>
                </div>
            </div>
        </div>

        <br>

        <seperator />

        <br>

        <customFooter />
    `,

    components: {
        Navbar,
        customFooter,
        seperator
    },

    methods: {
        signout: function() {
            localStorage.removeItem('token')
            alert('You have been signed out. Redirecting to home page.')
            window.location.href = '/'
        },

        getToken: function() {
            return localStorage.getItem('token')
        },

        async getServiceProfessional(){
            const response = await fetch('/api/service-professional', {
                headers: {
                    'x-access-token': this.token
                }
            })

            const professional = await response.json()
            this.professional = professional
        },
        
        async getCustomerRequests() {
            const response = await fetch('/api/service-professionals/customer/requests', {
                headers: {
                    'x-access-token': this.token
                }
            })

            const customerRequests = await response.json()
            this.customerRequests = customerRequests
        },

        async acceptCustomerRequest(id) {      
            const response = await fetch('/api/service-professionals/customer/requests/accept', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.token
                },
                body: JSON.stringify({ id: id })
            })

            if (response.ok) {
                alert('Request accepted successfully.')
                this.getCustomerRequests()
            } else {
                alert('Failed to accept request.')
            }
        },

        async rejectCustomerRequest(id) {
            const response = await fetch('/api/service-professionals/customer/requests/reject', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.token
                },
                body: JSON.stringify({ id: id })
            })

            if (response.ok) {
                alert('Request rejected successfully.')
                this.getCustomerRequests()
            } else {
                alert('Failed to reject request.')
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
            token: '',
            professional: [],
            customerRequests: [],
            serviceView: 0,

            services: [],
            reviews: [
                {
                    name: 'Bob The Builder',
                    type: 'Repair',
                    user: 'PROFESSIONNEL',
                    review: 'Well, this site’s as sturdy as a well-built shed—clean, quick, and does the job right! Whoever built this definitely knows their way around the web like I know my hammer.'
                },
                {
                    name: 'Sokrates The Philosopher',
                    user: 'PATRON',
                    review: 'This website, much like the pursuit of wisdom, is simple yet profound. It invites inquiry and rewards those who seek with clarity and purpose.'
                },
                {
                    name: 'Glam Guru',
                    type: 'Beauty',
                    user: 'PROFESSIONNEL',
                    review: 'Darlings, this website is simply fabulous! It\'s like a makeover for your browsing experience—flawless, stylish, and absolutely dazzling!'
                }
            ]
        }
    },

    mounted() {
        this.token = this.getToken()
        if (!this.token) {
            alert('You are not logged in. Redirecting to login page.')
            window.location.href = '/login'
        }

        this.getServiceProfessional()
        this.getCustomerRequests()
        this.getServices()
    }
})