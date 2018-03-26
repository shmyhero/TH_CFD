'use strict'

var colorScheme = 1

var colors = {
	COLOR_THEME_SIMULATOR: 1,
	COLOR_THEME_LIVE: 2,
	TITLE_BLUE_LIVE: '#425a85',
	TITLE_BLUE_SIMULATE: '#1962dd',
	TITLE_BLUE: '#1962dd',
	TITLE_DARK_BLUE: '#425a85',
	DISABLED_GREY: '#dcdcdc',
	BACKGROUND_GREY: '#f0f0f0',
	STOCK_RISE_RED: '#bc4105',
	STOCK_DOWN_GREEN: '#428e1b',
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
	COLOR_BORDER:'#184692',
	COLOR_STATIC_TEXT1:'#85b1fb',
	COLOR_CUSTOM_BLUE:'#629af3',
	COLOR_CUSTOM_BLUE2:'#8199c7',

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
			this.DISABLED_GREY = '#dcdcdc'
			this.BACKGROUND_GREY = '#f0f0f0'
			this.STOCK_RISE_RED = '#bc4105'
			this.STOCK_DOWN_GREEN = '#428e1b'
			this.STOCK_UNCHANGED_GRAY = '#a0a6aa'
			this.LIST_BACKGROUND_GREY = '#f0eff5'
			this.SEPARATOR_GRAY = '#ececec'
			this.MORE_ICON = '#9f9f9f'
			this.MAIN_CONTENT_BLUE = '#1b65e1'
			this.SUB_TITLE_WHITE = '#bbd3ff'
			this.STOCK_TAB_BLUE = '#8fabdb'
			this.TAB_UNSELECT_TEXT_COLOR = '#a0bdf1'
			this.COLOR_BORDER = '#253b60'
			this.COLOR_STATIC_TEXT1 = '#698dcd'
			this.COLOR_CUSTOM_BLUE = '#455e8b'
		}
		else {
			this.TITLE_BLUE = '#1962dd'
			this.TITLE_DARK_BLUE = '#425a85'
			this.DISABLED_GREY = '#dcdcdc'
			this.BACKGROUND_GREY = '#f0f0f0'
			this.STOCK_RISE_RED = '#bc4105'
			this.STOCK_DOWN_GREEN = '#428e1b'
			this.STOCK_UNCHANGED_GRAY = '#a0a6aa'
			this.LIST_BACKGROUND_GREY = '#f0eff5'
			this.SEPARATOR_GRAY = '#ececec'
			this.MORE_ICON = '#9f9f9f'
			this.MAIN_CONTENT_BLUE = '#1b65e1'
			this.SUB_TITLE_WHITE = '#bbd3ff'
			this.STOCK_TAB_BLUE = '#70a5ff'
			this.TAB_UNSELECT_TEXT_COLOR = '#abcaff'
			this.COLOR_BORDER = '#184692'
			this.COLOR_STATIC_TEXT1 = '#85b1fb'
			this.COLOR_CUSTOM_BLUE = '#629af3'
		}
	},
}

module.exports = colors;
