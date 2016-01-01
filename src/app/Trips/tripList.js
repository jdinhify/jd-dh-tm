'use strict';

var React = require('react'),
    TM = require('../Logic/tripManager.js'),
    Trip = require('./trip.js'); // eslint-disable-line no-unused-vars

var TripList = React.createClass({

    getInitialState: function() {
        return {
            clients: []
        };
    },

    componentWillReceiveProps: function() {
        this.setState({
            clients: TM.getClients(this.props.data)
        });
    },

    render: function() {
        var _this = this;
        var trips = TM.filterTrips(this.props.data, this.props.filterOptions).map(function(trip){
            var key = trip['.key'];
            return (
               <Trip
                   date={trip.date}
                   time={trip.time}
                   client={trip.client}
                   dep={trip.dep}
                   ret={trip.ret}
                   //note={trip.note}
                   fkey={key}
                   key={key}
                   type={trip.type}
                   clients={_this.state.clients}
                   updateTrip={_this.props.updateTrip}
                   removeTrip={_this.props.removeTrip}
                   />
           );
        });

        return (
            <div className="trip-list">
                {trips}
            </div>
        );
    }

});

module.exports = TripList;
