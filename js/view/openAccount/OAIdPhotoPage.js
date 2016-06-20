'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Platform,
	Alert,
} from 'react-native';


var OAIdPhotoPage = React.createClass({
	render: function() {
		return (
			<View style={styles.wrapper}>

			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'stretch',
		paddingBottom: Platform.OS === 'android' ? 40 : 0,
	},
});


module.exports = OAIdPhotoPage;