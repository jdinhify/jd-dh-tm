'use strict';

var React = require('react'),
    Firebase = require('firebase'),
    ReactFireMixin = require('reactfire'),
    TripForm = require('./tripForm.js'), //eslint-disable-line no-unused-vars
    TripList = require('./tripList.js'), //eslint-disable-line no-unused-vars
    TM = require('../Logic/tripManager.js'), //eslint-disable-line no-unused-vars
    config = require('../Logic/config'),
    Promise = require('bluebird');

var lang = config.language,
    locale = config.locale,
    getText = config.getText;

var TripBox = React.createClass({
    mixins: [ReactFireMixin],

    updateView: function (filterOptions) {
        this.setState({
            filterOptions: filterOptions
        });
    },

    createNewTrip: function(trip){
        return Promise.resolve(this.firebaseRef.push(trip));
    },

    updateTrip: function(key, trip) {
        var updatedTrip = {
            [key]: trip
        };
        return Promise.resolve(this.firebaseRef.update(updatedTrip));
    },

    removeTrip: function(key) {
        return Promise.resolve(this.firebaseRef.child(key).remove());
    },

    getInitialState: function () {
        this.firebaseRef = new Firebase('https://jd---dh-trip-manager.firebaseio.com/trips');
        var year = (new Date()).getFullYear(),
            month = (new Date()).getMonth(),
            eMonth = (new Date(year, month + 6, 0)).getDate(),
            sDate = '01/' + (month+1) + '/' + year,
            eDate = month > 7 ? eMonth + '/' + (month + 1) + '/' + year + 1 : eMonth + '/' + (month + 6) + '/' + year;

        return {
            trips: [],
            filterOptions: {
                startDate: sDate,
                endDate: eDate,
                typeFilter: [
                    {
                        '7s': true
                    },
                    {
                        '16s': true
                    },
                    {
                        '16s2': true
                    }
                ]
            },
            auth: false,
            loggingIn: false,
            view: 'View',
            editable: false
        };

    },
    componentWillMount: function(){
        if (this.firebaseRef.getAuth()) {
            this.bindAsArray(this.firebaseRef, 'trips');
            var userRef = new Firebase('https://jd---dh-trip-manager.firebaseio.com/users/rw/' + this.firebaseRef.getAuth().uid);
            userRef.once('value', function(snapshot){
                if (snapshot.exists()) {
                    this.setState({
                        editable: true
                    });
                } else {
                    this.setState({
                        editable: false
                    });
                }
            }.bind(this));
            this.setState({
                auth: true
            });
        }
    },

    loginDetailChanged: function(e) {
        var state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    },

    doLogin: function(){
        var _this = this;
        if (!_this.state.loggingIn) {
            _this.setState({
                loggingIn: true
            });
            _this.firebaseRef.authWithPassword({
                email: _this.state.email,
                password: _this.state.password
            }, function(error, authData){
                _this.setState({
                    loggingIn: false
                });
                if (error) {
                    _this.setState({
                        errorMsg: 'Incorrect username/password'
                    });
                } else {
                    _this.bindAsArray(_this.firebaseRef, 'trips');
                    var userRef = new Firebase('https://jd---dh-trip-manager.firebaseio.com/users/rw/' + authData.uid);
                    userRef.once('value', function(snapshot){
                        if (snapshot.exists()) {
                            _this.setState({
                                editable: true
                            });
                        } else {
                            _this.setState({
                                editable: false
                            });
                        }
                    });
                    _this.setState({
                        errorMsg: '',
                        auth: true
                    });
                }
            });
        }
    },

    doLogout: function() {
        this.firebaseRef.unauth();
        this.unbind('trips');
        this.setState({
            auth: false,
            email: '',
            password: '',
            editable: false
        });
    },

    getFilterInfo: function() {
        return (
            <div className="filter-info row">
                <div className="column">
                    <h4>{getText(lang, locale, 'Displaying')}</h4>
                </div>
                <div className="column medium-2 print-2">
                    <span className="heading">{getText(lang, locale, 'Type')}</span>
                </div>
                <div className="column medium-4 print-4">
                    <span className="">{TM.getTypes(this.state.filterOptions.typeFilter) ? TM.getTypes(this.state.filterOptions.typeFilter).join('; ') : '--'}</span>
                </div>
                <div className="column medium-2 print-2">
                    <span className="heading">{getText(lang, locale, 'Client')}</span>
                </div>
                <div className="column medium-4 print-4">
                <span className="">{(this.state.filterOptions.clients && this.state.filterOptions.clients.length > 0) ? this.state.filterOptions.clients.join('; ') : '--'}</span>
                </div>
                <div className="column medium-2 print-2">
                    <span className="heading">{getText(lang, locale, 'Time period')}</span>
                </div>
                <div className="column no-block-span medium-4 print-4">
                    <p>
                        <span className="">{this.state.filterOptions.startDate}</span>
                        <span className="separator">{(this.state.filterOptions.endDate === this.state.filterOptions.startDate) ? '' : '-'}</span>
                        <span className="">{(this.state.filterOptions.endDate === this.state.filterOptions.startDate) ? '' : this.state.filterOptions.endDate}</span>
                    </p>
                </div>
                <div className="column medium-2 print-2">
                    <span className="heading">{getText(lang, locale, 'Driver')}</span>
                </div>
                <div className="column medium-2 print-2 left">
                    <span className="">{(this.state.filterOptions.drivers && this.state.filterOptions.drivers.length > 0) ? this.state.filterOptions.drivers.join('; ') : '--'}</span>
                </div>
            </div>
        );
    },

    changeView: function() {
        if (this.state.view === 'View') {
            this.setState({
                view: 'Settings'
            });
        } else {
            this.setState({
                view: 'View'
            });
        }
    },

    getViewButton: function() {
        return (
            <button
                className="column btn-view"
                onClick={this.changeView}>{getText(lang, locale, this.state.view)}</button>
        );
    },

    getActionsHeading: function() {
        if (this.state.editable) {
            return (
                <div className="small-6 medium-2 print-hide column end actions">
                    <strong>{getText(lang, locale, 'Action')}</strong>
                </div>
            );
        }
    },

    render: function () {
        if (!this.state.auth) {
            return (
                <div className="login">
                    <div className="error">
                        <span>{this.state.errorMsg}</span>
                    </div>
                    <div className="row collapse">
                        <div className="small-3 columns">
                            <span className="prefix">Email</span>
                        </div>
                        <div className="small-9 columns end">
                            <input
                                value={this.state.email}
                                type="email"
                                placeholder="example@email.com"
                                name="email"
                                onChange={this.loginDetailChanged}/>
                        </div>
                    </div>
                    <div className="row collapse">
                        <div className="small-3 columns">
                            <span className="prefix">Password</span>
                        </div>
                        <div className="small-9 columns end">
                            <input
                                value={this.state.password}
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={this.loginDetailChanged}/>
                        </div>
                    </div>
                    <div className="row text-center">
                        <div>
                            <button
                                onClick={this.doLogin}>{getText(lang, locale, 'Login') + '' + (this.state.loggingIn ? ' ...' : '')}</button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={((this.state.view === 'View') ? 'print' : '') + ' trip-box'}>
                    <div className="row print-hide view-show">
                        {this.getViewButton()}
                    </div>
                    <TripForm
                        data={this.state.trips}
                        updateView={this.updateView}
                        filterOptions={this.state.filterOptions}
                        createNewTrip={this.createNewTrip}
                        editable={this.state.editable}/>
                    <hr className="print-hide"/>
                    {this.getFilterInfo()}
                    <hr />
                    <div className="row heading">
                        <div className="small-6 medium-1 print-1 column">
                            <strong>{getText(lang, locale, 'Type')}</strong>
                        </div>
                        <div className="small-6 medium-1 print-2 column">
                            <strong>{getText(lang, locale, 'Date')}</strong>
                        </div>
                        <div className="small-6 medium-1 print-1 column text-center print-text-left">
                            <strong>{getText(lang, locale, 'Time')}</strong>
                        </div>
                        <div className="small-12 medium-1 print-1 column">
                            <strong>{getText(lang, locale, 'Client')}</strong>
                        </div>
                        <div className="small-6 medium-2 print-2 column">
                            <strong>{getText(lang, locale, 'Departure')}</strong>
                        </div>
                        <div className="small-6 medium-2 print-2 column">
                            <strong>{getText(lang, locale, 'Return')}</strong>
                        </div>
                        <div className="small-6 medium-1 print-1 column">
                            <strong>{getText(lang, locale, 'Driver')}</strong>
                        </div>
                        <div className="small-6 medium-1 print-2 column">
                            <strong>{getText(lang, locale, 'Cost')}</strong>
                        </div>
                        {this.getActionsHeading()}
                    </div>
                    <TripList
                        data={this.state.trips}
                        filterOptions={this.state.filterOptions}
                        updateTrip={this.updateTrip}
                        removeTrip={this.removeTrip}
                        editable={this.state.editable}/>
                    <div className="row text-right print-hide logout view-show">
                        <div className="small-3 column right">
                            <button
                                onClick={this.doLogout}>{getText(lang, locale, 'Logout')}</button>
                        </div>
                    </div>
                </div>
            );
        }
    }

});

module.exports = TripBox;
