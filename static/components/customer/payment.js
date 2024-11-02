
export default ({
    template: /*html*/`
        <div class="container">
            <div class="row text-center">
                <h1>Paying {{ payment.serviceProfessional.name }}</h1>
            </div>

            <br><br>

            <div class="row justify-content-center">
                <div class="col-md-8 mb-4">
                    <div class="card mb-4">
                    <div class="card-header py-3">
                        <h5 class="mb-0">Billing details</h5>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="handleSubmit">
                            <div data-mdb-input-init class="form-outline mb-4">
                                <input type="text" :value="payment.customer.name" id="form6Example1" class="form-control" />
                                <label class="form-label" for="form6Example1">Full name</label>
                            </div>
                
                            <div data-mdb-input-init class="form-outline mb-4">
                                <input type="text" :value="payment.customer.address" id="form6Example4" class="form-control" />
                                <label class="form-label" for="form6Example4">Address</label>
                            </div>
                
                            <div data-mdb-input-init class="form-outline mb-4">
                                <input type="email" :value="payment.customer.email" id="form6Example5" class="form-control" />
                                <label class="form-label" for="form6Example5">Email</label>
                            </div>
                
                            <div data-mdb-input-init class="form-outline mb-4">
                                <input type="number" id="form6Example6" class="form-control" />
                                <label class="form-label" for="form6Example6">Phone</label>
                            </div>
                
                            <hr class="my-4" />
                
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="checkoutForm1" />
                                <label class="form-check-label" for="checkoutForm1">
                                Shipping address is the same as my billing address
                                </label>
                            </div>
                
                            <div class="form-check mb-4">
                                <input class="form-check-input" type="checkbox" value="" id="checkoutForm2" checked />
                                <label class="form-check-label" for="checkoutForm2">
                                Save this information for next time
                                </label>
                            </div>
                
                            <hr class="my-4" />
                
                            <h5 class="mb-4">Payment Mode</h5>
                
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="checkoutForm3"
                                checked />
                                <label class="form-check-label" for="checkoutForm3">
                                Credit card
                                </label>
                            </div>
                
                            <div class="row mb-4" style="padding-bottom: 0px;">
                                <div class="col">
                                <div data-mdb-input-init class="form-outline">
                                    <input type="text" :value="payment.customer.name" id="formNameOnCard" class="form-control" />
                                    <label class="form-label" for="formNameOnCard">Name on card</label>
                                </div>
                                </div>
                                <div class="col">
                                <div data-mdb-input-init class="form-outline">
                                    <input type="text" id="formCardNumber" class="form-control" />
                                    <label class="form-label" for="formCardNumber">Credit card number</label>
                                </div>
                                </div>
                            </div>
                
                                <div class="row mb-4" style="padding-bottom: 0px;">
                                <div class="col-3">
                                <div data-mdb-input-init class="form-outline">
                                    <input type="text" id="formExpiration" class="form-control" />
                                    <label class="form-label" for="formExpiration">Expiration</label>
                                </div>
                                </div>
                                <div class="col-3">
                                <div data-mdb-input-init class="form-outline">
                                    <input type="text" id="formCVV" class="form-control" />
                                    <label class="form-label" for="formCVV">CVV</label>
                                </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center">
                                <button data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-lg btn-block btn-submit w-100" type="submit">
                                    Finish Payment
                                </button>
                            </div>
                        </form>
                    </div>
                    </div>
                </div>
            
                <div class="col-md-4 mb-4">
                    <div class="card mb-4">
                    <div class="card-header py-3">
                        <h5 class="mb-0">Summary</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Ad Request Completion
                            <span>$ {{ payment.serviceRequest.price }}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Shipping
                            <span>N/A</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                            18% Tax
                            <span>$ {{ payment.serviceRequest.price * 0.18 }}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                            <div>
                            <strong>Total amount</strong>
                            <strong>
                                <p class="mb-0">(including Tax)</p>
                            </strong>
                            </div>
                            <span><strong>$ {{ payment.serviceRequest.price + (payment.serviceRequest.price * 0.18) }}</strong></span>
                        </li>
                        </ul>
                    </div>
                    </div>
                </div>
            </div>
        </div> 
        
        <br>
    `,

    methods: {
        async handleSubmit() {
            const response = await fetch('/api/service-professionals/requests/payment', {
                method: 'PATCH',
                headers: {
                    'x-access-token': this.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: this.payment.serviceRequest.id
                })
            })

            if (response.ok) {
                alert('Payment successful')
                window.location.href = '/customerDash'
            } else {
                alert('Payment failed')
            }
        }
    },

    props: {
        payment: {
            type: Object,
            required: true
        },

        token: {
            type: String,
            required: true
        }
    },

    mounted() {
        console.log(this.payment)
    }
})
