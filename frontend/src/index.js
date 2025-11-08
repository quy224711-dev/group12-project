import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { store } from './redux/store'; // 👈 Import kho
import { Provider } from 'react-redux'; // 👈 Import "Người cung cấp"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 👇 Bọc App trong Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
