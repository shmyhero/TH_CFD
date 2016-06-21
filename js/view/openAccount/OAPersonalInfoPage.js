'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
} from 'react-native';

var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')


var OAPersonalInfoPage = React.createClass({

	gotoNext: function() {
		//TODO, check
		this.props.navigator.push({
			name: MainPage.OPEN_ACCOUNT_ROUTE,
			step: 2,
		});
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<Button style={styles.buttonArea}
					enabled={true}
					onPress={this.gotoNext}
					textContainerStyle={styles.buttonView}
					textStyle={styles.buttonText}
					text='下一步' />
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'stretch',
	},
});


module.exports = OAPersonalInfoPage;