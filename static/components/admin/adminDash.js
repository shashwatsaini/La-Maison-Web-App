import Navbar from '../navbar.js'
import customFooter from '../nonStickyFooter.js'
import seperator from '../lineSeperator.js'

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

        <seperator />

        <div v-if="viewType==1">
            <div class="row justify-content-center">
                <div  class="col-12 col-md-6 d-flex justify-content-center">
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

        <div v-if="viewType==2">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 d-flex justify-content-center">
                    <h3>Modify a service.</h3>
                </div>
            </div>

            <br>

            <div class="row justify-content-center">
                <div class="col-12 col-md-6 form-container">
                    <form @submit.prevent="handleFormModifyServiceSubmit" method="post">
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
                    </form>
                </div>
            </div>
            
        </div>

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

        <br><br>

        <customFooter />
    `,

    components: {
        Navbar,
        customFooter,
        seperator
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
            formData.append('name', this.name);
            formData.append('description', this.description);
            formData.append('price', this.price);
            formData.append('timeRequired', this.timeRequired);
            formData.append('icon', this.icon);

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
            formData.append('id', this.modifyService);
            formData.append('name', this.modifyName);
            formData.append('description', this.modifyDescription);
            formData.append('price', this.modifyPrice);
            formData.append('timeRequired', this.modifyTimeRequired);
            if (this.modifyIcon)
                formData.append('icon', this.modifyIcon);

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
            modifyIcon: null
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
    },

    watch: {
        modifyService: function() {
            var service = this.services.find(service => service.id == this.modifyService)
            this.modifyName = service.name
            this.modifyDescription = service.description
            this.modifyPrice = service.price
            this.modifyTimeRequired = service.time_required
        }
    }
})
