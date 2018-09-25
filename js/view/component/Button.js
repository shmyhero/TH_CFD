'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	ViewPropTypes,
} from 'react-native';
var ColorConstants = require('../../ColorConstants')

class Button extends React.Component {
    static propTypes = {
		...TouchableHighlight.propTypes,

		textContainerStyle: ViewPropTypes.style,

		textStyle: Text.propTypes.style,

		text: PropTypes.string,

		enabled: PropTypes.bool,
	};

    render() {
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
	}
}

module.exports = Button
