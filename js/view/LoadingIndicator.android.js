'use strict'

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
} from 'react-native';

var ProgressBar = require('ProgressBarAndroid');
var {height, width} = Dimensions.get('window')
var LoadingIndicator = React.createClass({
	propTypes: {
		animating: React.PropTypes.bool,
	},

	getInitialState: function() {
		return {
			visible: false,
		};
	},

	show: function() {
		this.setState({
			visible: true,
		})
	},

	hide: function() {
		this.setState({
			visible: false,
		})
	},

	render: function() {
		if (this.state.visible) {
			return (
				<View style={styles.container}>
					<ProgressBar />
				</View>
			)
		} else {
			return null
		}
	}
})

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#0000004f',
	}
})

module.exports = LoadingIndicator;
