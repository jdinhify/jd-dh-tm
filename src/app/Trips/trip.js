'use strict';

var React = require('react'),
    NumberPicker = require('react-widgets/lib/NumberPicker'), //eslint-disable-line no-unused-vars
    numberLocalizer = require('react-widgets/lib/localizers/simple-number'),
    Typeahead = require('react-typeahead').Typeahead,  //eslint-disable-line no-unused-vars
    DatePicker = require('react-date-picker'), //eslint-disable-line no-unused-vars
    config = require('../Logic/config'),
    _ = require('lodash');

numberLocalizer();

var lang = config.language,
    locale = config.locale,
    getText = config.getText;

var Trip = React.createClass({
    getInitialState: function() {
        return {
            type: '',
            date: null,
            hour: NaN,
            min: NaN,
            time: '',
            client: '',
            dep: '',
            ret: '',
            cost: '',
            driver: '',
            editing: false
        };
    },

    componentDidMount: function() {
        this.setState({
            type: this.props.type,
            date: this.props.date,
            hour: parseInt(this.props.time.split(':')[0], 10),
            min: parseInt(this.props.time.split(':')[1], 10),
            time: this.props.time,
            client: this.props.client,
            dep: this.props.dep,
            ret: this.props.ret,
            cost: this.props.cost,
            driver: this.props.driver || '',
            editing: false
        });

    },

    handleEditClick: function() {
        this.setState({
            editing: !this.state.editing
        });
    },

    handleCancelClick: function() {
        this.setState({
            editing: false
        });
    },

    handleDateChange: function (date) {
        this.setState({
            date: date
        });
    },

    handleHourChange: function (value) {
        if (!isNaN(value)) {
            this.setState({
                hour: value,
                time: _.padLeft(value, 2, '0') + ':' + _.padLeft(this.state.min, 2, '0')
            });
        } else {
            this.setState({
                hour: null
            });
        }
    },

    handleMinChange: function (value) {
        if (!isNaN(value)) {
            this.setState({
                min: value,
                time: _.padLeft(this.state.hour, 2, '0') + ':' + _.padLeft(value, 2, '0')
            });
        } else {
            this.setState({
                min: null
            });
        }
    },

    handleClientChange: function(obj) {
        if (typeof(obj) === 'string') {
            this.setState({
                client: obj
            });
        } else {
            this.setState({
                client: obj.target.value
            });
        }
    },

    handleDriverChange: function(obj) {
        if (typeof(obj) === 'string') {
            this.setState({
                driver: obj
            });
        } else {
            this.setState({
                driver: obj.target.value
            });
        }
    },

    handleInputChange: function (event) {
        this.setState({
            [event.target.getAttribute('data-type')]: event.target.value
        });
    },

    handleSave: function() {
        var _this = this;
        this.props.updateTrip(this.props.fkey, this.state)
            .then(function(){
                _this.setState({
                    editing: false
                });
            });
    },

    handleDelete: function() {
        if (confirm(getText(lang, locale, 'Delete') + ' ?')) {
            this.props.removeTrip(this.props.fkey);
        }
    },

    getActionRow: function() {
        if (this.props.editable) {
            return (
                <div className="small-6 medium-2 print-hide column actions end">
                    <button
                        className="small edit"
                        onClick={this.handleEditClick}>{getText(lang, locale, 'Edit')}</button>
                    <button
                        className="small"
                        onClick={this.handleDelete}>{getText(lang, locale, 'Delete')}</button>
                </div>
            );
        }
    },

    getRow: function() {

        if (this.state.editing) {
            return (
                <div className="row edit">
                    <div className="small-6 medium-1 column">
                        <select
                            name="type"
                            id="type"
                            onChange={this.handleInputChange}
                            data-type="type"
                            value={this.state.type}>
                            <option value="">{getText(lang, locale, 'Type')}</option>
                            <option value="7s">{getText(lang, locale, '7s')}</option>
                            <option value="16s">{getText(lang, locale, '16s')}</option>
                            <option value="16s2">{getText(lang, locale, '16s2')}</option>
                        </select>
                    </div>
                    <div className="small-6 medium-5 column">
                        <DatePicker
                        date={this.state.date}
                        dateFormat="DD/MM/YYYY"
                        onChange={this.handleDateChange}
                        locale="vi"
                        hideFooter="true"/>
                    </div>
                    <div className="small-6 medium-3 column">
                        <NumberPicker
                            placeholder="hour"
                            value={this.state.hour}
                            min={0}
                            max={23}
                            onChange={this.handleHourChange}/> :
                        <NumberPicker
                            placeholder="min"
                            value={this.state.min}
                            min={0}
                            max={59}
                            step={5}
                            onChange={this.handleMinChange}/>
                    </div>
                    <div className="small-12 medium-3 column">
                        <Typeahead
                            value={this.state.client}
                            placeholder={getText(lang, locale, 'Client')}
                            options={this.props.clients}
                            onOptionSelected={this.handleClientChange}
                            onChange={this.handleClientChange}
                            data-type="client" />
                    </div>
                    <div className="small-12 medium-3 column">
                        <Typeahead
                            value={this.state.driver}
                            placeholder={getText(lang, locale, 'Driver')}
                            options={this.props.drivers}
                            onOptionSelected={this.handleDriverChange}
                            onChange={this.handleDriverChange}
                            data-type="driver" />
                    </div>
                    <div className="medium-3 column">
                        <input
                            type="number"
                            placeholder={getText(lang, locale, 'Cost')}
                            data-type='cost'
                            onChange={this.handleInputChange}
                            value={this.state.cost}/>
                    </div>
                    <div className="medium-6 column">
                        <textarea
                            placeholder={getText(lang, locale, 'Departure')}
                            onChange={this.handleInputChange}
                            data-type="dep"
                            value={this.state.dep}
                            rows="3"/>
                    </div>
                    <div className="medium-6 column">
                        <textarea
                            placeholder={getText(lang, locale, 'Return')}
                            onChange={this.handleInputChange}
                            data-type="ret"
                            value={this.state.ret}
                            rows="3"/>
                    </div>
                    <div className="small-6 medium-6 column actions">
                        <button
                            className="small save"
                            onClick={this.handleSave}>{getText(lang, locale, 'Save')}</button>
                        <button
                            className="small delete right"
                            onClick={this.handleDelete}>{getText(lang, locale, 'Delete')}</button>
                        <button
                            className="small cancel"
                            onClick={this.handleCancelClick}>{getText(lang, locale, 'Cancel')}</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="small-6 medium-1 print-1 column">{this.props.type}&nbsp;</div>
                    <div className="small-6 medium-1 print-2 column">{this.props.date}&nbsp;</div>
                    <div className="small-6 medium-1 print-1 column text-right print-text-left">{this.props.time}&nbsp;</div>
                    <div className="small-12 medium-1 print-1 column">{this.props.client}&nbsp;</div>
                    <div className="small-6 medium-2 print-2 column">{this.props.dep}&nbsp;</div>
                    <div className="small-6 medium-2 print-2 column">{this.props.ret}&nbsp;</div>
                    <div className="small-6 medium-1 print-1 column">{this.props.driver}&nbsp;</div>
                    <div className="small-6 medium-1 print-2 column">{this.props.cost ? this.props.cost.split('').reverse().join('').match(/.{1,3}/g).join('.').split('').reverse().join('') : ''}&nbsp;</div>
                    {this.getActionRow()}
                </div>
            );
        }

    },

    render: function(){
        return (
            this.getRow()
        );
    }
});

module.exports = Trip;
