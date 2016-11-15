'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
} from 'react-native';
var ColorConstants = require('../../ColorConstants')

var CheckBoxButton = React.createClass({

	propTypes: {
		...TouchableOpacity.propTypes,

		containerStyle: View.propTypes.style,

		textStyle: Text.propTypes.style,

		text: React.PropTypes.string,

		enabled: React.PropTypes.bool,

		defaultSelected: React.PropTypes.bool,

		onPress: React.PropTypes.func,
	},

	getInitialState: function() {
		return {
			selected: this.props.defaultSelected,
		};
	},
	
	getDefaultProps(): Object {
		return {
			containerStyle: {flex: 1,flexDirection: 'row', alignItems:'center'},
			textStyle: {fontSize: 14, paddingLeft: 5},
			enabled: true,
			defaultSelected: false,
			onPress: null,
		};
	},

	onPressed: function() {
		var newState = !this.state.selected
		this.props.onPress &&this.props.onPress(newState)
		this.setState({
			selected: newState,
		})
	},

	render: function() {
		var icon = this.state.selected ? require('../../../images/checkbox1.png') : require('../../../images/checkbox2.png')
		return (
			<TouchableOpacity style={styles.wrapper} onPress={this.props.enabled ? this.onPressed : null} >
				<View style={this.props.containerStyle}>
					<Image style={styles.image} source={icon} />
					<Text style = {this.props.textStyle}>{this.props.text} </Text>
				</View>
			</TouchableOpacity>
		)
	},

});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},

	image: {
		width: 20.5,
		height: 19.5,
	},
});

module.exports = CheckBoxButton
