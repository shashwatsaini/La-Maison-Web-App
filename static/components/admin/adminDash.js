import Navbar from '../navbar.js'
import customFooter from '../nonStickyFooter.js'
import seperator from '../lineSeperator.js'

export default ({
    template: `
        <link rel="stylesheet" href="/static/css/adminDash.css">
        <Navbar />

        <div class="row justify-content-center">
            <div class="col-12 col-md-8 d-flex align-items-center">
                <h3 style="margin-right: 6%;">What would you like to do?</h3>
                <div class="d-flex justify-content-between w-100">
                    <button type="button" @click="viewType=0" class="btn-adminControls">View Statistics</button>
                    <button type="button" @click="viewType=1" class="btn-adminControls">Add a service</button>
                    <button type="button" @click="viewType=2" class="btn-adminControls">Approve new <span class="logo-font">PROFESSIONNELS</span></button>
                    <button type="button" @click="viewType=3" class="btn-adminControls">Review <span class="logo-font">PROFESSIONNELS</span></button>
                    <button type="button" @click="viewType=4" class="btn-adminControls">Review <span class="logo-font">PATRONS</span></button>
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
                    <form @submit.prevent="checkFormService" action="/addService" method="post">
                        <div class="mb-3">
                            <label for="InputName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="InputDescription" v-model="name" required>
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
                const response = await fetch('/admin/service', {
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

        getToken: function() {
            return localStorage.getItem('token')
        }
    },

    data() {
        return {
            token: '',
            viewType: 0,
            name: '',
            description: '',
            price: 0,
            timeRequired: 0,
            icon: null
        }
    },

    mounted() {
        this.token = this.getToken()
        if (!this.token) {
            alert('You are not logged in. Redirecting to login page.')
            window.location.href = '/adminLogin'
        }
    }
})
