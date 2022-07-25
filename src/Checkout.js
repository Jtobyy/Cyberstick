// Import external modules and components
import React from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import NumberFormat from 'react-number-format'; 
import $ from 'jquery';

// Import custom modules, functions, variables and components
import { Steps, ScrollToTopOnMount, CheckoutForm } from './Bases';

// Import custom styles
import './static/Checkout.scss';

// Import image files
import cybersticbent from './static/cyberstickbent.png';



// Set delivery_date to 10 days time from today
const delivery_date = new Date(new Date().getTime()+(10*24*60*60*1000));

// Returns checkout page and controls its logic
export default class Checkout extends React.Component {
    constructor(props) {
        $('#spinner').removeClass('hidden');
        sessionStorage.removeItem('PIP'); // PIP stands for Payment In Progess
        super(props);
        this.state = {
            product_id: 1,    
            amount: 1,
            initial_price: 25000,         // Initial price of one (always constant)
            price: 25000,                 // Price of one multiplied by the amount
            shipping: 'Free',
            tax: '-',
            color: 'Black',
            total_price: 25000,           // state.price + shipping + tax
            delivery_date: delivery_date.toDateString(),
            askinfo: false,               // If true, customer's information is requested for
        };
    }

    // Return cart amount to 1 and prices to initial_price (of 1)
    clearCart = () => {
        sessionStorage.clear();
        this.setState({amount: 1, price: this.state.initial_price, total_price: this.state.initial_price})
    }

    componentDidMount() {
        $('#spinner').addClass('hidden');

        // Get product information from the backend and update the UI states of the component
        axios.get(`https://cyberstick-backend.herokuapp.com/cyberstick/products/${this.state.product_id}`)   
        //axios.get(`http://127.0.0.1:8000/cyberstick/products/${this.state.product_id}`)
        .then((res) => {
            this.setState({initial_price: res['data']['sale_price']})
            this.setState({price: this.state.amount * res['data']['sale_price']})
            this.setState({total_price: this.state.amount * res['data']['sale_price']})
        })
        .catch((e) => {
            alert(e.message);
        })

        // Get amount stored in browser's session storage if there is
        if (sessionStorage.getItem('amount')) {
            const amount = Number(sessionStorage.getItem('amount'))
            this.setState((prevState) => (
                {'amount': amount, price: prevState.initial_price * amount, total_price: prevState.initial_price * amount}
            )) 
        } else {
            this.setState({'amount': 1})
        }
    }

    componentDidUpdate() {
        // As state amount gets changed, store the value in browser's session storage (in case of a page reload or similar case)    
        if (!this.state.askinfo)    
            sessionStorage.setItem('amount', this.state.amount)
    }    

    componentWillUnmount() {
        $('#spinner').removeClass('hidden');
    }    

    // Decrease amount of product in cart by 1 and subtract the price of 1 product from the total_price
    decreaseAmount = () => {
        if (this.state.amount > 1 && !this.state.askinfo)
            this.setState((prevState) => ({amount: prevState.amount - 1, price: prevState.price - prevState.initial_price,
            total_price: prevState.total_price - prevState.initial_price}))
    }    

    // Increase amount of product in cart by 1 and add the price of 1 product to the total_price
    increaseAmount = () => {
        if (!this.state.askinfo)    
            this.setState((prevState) => ({amount: prevState.amount + 1, price: prevState.price + prevState.initial_price,
                total_price: prevState.total_price + prevState.initial_price}))
    }

    // Place an order by sending order information to the backend which stores the order with a status of 1 and returns the order's id
    placeOrder = () => {
        $('#spinner').removeClass('hidden');
        if (this.state.amount > 0 && !this.state.askinfo) {
        axios.post('https://cyberstick-backend.herokuapp.com/cyberstick/orders/', {
        //axios.post('http://127.0.0.1:8000/cyberstick/orders/', {
            id: this.state.product_id,
            amount: this.state.amount,
            total_price: this.state.total_price,
        })
        .then((res) => {
            sessionStorage.setItem('order_token', res['data']['Available']) // 'Available' variable stores the order id or token
            sessionStorage.setItem('amount', res['data']['amount'])
            sessionStorage.removeItem('new_customer')
            sessionStorage.removeItem('customer')
            this.setState({askinfo: true})
        })
        .catch((e) => (alert(e.message)));
    }
    }
    
    // If this.state.askinfo is true, navigate to shipping else return html for checkout page
    render() {    
        if (this.state.askinfo) {
            return <Navigate to='/shipping' state={{shipping: this.state.shipping,
                tax: this.state.tax, total_price: this.state.total_price}}
            />
        }
        return (
            <div>
                <ScrollToTopOnMount />
                <div className='container-fluid'>
                <section className='row checkout-section-1
                justify-content-around align-items-center g-0px'>
                    <div className='col-md-6 col-12 aside-1 text-md-left text-center'>
                        <h3>Review Your Bag.</h3>
                        <div className='d-flex align-items-center flex-sm-row flex-column
                        justify-content-start flex-wrap py-3'>
                            <img className='cyberstickbent' src={cybersticbent} alt='product'/>
                            <div className='checkout-p-wrapper'>
                                <p className='checkout-p my-1'>Cyberstick - {this.state.color}</p>
                                <p className='checkout-p my-1'>Get it By {this.state.delivery_date}</p>
                            </div>
                            <div className='amount-wrapper d-flex align-items-center'>
                                <span className='amount px-3'>{this.state.amount}</span>
                                <div className='d-flex flex-column amount-controls'>
                                    <i className='bi-caret-up increase' onClick={this.increaseAmount}></i>
                                    <i className='bi-caret-down decrease' onClick={this.decreaseAmount}></i>
                                </div>
                            </div>
                            <div className='d-flex flex-column align-items-start
                            justify-content-center price-wrapper'>
                                <p className='checkout-p price my-1 rounded'><NumberFormat value={this.state.price}
                            displayType={'text'} thousandSeparator={true} prefix={'₦'} /></p>
                                <p className='checkout-p remove my-1' onClick={this.clearCart}>Remove</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 col-12 aside-2 d-flex flex-column'>
                        <CheckoutForm header="order summary" price={this.state.price}
                        shipping={this.state.shipping} tax={this.state.tax} total_price={this.state.total_price}
                        />                   
                        <button className='checkout-btn' 
                        onClick={this.placeOrder} type='submit' value='Checkout'>Checkout</button>
                    </div>
                </section>
                </div>
                <Steps />
            </div>
            )
    }    
}
