'use strict';

require('babel-polyfill');

var React = require('react'), //eslint-disable-line no-unused-vars
    ReactDOM = require('react-dom'),
    TripBox = require('./app/Trips/tripBox.js'); //eslint-disable-line no-unused-vars
ReactDOM.render(<TripBox />, document.getElementById('app'));
