
<form className="was-validated" onSubmit={this.submitForm} noValidate>
<PaymentInputsContainer>
{({ meta, getCardNumberProps, getExpiryDateProps, getCVCProps }) => (
    <div>
        <div className="form-group mt-40px">
            <input {...getCardNumberProps()}
            placeholder = 'Card Number' name="card_number"
            className = 'form-control' id="card_number"  required/>
            {(() => {
                if(meta.touchedInputs.cardNumber && meta.erroredInputs.cardNumber) {
                return (
                    <div className="invalid-feedback">
                        { meta.erroredInputs.cardNumber }
                    </div>
                    )}
                })()}
        </div>    
        <div className="row">
            <div className="col mt-2">
                <input {...getExpiryDateProps()} 
                placeholder= 'Expiry Date' name="exp"
                className= 'form-control' id="exp" required/>
                {(() => {
                if(meta.touchedInputs.expiryDate && meta.erroredInputs.expiryDate ) {
                return (
                    <div className="invalid-feedback">
                        { meta.erroredInputs.expiryDate }
                    </div>
                    )    
                }})()}
            </div>
            <div className="col mt-2">
                <input {...getCVCProps()} name='cvv'
                placeholder= 'CVV' className= 'form-control' id="cvv" required />
                {(() => {
                if(meta.touchedInputs.cvc && meta.erroredInputs.cvc) {
                return (
                    <div className="invalid-feedback">
                        { meta.erroredInputs.cvc }
                    </div>
                    )    
                }})()}
            </div>
        </div>
    </div>
)}
</PaymentInputsContainer>

<button className='checkout-btn mt-80px' type='submit'
    value='Checkout'>
        Make Payment
</button>
</form>


















class CardPayment extends React.Component {
    constructor(props) {
        super(props)    
        const state_initials = props.location.state
        this.state = {
            ...state_initials,
            overlay: '',
        }
    }

    submitForm = (e) => {
    /*                
        const card_number = e.target.card_number.value
        const exp = e.target.exp.value
        const cvv = e.target.cvv.value */
        $('#spinner').removeClass('hidden');
        
        axios.post('https://api.paystack.co/transaction/initialize', {
                name: this.state.fullname,
                email: this.state.email,
                amount: this.state.total_price,
                currency: 'NGN',
                reference: this.state.order_id,
                metadata: {    
                    custom_fields: [
                        {
                            display_name: 'phone number',
                            variable_name: 'phone_number',
                            value: this.state.phone,
                        },
                        {
                            display_name: 'how many',
                            variable_name: 'how_many',
                            value: this.state.amount,
                        }
                    ]
                }
            
        }, 
        {
            headers: {
                Authorization: "Bearer sk_test_a17e9927c6754497f6a0d6a7b5d911346dbd5ce3",
                'Content-Type': "application/json",
            }
        })
        .then((res) => {
            console.log(res)
            window.location.href = res.data.data.authorization_url
        })
        .catch((err) => {console.log(e)})
    }

    componentDidMount() {    
        $('#spinner').removeClass('hidden');    
        let url = new URL(window.location.href);
        let trxref = url.searchParams.get("trxref");
        let reference = url.searchParams.get("reference");
        // verify payment
        if (trxref && reference) {
            axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: "Bearer sk_test_a17e9927c6754497f6a0d6a7b5d911346dbd5ce3",
                'Content-Type': "application/json",
                }
            })
            .then((res) => {
                if (res.data.data.status === 'success') {
                    sessionStorage.clear()
                    console.log(res)
                    this.setState({order_id: res.data.data.reference, 
                        date: String(res.data.data.createdAt).substring(0, 10), 
                        total_price: res.data.data.amount, email: res.data.data.customer.email
                    })
                    //axios.put(`https://cyberstick-project.herokuapp.com/cyberstick/orders/${reference}`, {    
                    axios.put(`http://127.0.0.1:8000/cyberstick/orders/${reference}`, {
                        status: 2,
                    })
                    .then((res) => {
                        $('#payment-btn').addClass('hidden')
                        this.setState({overlay: 'success'})
                        $('#spinner').addClass('hidden');    
                    })
                    .catch((err) => {
                        $('#spinner').addClass('hidden');    
                        console.log(err)
                    }
                    )
                }
                else {
                    this.setState({overlay: 'failed'})
                }
                $('#spinner').addClass('hidden');
            })
            .catch((err) => {
                $('#spinner').addClass('hidden');    
                console.log(err)
            })
        }            
        else $('#spinner').addClass('hidden');
    }    

    render() {
        let overlay
        if (this.state.overlay === 'success') overlay = <PaymentSuccessful />
        else if (this.state.overlay === 'failed') overlay = <PaymentFailed />
        else overlay = null    
        return (    
            <div className="container-fluid">
            <ScrollToTopOnMount />        
            {overlay ? overlay : ''}
                <section className='row checkout-section-1
                justify-content-around align-items-start g-0px'>
                    <div className="col-md-6 col-12">
                        <div className="py-5 pb-30px">
                            <h2 className="thank fw-400 text-white
                            border-bottom pb-3 mb-4">
                                Thank You. Your Order Has Been Received.    
                            </h2> 
                            <div className="my-1 text-muted order-details">Order number: <span>{this.state.order_id}</span></div>
                            <div className="my-1 text-muted order-details">Date: <span>{this.state.date}</span></div>
                            <div className="my-1 text-muted order-details">Email: <span>{this.state.email}</span></div>
                            <div className="my-1 text-muted order-details">Total: <span>
                                                <NumberFormat value={this.state.total_price}
                                                displayType={'text'} thousandSeparator={true} prefix={'₦ '} />
                                                </span></div>
                            <div className="my-1 text-muted order-details">Payment method: <span>Pay with debit/credit card</span></div>
                            
                            <button className='checkout-btn mt-80px' type='submit'
                                value='Checkout' onClick={this.submitForm} id='payment-btn'>
                                    Make Payment
                            </button>
                        
                        </div>
                    </div>
                    <div className="mt-30px">
                        <CheckoutForm header="your order total" price={this.state.total_price}
                            shipping={this.state.shipping} tax={this.state.tax}
                            total_price={this.state.total_price} />
                    </div>
                </section>
            </div>
        )}
}
