import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './Routes';
import reportWebVitals from './reportWebVitals';

(function(define) {
    define(function(require) {
        var _ = require('lodash');
    });
// eslint-disable-next-line no-undef
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

window.addEventListener("contextmenu", e => e.preventDefault());
ReactDOM.render(
    <Routes />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
