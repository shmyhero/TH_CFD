'use strict';

var React = require('react-native');
var {
	AppRegistry,
	StyleSheet,
	Navigator,
	Platform,
	View,
	Text,
	Image,
	TouchableHighlight,
} = React;

var NavBar = React.createClass({
	backOnClick: function() {
		this.props.navigator.pop();
	},
	render: function() {
		var backButton = this.props.showBackButton?
		<TouchableHighlight 
			onPress={this.backOnClick}
			underlayColor='#1789d5'>
			<Image 
				style={styles.backButton} 
				source={require('../../images/icon_return_default.png')}/>
		</TouchableHighlight>
		:
		<View />

		return (
			<View style={styles.container} >
				{backButton}
				<Text style={styles.title}>
					{this.props.title}
				</Text>
				<Text style={styles.right}>
					
				</Text>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		height: 50,
		backgroundColor: '#1789d5',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: (Platform.OS === 'ios') ? 15 : 0,
	},
	backButton: {
		width: 30,
		height: 30,
		resizeMode: Image.resizeMode.contain,
	},
	left: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
	},
	title: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
	},
	right: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
	},
});

module.exports = NavBar;