'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableHighlight
} from 'react-native';
var ColorConstants = require('../../ColorConstants')

var Button = React.createClass({

	propTypes: {
		...TouchableHighlight.propTypes,

		textContainerStyle: View.propTypes.style,

		textStyle: Text.propTypes.style,

		text: React.PropTypes.string,

		enabled: React.PropTypes.bool,
	},

	render: function() {
		return (
			<TouchableHighlight style={this.props.style}
				activeOpacity={this.props.enabled ? 0.7 : 1}
				underlayColor={this.props.enabled ? '#000000': ColorConstants.DISABLED_GREY}
				onPress={this.props.enabled ? this.props.onPress : null}>
				<View style={this.props.enabled ?
						this.props.textContainerStyle :
						[this.props.textContainerStyle, {backgroundColor: ColorConstants.DISABLED_GREY}]}>
					<Text style={this.props.textStyle}>
						{this.props.text}
					</Text>
				</View>
			</TouchableHighlight>
		)
	},

});

module.exports = Button
