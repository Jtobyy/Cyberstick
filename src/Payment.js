import React from "react";

import axios from "axios";
import tick from "./static/tick.png";
import close from "./static/failed.png";
import union from "./static/Union.png";
import whitebg from './static/paymentimgs.png';
import paystack from './static/paystack.png';
import NumberFormat from "react-number-format";
import emailjs from '@emailjs/browser';
 
import { Link, useParams, useLocation, Navigate } from "react-router-dom";

import { ScrollToTopOnMount, CheckoutForm } from "./Bases";
import cybersticbent from './static/cyberstickbent.png';    
import $ from 'jquery';


function PaymentSuccessful() {
    return (
        <div className="card w-75 validation-card  pb-30px" id='overlay'>
            <div className="card-body text-center">
                <div className="text-right"
                onClick={
                    (e) => {if (e.target.parentElement.parentElement.parentElement.id === 'overlay')
                    e.target.parentElement.parentElement.parentElement.classList.add('hidden')
                    else e.target.parentElement.parentElement.classList.add('hidden')
                }}
                ><span className="close-card">&times;</span></div>    
                <img src={tick} className="validation-img" alt="" />
                <h3 className="p-3">Payment Successful</h3>
                <Link to='/'>
                    <button className='checkout-btn validation-btn mt-30px'>Go back to homepage</button>
                </Link>
            </div>
        </div>
    )
}

function PaymentFailed() {
    return (
        <div className="card w-75 validation-card pb-30px" id='overlay'>
            <div className="card-body text-center">
                <div className="text-right"><span className="close-card"
                onClick={
                    (e) => {if (e.target.parentElement.parentElement.parentElement.id === 'overlay')
                    e.target.parentElement.parentElement.parentElement.classList.add('hidden')
                    else e.target.parentElement.parentElement.classList.add('hidden')
                }}>&times;</span></div>    
                <div className="validation-img-wrapper d-flex justify-content-center
                 position-relative">
                    <img src={union} className="validation-img-union position-absolute" alt="" />
                    <img src={close} className="validation-img-close position-absolute" alt="" />
                </div>
                <h3 className="p-3">Payment Failed</h3>
            </div>
        </div>
    )
}

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
        axios.post('https://api.paystack.co/transaction/initialize', {
                name: this.state.fullname,
                email: this.state.email,
                amount: this.state.total_price * 100,
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
                    this.setState({order_id: res.data.data.reference, 
                        date: String(res.data.data.createdAt).substring(0, 10), 
                        total_price: res.data.data.amount / 100, email: res.data.data.customer.email
                    })
                    axios.put(`https://cyberstick-project.herokuapp.com/cyberstick/orders/${reference}`, {    
                    //axios.put(`http://127.0.0.1:8000/cyberstick/orders/${reference}`, {
                        status: 2,
                    })
                    .then((res) => {
                        this.setState({overlay: 'success'})
                        $('#spinner').addClass('hidden');
                        const delivery_date = new Date(new Date().getTime()+(10*24*60*60*1000));
                        emailjs.send('gmail', 'template_tz24zvl', 
                                    {reply_to: 'olorunmeyanjoseph@gmail.com', customer_email: 'jtobi8161@gmail.com', to_name: sessionStorage.getItem('customer') || this.state.email,
                                    order_id: this.state.order_id, delivery_date: delivery_date.toDateString()}, 'C6M0b-kqeLWPsKmw-')
                                .then((res) => console.log('Email sent succesfully'))
                                .catch((err) => console.log(err))

                        sessionStorage.clear()
                    
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
        else {
            this.submitForm()
        } 
    }    

    render() {
        let url = new URL(window.location.href);
        let trxref = url.searchParams.get("trxref");
        let reference = url.searchParams.get("reference");    
        if (!sessionStorage.getItem('PIP') && !reference && !trxref)
        return <Navigate to='/checkout'/>    
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

class TransferPayment extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            ...props.location.state,
        }
    }

    componentDidMount() {
        $('#spinner').addClass('hidden');
    }

    render() {
        if (!sessionStorage.getItem('PIP'))    
        return <Navigate to='/checkout'/>
        return (
            <div className="container-fluid ">
            <ScrollToTopOnMount />
            <section className='pl-6vw row checkout-section-1
            justify-content-around align-items-start g-0px'>
                <div className="col-12 ">
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
                        <p className="my-4">Kindly make your payment directly into our bank account and 
                            send the receipt details to info@cyberstick.com. Please use 
                            your Order ID as the payment reference, For instance, 
                            if you registered with the name John Doe and you are paying 
                            for an Order ID of #1234, you should state the depositor’s 
                            name as John Doe (#1234).These details would assist us in 
                            tracing your payment quickly and easily. Your order won’t be 
                            shipped until the funds have cleared in our account.</p>
                    </div>
                    <div className="my-4 mb-5 pb-3">
                        <h2 className="thank fw-400 text-white
                            border-bottom pb-3 mb-4 ">
                                Our Bank Details
                        </h2> 
                        <div className="my-1 text-muted order-details">Bank: <span>United Bank for Africa</span></div>
                        <div className="my-1 text-muted order-details">Account number: <span>2043103595</span></div>
                    </div>
                    <div className="my-5">
                        <h2 className="thank fw-400 text-white
                            pb-3 mb-1">
                                Order Details
                        </h2> 
                        
                        <div className='checkout-details final-details pt-4 pb-5 px-5 card'>
                            <div className="card-header p-0">
                                <div className='d-flex my-2'>
                                    <div className='fw-600 fs-1p3em'>Product</div>
                                    <div className='ml-auto fw-600 fs-1p3em'>Total</div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className='d-flex align-items-center
                                justify-content-start flex-wrap py-3'>
                                    <img className='cyberstickbent' src={cybersticbent} alt='product'/>
                                    <div className='my-1'>Cyberstick - Black X1</div>
                                    <div className="ml-auto"><NumberFormat value={this.state.total_price}
                                        displayType={'text'} thousandSeparator={true} prefix={'₦'} /></div>
                                </div>    
                            </div>
                            <div className='card-footer checkout-card px-0 py-3'>
                                <div className='d-flex pl-50per'>
                                    <div>Subtotal</div>
                                    <div className="ml-auto"><NumberFormat value={this.state.total_price}
                                        displayType={'text'} thousandSeparator={true} prefix={'₦'} /></div>
                                </div>    
                                <div className='d-flex my-2 pl-50per'>
                                    <div>Shipping</div>
                                    <div className="ml-auto">{this.state.shipping}</div>
                                </div>
                                <div className='d-flex my-2 pl-50per'>
                                    <div className='mr-auto'>Estimated Tax</div>
                                    <div>{this.state.tax}</div>
                                </div>
                                <div className='d-flex my-2 final-details-method'>
                                    <div className='mr-auto'>Payment Method</div>
                                    <div>Direct Bank Transfer</div>
                                </div>
                                <div className='d-flex pl-50per pt-3'>
                                    <div className='mr-auto fw-600 fs-1p3em'>Total</div>
                                    <div className='fw-600 fs-1p3em'><NumberFormat value={this.state.total_price}
                                        displayType={'text'} thousandSeparator={true} prefix={'₦'} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="my-5">
                        <h2 className="thank fw-400 text-white border-bottom pb-3 mb-4">
                                Customer Details
                        </h2> 
                        <div className="my-1 text-muted order-details">Email: <span>{this.state.email}</span></div>
                        <div className="my-1 text-muted order-details">Phone: <span>{this.state.phone}</span></div>
                         
                        <h4 className="thank fw-400 text-white mt-4 border-bottom pb-2 mb-3"> Billing Address </h4>
                        <div className="my-1 text-muted order-details">{this.state.fullname}</ div>
                        <div className="my-1 text-muted order-details">{this.state.address},</ div>
                        <div className="my-1 text-muted order-details">{this.state.location}</ div>
                    </div>
                </div>
            </section>
        </div>            
    )}    
}


class Payment extends React.Component {
    constructor(props) {
        sessionStorage.removeItem('PIP');    
        $('#spinner').removeClass('hidden');        
        super(props)
        const state_initials = props.location.state
        this.state = {
            ...state_initials,
            paymentmethod: '',
        }
    }

    choosePayment = (e) => {
        const paymentoption = e.target.paymentoption.value;
        if (e.target.terms.checked && paymentoption !== '') {
            $('#spinner').removeClass('hidden');    
            axios
            .get(`https://cyberstick-project.herokuapp.com/cyberstick/orders/${sessionStorage.getItem('order_token')}`)    
            //.get(`http://127.0.0.1:8000/cyberstick/orders/${sessionStorage.getItem('order_token')}`)
            .then((res) => {
                this.setState({...res.data})
                this.setState({paymentmethod: paymentoption})
                
                if (res.data.fullname !== sessionStorage.getItem('customer')) {
                 alert('invalid request')
                } else {
                    sessionStorage.setItem('PIP', 'yes') /*Payment in progress */    
                }
                
            })
            .catch((err) => {alert('an error occured'); $('#spinner').addClass('hidden');})
        } 
    }    

    componentDidMount() {
        setTimeout(() => sessionStorage.removeItem('new_customer'), 300000)
        $('#spinner').addClass('hidden');
    }

    componentWillUnmount() {
        $('#spinner').removeClass('hidden');
    }
    
    render() {
        if (this.state.paymentmethod === 'debit card') 
        return <Navigate to='/cardpayment' 
                state={{shipping: this.state.shipping,
                tax: this.state.tax, total_price: this.state.total_price,
                order_id: this.state.id, fullname: this.state.fullname,
                email: this.state.email, phone: this.state.phone,
                date: this.state.date }}/>

        else if (this.state.paymentmethod === 'direct transfer')
        return <Navigate to='/transferpayment'
                state={{shipping: this.state.shipping,
                tax: this.state.tax, total_price: this.state.total_price,
                order_id: this.state.id, fullname: this.state.fullname,
                email: this.state.email, phone: this.state.phone,
                address: this.state.address, location: this.state.location,
                date: this.state.date }}/>
                
        if (!sessionStorage.getItem('new_customer')) return <Navigate to='/shipping' />
        if (!this.state.total_price) return <Navigate to='/checkout' />
        
        return (
            <div>
                <ScrollToTopOnMount />
                
                <div className="container-fluid">
                    <section className='row checkout-section-1
                    justify-content-around align-items-start g-0px'>
                        <div className="col-md-6 col-12">
                            <div className="py-5 pb-30px">
                                <h2 className="fw-400 text-white">How Do You Want To Pay?</h2> 
                                <p className="text-muted">Payment Methods</p>
                            </div>
                            <div className="position-relative mt--20px mb-30px">
                                <img className="whitebg postion-absolute" src={whitebg} alt="" />
                                <img className="paystack position-absolute" src={paystack} alt="" />
                            </div>
                            <form onSubmit={(e) => {e.preventDefault(); this.choosePayment(e);}}>
                                <div className="custom-control custom-radio">
                                    <input className="custom-control-input" type='radio' id='debit_card' name='paymentoption' value='debit card' selected />
                                    <label className="custom-control-label fs-1p2em text-white" htmlFor='debit_card'>Pay with debit/credit card</label>
                                </div>
                                <p className="text-muted mt-1">Make payment using your debit and credit cards</p>
                                <div className="custom-control custom-radio mt-4">
                                    <input className="custom-control-input" type='radio' id='direct_transfer' name='paymentoption' value='direct transfer' />
                                    <label className="custom-control-label fs-1p2em text-white" htmlFor='direct_transfer'>Direct bank transfer</label>
                                </div>    
                                <p className="text-muted mt-1">Make your payment directly into our bank account. Please use your Order ID as the payment reference. 
                                    Your order won’t be shipped until the funds have cleared in our account.</p>
                                <div className="custom-control custom-checkbox mt-5">
                                    <input className="custom-control-input" type='checkbox'
                                    id='terms' name='terms' />    
                                    <label className="custom-control-label fs-1em " htmlFor='terms'>
                                        I have read and agreed to the website terms and conditions
                                    </label>
                                </div>
                                <button className='checkout-btn mt-80px' type='submit'
                                value='Checkout'>
                                    Make Payment
                                </button>
                            </form>
                        </div>
                        <div className="mt-30px">
                            <CheckoutForm header="your order total" price={this.state.total_price}
                                shipping={this.state.shipping} tax={this.state.tax}
                                total_price={this.state.total_price} />
                        </div>
                    </section>
                </div>
            </div>
        )
    }    
}

const Payment_wrapper = () => (
    <Payment params={useParams()} location={useLocation()} />
);

const CardPayment_wrapper = () => (
    <CardPayment params={useParams()} location={useLocation()} />
);

const TransferPayment_wrapper = () => (
    <TransferPayment params={useParams()} location={useLocation()} />
);

export { CardPayment_wrapper as CardPayment, 
    TransferPayment_wrapper as TransferPayment, Payment_wrapper as Payment,
    PaymentFailed, PaymentSuccessful }