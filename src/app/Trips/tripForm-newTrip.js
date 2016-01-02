'use strict';

var React = require('react'), //eslint-disable-line no-unused-vars
    DatePicker = require('react-date-picker'), //eslint-disable-line no-unused-vars
    numberLocalizer = require('react-widgets/lib/localizers/simple-number'),
    NumberPicker = require('react-widgets/lib/NumberPicker'), //eslint-disable-line no-unused-vars
    Typeahead = require('react-typeahead').Typeahead,  //eslint-disable-line no-unused-vars
    _ = require('lodash');

numberLocalizer();

var config = require('../Logic/config'); // eslint-disable-line no-unused-vars

var lang = config.language,
    locale = config.locale,
    getText = config.getText;

var NewTrip = React.createClass({

    getInitialState: function () {
        return {
            type: '',
            date: '',
            hour: NaN,
            min: NaN,
            client: '',
            dep: '',
            ret: '',
            note: '',
            cost: '',
            creating: false
        };
    },

    getDateInput: function () {
        if (this.state.type.length > 0) {
            return (
                <div className="small-6 medium-4 column left">
                    <DatePicker
                        date={this.state.date}
                        dateFormat="DD/MM/YYYY"
                        onChange={this.handleDateChange}
                        locale="vi"
                        hideFooter="true"/>
                </div>
            );
        }
    },

    getTimeInput: function () {
        if (this.state.type.length > 0 && this.state.date) {
            return (
                <div
                    className="small-6 medium-3 column left">
                    <NumberPicker
                        placeholder={getText(lang, locale, 'hour')}
                        value={this.state.hour}
                        min={0}
                        max={23}
                        onChange={this.handleHourChange}/> :
                    <NumberPicker
                        placeholder={getText(lang, locale, 'min')}
                        value={this.state.min}
                        min={0}
                        max={59}
                        step={5}
                        onChange={this.handleMinChange}/>
                </div>
            );
        }
    },

    getClientInput: function () {
        if (this.state.type.length > 0
            && this.state.date
            && !isNaN(this.state.hour)
            && !isNaN(this.state.min)) {
            return (
                <div
                    className="small-12 medium-3 column left">
                    <Typeahead
                        value={this.state.client}
                        placeholder={getText(lang, locale, 'Client')}
                        options={this.props.clients}
                        onOptionSelected={this.handleClientChange}
                        onKeyUp={this.handleClientChange}
                        data-type="client"/>
                </div>
            );
        }
    },

    getInfoInput: function () {
        if (this.state.type.length > 0
            && this.state.date
            && !isNaN(this.state.hour)
            && !isNaN(this.state.min)
            && this.state.client.length > 0) {
            return (
                [
                    <div
                        className="small-6 column"
                        key="nt-cost">
                        <input
                            type="number"
                            placeholder={getText(lang, locale, 'Cost')}
                            data-type='cost'
                            onKeyUp={this.handleInputChange} />
                    </div>,
                    <div
                        className="small-6 column"
                        key="nt-dep">
                        <textarea
                            placeholder={getText(lang, locale, 'Departure')}
                            onKeyUp={this.handleInputChange}
                            data-type="dep"
                            rows="3"/>
                    </div>,
                    <div
                        className="small-6 column"
                        key="nt-ret">
                        <textarea
                            placeholder={getText(lang, locale, 'Return')}
                            onKeyUp={this.handleInputChange}
                            data-type="ret"
                            rows="3"/>
                    </div>,
                    //<div
                    //    className="small-12 medium-4 column"
                    //    key="nt-note">
                    //    <textarea
                    //        placeholder="Note"
                    //        onKeyUp={this.handleInputChange}
                    //        data-type="note"/>
                    //</div>,
                    <div
                        className="small-12 medium-12 column"
                        key="nt-button">
                        <button
                            onClick={this.createNewTrip}>
                            {getText(lang, locale, 'Create')}
                        </button>
                    </div>
                ]
            );
        }
    },

    handleInputChange: function (event) {
        this.setState({
            [event.target.getAttribute('data-type')]: event.target.value
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
                hour: value
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
                min: value
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

    createNewTrip: function(){
        var newTrip = {
            type: this.state.type,
            date: this.state.date,
            time: _.padLeft(this.state.hour, 2, '0') + ':' + _.padLeft(this.state.min, 2, '0'),
            client: this.state.client,
            dep: this.state.dep,
            ret: this.state.ret,
            note: this.state.note,
            cost: this.state.cost
        };
        this.props.createNewTrip(newTrip);
        this.setState({
            type: '',
            date: null,
            hour: NaN,
            min: NaN,
            client: '',
            dep: '',
            ret: '',
            note: '',
            cost: ''
        });
    },

    toggleCreating: function() {
        this.setState({
            creating: !this.state.creating
        });
    },

    render: function () {
        if (this.state.creating) {
            return (
                <div className="new-trip row">
                    <div
                        className="small-6 medium-2 column">
                        <select
                            name="type"
                            id="type"
                            onChange={this.handleInputChange}
                            data-type="type"
                            value={this.state.type}>
                            <option value="">{getText(lang, locale, 'Type')}</option>
                            <option value="7s">{getText(lang, locale, '7s')}</option>
                            <option value="16s">{getText(lang, locale, '16s')}</option>
                        </select>
                    </div>
                    {this.getDateInput()}
                    {this.getTimeInput()}
                    {this.getClientInput()}
                    {this.getInfoInput()}
                    <div className="column text-right">
                        <button
                            onClick={this.toggleCreating}>{getText(lang, locale, 'Cancel')}</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="column">
                        <button
                            onClick={this.toggleCreating}>{getText(lang, locale, 'Create new')}</button>
                    </div>
                </div>
            );
        }
    }
});

module.exports = NewTrip;
