import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import App from './App';
import './App.css';
import { store } from './redux/store'; // 👈 Import kho
import { Provider } from 'react-redux'; // 👈 Import "Người cung cấp"
=======
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
>>>>>>> main

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    {/* 👇 Bọc App trong Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
=======
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
>>>>>>> main
