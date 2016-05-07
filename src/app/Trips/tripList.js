'use strict';

var React = require('react'),
    TM = require('../Logic/tripManager.js'),
    _ = require('lodash'),
    Trip = require('./trip.js'); // eslint-disable-line no-unused-vars

var TripList = React.createClass({

    getInitialState: function() {
        return {
            clients: [],
            drivers: []
        };
    },

    componentWillReceiveProps: function() {
        this.setState({
            clients: TM.getClients(this.props.data),
            drivers: TM.getDrivers(this.props.data)
        });
    },

    render: function() {
        var _this = this;
        var filteredTrips = TM.filterTrips(this.props.data, this.props.filterOptions);
        var trips = filteredTrips.map(function(trip){
            var key = trip['.key'];
            return (
               <Trip
                   date={trip.date}
                   time={trip.time}
                   client={trip.client}
                   driver={trip.driver}
                   dep={trip.dep}
                   ret={trip.ret}
                   cost={trip.cost}
                   //note={trip.note}
                   fkey={key}
                   key={key}
                   type={trip.type}
                   drivers={_this.state.drivers}
                   clients={_this.state.clients}
                   updateTrip={_this.props.updateTrip}
                   removeTrip={_this.props.removeTrip}
                   editable={_this.props.editable}
                   />
           );
        });
        var totalCost = _.reduce(filteredTrips.map(function(trip){
            return trip.cost || 0;
        }), function( sum, n ){
            return sum + parseInt(n, 10);
        }, 0);

        return (
            <div className="trip-list">
                {trips}
                <div className="row">
                    <div className="small-6 medium-1 print-1 column">&nbsp;</div>
                    <div className="small-6 medium-1 print-2 column">&nbsp;</div>
                    <div className="small-6 medium-1 print-1 column text-right print-text-left">&nbsp;</div>
                    <div className="small-12 medium-1 print-1 column">&nbsp;</div>
                    <div className="small-6 medium-2 print-2 column">&nbsp;</div>
                    <div className="small-6 medium-2 print-2 column">&nbsp;</div>
                    <div className="small-6 medium-1 print-1 column">&nbsp;</div>
                    <div className="column medium-2 print-2">
                        {totalCost ? ('' + totalCost).split('').reverse().join('').match(/.{1,3}/g).join('.').split('').reverse().join('') : ''}&nbsp;
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = TripList;
