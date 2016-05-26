'use strict';

var React = require('react-native');
var {
	Platform,
} = React;

export let TAB_BAR_HEIGHT = 50
export let HEADER_HEIGHT = 64
export let SCROLL_TAB_HEIGHT = 48
export let ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER = Platform.OS === 'android' ? 28 : 0
