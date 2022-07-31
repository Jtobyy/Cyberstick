// Import external modules and components
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import custom modules, functions, variables and components
import { Footer, Header, Faq } from './Bases';
import Home from './Home';
import Checkout from './Checkout';
import Shipping from './Shipping';
import { CardPayment, TransferPayment, Payment } from './Payment';
import { loadProgressBar } from 'axios-progress-bar';

// Import external styles
import 'axios-progress-bar/dist/nprogress.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


loadProgressBar()

// Control routing of app
class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/faq' element={<Faq />} />
            <Route exact path='/cardpayment' element={<CardPayment />} />
            <Route exact path='/checkout'  element={<Checkout />} />
            <Route exact path='/shipping' element={<Shipping />} />
            <Route exact path='/payment' element={<Payment />} />
            <Route exact path='/cardpayment' element={<CardPayment />} />
            <Route exact path='/transferpayment' element={<TransferPayment />} />
          </Routes>
          <div className="border rounded" id="spinner"></div> {/** shows spinner when api requests are in progress */}
          <Footer />
        </div>
      </Router>
    )
  }
}

// Render app in the element with id 'root' in the index.html page
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
