'use strict'

var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');

var eventEmitter = new EventEmitter()

const EventConst = {
	HOME_TAB_RESS_EVENT: 'homeTabPress',
	STOCK_TAB_PRESS_EVENT : 'stockTabEvent',
	EXCHANGE_TAB_PRESS_EVENT : 'exchangeTabEvent',
	ME_TAB_PRESS_EVENT : 'meTabEvent',
}

var EventCenter = {
	getEventEmitter: function() {
		return eventEmitter
	},

	emitHomeTabPressEvent: function() {
		eventEmitter.emit(EventConst.HOME_TAB_RESS_EVENT)
	},

	emitStockTabPressEvent: function() {
		// this.eventEmitter.emit('eventname', { someArg: 'argValue' });
		eventEmitter.emit(EventConst.STOCK_TAB_PRESS_EVENT)
	},

	emitExchangeTabPressEvent: function() {
		// this.eventEmitter.emit('eventname', { someArg: 'argValue' });
		eventEmitter.emit(EventConst.EXCHANGE_TAB_PRESS_EVENT)
	},

	emitMeTabPressEvent: function(){
		eventEmitter.emit(EventConst.ME_TAB_PRESS_EVENT)
	},
}

module.exports = {EventCenter, EventConst};
