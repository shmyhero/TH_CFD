'use strict';

import {
	Platform,
	StatusBar,
} from 'react-native';

export let TAB_BAR_HEIGHT = 50
export let HEADER_HEIGHT = Platform.OS === 'android' ? 48 : 64
export let SCROLL_TAB_HEIGHT = Platform.OS === 'android' ? 32 : 48	//TODO: A calculated value, may be wrong on some devices...
export let ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER = Platform.OS === 'android' ? StatusBar.currentHeight : 0
export let LIST_HEADER_BAR_HEIGHT = 31

export var USD_CURRENCY = 'USD'
export let CURRENCY_CODE_LIST = {"CAD":"加元", "CHF":"瑞士法郎", "EUR":"欧元", "GBP":"英镑", "HKD":"港元", "JPY":"日元", "SEK":"瑞典克朗", "USD":"美元"}

export let MAX_NICKNAME_LENGTH = 8;
export let LIST_ITEM_LEFT_MARGIN = 15;
