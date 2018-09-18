'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Switch,
	TouchableHighlight,
} from 'react-native';

class MySettings extends React.Component {
    state = {
        trueSwitchIsOn: true,
    };

    quitOnClick = () => {
		this.props.navigator.replace({
			name: 'login'
		});
	};

    render() {
		return (
			<View style={styles.wrapper}>

			</View>
		);
	}
}

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,

		alignItems: 'center',
	},

	line: {
		alignSelf: 'stretch',
		height: 1,
		borderWidth: 0.25,
		marginLeft: 10,
		borderColor: '#d0d0d0'
	},

	lineSicker: {
		alignSelf: 'stretch',
		height: 15,
		backgroundColor: '#efefef'
	},

	rowContainer: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'space-between',
	},

	rowText: {
		fontSize: 14,
		textAlign: 'center',
	},

	rowImage: {
		width: 15,
		height: 15,
		resizeMode: 'contain',
	},

	quitContainer: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'center',
	},

	quitText: {
		fontSize: 14,
		textAlign: 'center',
		color: '#ff0000'
	},
});

module.exports = MySettings;