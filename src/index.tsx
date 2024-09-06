import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './components/header/Header.tsx';
import App from './app/App.tsx'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(

  <>
    <>
    <Header/>
    <App />
    </>
    <div>
       <h1>hi</h1>
      <p>hello</p>
      <p>123</p>
      <p>06.09</p>
    
    </div>

  </>
);
