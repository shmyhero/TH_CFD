'use strict'

var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');

var eventEmitter = new EventEmitter()

const EventConst = {
	HOME_TAB_RESS_EVENT: 'homeTabPress',
	STOCK_TAB_PRESS_EVENT : 'stockTabEvent',
	EXCHANGE_TAB_PRESS_EVENT : 'exchangeTabEvent',
	RANKING_TAB_PRESS_EVENT : 'rankingTabEvent',
	ME_TAB_PRESS_EVENT : 'meTabEvent',
	ACCOUNT_STATE_CHANGE : 'account_state_change',
	NETWORK_CONNECTION_CHANGED: 'network_connection_changed',
	ACCOUNT_LOGIN_OUT_SIDE: 'account_login_out_side',
	ACCOUNT_LOGIN: 'account_login',
	ACCOUNT_LOGOUT: 'account_logout',
	LAYOUT_SIZE_CHANGED: 'layout_size_changed',
	CHART_CLICKED: 'chart_clicked',
	DISABLE_TABBAR: 'disable_tabbar',
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

	emitRankingTabPressEvent: function() {
		// this.eventEmitter.emit('eventname', { someArg: 'argValue' });
		eventEmitter.emit(EventConst.RANKING_TAB_PRESS_EVENT)
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

	emitAccountLoginEvent: function(){
		eventEmitter.emit(EventConst.ACCOUNT_LOGIN)
	},

	emitAccountLoginOutSideEvent: function(){
		eventEmitter.emit(EventConst.ACCOUNT_LOGIN_OUT_SIDE)
	},

	emitAccountLogoutEvent: function(){
		eventEmitter.emit(EventConst.ACCOUNT_LOGOUT);
	},

	emitLayoutSizeChangedEvent: function(){
		eventEmitter.emit(EventConst.LAYOUT_SIZE_CHANGED);
	},

	emitChartClickedEvent: function(){
		eventEmitter.emit(EventConst.CHART_CLICKED);
	},

	emitDisableTabbarEvent: function(){
		eventEmitter.emit(EventConst.DISABLE_TABBAR);
	},
}

module.exports = {EventCenter, EventConst};
