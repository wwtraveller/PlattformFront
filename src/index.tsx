import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './app/App'; // Подключаем обновленный App
import './responsive.css'; // Подключаем адаптивные стили

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>

);

