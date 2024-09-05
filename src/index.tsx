import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import './App';
import reportWebVitals from './reportWebVitals';
import Header from './components/header/Header.tsx';
//import App from '../App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <><Header/></>
  <div>
    <h1>hello</h1>
    <p>kjl</p>
  </div>
  </React.StrictMode>
);


reportWebVitals();
