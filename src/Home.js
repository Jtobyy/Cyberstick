// Import external modules and components
import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';

// Import custom modules, functions, variables and components
import { Steps, Faq, ScrollToTopOnMount } from './Bases';

// Import custom styles
import './static/Home.scss';

// Import external styles
import 'animate.css';

// Import image files
import cyberstick from './static/cyberstick front and back 1.png';
import tvbg1 from './static/tvbg1.png';
import tvbg2 from './static/tvbg2.png';



// Set a cookie given its name(cname) and its value(cvalue) and amount of days(exdays)
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires"+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";";
}

// Get a cookie value given its name(cname)
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while(c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Return true if a cooke exists else false
function checkCookie(cname) {
    if(getCookie(cname) !== "") return true
    else return false
}

// (Home component) Display the landing page
export default class Home extends React.Component {
    constructor() {
        super()
        $('#spinner').removeClass('hidden');
        sessionStorage.removeItem('PIP');
    }    
    
    componentDidMount() {
        $('#spinner').addClass('hidden');
    }

    componentWillUnmount() {
        $('#spinner').removeClass('hidden');
    }

    // Hide an element by hiding its parent. Used to hide the cookie policy popup    
    removePopup = (e) => {
        e.target.parentElement.classList.add('hidden')
    }
        
    render() {
        return (
            <div className='landing' id='overview'>
            <ScrollToTopOnMount />
                <section className='home-section-1 d-flex flex-column'>
                    <div className='container-fluid pl-7vw pr-7vw '>   
                        <div className='row mt-170px mb-100px position-relative home-section-1-row'>
                            <div className='section-1-text col-lg-6 col-md-8 col-12 align-items-start
                            justify-content-start text-md-left pl-0'>
                                <h1 className='think-text1'>
                                    Think Beyond Smart,</h1>
                                <h1 className='think-text2'>
                                    Think Cyberstick.</h1>
                                <p className='home-p my-0 text-md-left'>A multi purpose device that offers users to stream contents with access to
                                                        applications that allows users to work on the go..</p>
                                <Link to= "/Checkout">    
                                    <button className='buynowbtn'>
                                        Buy Now
                                    </button>
                                </Link>
                            </div>
                            <div className='col-lg-6 col-md-4 col-12 mt--10px cyberstick-wrapper'>
                                <img className='cyberstick' alt='cyberstick' src={cyberstick} />
                            </div>
                        </div>
                    </div>
                    <div className='home-section-1-footer'></div>
                </section>
                <section className='section-2 d-flex flex-column align-items-center pl-7vw pr-7vw'>
                    <h1 className='unlock'>
                        <span>Unlock</span> A Whole New
                    </h1>
                    <h1 className='unlock'>
                        World Of Content
                    </h1>
                    <p className='home-p'>Stay plugged with cyber stick, a smarter life to your TV</p>
                    <Link to= "/Checkout" style={{width: '100%'}}>
                        <button className='buynowbtn'>
                            Buy Now
                        </button>
                    </Link>
                    <img src={tvbg1} alt='tvshow' className="tvbg1"/>
                </section>
                <section className='section-3 d-flex align-items-center flex-column pl-7vw pr-7vw'>
                    <h1 className='make'>
                        Make Your TV Smarter    
                    </h1>
                    <p className='home-p fourth-p'>With any display system, Cyberstick™ offers you a new multimedia
                    <span> experience anytime, anywhere. Compact and portable, it brings a smarter</span>
                    <span> life to your displays. </span></p>
                    <Link to= "/Checkout" style={{width: '100%'}}>
                        <button className='buynowbtn buynowbtn2'>
                            Buy Now
                        </button>
                    </Link>
                    <img src={tvbg2} alt="tvshow" className="tvbg1 tvbg2"/>
                </section>
                <Steps />
                <Faq />
                {(() => { if (!checkCookie('ft')) {
                    setCookie('ft', 'set')    
                    return (
                        <div className="alert alert-dark alert-dismissible fade show
                        animate__animated animate__bounce fixed-bottom" role="alert">
                        This site uses cookies to enhance user experience <a style={{color: 'black'}} target="blank" href='https://l.facebook.com/l.php?u=http%3A%2F%2Fwww.aboutads.info%2Fchoices%3Ffbclid%3DIwAR1YKgNyzXOQT9XiFSK8MKS1PonXW-TbFvtZL7sGYkEEybQ2UVbNtosY1CY&h=AT1IERkzcZgRKh0DD8Mi6MG0DKq8WwjnvZlg7HCsyPPbcRZuwVAGHLM4BdDy1fp_yPYbg1SQ9D9Cr_-jTOpsd6NDWuOHcBXVqDsNmZf6vDKC-F-uOgugbDR2EiVz_5Op7K-p1w'>
                            <b>Learn more. </b>
                        </a>
                        <button type="button" className="btn btn-dark" data-dismiss="alert" aria-label="Close" onClick={this.removePopup}>
                            okay
                        </button></div>
                        )
                    }}
                )()}
            </div>
        )
    }
}
