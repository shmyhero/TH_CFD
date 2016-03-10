'use strict';

var React = require('react-native');

var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	Platform,
} = React;

var LogicData = require('../LogicData')
var ColorConstants = require('../ColorConstants')
var StorageModule = require('../module/StorageModule')
var NetworkModule = require('../module/NetworkModule')

var StockSearchPage = React.createClass({
	renderNavBar: function() {
		return (
			<View style={styles.navBarContainer} >
				<View style={styles.navBarInputContainer}>

				</View>

				<View style={styles.navBarCancelTextContainer}>
					<Text style={styles.cancelText}>
						取消
					</Text>
				</View>
			</View>
		);
	},

	render: function() {
		return (
			<View>
				{this.renderNavBar()}
			</View>
		);
	},
});

var styles = StyleSheet.create({
	navBarContainer: {
		height: 50,
		backgroundColor: ColorConstants.TITLE_BLUE,
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-between',
		paddingTop: (Platform.OS === 'ios') ? 15 : 0,
	},

	navBarInputContainer: {
		flex: 5,
		backgroundColor: '#1553bc',
		borderRadius: 5,
		borderWidth: 0.25,
		borderColor: '#ffffff',
		marginTop: 8,
		marginBottom: 5,
		marginLeft: 10,
		marginRight: 0,
	},

	navBarCancelTextContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},

	cancelText: {
		fontSize: 14,
		textAlign: 'center',
		color: '#ffffff',
		marginRight: 5,
	},
});

module.exports = StockSearchPage;