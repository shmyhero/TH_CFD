'use strict'

var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');

var eventEmitter = new EventEmitter()

const EventConst = {
	HOME_TAB_RESS_EVENT: 'homeTabPress',
	STOCK_TAB_PRESS_EVENT : 'stockTabEvent',
	EXCHANGE_TAB_PRESS_EVENT : 'exchangeTabEvent',
	ME_TAB_PRESS_EVENT : 'meTabEvent',
	ACCOUNT_STATE_CHANGE : 'account_state_change',
	NETWORK_CONNECTION_CHANGED: 'network_connection_changed',
	ACCOUNT_LOGIN_OUT_SIDE: 'account_login_out_side',
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

	emitAccountStateChangeEvent: function(){
		eventEmitter.emit(EventConst.ACCOUNT_STATE_CHANGE)
	},

	emitNetworkConnectionChangedEvent: function(){
		eventEmitter.emit(EventConst.NETWORK_CONNECTION_CHANGED)
	},

	emitAccountLoginOutSideEvent: function(){
		eventEmitter.emit(EventConst.ACCOUNT_LOGIN_OUT_SIDE)
	},
}

module.exports = {EventCenter, EventConst};
