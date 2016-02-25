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

var ColorConstants = require('../ColorConstants')

var NavBar = React.createClass({
	propTypes: {
		showBackButton: React.PropTypes.bool,

		showTextOnRight: React.PropTypes.bool,

		textOnRight: React.PropTypes.string,

		rightContainerOnClick: React.PropTypes.func,
	},


	backOnClick: function() {
		this.props.navigator.pop();
	},
	
	rightContainerOnClick: function() {
		if (this.props.rightContainerOnClick) {
			this.props.rightContainerOnClick()
		}
	},

	render: function() {
		var backButton = this.props.showBackButton ?
			<TouchableHighlight 
				onPress={this.backOnClick}
				underlayColor={ColorConstants.TITLE_BLUE}>
				<Image 
					style={styles.backButton} 
					source={require('../../images/icon_return_default.png')}/>
			</TouchableHighlight>
			:
			<View />

		var rightText = this.props.showTextOnRight ?
			<TouchableHighlight
				onPress={this.rightContainerOnClick}
				underlayColor={ColorConstants.TITLE_BLUE}>

				<Text style={styles.textOnRight}>
					{this.props.textOnRight}
				</Text>

			</TouchableHighlight>
			:
			<View />

		return (
			<View style={styles.container} >
				<View style={styles.leftContainer}>
					{backButton}
				</View>

				<View style={styles.centerContainer}>
					<Text style={styles.title}>
						{this.props.title}
					</Text>
				</View>
				
				<View style={styles.rightContainer}>
					{rightText}
				</View>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		height: 50,
		backgroundColor: ColorConstants.TITLE_BLUE,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: (Platform.OS === 'ios') ? 15 : 0,
	},
	leftContainer: {
		flex: 1,
		alignItems: 'flex-start'
	},
	centerContainer: {
		flex: 2,
	},
	rightContainer: {
		flex: 1,
		alignItems: 'flex-end',
	},
	backButton: {
		width: 30,
		height: 30,
		marginLeft: 10,
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
	textOnRight: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
		marginRight: 10,
	},
});

module.exports = NavBar;