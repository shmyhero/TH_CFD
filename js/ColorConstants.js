'use strict'

var LogicData = require('./LogicData')

var colors = {
	TITLE_BLUE: '#1962dd',
	TITLE_DARK_BLUE: '#425a85',
	DISABLED_GREY: '#e0e0e0',
	BACKGROUND_GREY: '#f0f0f0',
	STOCK_RISE_RED: '#ea5458',
	STOCK_DOWN_GREEN: '#40c19a',
	STOCK_UNCHANGED_GRAY: '#a0a6aa',
	LIST_BACKGROUND_GREY: '#f0eff5',
	SEPARATOR_GRAY: '#ececec',
	MORE_ICON: '#9f9f9f',
	MAIN_CONTENT_BLUE: '#1b65e1',
	SUB_TITLE_WHITE: '#bbd3ff',

	stock_color: function(change) {
		if (change > 0) {
			return this.STOCK_RISE_RED
		}
		else if (change < 0) {
			return this.STOCK_DOWN_GREEN
		}
		else {
			return this.STOCK_UNCHANGED_GRAY
		}
	},

	title_blue:function(){
		return LogicData.getAccountState()?'#425a85':'#1962dd'
	}

}

module.exports = colors;
