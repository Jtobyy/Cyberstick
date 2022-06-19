import React from 'react';
import './static/Home.scss';
import logo from './static/Group_20logo.svg';
import search from './static/Search.svg';
import cart from './static/Cart.svg';
import cyberstick from './static/cyberstick front and back 1.png';
import tvbg1 from './static/tvbg 1.png';
import tvbg2 from './static/tvbg2.png';
import steparrow1 from './static/steparrow1.png';
import steparrow2 from './static/steparrow2.png';
import step1 from './static/step1.png';
import step2 from './static/step2.png';
import step3 from './static/step3.png';
import copyright from './static/copyright.png';
import ig from './static/ig.png';
import fb from './static/fb.png';
import tw from './static/tw.png';

export default class Home extends React.Component {
    render() {
        return (
            <div className='landing'>    
                <section className='section-1 d-flex flex-column'>
                    <header className='header d-flex flex-row align-items-center'>
                        <img src={logo} alt="logo" className='logo'/>
                        <nav className='nav'>
                            <div className='nav-wrapper d-flex align-items-center'>
                                <span className='header-link'>Overview</span>
                                <span className='header-link'>Specs</span>
                                <span className='header-link'><img src={search}/></span>
                                <span className='header-link'><img src={cart}/></span>
                            </div>
                        </nav>
                    </header>
                    <div className='section-1-text text-center d-flex align-items-center
                    flex-column align-self-center'>
                        <h1 className='think-text1'>
                            Think Beyond Smart,</h1>
                        <h1 className='think-text2'>
                            Think Cyberstick.</h1>
                        <p className='first-p'>A multi purpose device that offers users to stream contents with access to</p>
                                                <p>applications that allows users to work on the go..</p>
                    </div>
                    <div className='cyberstick-wrapper'>
                        <img className='cyberstick' src={cyberstick} />
                    </div>
                </section>
                <section className='section-2 d-flex flex-column align-items-center'>
                    <h1 className='unlock'>
                        <span>Unlock</span> A Whole New
                    </h1>
                    <h1 className='unlock'>
                        World Of Content
                    </h1>
                    <p className='third-p'>Stay plugged with cyber stick, a smarter life to your TV</p>
                    <button className='buynowbtn1 buynowbtn'>
                        Buy Now
                    </button>
                    <img src={tvbg1} className="tvbg1"/>
                </section>
                <section className='section-3 d-flex align-items-center flex-column'>
                    <h1 className='make'>
                        Make Your TV Smarter    
                    </h1>
                    <p className='fourth-p'>With any display system, Cyberstick™ offers you a new multimedia
                    <span className='fifth-p'> experience anytime, anywhere. Compact and portable, it brings a smarter</span>
                    <span className='sixth-p'> life to your displays. </span></p>
                    <button className='buynowbtn buynowbtn2'>
                        Buy Now
                    </button>
                    <img src={tvbg2} className="tvbg1 tvbg2"/>
                </section>
                <section className='section-4 d-flex flex-column align-items-center'>
                    <h1 className='ready align-self-start'>
                        Ready To Use In
                    </h1>
                    <h1 className='ready align-self-start'>
                        Just 3 Steps
                    </h1>
                    <p className='text-left seventh-p align-self-start my-0'>With the any display system, Cyberstick™ offers you a new
                    <span className='align-self-start my-0'> multimedia experience anytime, anywhere. Compact and</span>
                    <span className='align-self-start my-0'> portable, it brings a smarter life to your displays. </span></p>
                    <div className='steparrow1-wrapper'>
                            <img src={steparrow1} className="steparrow1"/>
                        </div>    
                    <section className='steps d-flex align-items-center flex-column'>
                        <div className='d-flex stepwrapper'>
                            <div className='d-flex flex-column align-items-center '>
                                <span className='stepnumber'>1</span>    
                                <img src={step1} className="step"/>
                                <span>Connect the</span>
                                <span>Cyberstick™  to your TV</span>
                            </div>    
                            <div className='d-flex flex-column align-items-center'>
                                <span className='stepnumber'>2</span>    
                                <img src={step2} className="step" />
                                <span>Connect to Wi-Fi </span>
                            </div>
                            <div className='d-flex flex-column align-items-center'>
                                <span className='stepnumber'>3</span>        
                                <img src={step3} className="step" />
                                <span>Start Watching</span>
                            </div>
                        </div>
                    </section>
                    <div className='steparrow1-wrapper'>
                            <img src={steparrow2} className="steparrow2"/>
                        </div>
                    <footer className='footer container'>
                        <div className='footercontainer row align-items-start justify-content-between'>
                            <div className='col-sm-3 d-flex flex-column'>
                                <h5>shop</h5>
                                <a href="#">Watches</a>
                                <a href="#">Mobile Accessories</a>
                                <a href="#">Mobile Audio</a>
                                <a href="#">TV & Home Theater</a>
                                <a href="#">Computing</a>
                            </div>
                            <div className='col-sm-3 d-flex flex-column'>
                                <h5>support</h5>
                                <a href="#">Contact Us</a>
                                <a href="#">Product Support</a>
                                <a href="#">Order Support</a>
                                <a href="#">Your Account</a>
                                <a href="#">Register Your Product</a>
                            </div>
                            <div className='col-sm-3 d-flex flex-column'>
                                <h5>contact us</h5> 
                                <a href="#">Facebook</a>
                                <a href="#">YouTube</a>
                                <a href="#">Instagram</a>
                                <a href="#">Twitter</a>
                                <a href="#">Cyberstick™ Studios</a>
                                <a href="#">Cyberstick™ Imagery</a>
                                <a href="#">Cyberstick™ Creators</a>
                            </div>
                            <div className='col-sm-3 d-flex flex-column'>
                                <h5>about us</h5>
                                <a href="#">Our Business</a>
                                <a href="#">Brand Identity</a>
                                <a href="#">Careers</a>
                                <a href="#">Investor Relations</a>
                                <a href="#">Newsroom</a>
                                <a href="#">Corporate Citizenship</a>
                                <a href="#">Digital Responsibility</a>
                            </div>
                        </div>  
                        <div className='copyrights d-flex flex-wrap justify-content-start align-items-center'>    
                            <span>Copyright <img className='copy my-3' src={copyright}/> 2022 Cyberstick™, All rights reserved</span>
                            <div className='social d-flex align-items-center'>
                                <a className='fb' href='#'><img src={fb}/></a>
                                <a className='tw' href='#'><img src={tw}/></a>
                                <a className='ig' href='#'><img src={ig}/></a>
                            </div>
                        </div>  
                    </footer>
                </section>
            </div>    
        )
    }
}
