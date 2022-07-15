import React from "react";
import axios from "axios";
import { useParams, useLocation, Navigate } from "react-router-dom";
import $ from 'jquery';

import { ScrollToTopOnMount, CheckoutForm } from "./Bases";

class Shipping extends React.Component {
    constructor(props) {
        $('#spinner').removeClass('hidden');
        sessionStorage.removeItem('PIP'); 
        super(props)
        const state_initials = props.location.state
        this.state = {
            ...state_initials, 
            checkout: 'no'
        }
    }

    submitInfo = (e) => {
        if (!sessionStorage.getItem('new_customer')) {
            $('#spinner').removeClass('hidden');
            axios.post('https://cyberstick-project.herokuapp.com/cyberstick/customers/', {
            //axios.post('http://127.0.0.1:8000/cyberstick/customers/', {
                first_name: $('#first_name').val(),
                last_name: $('#last_name').val(),
                street_address: $('#street_address').val(),
                country: $('#country').val(),
                zip_code: $('#zip_code').val(),
                city_state: $('#city_state').val(),
                email: $('#email').val(),
                phone_number: $('#phone_number').val(),
                order_id: sessionStorage.getItem('order_token'),
            })
            .then((res) => {
                sessionStorage.setItem('customer', res['data']['first_name'] + ' ' + res['data']['last_name'])
                sessionStorage.setItem('new_customer', res['data']['first_name'] + ' ' + res['data']['last_name'])
                this.setState({checkout: 'yes'})
            })
            .catch((err) => {alert(err); $('#spinner').addClass('hidden');})
        }
    }   

    componentDidMount() {
        $('#spinner').addClass('hidden');
    }

    forceUpdate() {
        this.setState({price: Number(sessionStorage.getItem('amount') * 25000), shipping: 'Free',
            tax:'-', total_price: Number(sessionStorage.getItem('amount') * 25000)})
    }

    render() {
        if (this.state.price || this.state.total_price) console.log('')
        else if (sessionStorage.getItem('order_token') && sessionStorage.getItem('amount'))
            this.forceUpdate()
        else return <Navigate to='/checkout' />
        
        if (sessionStorage.getItem('new_customer'))
            return <Navigate to='/payment' state={{shipping: this.state.shipping,
                tax: this.state.tax, total_price: this.state.total_price}} />
        if (this.state.checkout === 'yes')
        <Navigate to='/payment' state={{shipping: this.state.shipping,
            tax: this.state.tax, total_price: this.state.total_price}}
        />
        return (
            <div>
                <ScrollToTopOnMount />
                <div className="container-fluid">
                <section className='row checkout-section-1
                justify-content-around align-items-start g-0px'>
                    <div className="col-md-6 col-12">
                        <div className="p-5 pb-30px">
                            <h3 className="fw-400">Shipping</h3> 
                            <p className="text-muted py-2 ">Where Should We Send Your Order?</p>
                        </div>    
                        <form className="form px-5" onSubmit={(e) => {e.preventDefault(); this.submitInfo(e)}}>
                            <p>Enter Your Name And Address:</p>    
                            <div className="form-group">    
                                <input id="first_name" type="text" className="form-control " placeholder="First Name" required/>    
                            </div>
                            <div className="form-group">    
                                <input id="last_name" type="text" className="form-control" placeholder="Last Name" required/>
                            </div>
                            <div className="form-group">
                                <input type="text" id="street_address" className="form-control" placeholder="Street Address" required/>
                            </div>
                            <div className="form-group">
                                <input type="text" id="country" className="form-control" placeholder="Country" required/>
                            </div>
                            <div className="row" id="street_extra">
                                <div className="col">
                                    <input type="text" id="zip_code" className="form-control" placeholder="Zip Code" required/>
                                </div>  
                                <div className="col">
                                    <input type="text" id="city_state" className="form-control" placeholder="City/State" required/>
                                </div>    
                            </div>
                            
                    
                            <p className="mt-50px">What's Your Contact Information?</p>                        
                            <div className="form-group">
                                <input type="email" id="email" className="form-control"
                                placeholder="Email Address" required/>
                            </div>
                            <div className="form-group">
                                <input type="text" maxLength="15" id="phone_number" className="form-control"
                                placeholder="Phone Number" required/>
                            </div>
                            <button className='checkout-btn  mt-20px' type='submit' value='Checkout'>
                                Proceed to Payment
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

export default function Shipping_wrapper() {
    return <Shipping params={useParams()} location={useLocation()} />
}