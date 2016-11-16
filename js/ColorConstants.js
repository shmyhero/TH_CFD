'use strict'

var colorScheme = 1

var colors = {
	COLOR_THEME_SIMULATOR: 1,
	COLOR_THEME_LIVE: 2,
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
	STOCK_TAB_BLUE: '#70a5ff',
	INPUT_TEXT_PLACE_HOLDER_COLOR: '#c4c4c4',
	INPUT_TEXT_COLOR: '#333333',
	INOUT_TEXT_SELECTION_COLOR: '#426bf2',
	TAB_UNSELECT_TEXT_COLOR: '#abcaff',

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
		// return LogicData.getAccountState()?'#425a85':'#1962dd'
		return colorScheme === this.COLOR_THEME_LIVE ? '#425a85':'#1962dd'
	},

	setScheme: function(scheme){
		colorScheme = scheme

		if(scheme === this.COLOR_THEME_LIVE) {
			this.TITLE_BLUE = '#425a85'
			this.TITLE_DARK_BLUE = '#425a85'
			this.DISABLED_GREY = '#e0e0e0'
			this.BACKGROUND_GREY = '#f0f0f0'
			this.STOCK_RISE_RED = '#ea5458'
			this.STOCK_DOWN_GREEN = '#40c19a'
			this.STOCK_UNCHANGED_GRAY = '#a0a6aa'
			this.LIST_BACKGROUND_GREY = '#f0eff5'
			this.SEPARATOR_GRAY = '#ececec'
			this.MORE_ICON = '#9f9f9f'
			this.MAIN_CONTENT_BLUE = '#1b65e1'
			this.SUB_TITLE_WHITE = '#bbd3ff'
			this.STOCK_TAB_BLUE = '#8fabdb'
			this.TAB_UNSELECT_TEXT_COLOR = '#a0bdf1'
		}
		else {
			this.TITLE_BLUE = '#1962dd'
			this.TITLE_DARK_BLUE = '#425a85'
			this.DISABLED_GREY = '#e0e0e0'
			this.BACKGROUND_GREY = '#f0f0f0'
			this.STOCK_RISE_RED = '#ea5458'
			this.STOCK_DOWN_GREEN = '#40c19a'
			this.STOCK_UNCHANGED_GRAY = '#a0a6aa'
			this.LIST_BACKGROUND_GREY = '#f0eff5'
			this.SEPARATOR_GRAY = '#ececec'
			this.MORE_ICON = '#9f9f9f'
			this.MAIN_CONTENT_BLUE = '#1b65e1'
			this.SUB_TITLE_WHITE = '#bbd3ff'
			this.STOCK_TAB_BLUE = '#70a5ff'
			this.TAB_UNSELECT_TEXT_COLOR = '#abcaff'
		}
	},
}

module.exports = colors;
