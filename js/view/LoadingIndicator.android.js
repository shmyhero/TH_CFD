'use strict'

import PropTypes from 'prop-types';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
} from 'react-native';

var ProgressBar = require('ProgressBarAndroid');
var {height, width} = Dimensions.get('window')

class LoadingIndicator extends React.Component {
    static propTypes = {
		animating: PropTypes.bool,
	};

    state = {
        visible: false,
    };

    show = () => {
		this.setState({
			visible: true,
		})
	};

    hide = () => {
		this.setState({
			visible: false,
		})
	};

    render() {
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
}

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
