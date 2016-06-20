'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Platform,
	Alert,
} from 'react-native';


var OAPersonalInfoPage = React.createClass({

});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'stretch',
		paddingBottom: Platform.OS === 'android' ? 40 : 0,
	},
});


module.exports = OAPersonalInfoPage;