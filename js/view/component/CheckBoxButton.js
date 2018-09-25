'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	ViewPropTypes
} from 'react-native';
var ColorConstants = require('../../ColorConstants')

class CheckBoxButton extends React.Component {
    static propTypes = {
		...TouchableOpacity.propTypes,

		containerStyle: ViewPropTypes.style,

		textStyle: Text.propTypes.style,

		text: PropTypes.string,

		enabled: PropTypes.bool,

		defaultSelected: PropTypes.bool,

		onPress: PropTypes.func,

		content: PropTypes.element,

		selectedIcon: PropTypes.number,

		unSelectedIcon: PropTypes.number,
	};

    static defaultProps = {
        containerStyle: {flex: 1,flexDirection: 'row', alignItems:'center'},
        textStyle: {fontSize: 14, paddingLeft: 5},
        enabled: true,
        defaultSelected: false,
        onPress: null,
    };

    state = {
        selected: this.props.defaultSelected,
    };

    onPressed = () => {
		var newState = !this.state.selected
		this.props.onPress &&this.props.onPress(newState)
		this.setState({
			selected: newState,
		})
	};

    setSelectedState = (newState) => {
		this.setState({
			selected: newState,
		})
	};

    render() {
		var icon = this.state.selected ?
			(this.props.selectedIcon ? this.props.selectedIcon : require('../../../images/checkbox1.png'))
		 : (this.props.unSelectedIcon ? this.props.unSelectedIcon : require('../../../images/checkbox2.png'))
		return (
			<TouchableOpacity style={styles.wrapper} disabled={!this.props.enabled} onPress={this.props.enabled ? this.onPressed : null} >
				<View style={this.props.containerStyle}>
					<Image style={styles.image} source={icon} />
					<Text style = {this.props.textStyle}>{this.props.text}</Text>
					{this.props.children}
				</View>
			</TouchableOpacity>
		)
	}
}

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},

	image: {
		width: 20.5,
		height: 20,
		marginLeft: 0,
	},
});

module.exports = CheckBoxButton
