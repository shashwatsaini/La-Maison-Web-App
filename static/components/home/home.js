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

        <seperator />

        <div class="row justify-content-center">
            <div class="col-12 col-md-9 d-flex flex-wrap justify-content-center">
                <div v-for="service in services" class="card d-flex flex-row align-items-center p-3" style="width: 18rem; margin: 10px;">
                    <img :src="service.icon_path" alt="service logo" class="card-img-left" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div class="card-body p-0">
                        <h5 class="card-title">{{ service.name }}</h5>
                    </div>
                </div>
            </div>
        </div>

        <br>

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
                <h4>join the community today.</h4>
            </div>
            <br><br>
            <div class="col-12 d-flex justify-content-center">
                <button type="button" class="btn-small d-flex justify-content-center align-items-center" onclick="window.location.href='/register'">
                    <h5 class="mb-0">Create <span class="logo-font" style="font-size: 1.15em;">UN MAISON.</span></h5>
                </button>
            </div>
        </div>

        <br>

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

        <div class="row justify-content-center">
            <div class="col-12 col-md-6 d-flex justify-content-center">
                <h3>Browse from our services curated especially <span class="logo-font" style="font-size: 1.15em;">POUR TOI.</span></h3>
            </div>
        </div>

        <br>

        <div class="row justify-content-center">
            <div class="col-9 col-md-8.5 d-flex justify-content-center">
                <p>Beauty at your doorstep.</p>
            </div>

            <div class="col-12 col-md-9 d-flex flex-wrap justify-content-center">                
                <div v-for="service in beauty_services" class="card d-flex flex-row align-items-center p-3" style="width: 18rem; margin: 10px;">
                    <img :src="service.icon_path" alt="service logo" class="card-img-left" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div class="card-body p-0">
                        <h6 class="card-title">{{ service.name }}</h6>
                    </div>
                </div>
            </div>
        </div>

        <br>

        <div class="row justify-content-center">
            <div class="col-9 col-md-8.5 d-flex justify-content-center">
                <p>Repair at your doorstep.</p>
            </div>

            <div class="col-12 col-md-9 d-flex flex-wrap justify-content-center">                
                <div v-for="service in repair_services" class="card d-flex flex-row align-items-center p-3" style="width: 18rem; margin: 10px;">
                    <img :src="service.icon_path" alt="service logo" class="card-img-left" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div class="card-body p-0">
                        <h6 class="card-title">{{ service.name }}</h6>
                    </div>
                </div>
            </div>
        </div>

        <br>

        <div class="row justify-content-center">
            <div class="col-9 col-md-8.5 d-flex justify-content-center">
                <p>Cleaning at your doorstep.</p>
            </div>

            <div class="col-12 col-md-9 d-flex flex-wrap justify-content-center">                
                <div v-for="service in cleaning_services" class="card d-flex flex-row align-items-center p-3" style="width: 18rem; margin: 10px;">
                    <img :src="service.icon_path" alt="service logo" class="card-img-left" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div class="card-body p-0">
                        <h6 class="card-title">{{ service.name }}</h6>
                    </div>
                </div>
            </div>
        </div>

        <br>

        <div class="row justify-content-center">
            <div class="col-9 col-md-8.5 d-flex justify-content-center">
                <p>And trust us, there's more.</p>
            </div>
        </div>

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
        async getServices() {
            const response = await fetch('/api/services')
            const services = await response.json()
            this.services = services
        }
    },

    data() {
        return {
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
            ],
            beauty_services: [
                {
                    name: 'Haircut',
                    icon_path: '/static/uploads/detailed_services/haircut.png'
                },
                {
                    name: 'Spa',
                    icon_path: '/static/uploads/detailed_services/spa.png'
                },
                {
                    name: 'Makeup',
                    icon_path: '/static/uploads/detailed_services/makeup.png'
                },
                {
                    name: 'Pedicure',
                    icon_path: '/static/uploads/detailed_services/pedicure.png'
                }
            ],
            repair_services: [
                {
                    name: 'Appliance Repair',
                    icon_path: '/static/uploads/detailed_services/appliance-repair.png'
                },
                {
                    name: 'Furniture Assembly & Repair',
                    icon_path: '/static/uploads/detailed_services/furniture.png'
                },
                {
                    name: 'Wall Decor',
                    icon_path: '/static/uploads/detailed_services/wall-decor.png'
                },
                {
                    name: 'AC Installation & Repair',
                    icon_path: '/static/uploads/detailed_services/ac-repair.png'
                }
            ],
            cleaning_services: [
                {
                    name: 'Home Cleaning',
                    icon_path: '/static/uploads/detailed_services/house.png'
                },
                {
                    name: 'Bathroom Cleaning',
                    icon_path: '/static/uploads/detailed_services/bathroom.png'
                },
                {
                    name: 'Kitchen Cleaning',
                    icon_path: '/static/uploads/detailed_services/kitchen.png'
                },
                {
                    name: 'Carpet Cleaning',
                    icon_path: '/static/uploads/detailed_services/carpet.png'
                }
            ]
        }
    },

    mounted() {
        this.getServices()
    }
})