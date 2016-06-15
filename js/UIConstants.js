'use strict';

import {
	Platform,
} from 'react-native';

export let TAB_BAR_HEIGHT = 50
export let HEADER_HEIGHT = 64
export let SCROLL_TAB_HEIGHT = 48
export let ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER = Platform.OS === 'android' ? 28 : 0

export var USD_CURRENCY = 'USD'
export let CURRENCY_CODE_LIST = {"CAD":"加元", "CHF":"瑞士法郎", "EUR":"欧元", "GBP":"英镑", "HKD":"港元", "JPY":"日元", "SEK":"瑞典克朗", "USD":"美元"}
