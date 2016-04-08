'use strict'

var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');

var eventEmitter = new EventEmitter()

const EventConst = {
	STOCK_TAB_PRESS_EVENT : 'stockTabEvent',
}

var EventCenter = {
	getEventEmitter: function() {
		return eventEmitter
	},

	emitStockTabPressEvent: function() {
		// this.eventEmitter.emit('eventname', { someArg: 'argValue' });
		eventEmitter.emit(EventConst.STOCK_TAB_PRESS_EVENT)
	},
}

module.exports = {EventCenter, EventConst};