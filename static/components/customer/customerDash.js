import Navbar from '../navbar.js'
import customFooter from '../nonStickyFooter.js'
import seperator from '../lineSeperator.js'

export default ({
    template: /*html*/`
        <link rel="stylesheet" href="/static/css/customerDash.css">
        <Navbar />

        <div class="row justify-content-center">
            <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                <h3 style="margin-right: 6%;">Welcome, <span class="logo-font">PATRON</span> {{ customer.name }}</h3>
                <h5><button @click="signout()" type="button" class="btn">Sign out</button></h5>
            </div>
        </div>

        <seperator />

        <div v-if="serviceRequests[0]">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <h3>Your active requests are here, hang tight!</h3>
                </div>
            </div>

            <br>

            <div class="container">
                <div class="row justify-content-center g-4">
                    <div v-for="(request, index) in serviceRequests" class="col-3 col-md-4">
                        <div class="card d-flex flex-row align-items-center p-3">
                            <div class="d-flex flex-column align-items-center" style="margin-right: 15px;">
                                <img :src="services[request.service_type - 1].icon_path" alt="service logo" class="card-img-left" style="width: 80px; height: 80px; margin-bottom: 30px; padding: 10px;">
                                <div class="d-flex flex-column justify-content-center align-items-center w-100">
                                    <button type="button" class="btn-customerWhite d-flex align-items-center justify-content-center mb-2 w-100">
                                        $ {{ services[request.service_type - 1].price }}
                                    </button>
                                    <button type="button" @click="cancelServiceRequest(request.id)" class="btn d-flex align-items-center justify-content-center mb-2 w-100" style="background-color: red;">
                                        <i class="fa fa-times" style="margin-right: 10px;"></i> Cancel
                                    </button>
                                </div>
                            </div>

                            <div class="d-flex flex-column justify-content-between" style="flex-grow: 1;">
                                <h6 class="card-title"><span style="margin-right: 6%;">{{ request.serviceProfessional_name }}</span> {{ request.serviceProfessional_rating.toFixed(1) }} <i class="fa-regular fa-star"></i></h6>
                                <h6 class="card-title">{{ request.service_name }} Service</h6>
                                <br>
                                <p class="card-text">{{ request.description }}</p>
                                <p class="card-text">Booked for: {{ request.for_day }}, {{ request.for_date }}</p>
                                <p class="card-text"><span class="logo-font">PROFESSIONNEL</span> description: {{ request.serviceProfessional_description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <seperator />
        </div>

        <div v-if="completedServiceRequests[0]">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <h3>Your completed services are here, please proceed to payment.</h3>
                </div>
            </div>

            <br>

            <div class="container">
                <div class="row justify-content-center g-4">
                    <div v-for="(request, index) in completedServiceRequests" class="col-3 col-md-4">
                        <div class="card d-flex flex-row align-items-center p-3">
                            <div class="d-flex flex-column align-items-center" style="margin-right: 15px;">
                                <img :src="services[request.service_type - 1].icon_path" alt="service logo" class="card-img-left" style="width: 80px; height: 80px; margin-bottom: 30px; padding: 10px;">
                                <div class="d-flex flex-column justify-content-center align-items-center w-100">
                                    <button type="button" class="btn-customerWhite d-flex align-items-center justify-content-center mb-2 w-100">
                                        $ {{ services[request.service_type - 1].price }}
                                    </button>
                                    <button type="button" class="btn d-flex align-items-center justify-content-center mb-2 w-100">
                                        <i class="fa-regular fa-credit-card" style="margin-right: 10px;"></i> Pay
                                    </button>
                                    <button type="button" v-if="!request.rating" @click="completedServiceRequestView=request.id" class="btn d-flex align-items-center justify-content-center mb-2 w-100">
                                        <i class="fa-regular fa-comments" style="margin-right: 10px;"></i> Review
                                    </button>
                                </div>
                            </div>

                            <div class="d-flex flex-column justify-content-between" style="flex-grow: 1;">
                                <h6 class="card-title"><span style="margin-right: 6%;">{{ request.serviceProfessional_name }}</span> {{ request.serviceProfessional_rating.toFixed(1) }} <i class="fa-regular fa-star"></i></h6>
                                <h6 class="card-title">{{ request.service_name }} Service</h6>
                                <br>
                                <p class="card-text">{{ request.description }}</p>
                                <p class="card-text">Booked for: {{ request.for_day }}, {{ request.for_date }}</p>
                                <p class="card-text"><span class="logo-font">PROFESSIONNEL</span> description: {{ request.serviceProfessional_description }}</p>
                            </div>
                        </div>

                        <div v-if="completedServiceRequestView == request.id" class="w-100">
                            <br>
                            <div class="card d-flex flex-column align-items-center p-3 h-100">
                                <form @submit.prevent="checkFormCompletedServiceRequest" method="patch" class="w-100">
                                    <div class="mb-3">
                                        <label for="InputRemarks" class="form-label">Service Remarks</label>
                                        <input type="text" class="form-control" id="InputRemarks" v-model="completedServiceRequest_remarks">
                                    </div>
                                    <div class="mb-3">
                                        <label for="InputRating" class="form-label">Service Rating</label>
                                        <input type="number" class="form-control" id="InputRating" v-model="completedServiceRequest_rating" min=0 max=5 required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <seperator />
        </div>

        <div v-if="customerRequests[0]">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <h3>Your pending requests are here, you can view & modify them.</h3>
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
                                    <button type="button" @click="modifyCustomerRequestView = request.id" class="btn d-flex align-items-center justify-content-center mb-2 w-100">
                                        <i class="fa fa-cog" style="margin-right: 10px;"></i> Modify
                                    </button>
                                    <button type="button" class="btn-customerWhite d-flex align-items-center justify-content-center mb-2 w-100">
                                        $ {{ services[request.service_type - 1].price }}
                                    </button>
                                </div>
                            </div>

                            <div class="d-flex flex-column justify-content-between" style="flex-grow: 1;">
                                <h6 class="card-title"><span style="margin-right: 6%;">{{ request.serviceProfessional_name }}</span> {{ request.serviceProfessional_rating.toFixed(1) }} <i class="fa-regular fa-star"></i></h6>
                                <h6 class="card-title">{{ request.service_name }} Service</h6>
                                <br>
                                <p class="card-text">{{ request.description }}</p>
                                <p class="card-text">Booked for: {{ request.for_day }}, {{ request.for_date }}</p>
                                <p class="card-text"><span class="logo-font">PROFESSIONNEL</span> description: {{ request.serviceProfessional_description }}</p>
                            </div>
                        </div>

                        <div v-if="modifyCustomerRequestView == request.id" class="w-100">
                            <br>
                            <div class="card d-flex flex-column align-items-center p-3 h-100">
                                <form @submit.prevent="checkFormModifyCustomerRequest" method="post" class="w-100">
                                    <div class="mb-3">
                                        <label for="InputDescription" class="form-label">New Service Description</label>
                                        <input type="text" class="form-control" id="InputDescription" v-model="modifyCustomerRequest_description" :placeholder="request.description" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="InputDate" class="form-label">New Service Date</label>
                                        <input type="date" class="form-control" id="InputDescription" v-model="modifyCustomerRequest_date" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100" style="margin-bottom: 10px;">Modify</button>
                                    <button type="button" @click="cancelCustomerRequest()" class="btn btn-primary w-100" style="background-color: red;">Cancel Request</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <seperator />
        </div>

        <div class="row justify-content-center">
            <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                <h3>Book a service.</h3>
                <br><br><br>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-12 col-md-9 d-flex flex-wrap justify-content-center">
                <div v-for="(service, index) in services" @click="setServiceView(index+1)" class="card button-like-customerDash d-flex flex-row align-items-center p-3" style="width: 18rem; margin: 10px;">
                    <img :src="service.icon_path" alt="service logo" class="card-img-left" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div class="card-body p-0">
                        <h5 class="card-title">{{ service.name }}</h5>
                    </div>
                </div>
            </div>
        </div>

        <br>

        <div v-if="serviceView != 0" class="container">
            <div class="row justify-content-center">
                 <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <h3>Browsing {{ services[serviceView - 1].name }} services.</h3>
                </div>
            </div>

            <br>

            <div class="row justify-content-center g-4">
                <div v-for="(serviceProfessional, index) in serviceProfessionals[serviceView]" class="col-3 col-md-4">
                    <div v-if="serviceView == serviceProfessional.service_type">
                        <div class="card d-flex flex-row align-items-center p-3 h-100">
                            <div class="d-flex flex-column align-items-center" style="margin-right: 15px;">
                                <img :src="serviceProfessional.icon_path" alt="service logo" class="card-img-left" style="width: 80px; height: 80px; margin-bottom: 30px; padding: 10px;">
                                <div class="d-flex flex-column justify-content-center align-items-center w-100">
                                    <button type="button" @click="serviceProfessional_book = serviceProfessional.email" class="btn d-flex align-items-center justify-content-center mb-2 w-100">
                                        <i class="fa fa-check" style="margin-right: 10px;"></i> Book
                                    </button>
                                    <button type="button" class="btn-customerWhite d-flex align-items-center justify-content-center mb-2 w-100">
                                        $ {{ services[serviceView - 1].price }}
                                    </button>
                                </div>
                            </div>

                            <div class="d-flex flex-column justify-content-between" style="flex-grow: 1;">
                                <h6 class="card-title"><span style="margin-right: 6%;">{{ serviceProfessional.name }}</span> {{ serviceProfessional.rating.toFixed(1) }} <i class="fa-regular fa-star"></i></h6>
                                <p class="card-text">{{ serviceProfessional.description }}</p>
                                <p class="card-text">
                                    Email: {{ serviceProfessional.email }}
                                    <br>
                                    Experience: {{ serviceProfessional.experience }} months
                                    <br>
                                    Services completed: {{ serviceProfessional.services_completed }}
                                    <br>
                                    Location: {{serviceProfessional.location}}
                                </p>
                            </div>
                        </div>

                        <div v-if="serviceProfessional_book == serviceProfessional.email" class="w-100">
                            <br>
                            <div class="card d-flex flex-column align-items-center p-3 h-100">
                                <form @submit.prevent="checkFormServiceProfessionalBook" method="post" class="w-100">
                                    <div class="mb-3">
                                        <label for="InputDescription" class="form-label">Service Description</label>
                                        <input type="text" class="form-control" id="InputDescription" v-model="serviceProfessional_book_description" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="InputDate" class="form-label">Service Date</label>
                                        <input type="date" class="form-control" id="InputDescription" v-model="serviceProfessional_book_date" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br>
        </div>

        <div class="row justify-content-center">
            <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                <h3>Or, let's search.</h3>
                <br><br>
            </div>
        </div>

        <br>

        <div class="row justify-content-center">
            <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                <form class="w-100">
                    <div class="mb-3">
                        <input type="text" v-model="searchQuery" class="form-control" id="InputSearch" placeholder="Search by service or location." required>
                    </div>
                </form>
            </div>
        </div>

        <br>

        <div v-if="searchServiceProfessionals[0]" class="container">
            <div class="row justify-content-center g-4">
                <div v-for="(serviceProfessional, index) in searchServiceProfessionals" class="col-3 col-md-4">
                    <div>
                        <div class="card d-flex flex-row align-items-center p-3 h-100">
                            <div class="d-flex flex-column align-items-center" style="margin-right: 15px;">
                                <img :src="serviceProfessional.icon_path" alt="service logo" class="card-img-left" style="width: 80px; height: 80px; margin-bottom: 30px; padding: 10px;">
                                <div class="d-flex flex-column justify-content-center align-items-center w-100">
                                    <button type="button" @click="searchServiceProfessional_book = serviceProfessional.email" class="btn d-flex align-items-center justify-content-center mb-2 w-100">
                                        <i class="fa fa-check" style="margin-right: 10px;"></i> Book
                                    </button>
                                    <button type="button" class="btn-customerWhite d-flex align-items-center justify-content-center mb-2 w-100">
                                        $ {{ serviceProfessional.service_price }}
                                    </button>
                                </div>
                            </div>

                            <div class="d-flex flex-column justify-content-between" style="flex-grow: 1;">
                                <h6 class="card-title"><span style="margin-right: 6%;">{{ serviceProfessional.name }}</span> {{ serviceProfessional.rating.toFixed(1) }} <i class="fa-regular fa-star"></i></h6>
                                <p class="card-text">{{ serviceProfessional.description }}</p>
                                <p class="card-text">
                                    Email: {{ serviceProfessional.email }}
                                    <br>
                                    Experience: {{ serviceProfessional.experience }} months
                                    <br>
                                    Services completed: {{ serviceProfessional.services_completed }}
                                    <br>
                                    Location: {{ serviceProfessional.location }}
                                </p>
                            </div>
                        </div>
                        
                        <div v-if="searchServiceProfessional_book == serviceProfessional.email" class="w-100">
                            <br>
                            <div class="card d-flex flex-column align-items-center p-3 h-100">
                                <form @submit.prevent="checkFormSearchServiceProfessionalBook" method="post" class="w-100">
                                    <div class="mb-3">
                                        <label for="InputDescription" class="form-label">Service Description</label>
                                        <input type="text" class="form-control" id="InputDescription" v-model="searchServiceProfessional_book_description" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="InputDate" class="form-label">Service Date</label>
                                        <input type="date" class="form-control" id="InputDescription" v-model="searchServiceProfessional_book_date" required>
                                    </div>
                                    <input type="hidden" id="InputServiceName" :value="serviceProfessional.service_type">
                                    <input type="hidden" id="InputServicePrice" :value="serviceProfessional.service_price">
                                    <button type="submit" class="btn btn-primary w-100">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <br>
        </div>


        <seperator />

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
        setServiceView: function(index) {
            if (this.serviceView == index)
                this.serviceView = 0
            else
                this.serviceView = index
        },

        checkFormCompletedServiceRequest: function(e) {
            var check = 1
            if (!this.completedServiceRequest_rating) {
                check = 0
            }

            if (check == 0) {
                e.preventDefault()
                alert('Invalid details. Please try again.')
            } else {
                this.handleCompletedServiceRequest()
            }
        },

        checkFormServiceProfessionalBook: function(e) {
            var check = 1
            if (!this.serviceProfessional_book_description || !this.serviceProfessional_book_date) {
                check = 0
            }

            if (check == 0) {
                e.preventDefault()
                alert('Invalid details. Please try again.')
            } else {
                this.handleServiceProfessionalBook()
            }
        },

        checkFormSearchServiceProfessionalBook: function(e) {
            var check = 1
            const form = e.target

            this.searchServiceProfessional_book_service_type = form.querySelector("#InputServiceName").value
            this.searchServiceProfessional_book_service_price = form.querySelector("#InputServicePrice").value
            
            if (!this.searchServiceProfessional_book_description || !this.searchServiceProfessional_book_date || !this.searchServiceProfessional_book_service_type || !this.searchServiceProfessional_book_service_price) {
                check = 0
            }

            if (check == 0) {
                e.preventDefault()
                alert('Invalid details. Please try again.')
            } else {
                this.handleSearchServiceProfessionalBook()
            }
        },

        checkFormModifyCustomerRequest: function(e) {
            var check = 1
            if (!this.modifyCustomerRequest_description || !this.modifyCustomerRequest_date) {
                check = 0
            }

            if (check == 0) {
                e.preventDefault()
                alert('Invalid details. Please try again.')
            } else {
                this.handleModifyCustomerRequest()
            }
        },

        signout: function() {
            localStorage.removeItem('token')
            alert('You have been signed out. Redirecting to home page.')
            window.location.href = '/'
        },

        getToken: function() {
            return localStorage.getItem('token')
        },

        async handleCompletedServiceRequest() {
            const formData = {
                id: this.completedServiceRequestView,
                remark: this.completedServiceRequest_remarks,
                rating: this.completedServiceRequest_rating
            }

            try {
                const response = await fetch('api/customer/requests/completed', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify(formData)
                })

                if (response.ok) {
                    alert('Review submitted successfully. Thank you for your feedback.')
                    window.location.href = '/customerDash'
                } else {
                    var data = await response.json()
                    if (data['message']) {
                        alert(data['message'])
                    } else {
                        alert('Error submitting review.')
                    }
                }
            } catch (error) {
                alert('Error:', error)
            }
        },

        async handleServiceProfessionalBook() {
            const formData = {
                serviceProfessional_id: this.serviceProfessional_book,
                service_type: this.serviceView,
                price: this.services[this.serviceView - 1].price,
                for_date: this.serviceProfessional_book_date,
                description: this.serviceProfessional_book_description
            }

            try {
                const response = await fetch('api/customer/service-professionals/requests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify(formData)
                })

                if (response.ok) {
                    alert('Service booked successfully.')
                    window.location.href = '/customerDash'
                } else {
                    var data = await response.json()
                    if (data['message']) {
                        alert(data['message'])
                    } else {
                        alert('Error booking service.')
                    }
                }
            } catch (error) {
                alert('Error:', error)
            }
        },

        async handleSearchServiceProfessionalBook(service_type, service_price) {
            const formData = {
                serviceProfessional_id: this.searchServiceProfessional_book,
                service_type: this.searchServiceProfessional_book_service_type,
                price: this.searchServiceProfessional_book_service_price,
                for_date: this.searchServiceProfessional_book_date,
                description: this.searchServiceProfessional_book_description
            }

            try {
                const response = await fetch('api/customer/service-professionals/requests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify(formData)
                })

                if (response.ok) {
                    alert('Service booked successfully.')
                    window.location.href = '/customerDash'
                } else {
                    var data = await response.json()
                    if (data['message']) {
                        alert(data['message'])
                    } else {
                        alert('Error booking service.')
                    }
                }
            } catch (error) {
                alert('Error:', error)
            }
        },

        async handleModifyCustomerRequest() {
            const formData = {
                id: this.modifyCustomerRequestView,
                description: this.modifyCustomerRequest_description,
                for_date: this.modifyCustomerRequest_date
            }

            try {
                const response = await fetch('api/customer/service-professionals/requests', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify(formData)
                })

                if (response.ok) {
                    alert('Request modified successfully.')
                    window.location.href = '/customerDash'
                } else {
                    var data = await response.json()
                    if (data['message']) {
                        alert(data['message'])
                    } else {
                        alert('Error modifying request.')
                    }
                }
            } catch (error) {
                alert('Error:', error)
            }
        },

        async cancelServiceRequest(id) {
            const response = await fetch('api/customer/requests', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.token
                },
                body: JSON.stringify({ id: id })
            })

            if (response.ok) {
                alert('Request cancelled successfully.')
                window.location.href = '/customerDash'
            } else {
                alert('Error cancelling request.')
            }
        },

        async cancelCustomerRequest() {
            const response = await fetch('api/customer/service-professionals/requests', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.token
                },
                body: JSON.stringify({ id: this.modifyCustomerRequestView })
            })

            if (response.ok) {
                alert('Request cancelled successfully.')
                window.location.href = '/customerDash'
            } else {
                alert('Error cancelling request.')
            }
        },

        async getCustomer(){
            const response = await fetch('/api/customer', {
                headers: {
                    'x-access-token': this.token
                }
            })

            const customer = await response.json()
            this.customer = customer
        },

        async getServiceProfessionals() {
            const response = await fetch('/api/customer/service-professionals/', {
                headers: {
                    'x-access-token': this.token
                }
            });
        
            const serviceProfessionals = await response.json();
        
            // Group service professionals by service type
            serviceProfessionals.sort((a, b) => {
                if (a.service_type < b.service_type) {
                    return -1;
                } else if (a.service_type > b.service_type) {
                    return 1;
                } else {
                    return 0;
                }
            });
        
            const groupedServiceProfessionals = [];
        
            serviceProfessionals.forEach(professional => {
                const { service_type } = professional;
        
                if (!groupedServiceProfessionals[service_type]) {
                    groupedServiceProfessionals[service_type] = [];
                }
        
                groupedServiceProfessionals[service_type].push(professional);
            });

            // Sort service professionals by rating
            Object.keys(groupedServiceProfessionals).forEach(service_type => {
                groupedServiceProfessionals[service_type].sort((a, b) => b.rating - a.rating);
            });
        
            this.serviceProfessionals = groupedServiceProfessionals;
        },  
        
        async processSearchQuery() {
            if(this.searchQuery != '') {
                const response = await fetch('/api/customer/service-professionals/search', {
                    headers: {
                        'x-access-token': this.token,
                        'searchQuery': this.searchQuery
                    }
                })

                const searchServiceProfessionals = await response.json()

                // Sort service professionals by rating
                searchServiceProfessionals.sort((a, b) => b.rating - a.rating);

                this.searchServiceProfessionals = searchServiceProfessionals
                console.log(this.searchServiceProfessionals)
            } else {
                this.searchServiceProfessionals = []
            }
        },
        
        async getServiceRequests() {
            const response = await fetch('/api/customer/requests', {
                headers: {
                    'x-access-token': this.token
                }
            })
        
            const serviceRequests = await response.json()
            this.serviceRequests = serviceRequests
        },

        async getCompletedServiceRequests() {
            const response = await fetch('/api/customer/requests/completed', {
                headers: {
                    'x-access-token': this.token
                }
            })

            const completedServiceRequests = await response.json()
            this.completedServiceRequests = completedServiceRequests
        },
        
        async getCustomerRequests() {
            const response = await fetch('/api/customer/service-professionals/requests', {
                headers: {
                    'x-access-token': this.token
                }
            })

            const customerRequests = await response.json()
            this.customerRequests = customerRequests
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
            customer: [],
            serviceProfessionals: [],
            serviceRequests: [],
            completedServiceRequests: [],
            customerRequests: [],
            serviceView: 0,

            completedServiceRequestView: 0,
            completedServiceRequest_remarks: '',
            completedServiceRequest_rating: 5,

            modifyCustomerRequestView: 0,
            modifyCustomerRequest_description: '',
            modifyCustomerRequest_date: '',

            serviceProfessional_book: '',
            serviceProfessional_book_description: '',
            serviceProfessional_book_date: '',

            searchQuery: '',
            searchServiceProfessionals: [],
            searchServiceProfessional_book: '',
            searchServiceProfessional_book_description: '',
            searchServiceProfessional_book_date: '',
            searchServiceProfessional_book_service_type: 0,
            searchServiceProfessional_book_service_price: 0,

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

        this.getCustomer()
        this.getServiceProfessionals()
        this.getServiceRequests()
        this.getCompletedServiceRequests()
        this.getCustomerRequests()
        this.getServices()
    },

    watch: {
        searchQuery(newValue, oldValue) {
            this.processSearchQuery()
        }
    }
})