import seperator from '../lineSeperator.js'

export default {
    template: /*html*/ `
        <br><br>

        <div class="container">
            <div class="row justify-content-center" style="margin-top: 15px;">
                <div class="col-md-6">
                    <div class="card-container">
                        <div class="card" style="width: 100%;">
                            <div class="card-header stat-card-header">
                                API Requests
                                <i class="fa fa-code" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center" style="max-height: 400px;">
                                <canvas id="api_requests_recent"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card-container">
                        <div class="card" style="width: 100%;">
                            <div class="card-header stat-card-header">
                                Average API Latency
                                <i class="fa fa-code" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center" style="max-height: 400px;">
                                <canvas id="api_latency"></canvas>
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
                                Total Ingress
                                <i class="fa fa-code" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center" style="max-height: 400px;">
                                <canvas id="total_ingress"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card-container">
                        <div class="card" style="width: 100%;">
                            <div class="card-header stat-card-header">
                                Total Egress
                                <i class="fa fa-code" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center" style="max-height: 400px;">
                                <canvas id="total_egress"></canvas>
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
                                Daily API Requests
                                <i class="fa fa-code" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center" style="max-height: 400px;">
                                <canvas id="daily_api_requests"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card-container">
                        <div class="card" style="width: 100%;">
                            <div class="card-header stat-card-header">
                                Daily Average API Latency
                                <i class="fa fa-code" style="margin-left: 15px;"></i>
                            </div>
                            <div class="card-body card-text-center" style="max-height: 400px;">
                                <canvas id="daily_average_api_latency"></canvas>
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
        async getAPIStats() {
            const request = await fetch('/api/admin/stats/api', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.getToken()  
                }
            })

            const response = await request.json()
            this.api_requests_recent = response.api_requests_recent
            this.api_latency = response.api_latency
            this.total_ingress = response.total_ingress
            this.total_egress = response.total_egress
            this.daily_api_requests = response.daily_api_requests
            this.daily_average_api_latency = response.daily_average_api_latency

            this.createAPIRequestsChart()
            this.createAPILatencyChart()
            this.createTotalIngressChart()
            this.createTotalEgressChart()
            this.createDailyAPIRequestsChart()
            this.createDailyAverageAPILatencyChart()
        },

        createAPIRequestsChart() {
            const ctx = document.getElementById('api_requests_recent').getContext('2d')
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(this.api_requests_recent),
                    datasets: [{
                        label: 'Average API Latency',
                        data: this.api_requests_recent,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })
        },

        createAPILatencyChart() {
            const ctx = document.getElementById('api_latency').getContext('2d')
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(this.api_latency),
                    datasets: [{
                        label: 'Average API Latency in seconds',
                        data: this.api_latency,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })
        },

        createTotalIngressChart() {
            const ctx = document.getElementById('total_ingress').getContext('2d')
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(this.total_ingress),
                    datasets: [{
                        label: 'Total Ingress in bits',
                        data: this.total_ingress,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })
        },

        createTotalEgressChart() {
            const ctx = document.getElementById('total_egress').getContext('2d')
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(this.total_egress),
                    datasets: [{
                        label: 'Total Egress in bits',
                        data: this.total_egress,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })
        },

        createDailyAPIRequestsChart() {
            const ctx = document.getElementById('daily_api_requests').getContext('2d')
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(this.daily_api_requests),
                    datasets: [{
                        label: 'API Requests',
                        data: Object.values(this.daily_api_requests),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })
        },

        createDailyAverageAPILatencyChart() {
            const ctx = document.getElementById('daily_average_api_latency').getContext('2d')
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(this.daily_average_api_latency),
                    datasets: [{
                        label: 'Average API Latency in seconds',
                        data: this.daily_average_api_latency,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
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

            api_requests_recent: {},
            api_latency: {},
            total_ingress: {},
            total_egress: {},
            daily_api_requests: {},
            daily_average_api_latency: []
        }
    },

    mounted() {
        this.token = this.getToken()
        if (!this.token) {
            alert('You are not logged in. Redirecting to login page.')
            window.location.href = '/adminLogin'
        }

        this.getAPIStats()
    }
}
