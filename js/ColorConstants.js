'use strict'

var colors = {
	TITLE_BLUE: '#1962dd',
	TITLE_DARK_BLUE: '#415a86',
	DISABLED_GREY: '#e0e0e0',
	BACKGROUND_GREY: '#f0f0f0',
	STOCK_RISE_RED: '#ea5458',
	STOCK_DOWN_GREEN: '#40c19a',
	STOCK_UNCHANGED_GRAY: '#a0a6aa',
	LIST_BACKGROUND_GREY: '#f0eff5',

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
	}
}

module.exports = colors;
