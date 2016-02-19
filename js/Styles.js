'use strict'

var React = require('react-native');
var {
	StyleSheet
} = React;

var styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
	detailsImage: {
		width: 60,
		height: 88,
		backgroundColor: '#eaeaea',
		marginRight: 10,
	},
});

module.exports = styles;