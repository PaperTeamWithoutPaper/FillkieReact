import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux'
import rootReducer from './reducer/root_reducer';
import { CookiesProvider } from 'react-cookie';
import logger from 'redux-logger'
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['doc/attach/fulfilled', 'doc/activate/fulfilled'],
        ignoredPaths: ['docState.client', 'docState.doc'],
      },
      immutableCheck: {
        ignoredPaths: ['docState.client', 'docState.doc'],
      },
    }),
  });
export default store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <CookiesProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </CookiesProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
