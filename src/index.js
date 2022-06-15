import React from 'react';
import ReactDOM from 'react-dom/client';
import './static/index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Routes>
            <Route exact path='/' element={<Home />}></Route>
          </Routes>
        </div>
      </Router>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
