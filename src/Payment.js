// Import external modules and components
import React from "react";
import axios from "axios";
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { ScrollToTopOnMount, CheckoutForm } from "./Bases";
import NumberFormat from "react-number-format";
import emailjs from '@emailjs/browser';
import $ from 'jquery';

// Import image files
import tick from "./static/tick.png";
import close from "./static/failed.png";
import union from "./static/Union.png";
import whitebg from './static/paymentimgs.png';
import paystack from './static/paystack.png';
import cybersticbent from './static/cyberstickbent.png';



// Return the Payment Successful popup
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

// Return the Payment Failed popup
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
                <button className='checkout-btn validation-btn mt-30px'
                onClick={() => {window.location.href = sessionStorage.getItem('payment_url')}}>Retry</button>
            </div>
        </div>
    )
}

// Make card payment through the backend
class CardPayment extends React.Component {
    constructor(props) {
        super(props)    
        const state_initials = props.location.state
        this.state = {
            ...state_initials,
            overlay: '', /** If value is 'success', PaymentSuccessful component is called, if its 'failed' PaymentFailed component 
            is called, if empty, no popup is shown */
        }
    }

    // Make a get request to the backend to initiate payment and on success, redirect to paystack
    submitForm = (e) => {
        axios.get(`https://cyberstick-backend.herokuapp.com/cyberstick/makepayment/?order_id=${this.state.order_id}&amount=${this.state.total_price * 100}`)
        //axios.get(`http://127.0.0.1:8000/cyberstick/makepayment/?order_id=${this.state.order_id}&amount=${this.state.total_price * 100}`)
        .then((res) => {
            sessionStorage.setItem('payment_url', res.data.authorization_url)
            window.location.href = res.data.authorization_url // redirect to paystack using the url gotten from the backend
        })
        .catch((e) => {console.log(e.message); 
            $('#spinner').addClass('hidden');
            this.setState({overlay: 'failed'})})
    }

    componentDidMount() {    
        $('#spinner').removeClass('hidden');    
        let url = new URL(window.location.href);
        let trxref = url.searchParams.get("trxref");
        let reference = url.searchParams.get("reference");

        /** Paystack redirects back to this same page/component so, if trxref and reference are present on the url, it's assumed that
         * a payment was previously made and a get request is sent to the backend to verify the payment with the given reference */
        if (trxref && reference) {
            axios.get(`https://cyberstick-backend.herokuapp.com/cyberstick/verifypayment?trxref=${trxref}&reference=${reference}`)    
            //axios.get(`http://127.0.0.1:8000/cyberstick/verifypayment?trxref=${trxref}&reference=${reference}`)
            .then((res) => {
                this.setState({overlay: 'success'})
                $('#spinner').addClass('hidden');
                this.setState({order_id: res.data.order_id, 
                    date: res.data.delivery_date, 
                    total_price: res.data.total_price,
                    email: res.data.email
                })
                // Send an email to the customer
                emailjs.send("gmail", "template_tz24zvl", {
                    to_name: sessionStorage.getItem('customer'),
                    order_id: res.data.order_id,
                    delivery_date: res.data.delivery_date,
                    reply_to: res.data.email
                }, 'C6M0b-kqeLWPsKmw-')
                .then((res) => console.log('email sent successfully'), (err) => console.log('fialed...', err))
            })
            .catch((err) => {
                $('#spinner').addClass('hidden');
                this.setState({overlay: 'failed'});
                alert(err)
            })
        }
        /** This page is only for automated payments so if trx and reference doesn't exist, Payment is initiated  */       
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
                                {(() => {
                                    if (!overlay) return 'Proceeding to payment'
                                    else if(this.state.overlay === 'success') return 'Thank you, your order has been received'
                                    else if(this.state.overlay === 'failed') return 'Payment failed'   
                                })()}
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

// Display details for transfer payments
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
                    <div className="my-4 mb-5 pb-3 text-md-left text-center">
                        <h2 className="fw-400 text-white thank
                            border-bottom pb-3 mb-4 " >
                                Our Bank Details
                        </h2> 
                        <div className="my-1 text-muted order-details">Bank: <span>United Bank for Africa</span></div>
                        <div className="my-1 text-muted order-details">Account number: <span>2117270163</span></div>
                    </div>
                    <div className="my-5 text-md-left text-center large-screens">
                        <h2 className="fw-400 text-white thank
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
                    <div className="my-5 text-md-left text-center medium-screens">
                        <h2 className="fw-400 text-white
                            pb-3 mb-1 thank">
                                Order Details
                        </h2> 
                        
                        <div className='checkout-details final-details pt-4 pb-5 px-4 card'>
                            <div className="card-header p-0">
                                <div className='my-2 text-center'>
                                    <div className='fw-600 fs-1p3em '>Product</div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className='d-flex align-items-center
                                justify-content-center flex-wrap py-1'>
                                    <img className='cyberstickbent' src={cybersticbent} alt='product'/>
                                    <div className='my-1'>Cyberstick - Black X1</div>
                                </div>    
                            </div>
                            <div className='card-footer px-0 py-3'>
                                <div className='d-flex'>
                                    <div>Subtotal</div>
                                    <div className="ml-auto"><NumberFormat value={this.state.total_price}
                                        displayType={'text'} thousandSeparator={true} prefix={'₦'} /></div>
                                </div>    
                                <div className='d-flex my-2 '>
                                    <div>Shipping</div>
                                    <div className="ml-auto">{this.state.shipping}</div>
                                </div>
                                <div className='d-flex my-2'>
                                    <div className='mr-auto'>Estimated Tax</div>
                                    <div>{this.state.tax}</div>
                                </div>
                                <div className='d-flex my-2'>
                                    <div className='mr-auto'>Payment Method</div>
                                    <div>Direct Bank Transfer</div>
                                </div>
                            </div>
                            <div className='d-flex pt-3' style={{'borderTop': '1px solid rgb(50, 50, 50)'}}>
                                <div className='mr-auto fw-600 fs-1p3em'>Total</div>
                                <div className='fw-600 fs-1p3em'><NumberFormat value={this.state.total_price}
                                    displayType={'text'} thousandSeparator={true} prefix={'₦'} /></div>
                            </div>
                        </div>
                    </div>
                    <div className="my-5 text-md-left text-center">
                        <h2 className="fw-400 text-white border-bottom pb-3 mb-4 thank">
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

// Determine whether to use CardPayment of TransferPayment
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
            .get(`https://cyberstick-backend.herokuapp.com/cyberstick/orders/${sessionStorage.getItem('order_token')}`)    
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
            .catch((err) => {alert(err.message); $('#spinner').addClass('hidden');})
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
                            <div className="py-5 pb-30px text-sm-left text-center">
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
                        <div className="mt-30px col-12 col-md-4">
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

// Wrap class components in functional components to be able to use React Hooks
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