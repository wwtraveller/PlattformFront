import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";
import { store } from "./redux/store";
import App from './App/App';
import Header from './components/header/Header';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
/*root.render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
      </Routes>
    </HashRouter>
  </Provider> 
);
*/

