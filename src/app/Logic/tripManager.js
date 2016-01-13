'use strict';
var _ = require('lodash');

/**
 * dateCompare
 * @param {string} date1
 * @param {string} date2
 * @return {int} - value:
 * -1 if less than
 * 0 if equal
 * 1 if greater than
 */
var dateCompare = {
    dateCompare: function(date1, date2){
        var dt1 = date1.split('/'),
            dt2 = date2.split('/'),
            d1 = new Date(dt1[2], parseInt(dt1[1], 10) - 1, dt1[0]).getTime(),
            d2 = new Date(dt2[2], parseInt(dt2[1], 10) - 1, dt2[0]).getTime();

        if (d1 > d2){
            return 1;
        } else if (d1 === d2) {
            return 0;
        } else {
            return -1;
        }
    }
};

/**
 * getClients
 * get a list of client names (unique)
 * @param data
 * @returns {Array}
 */
var getClients = {
    getClients: function(data){
        var clients = data.map(function(trip){
            return trip.client;
        });
        return _.uniq(clients);
    }
};

/**
 * getDrivers
 * get a list of driver names (unique)
 * @param data
 * @returns {Array}
 */
var getDrivers = {
    getDrivers: function(data){
        var drivers = data.map(function(trip){
            return trip.driver;
        });
        return _.uniq(drivers).filter(function(n){ return n !== undefined; });
    }
};

/**
 * Filter
 * @param {Array} data
 * @param {Object} options
 * @returns {Array} - sorted by Date then Time
 */
var filterTrips = {
    /*eslint-disable complexity*/
    filterTrips: function (data, options) {
        if (typeof(options) === 'undefined') {
            return data;
        }

        var rData = [],
            clients = options.clients || '',
            drivers = options.drivers || '',
            sDate = options.startDate,
            eDate = options.endDate,
            types = [];

        if (options.typeFilter) {
            options.typeFilter.map(function(type){
                var key = Object.keys(type)[0];
                if (type[key]) {types = types.concat([key]);}
            });
        }
        data.map(function (trip) {
            if ( (clients.length === 0 || clients.indexOf(trip.client) > -1)
                && (drivers.length === 0 || drivers.indexOf(trip.driver) > -1)
                && dateCompare.dateCompare(sDate, trip.date) <= 0
                && dateCompare.dateCompare(eDate, trip.date) >= 0
                && (types.length === 0 || types.indexOf(trip.type) > -1) ) {
                var dArr = trip.date.split('/');
                trip.d = dArr[2] + '/' + dArr[1] + '/' + dArr[0];
                rData = rData.concat([trip]);
            }
        });

        return _.sortByOrder(rData, ['d', 'time'], ['asc', 'asc']);
    }
    /*eslint-enable complexity*/
};


var tripSort = {
    tripSort: function(data){
        return _.sortByOrder(data, ['date', 'time'], ['asc', 'asc']);
    }
};

var getTypes = {
    getTypes: function(typeFilter) {
        var types = [];
        if (typeFilter) {
            typeFilter.map(function(type){
                var key = Object.keys(type)[0];
                if (type[key]) {types = types.concat([key]);}
            });
        }
        return types;
    }
};

var TripManager = Object.assign({}, dateCompare, getDrivers, getClients, filterTrips, tripSort, getTypes);
module.exports = TripManager;
