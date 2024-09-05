import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './components/header/Header.tsx';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(

  <React.StrictMode>
<>
<Header/>
</>
  <div>
       <h1>hi</h1>
    <p>hello</p>
    <p>hel</p>
    
  </div>

  </React.StrictMode>
);
