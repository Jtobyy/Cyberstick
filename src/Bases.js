import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import NumberFormat from 'react-number-format';

import copyright from './static/copyright.png';
import logo from './static/Group_20logo.svg';
import cart from './static/Cart.svg';

import steparrow1 from './static/steparrow1.png';
import steparrow2 from './static/steparrow2.png';
/*import step1 from './static/step1.png';*/
import step2 from './static/step2.png';
import step3 from './static/step3.png';
import frame1 from './static/frame1.png';
import frame2 from './static/frame2.png';
import frame3 from './static/frame3.png';

import './static/Home.scss';
import $ from 'jquery';



function Header() {
    return (
        <header className='fixed-top header d-md-flex flex-row align-items-center'>
            <Link to='/' className='logo'>
                <img src={logo} alt="logo"/>
            </Link>
            <nav className='nav' id='header-nav'>
                <div className='nav-wrapper d-flex align-items-center'>
                    <span className='header-link'>
                        <HashLink to='/#overview'
                        scroll={(el) => el.scrollIntoView({ behavior: 'smooth'} )}>
                            Overview
                        </HashLink>    
                    </span>
                    <span className='header-link text-muted specs-span'>
                        <HashLink to='/#faq' 
                        scroll={(el) => el.scrollIntoView({ behavior: 'smooth'} )}
                        >
                            FAQ
                        </HashLink>    
                    </span>
                    <Link to= "/Checkout" className='header-link position-absolute'>
                        <button className='buynowbtn'>
                            Buy Now
                        </button>
                    </Link>
                    
                    <span className='header-link'>
                        <Link to= "/Checkout">
                            <img src={cart} alt='product'/>
                        </Link>    
                    </span>
                </div>
            </nav>
            <Sidebar />
        </header>
        )    
}

function Sidebar() {
    const [sidebarState, setSidebarState] = useState('closed');

    return (
        <div>
            <div className="sidebar-toggle" id="sidebar-toggle" onClick={ () => {
                $('#sidebar').toggleClass('hidden');    
                $('#sidebar-toggle').toggleClass('close');
                if (sidebarState === 'closed') {    
                    setSidebarState('opened');
                } else {
                    setSidebarState('closed');
                }
            }}>
                <div className="toggle-line t1 mb-5px"></div>
                <div className="toggle-line t2 mb-5px"></div>
                <div className="toggle-line t3 mb-5px"></div>
            </div>
            <div className='d-flex flex-column py-5 px-4 sidebar position-absolute hidden' id='sidebar'>
                <HashLink to='/#overview'
                scroll={(el) => el.scrollIntoView({ behavior: 'smooth'} )}>
                    <div className='border-bottom pb-1 pt-3'>Overview</div>
                </HashLink>    
                <HashLink to='/#faq' scroll={(el) => el.scrollIntoView({ behavior: 'smooth' })}
                    >
                    <div className='border-bottom pb-1 pt-3'>FAQ</div>
                </HashLink>    
                <Link to='/checkout'>
                    <div className='border-bottom pb-1 pt-3 mb-3'>Cart</div>
                </Link>
            </div>
        </div>    
    )
}

function Steps() {
    return (
        <section className='section-4 d-flex flex-column align-items-center '>
            <h1 className='ready align-self-md-start'>
                Ready To Use In
            </h1>
            <h1 className='ready align-self-md-start'>
                Just 3 Steps
            </h1>
            <p className='text-md-left step-p home-p align-self-start'>With the any display system, Cyberstick™ offers you a new
            <span className='align-self-start my-0'> multimedia experience anytime, anywhere. Compact and</span>
            <span className='align-self-start my-0'> portable, it brings a smarter life to your displays. </span></p>
            <div className='steparrow1-wrapper'>
                    <img src={steparrow1} className="steparrow1" alt=""/>
                </div>
            <section className='d-flex align-items-center flex-column'>
                <div className='row stepwrapper'>
                    <div className='col-md-3 d-flex flex-column align-items-center stepcontainer
                    mx-2vw'>
                        <span className='stepnumber'>1</span>    
                        <img src={step2} className="step" alt=""/>
                        <img src={frame1} className='frame position-absolute' alt=""/>
                        <span>Connect the</span>
                        <span>Cyberstick™  to your TV</span>
                    </div>    
                    <div className='col-md-3 d-flex flex-column align-items-center stepcontainer
                    mx-2vw'>
                        <span className='stepnumber'>2</span>    
                        <img src={step2} className="step" alt=""/>
                        <img src={frame2} className='frame position-absolute' alt=""/>
                        <span>Connect to Wi-Fi </span>
                    </div>
                    <div className='col-md-3 d-flex flex-column align-items-center stepcontainer
                    mx-2vw'>
                        <span className='stepnumber'>3</span>        
                        <img src={step3} className="step" alt=""/>
                        <img src={frame3} className='frame position-absolute mt-auto' alt=""/>
                        <span>Start Watching</span>
                    </div>
                </div>
            </section>
            <div className='steparrow1-wrapper'>
                    <img src={steparrow2} className="steparrow2" alt=""/>
            </div>
        </section>
    )
}

class Faq extends React.Component {
    showText = (e) => {
        let text;
        let arrow;
        switch(e.target.classList[0]) {
            case 'faq-header-wrapper':
                text = e.target.nextElementSibling;
                arrow = e.target.lastElementChild;
                break;
            case 'faq-header':
                text = e.target.parentElement.nextElementSibling;
                arrow = e.target.nextElementSibling;                
                break;    
            case 'arrow':    
                text = e.target.parentElement.nextElementSibling;
                arrow = e.target;
                break;
            case 'stroke-1':
            case 'stroke-2':    
                text = e.target.parentElement.parentElement.nextElementSibling;
                arrow = e.target.parentElement
                break;
            default:
                console.log('reached default');
                break;
        }

        if (text.classList.contains('hide-answer')) {
            text.classList.remove('hide-answer')
            arrow.classList.remove('rotate')
        }
        else {
            text.classList.add('hide-answer')    
            arrow.classList.add('rotate')
        }
    };
        
    render() {
        return (
            <section className='faq d-flex flex-column align-items-md-start align-items-center text-left pl-7vw pr-7vw'
            id='faq'>
                <h4 className='faq-title mb-30px small-caps'>faq</h4>
                <div className='faq-item py-3'>
                    <div className='faq-header-wrapper d-flex position-relative pointer-cursor' 
                    onClick={(e) => {this.showText(e)}}>
                        <p className='faq-header'>How do I connect the Cyberstick?</p>
                        <div className='arrow rotate position-absolute '>
                            <div className='stroke-1'></div>
                            <div className='stroke-2'></div>
                        </div>
                    </div>    
                    <div className='faq-answer hide-answer'> Connect the Cyberstick to a power source (using the small port at the side) and then attach it 
                    to the HDMI port of your TV or Monitor. A blue comes on indicating that the Cyberstick is 
                    powered up. If your TV or Monitor is hung on a wall, there is an extender cable that comes 
                    with the package, attach it to the Cyberstick on plug it into your device.</div>
                </div>
                <div className='faq-item py-4'>
                    <div className='faq-header-wrapper d-flex position-relative pointer-cursor' 
                    onClick={(e) => {this.showText(e)}}>
                        <p className='faq-header'>Why do i need a cybersick?</p>
                        <div className='arrow rotate position-absolute'>
                            <div className='stroke-1'></div>
                            <div className='stroke-2'></div>
                        </div>
                    </div>    
                    <div className='faq-answer hide-answer'>With the remote control that comes with the package, navigate to the settings section, 
                    connect to a WiFi service and you can start streaming contents online.</div>
                </div>

                <div className='faq-item py-4'>
                    <div className='faq-header-wrapper d-flex position-relative pointer-cursor' 
                    onClick={(e) => {this.showText(e)}}>
                        <p className='faq-header'>Can I download other applications that do not come with the Cyberstick?</p>
                        <div className='arrow rotate position-absolute'>
                            <div className='stroke-1'></div>
                            <div className='stroke-2'></div>
                        </div>
                    </div>    
                    <div className='faq-answer hide-answer'>Other applications can be downloaded to the Cyberstick, 
                    either from the Google playstore or from the browser.</div>
                </div>

                <div className='faq-item py-4'>
                    <div className='faq-header-wrapper d-flex position-relative pointer-cursor' 
                    onClick={(e) => {this.showText(e)}}>
                        <p className='faq-header'>What is the storage capacity of the Cyberstick?</p>
                        <div className='arrow rotate position-absolute'>
                            <div className='stroke-1'></div>
                            <div className='stroke-2'></div>
                        </div>
                    </div>    
                    <div className='faq-answer hide-answer'>text</div>
                </div>

                <div className='faq-item py-4'>
                    <div className='faq-header-wrapper d-flex position-relative pointer-cursor' 
                    onClick={(e) => {this.showText(e)}}>
                        <p className='faq-header'>Can I connect other devices to it?</p>
                        <div className='arrow rotate position-absolute'>
                            <div className='stroke-1'></div>
                            <div className='stroke-2'></div>
                        </div>
                    </div>    
                    <div className='faq-answer hide-answer'>text</div>
                </div>

                <div className='faq-item py-4'>
                    <div className='faq-header-wrapper d-flex position-relative pointer-cursor' 
                    onClick={(e) => {this.showText(e)}}>
                        <p className='faq-header'>What else can the Cyberstick be used for?</p>
                        <div className='arrow rotate position-absolute'>
                            <div className='stroke-1'></div>
                            <div className='stroke-2'></div>
                        </div>
                    </div>    
                    <div className='faq-answer hide-answer'>text</div>
                </div>

                <div className='faq-item py-4'>
                    <div className='faq-header-wrapper d-flex position-relative pointer-cursor' 
                    onClick={(e) => {this.showText(e)}}>
                        <p className='faq-header'>How do I connect the Cyberstick?</p>
                        <div className='arrow rotate position-absolute'>
                            <div className='stroke-1'></div>
                            <div className='stroke-2'></div>
                        </div>
                    </div>    
                    <div className='faq-answer hide-answer'>text</div>
                </div>
            </section>
        )
    }
}
function Footer() {
    return (
        <footer className='footer container'>
            <div className='footercontainer row align-items-start 
            justify-content-between'>
                <div className='col-md-3 d-flex flex-column '>
                    <img src={logo} style={{width: '80%'}} className='footer-logo' alt='logo'/>
                </div>
                <div className='col-md-3 col-6 d-flex flex-column'>
                    <h5 className='p-0 mt-0'>support</h5>
                    <a href='#!' className='py-1 m-0'>Contact Us</a>
                    <a href='#!' className='py-1 m-0'>Product Support</a>
                    <a href='#!' className='py-1 m-0'>Order Support</a>
                </div>
                <div className='col-md-3 col-6 d-flex flex-column'>
                    <h5 className='p-0 mt-0'>contact us</h5> 
                    <a href='#!' className='py-1 m-0'>(+234) 908 899 9099</a>
                    <a href='#!' className='py-1 m-0'>support@cyberstick.io</a>
                </div>
                <div className='col-md-3 col-6 d-flex flex-column'>
                    <h5 className='p-0 mt-md-0 mt-5'>socials</h5> 
                    <a className='fb py-1 m-0' href='https://www.facebook.com/Cyberstickio-100203956085984/'>
                        Instagram
                    </a>
                    <a className='tw py-1 m-0' href='https://www.twitter.com/Cyberstick_io'>
                        Twitter
                    </a>
                    <a className='ig py-1 m-0' href='https://www.instagram.com/cyberstick.io/'>
                        Facebook
                    </a>
                    <a className='yt py-1 m-0' href='https://youtube.com/channel/UCAvjUB_HpH77JcBvEKfhZFA'>
                        Youtube
                    </a>
                    
                </div>
            </div>  
            <div className='copyrights d-flex flex-wrap justify-content-center align-items-center'>    
                <span>Copyright <img className='copy my-3' src={copyright} alt=""/> 2022 Cyberstick™, All rights reserved</span>
            </div>  
        </footer>
    )
}

function CheckoutForm(props) {
    return(
        <form onSubmit={(e) => {e.preventDefault();}}>
            <div className='checkout-details py-2 card'>
                <div className='card-body checkout-card px-0 mx-4'>
                    <h5 className='small-caps'>{props.header}</h5>    
                    <div className="input-group mb-3 discount-code-wrapper my-3">
                        <input placeholder="Enter Discount Code" className="form-control discount-code"
                        id="discount-code" />    
                        <div className="input-group-append pointer-cursor">
                            <span className="input-group-text apply-text">
                                Apply
                            </span>
                        </div>
                    </div>    
                    <div className='d-flex my-2'>
                        <div className='mr-auto'>Subtotal</div>
                        <div><NumberFormat value={props.price}
                displayType={'text'} thousandSeparator={true} prefix={'₦'} /></div>
                    </div>
                    <div className='d-flex my-2'>
                        <div className='mr-auto'>Shipping</div>
                        <div>{props.shipping}</div>
                    </div>
                    <div className='d-flex my-2'>
                        <div className='mr-auto'>Estimated Tax</div>
                        <div>{props.tax}</div>
                    </div>
                </div>
                <div className='card-footer px-0 mx-4'>
                    <div className='d-flex'>
                        <div className='mr-auto fw-600 fs-1p3em'>Total</div>
                        <div className='fw-700 fs-1p3em'><NumberFormat value={props.total_price}
                displayType={'text'} thousandSeparator={true} prefix={'₦'} /></div>
                    </div>
                </div>
            </div>
            
        </form>
    )    
}

class ScrollToTopOnMount extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return null;
    }    
}

export { Footer, Header, Steps, Faq, CheckoutForm, ScrollToTopOnMount }