import Navbar from '../navbar.js'
import customFooter from '../nonStickyFooter.js'
import seperator from '../lineSeperator.js'
import adminStats1 from './adminStats1.js'
import adminStats2 from './adminStats2.js'

export default ({
    template: /*html*/`
        <link rel="stylesheet" href="/static/css/adminDash.css">
        <Navbar />

        <div class="row justify-content-center">
            <div class="col-12 col-md-9 d-flex align-items-center">
                <h3 style="margin-right: 6%;">What would you like to do?</h3>
                <div class="d-flex justify-content-between w-100">
                    <button type="button" @click="viewType=0" class="btn-adminControls">View Statistics</button>
                    <button type="button" @click="viewType=1" class="btn-adminControls">Add a service</button>
                    <button type="button" @click="viewType=2" class="btn-adminControls">Modify a service</button>
                    <button type="button" @click="viewType=3" class="btn-adminControls">Approve new <span class="logo-font">PROFESSIONNELS</span></button>
                    <button type="button" @click="viewType=4" class="btn-adminControls">Review <span class="logo-font">PROFESSIONNELS</span></button>
                    <button type="button" @click="viewType=5" class="btn-adminControls">Review <span class="logo-font">PATRONS</span></button>
                    <button type="button" @click="signout()" class="btn-adminControls">Sign out</button>
                </div>
            </div>
        </div>

        <br>

        <div class="row justify-content-center mt-3">
            <div class="col-12 col-md-9 d-flex align-items-center">
                <div class="d-flex justify-content-between w-100">
                    <div class="slide-button">
                        <span style="margin-right: 10px;">Service <span class="logo-font">PROFESSIONNELS</span> Notifications</span>
                        <label class="switch">
                            <input type="checkbox" checked disabled>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    
                    <div class="slide-button">
                        <span style="margin-right: 10px;">Service <span class="logo-font">PROFESSIONNELS</span> Monthly Reports</span>
                        <label class="switch">
                            <input type="checkbox" checked disabled>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    
                    <div class="slide-button">
                        <span style="margin-right: 10px;">Service <span class="logo-font">PROFESSIONNELS</span> Monthly Reports</span>
                        <label class="switch">
                            <input type="checkbox" checked disabled>
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <seperator />

        <!-- View Statistics -->
        <div v-if="viewType==0">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center">
                    <h3>Viewing Statistics: {{ statsView[statsViewType] }}</h3>
                </div>
            </div>

            <br>

            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-between">
                    <button type="button" @click="statsViewType=1" class="btn-adminControlsWide2">Overview</button>
                    <button type="button" @click="statsViewType=2" class="btn-adminControlsWide2">Distributions</button>
                    <button type="button" @click="statsViewType=3" class="btn-adminControlsWide2">API Stats</button>
                </div>
            </div>
        </div>

        <div v-if="viewType==0 && statsViewType==1">
            <adminStats1 />
        </div>

        <div v-if="viewType==0 && statsViewType==2">
            <adminStats2 />
        </div>

        <!-- Create a service -->

        <div v-if="viewType==1">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center">
                    <h3>Add a serivce.</h3>
                </div>
            </div>

            <br>

            <div class="row justify-content-center">
                <div class="col-12 col-md-6 form-container">
                    <form @submit.prevent="checkFormService" method="post">
                        <div class="mb-3">
                            <label for="InputName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="InputName" v-model="name" required>
                        </div>
                        <div class="mb-3">
                            <label for="InputDescription" class="form-label">Description</label>
                            <input type="text" class="form-control" id="InputDescription" v-model="description" required>
                        </div>
                        <div class="mb-3">
                            <label for="InputPrice" class="form-label">Price ($)</label>
                            <input type="number" class="form-control" id="InputPrice" v-model="price" required>
                        </div>
                        <div class="mb-3">
                            <label for="InputTimeRequired" class="form-label">Time Required</label>
                            <input type="number" class="form-control" id="InputTimeRequired" v-model="timeRequired" required>
                        </div>
                        <div class="mb-3">
                            <label for="InputTimeRequired" class="form-label">Upload an Icon</label>
                            <input type="file" class="form-control" id="InputIcon" name="icon" @change="handleIconUpload" accept="image/*" required>
                        </div>
                        <br>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Modify a service -->

        <div v-if="viewType==2">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center">
                    <h3>Modify a service.</h3>
                </div>
            </div>

            <br>

            <div class="row justify-content-center">
                <div class="col-12 col-md-6 form-container">
                    <form @submit.prevent="handleFormModifyServiceSubmit" method="patch">
                        <div class="mb-3">
                            <label for="SelectService" class="form-label">Service Name</label>
                            <select class="form-control" id="SelectService" v-model="modifyService" required>
                                <option value="" selected disabled>Select a service</option>
                                <option v-for="service in services" :value="service.id">{{ service.name }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="InputName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="InputName" v-model="modifyName" required>
                        </div>
                        <div class="mb-3">
                            <label for="InputDescription" class="form-label">Description</label>
                            <input type="text" class="form-control" id="InputDescription" v-model="modifyDescription" required>
                        </div>
                        <div class="mb-3">
                            <label for="InputPrice" class="form-label">Price ($)</label>
                            <input type="number" class="form-control" id="InputPrice" v-model="modifyPrice" required>
                        </div>
                        <div class="mb-3">
                            <label for="InputTimeRequired" class="form-label">Time Required</label>
                            <input type="number" class="form-control" id="InputTimeRequired" v-model="modifyTimeRequired" required>
                        </div>
                        <div class="mb-3">
                            <label for="InputTimeRequired" class="form-label">Upload an Icon</label>
                            <input type="file" class="form-control" id="InputIcon" name="icon" @change="handleModifyIconUpload" accept="image/*">
                        </div>
                        <br>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn">Submit</button>
                        </div>
                        <br>
                        <div class="d-flex justify-content-center">
                            <button type="button" class="btn bg-danger" @click="handleFormDeleteServiceSubmit">Delete Service</button>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>

        <!-- Approve new service professionals -->

        <div v-if="viewType==3">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center">
                    <h3>Approve new <span class="logo-font">PROFESSIONNELS</span>.</h3>
                </div>
            </div>

            <br>

            <div v-if="unapprovedServiceProfessionals.length == 0" class="row justify-content-center">
                <div  class="col-12 col-md-6 d-flex justify-content-center">
                    <h4>No one new!</h4>
                </div>
            </div>

            <br>

            <div class="row justify-content-center">
                <div v-for="serviceProfessional in unapprovedServiceProfessionals" class="col-12 col-md-4 d-flex justify-content-center">
                    <div class="card d-flex flex-row align-items-center p-3" style="width: 90%; margin: 10px;">
                        <div class="d-flex flex-column align-items-center" style="margin-right: 15px;">
                            <img :src="serviceProfessional.icon_path" alt="service logo" class="card-img-left" style="width: 80px; height: 80px; margin-bottom: 30px; padding: 10px;">

                            <div class="d-flex flex-column justify-content-center align-items-center w-100">
                                <button type="button" @click="approveServiceProfessional(serviceProfessional.email)" class="btn-adminApprove d-flex align-items-center justify-content-center mb-2">
                                    <i class="fa fa-check"></i>
                                </button>
                                <button type="button" @click="rejectServiceProfessional(serviceProfessional.email)" class="btn-adminReject d-flex align-items-center justify-content-center mb-2">
                                    <i class="fa fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <div class="d-flex flex-column justify-content-between" style="flex-grow: 1;">
                            <h6 class="card-title">{{ serviceProfessional.name }}</h6>
                            <p class="card-text">{{ serviceProfessional.description }}</p>
                            <p class="card-text">
                                Service: {{ serviceProfessional.service_name }}
                                <br>
                                Email: {{ serviceProfessional.email }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Review service professionals -->

        <div v-if="viewType==4">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center">
                    <h3>Review  <span class="logo-font">PROFESSIONNELS</span>.</h3>
                </div>
            </div>

            <br>

            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <form class="w-100">
                        <div class="mb-3">
                            <input type="text" v-model="searchServiceProfessionalQuery" class="form-control" id="InputSearch" placeholder="Search by service or location." required>
                        </div>
                    </form>
                </div>
            </div>

            <br>

            <div class="container">
                <div class="row justify-content-center">
                    <div v-for="serviceProfessional in searchServiceProfessionals" class="col-12 col-md-5 d-flex justify-content-center">
                        <div class="card d-flex flex-row align-items-center p-3" style="width: 90%; margin: 10px;">
                            <div class="d-flex flex-column align-items-center" style="margin-right: 15px;">
                                <img :src="serviceProfessional.icon_path" alt="service logo" class="card-img-left" style="width: 80px; height: 80px; margin-bottom: 5px; padding: 10px;">

                                <div class="d-flex flex-column justify-content-center align-items-center w-100" style="flex-grow: 1;">  
                                    <div style="display: flex; gap: 10px; align-items: center;">
                                        <i class="fas fa-check-circle" style="font-size: 24px; color: green;"></i> {{ serviceProfessional.services_completed }}
                                        <i class="fas fa-calendar-check" style="font-size: 24px; color: black; margin-left: 3px;"></i> {{ serviceProfessional.services_booked }}
                                        <i class="fas fa-times-circle" style="font-size: 24px; color: red; margin-left: 3px;"></i> {{ serviceProfessional.services_rejected }}
                                    </div>
                                    <br>
                                    <button v-if="serviceProfessional.admin_approved == 1" type="button" @click="handleBlockServiceProfessional(serviceProfessional.email)" class="btn d-flex align-items-center justify-content-center mb-2">
                                        <i class="fa fa-ban"></i>
                                    </button>

                                    <button v-if="serviceProfessional.admin_approved == 2" type="button" @click="handleUnblockServiceProfessional(serviceProfessional.email)" class="btn bg-success d-flex align-items-center justify-content-center mb-2">
                                        <i class="fa fa-check"></i>
                                    </button>

                                    <button v-if="serviceProfessional.admin_approved == 2" type="button" @click="handleDeleteServiceProfessional(serviceProfessional.email)" class="btn bg-danger d-flex align-items-center justify-content-center mb-2">
                                        <i class="fa fa-ban"></i>
                                    </button>

                                    <button type="button" @click="exportServiceProfessionalAsCSV(serviceProfessional.email)" class="btn d-flex align-items-center justify-content-center mb-2">
                                        Export <i class="fa fa-table" style="margin-left: 10px;"></i>
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
                                    Location: {{ serviceProfessional.location }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Review patrons -->

        <div v-if="viewType==5">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center">
                    <h3>Review  <span class="logo-font">PATRONS</span>.</h3>
                </div>
            </div>

            <br>

            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <form class="w-100">
                        <div class="mb-3">
                            <input type="text" v-model="searchCustomerQuery" class="form-control" id="InputSearch" placeholder="Search by customer or location." required>
                        </div>
                    </form>
                </div>
            </div>

            <br>

            <div class="container">
                <div class="row justify-content-center">
                    <div v-for="customer in searchCustomers" class="col-12 col-md-5 d-flex justify-content-center">
                        <div class="card d-flex flex-row align-items-center p-3" style="width: 90%; margin: 10px;">
                            <div class="d-flex flex-column align-items-center" style="margin-right: 15px;">
                                <div class="d-flex flex-column justify-content-center align-items-center w-100" style="flex-grow: 1;">  
                                    <div style="display: flex; gap: 10px; align-items: center;" style="margin-bottom: 12px;">
                                        <i class="fas fa-check-circle" style="font-size: 24px; color: green;"></i> {{ customer.services_completed }}
                                        <i class="fas fa-calendar-check" style="font-size: 24px; color: black; margin-left: 3px;"></i> {{ customer.services_booked }}
                                        <i class="fas fa-credit-card" style="font-size: 24px; color: black; margin-left: 3px;"></i> {{ customer.services_paid }}
                                    </div>

                                    <button v-if="customer.admin_action == 0" type="button" @click="handleBlockCustomer(customer.email)" class="btn d-flex align-items-center justify-content-center mb-2">
                                        <i class="fa fa-ban"></i>
                                    </button>

                                    <button v-if="customer.admin_action == 1" type="button" @click="handleUnblockCustomer(customer.email)" class="btn bg-success d-flex align-items-center justify-content-center mb-2">
                                        <i class="fa fa-check"></i>
                                    </button>

                                    <button v-if="customer.admin_action == 1" type="button" @click="handleDeleteCustomer(customer.email)" class="btn bg-danger d-flex align-items-center justify-content-center mb-2">
                                        <i class="fa fa-ban"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="d-flex flex-column justify-content-between" style="flex-grow: 1;">
                                <h6 class="card-title"><span style="margin-right: 6%;">{{ customer.name }}</span></h6>
                                <p class="card-text">
                                    Email: {{ customer.email }}
                                    <br>
                                    Address: {{ customer.address }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <br><br>

        <customFooter />
    `,

    components: {
        Navbar,
        customFooter,
        seperator,
        adminStats1,
        adminStats2
    },

    methods: {
        checkFormService: function(e) {
            var check = 1
            if (!this.name || !this.description || !this.price || !this.timeRequired) {
                check = 0
            }

            if (typeof(this.price) != 'number' || typeof(this.timeRequired) != 'number') {
                check = 0
            }

            if (check == 0) {
                alert('Invalid inputs.')
            } else {
                this.handleFormServiceSubmit()
            }
        },

        handleIconUpload(e) {
            const file = e.target.files[0]
            this.icon = file
        },

        handleModifyIconUpload(e) {
            const file = e.target.files[0]
            this.modifyIcon = file
        },

        signout: function() {
            localStorage.removeItem('token')
            alert('You have been signed out. Redirecting to login page.')
            window.location.href = '/adminLogin'
        },

        async handleFormServiceSubmit() {
            const formData = new FormData()
            formData.append('name', this.name)
            formData.append('description', this.description)
            formData.append('price', this.price)
            formData.append('timeRequired', this.timeRequired)
            formData.append('icon', this.icon)

            try {
                const response = await fetch('/api/admin/service', {
                    method: 'POST',
                    headers: {
                        'x-access-token': this.token
                    },
                    body: formData
                })

                if (response.ok) {
                    alert('Service added successfully.')
                    window.location.href = '/adminDash'
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
        },

        async handleFormModifyServiceSubmit() {
            const formData = new FormData()
            formData.append('id', this.modifyService)
            formData.append('name', this.modifyName)
            formData.append('description', this.modifyDescription)
            formData.append('price', this.modifyPrice)
            formData.append('timeRequired', this.modifyTimeRequired)
            if (this.modifyIcon)
                formData.append('icon', this.modifyIcon)

            try {
                const response = await fetch('/api/admin/service', {
                    method: 'PATCH',
                    headers: {
                        'x-access-token': this.token
                    },
                    body: formData
                })

                if (response.ok) {
                    alert('Service modified successfully.')
                    window.location.href = '/adminDash'
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
        },
        
        async handleFormDeleteServiceSubmit() {
            try {
                const response = await fetch('/api/admin/service', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify({
                        id: this.modifyService
                    })
                })

                if (response.ok) {
                    alert('Service deleted successfully.')
                    window.location.href = '/adminDash'
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

            window.location.href = '/adminDash'
        },

        async handleBlockServiceProfessional(email) {
            try {
                const response = await fetch('/api/admin/service-professionals/block', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify({
                        email: email
                    })
                })

                if (response.ok) {
                    alert('Service professional blocked successfully.')
                    let change = 1
                    this.processSearchServiceProfessionalQuery(change)
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
        },

        async handleUnblockServiceProfessional(email) {
            try {
                const response = await fetch('/api/admin/service-professionals/unblock', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify({
                        email: email
                    })
                })

                if (response.ok) {
                    alert('Service professional unblocked successfully.')
                    let change = 1
                    this.processSearchServiceProfessionalQuery(change)
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
        },

        async handleDeleteServiceProfessional(email) {
            try {
                const response = await fetch('/api/admin/service-professionals/block', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify({
                        email: email
                    })
                })

                if (response.ok) {
                    alert('Service professional deleted successfully.')
                    let change = 1
                    this.processSearchServiceProfessionalQuery(change)
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
        },        

        async processSearchServiceProfessionalQuery(change) {
            // Get all professionals once
            if (this.serviceProfessionalsAll.length == 0 || !this.serviceProfessionalsAll || change) {
                const response = await fetch('/api/admin/service-professionals/search', {
                    method: 'POST',
                    headers: {
                        'x-access-token': this.token,
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({query: this.searchServiceProfessionalQuery})
                })

                let serviceProfessionalsAll = await response.json()
                this.serviceProfessionalsAll = serviceProfessionalsAll
            }

            // Sort service professionals by rating
            this.serviceProfessionalsAll.sort((a, b) => -(b.rating - a.rating))
            
            this.searchServiceProfessionals = this.serviceProfessionalsAll.filter(professional => {
                const matchesQuery = professional.name.toLowerCase().includes(this.searchServiceProfessionalQuery.toLowerCase()) ||
                                     professional.email.toLowerCase().includes(this.searchServiceProfessionalQuery.toLowerCase()) ||
                                     professional.location.toLowerCase().includes(this.searchServiceProfessionalQuery.toLowerCase())
                const validAdminApproved = professional.admin_approved !== 0 && professional.admin_approved !== 3
                return matchesQuery && validAdminApproved
            })

            // Get blocked professionals first
            const adminId2Professionals = []
            const otherProfessionals = []

            this.searchServiceProfessionals.forEach(professional => {
                if (professional.admin_approved === 2) {
                    adminId2Professionals.push(professional)
                } else {
                    otherProfessionals.push(professional)
                }
            })

            var searchServiceProfessionals = [...adminId2Professionals, ...otherProfessionals]

            this.searchServiceProfessionals = searchServiceProfessionals
        },

        async handleBlockCustomer(email) {
            try {
                const response = await fetch('/api/admin/customers/block', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify({
                        email: email
                    })
                })

                if (response.ok) {
                    alert('Customer blocked successfully.')
                    let change = 1
                    this.processSearchCustomerQuery(change)
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
        },

        async handleUnblockCustomer(email) {
            try {
                const response = await fetch('/api/admin/customers/unblock', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify({
                        email: email
                    })
                })

                if (response.ok) {
                    alert('Customer unblocked successfully.')
                    let change = 1
                    this.processSearchCustomerQuery(change)
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
        },

        async handleDeleteCustomer(email) {
            try {
                const response = await fetch('/api/admin/customers/block', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify({
                        email: email
                    })
                })

                if (response.ok) {
                    alert('Customer deleted successfully.')
                    let change = 1
                    this.processSearchCustomerQuery(change)
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
        },

        async exportServiceProfessionalAsCSV(email) {
            try {
                const response = await fetch('/api/admin/tasks/export-service-professional-as-csv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify({
                        id: email
                    })
                })

                const responseJson = await response.json()
                const task_id = responseJson.task_id
                console.log(task_id)

                const pollTaskStatus = async () => {
                    const response2 = await fetch(`/api/admin/tasks/export-service-professional-as-csv/${task_id}`, {
                        method: 'GET',
                        headers: {
                            'x-access-token': this.token
                        }
                    })
                
                    if (response2.status === 200) {
                        clearInterval(pollingInterval) // Stop polling when task is complete
                
                        const response3 = await fetch(`/api/admin/tasks/export-service-professional-as-csv/download/${task_id}`, {
                            method: 'GET',
                            headers: {
                                'x-access-token': this.token
                            }
                        })
                
                        const blob = await response3.blob()
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'service-professional.csv'
                        a.click()
                    }
                }
                
                const pollingInterval = setInterval(pollTaskStatus, 5000)

            } catch (error) {
                alert('Error:', error)
            }
        },

        async processSearchCustomerQuery(change) {
            // Get all customers once
            if (this.customersAll.length == 0 || !this.customersAll || change) {
                const response = await fetch('/api/admin/customers/search', {
                    method: 'POST',
                    headers: {
                        'x-access-token': this.token,
                        'Content-Type': 'application/json'
                    },
                })

                let customersAll = await response.json()
                this.customersAll = customersAll
            }

            this.searchCustomers = this.customersAll.filter(customer => {
                const matchesQuery = customer.name.toLowerCase().includes(this.searchCustomerQuery.toLowerCase()) ||
                                     customer.email.toLowerCase().includes(this.searchCustomerQuery.toLowerCase()) ||
                                     customer.address.toLowerCase().includes(this.searchCustomerQuery.toLowerCase())
                const validAdminAction = customer.admin_action !== 2
                return matchesQuery && validAdminAction
            })

            // Get blocked customers first
            const adminAction1Customers = []
            const otherCustomers = []

            this.searchCustomers.forEach(customer => {
                if (customer.admin_action === 1) {
                    adminAction1Customers.push(customer)
                } else {
                    otherCustomers.push(customer)
                }
            })

            this.searchCustomers = [...adminAction1Customers, ...otherCustomers]
        }, 

        async getServices() {
            try {
                const response = await fetch('/api/admin/service', {
                    method: 'GET',
                    headers: {
                        'x-access-token': this.token
                    }
                })

                if (response.ok) {
                    var data = await response.json()
                    this.services = data
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
        },

        getToken: function() {
            return localStorage.getItem('token')
        },

        async getUnapprovedServiceProfessionals() {
            try {
                const response = await fetch('/api/admin/service-professionals/', {
                    method: 'GET',
                    headers: {
                        'x-access-token': this.token
                    }
                })

                if (response.ok) {
                    var data = await response.json()
                    this.unapprovedServiceProfessionals = data
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
        },

        async approveServiceProfessional(email) {
            try {
                const response = await fetch('/api/admin/service-professionals/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify({
                        email: email
                    })
                })

                if (response.ok) {
                    this.unapprovedServiceProfessionals = this.unapprovedServiceProfessionals.filter(professional => professional.email != email)
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
        },

        async rejectServiceProfessional(email) {
            try {
                const response = await fetch('/api/admin/service-professionals/', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.token
                    },
                    body: JSON.stringify({
                        email: email
                    })
                })

                if (response.ok) {
                    this.unapprovedServiceProfessionals = this.unapprovedServiceProfessionals.filter(professional => professional.email != email)
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
    },

    data() {
        return {
            token: '',
            unapprovedServiceProfessionals: [],
            viewType: 0,
            statsViewType: 2,
            statsView: {
                1: 'Overview',
                2: 'Distributions',
                3: 'API Stats'
            },

            name: '',
            description: '',
            price: 0,
            timeRequired: 0,
            icon: null,

            services: [],
            modifyService: '',
            modifyName: '',
            modifyDescription: '',
            modifyPrice: 0,
            modifyTimeRequired: 0,
            modifyIcon: null,

            searchServiceProfessionalQuery: '',
            searchServiceProfessionals: [],
            serviceProfessionalsAll: [],

            searchCustomerQuery: '',
            searchCustomers: [],
            customersAll: []
        }
    },

    mounted() {
        this.token = this.getToken()
        if (!this.token) {
            alert('You are not logged in. Redirecting to login page.')
            window.location.href = '/adminLogin'
        }

        this.getServices()
        this.getUnapprovedServiceProfessionals()
        this.processSearchServiceProfessionalQuery()
        this.processSearchCustomerQuery()
    },

    watch: {
        modifyService: function() {
            var service = this.services.find(service => service.id == this.modifyService)
            this.modifyName = service.name
            this.modifyDescription = service.description
            this.modifyPrice = service.price
            this.modifyTimeRequired = service.time_required
        },

        searchServiceProfessionalQuery: function() {
            // Updates cache after block or unblock operations
            let change = 0
            this.processSearchServiceProfessionalQuery(change)
        },

        searchCustomerQuery: function() {
            let change = 0
            this.processSearchCustomerQuery(change)
        }
    }
})
