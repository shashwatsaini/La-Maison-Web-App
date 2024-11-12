import seperator from '../lineSeperator.js'

export default ({
    template: /*html*/`
        <br><br>

        <div class="container">
            <div class="row justify-content-center">
                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Total Users
                                <i class="fa fa-users" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.total_users }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Total <span class="logo-font">PATRONS</span>
                                <i class="fa fa-users" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.total_customers }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Total <span class="logo-font">PROFESSIONNELS</span>
                                <i class="fa fa-address-book" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.total_service_professionals }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Total Services
                                <i class="fa fa-cog" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.total_services }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Total Service Requests
                                <i class="fa fa-cog" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.total_service_requests }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Total Customer Requests
                                <i class="fa fa-cog" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{overview_stats.total_customer_requests}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Monthly Revenue
                                <i class="fa fa-usd" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">$ {{ overview_stats.monthly_revenue }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Total Revenue
                                <i class="fa fa-usd" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">$ {{ overview_stats.total_revenue }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <seperator />

            <div class="row justify-content-center" style="margin-top: 15px;">
                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Total Site Visits
                                <i class="fa fa-users" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.total_site_visits }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Total Logins
                                <i class="fa fa-users" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.total_logins }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Total API Requests
                                <i class="fa fa-code" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.total_api_requests }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Average API Latency
                                <i class="fa fa-code" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.average_api_latency }} s</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Daily Site Visits
                                <i class="fa fa-users" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.daily_site_visits }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Daily Logins
                                <i class="fa fa-users" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.daily_logins }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Daily API Requests
                                <i class="fa fa-code" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.daily_api_requests }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3 px-1">
                    <div class="card-container">
                        <div class="card">
                            <div class="card-header stat-card-header">
                                Daily Average API Latency
                                <i class="fa fa-code" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <p class="card-text">{{ overview_stats.daily_average_api_latency }} s</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    components: {
        seperator
    },

    methods: {
        async getOverviewStats() {
            const request = await fetch('/api/admin/stats/overview', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.token
                }
            })

            const response = await request.json()
            this.overview_stats = response
        },

        getToken: function() {
            return localStorage.getItem('token')
        }
    },

    data() {
        return {
            token: '',

            overview_stats: []
        }
    },

    mounted() {
        this.token = this.getToken()
        if (!this.token) {
            alert('You are not logged in. Redirecting to login page.')
            window.location.href = '/adminLogin'
        }

        this.getOverviewStats()
    }
})
