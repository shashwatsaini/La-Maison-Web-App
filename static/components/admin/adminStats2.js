import seperator from '../lineSeperator.js'

export default {
    template: /*html*/`
        <br><br>

        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-4">
                    <div class="card-container">
                        <div class="card" style="width: 25rem;">
                            <div class="card-header stat-card-header">
                                <span class="logo-font">PROFESSIONNEL</span> Distribution
                                <i class="fa fa-cog" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <canvas id="service_professional_distribution"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card-container">
                        <div class="card" style="width: 25rem;">
                            <div class="card-header stat-card-header">
                                Service Requests Distribution
                                <i class="fa fa-cog" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <canvas id="service_requests_distribution"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card-container">
                        <div class="card" style="width: 25rem;">
                            <div class="card-header stat-card-header">
                                Customer Requests Distribution
                                <i class="fa fa-cog" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <canvas id="customer_requests_distribution"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center" style="margin-top: 15px;">
                <div class="col-md-6">
                    <div class="card-container">
                        <div class="card" style="width: 100%;">
                            <div class="card-header stat-card-header">
                                Cumulative Service Revenue
                                <i class="fa fa-usd" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center" style="max-height: 400px;">
                                <canvas id="service_revenue_distribution"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card-container">
                        <div class="card" style="width: 100%;">
                            <div class="card-header stat-card-header">
                                Potential Cumulative Service Revenue
                                <i class="fa fa-usd" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center" style="max-height: 400px;">
                                <canvas id="potential_service_revenue_distribution"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <seperator />

            <div class="row justify-content-center" style="margin-top: 15px;">
                <div class="col-md-4">
                    <div class="card-container">
                        <div class="card" style="width: 25rem;">
                            <div class="card-header stat-card-header">
                                <span class="logo-font">PROFESSIONNEL</span> Locations
                                <i class="fa fa-address-book" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <canvas id="service_professional_location_distribution"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card-container">
                        <div class="card" style="width: 25rem;">
                            <div class="card-header stat-card-header">
                            <span class="logo-font">PROFESSIONNEL</span> Experience
                                <i class="fa fa-address-book" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <canvas id="service_professional_experience_distribution"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card-container">
                        <div class="card" style="width: 25rem;">
                            <div class="card-header stat-card-header">
                            <span class="logo-font">PROFESSIONNEL</span> Completed Services
                                <i class="fa fa-address-book" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <canvas id="service_professional_completed_services_distribution"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <seperator />

            <div class="row justify-content-center" style="margin-top: 15px;">
                <div class="col-md-4">
                    <div class="card-container">
                        <div class="card" style="width: 25rem;">
                            <div class="card-header stat-card-header">
                                <span class="logo-font">PATRON</span> Lifetime
                                <i class="fa fa-users" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <canvas id="customer_lifetime_distribution"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card-container">
                        <div class="card" style="width: 25rem;">
                            <div class="card-header stat-card-header">
                            <span class="logo-font">PATRON</span> Services Booked
                                <i class="fa fa-users" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <canvas id="customer_services_booked_distribution"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card-container">
                        <div class="card" style="width: 25rem;">
                            <div class="card-header stat-card-header">
                            <span class="logo-font">PATRON</span> Services Price
                                <i class="fa fa-users" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center">
                                <canvas id="customers_services_price_distribution"></canvas>
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
        async getUserDistributionStats() {
            const request = await fetch('/api/admin/stats/distributions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.token
                }
            })

            const response = await request.json()
            this.services = response.services
            this.service_professional_distribution = response.service_professional_distribution
            this.service_requests_distribution = response.service_requests_distribution
            this.customer_requests_distribution = response.customer_requests_distribution
            this.service_professional_location_distribution = response.service_professional_location_distribution
            this.service_professional_experience_distribution = response.service_professional_experience_distribution
            this.service_professional_services_completed_distribution = response.service_professional_services_completed_distribution
            this.customer_lifetime_distribution = response.customer_lifetime_distribution
            this.customer_services_booked_distribution = response.customer_services_booked_distribution
            this.customer_services_price_distribution = response.customer_services_price_distribution
            this.service_revenue_distribution = response.service_revenue_distribution
            this.potential_service_revenue_distribution = response.potential_service_revenue_distribution

            this.createServiceProfessionalDistributionChart()
            this.createServiceRequestsDistributionChart()
            this.createCustomerRequestsDistributionChart()
            this.createServiceRevenueDistributionChart()
            this.createPotentialServiceRevenueDistributionChart()

            this.createServiceProfessionalLocationDistributionChart()
            this.createServiceProfessionalExperienceDistributionChart()
            this.createServiceProfessionalServicesCompletedDistributionChart()

            this.createCustomerLifetimeDistributionChart()
            this.createCustomerServicesBookedDistributionChart()
            this.createCustomerServicesPriceDistributionChart()
        },

        createServiceProfessionalDistributionChart() {
            const chart_ele = document.getElementById('service_professional_distribution').getContext('2d')
            this.chart = new Chart(chart_ele, {
                type: 'pie',
                data: {
                    labels: this.services,
                    datasets: [{
                        data: this.service_professional_distribution
                    }]
                },
                options: {
                    responsive: true
                }
            })
        },

        createServiceRequestsDistributionChart() {
            const chart_ele = document.getElementById('service_requests_distribution').getContext('2d')
            this.chart = new Chart(chart_ele, {
                type: 'pie',
                data: {
                    labels: this.services,
                    datasets: [{
                        data: this.service_requests_distribution
                    }]
                },
                options: {
                    responsive: true
                }
            })
        },

        createCustomerRequestsDistributionChart() {
            const chart_ele = document.getElementById('customer_requests_distribution').getContext('2d')
            this.chart = new Chart(chart_ele, {
                type: 'pie',
                data: {
                    labels: this.services,
                    datasets: [{
                        data: this.customer_requests_distribution
                    }]
                },
                options: {
                    responsive: true
                }
            })
        },

        createServiceRevenueDistributionChart() {
            const range = Array.from({length: this.service_revenue_distribution.length}, (v, k) => k)
            const chart_ele = document.getElementById('service_revenue_distribution').getContext('2d')
            this.chart = new Chart(chart_ele, {
                type: 'line',
                data: {
                    labels: range,
                    datasets: [{
                        label: 'Service Revenue',
                        data: this.service_revenue_distribution
                    }],
                },
                options: {
                    responsive: true
                }
            })
        }, 

        createPotentialServiceRevenueDistributionChart() {
            const range = Array.from({length: this.potential_service_revenue_distribution.length}, (v, k) => k)
            const chart_ele = document.getElementById('potential_service_revenue_distribution').getContext('2d')
            this.chart = new Chart(chart_ele, {
                type: 'line',
                data: {
                    labels: range,
                    datasets: [{
                        label: 'Potential Service Revenue',
                        data: this.potential_service_revenue_distribution
                    }],
                },
                options: {
                    responsive: true
                }
            })
        },
        
        createServiceProfessionalLocationDistributionChart() {
            const chart_ele = document.getElementById('service_professional_location_distribution').getContext('2d')
            this.chart = new Chart(chart_ele, {
                type: 'bar',
                data: {
                    labels: Object.keys(this.service_professional_location_distribution),
                    datasets: [{
                        label: 'Service Professional Locations',
                        data: Object.values(this.service_professional_location_distribution)
                    }]
                },
                options: {
                    responsive: true
                }
            })
        },

        createServiceProfessionalExperienceDistributionChart() {
            const chart_ele = document.getElementById('service_professional_experience_distribution').getContext('2d')
            this.chart = new Chart(chart_ele, {
                type: 'bar',
                data: {
                    labels: Object.keys(this.service_professional_experience_distribution),
                    datasets: [{
                        label: 'Service Professional Experience',
                        data: Object.values(this.service_professional_experience_distribution)
                    }]
                },
                options: {
                    responsive: true
                }
            })
        },

        createServiceProfessionalServicesCompletedDistributionChart() {
            const chart_ele = document.getElementById('service_professional_completed_services_distribution').getContext('2d')
            this.chart = new Chart(chart_ele, {
                type: 'bar',
                data: {
                    labels: Object.keys(this.service_professional_services_completed_distribution),
                    datasets: [{
                        label: 'Service Professional Completed Services',
                        data: Object.values(this.service_professional_services_completed_distribution)
                    }]
                },
                options: {
                    responsive: true
                }
            })
        },

        createCustomerLifetimeDistributionChart() {
            const chart_ele = document.getElementById('customer_lifetime_distribution').getContext('2d')
            this.chart = new Chart(chart_ele, {
                type: 'bar',
                data: {
                    labels: Object.keys(this.customer_lifetime_distribution),
                    datasets: [{
                        label: 'Customer Lifetime',
                        data: Object.values(this.customer_lifetime_distribution)
                    }]
                },
                options: {
                    responsive: true
                }
            })
        },

        createCustomerServicesBookedDistributionChart() {
            const chart_ele = document.getElementById('customer_services_booked_distribution').getContext('2d')
            this.chart = new Chart(chart_ele, {
                type: 'bar',
                data: {
                    labels: Object.keys(this.customer_services_booked_distribution),
                    datasets: [{
                        label: 'Customer Services Booked',
                        data: Object.values(this.customer_services_booked_distribution)
                    }]
                },
                options: {
                    responsive: true
                }
            })
        },

        createCustomerServicesPriceDistributionChart() {
            const chart_ele = document.getElementById('customers_services_price_distribution').getContext('2d')
            this.chart = new Chart(chart_ele, {
                type: 'bar',
                data: {
                    labels: Object.keys(this.customer_services_price_distribution),
                    datasets: [{
                        label: 'Customer Services Price',
                        data: Object.values(this.customer_services_price_distribution)
                    }]
                },
                options: {
                    responsive: true
                }
            })
        },

        getToken: function() {
            return localStorage.getItem('token')
        }
    },

    data() {
        return {
            token: '',

            services: [],
            service_professional_distribution: [],
            service_requests_distribution: [],
            customer_requests_distribution: [],
            service_professional_location_distribution: {},
            service_professional_experience_distribution: {},
            service_professional_services_completed_distribution: {},
            customer_lifetime_distribution: {},
            customer_services_booked_distribution: {},
            customer_services_price_distribution: {},
            service_revenue_distribution: [],
            potential_service_revenue_distribution: []
        }
    },

    mounted() {
        this.token = this.getToken()
        if (!this.token) {
            alert('You are not logged in. Redirecting to login page.')
            window.location.href = '/adminLogin'
        }

        this.getUserDistributionStats()
    },

    beforeDestroy() {
        // Destroy the chart instance to avoid memory leaks when the component is unmounted
        if (this.chart) {
            this.chart.destroy();
        }
    }
}
