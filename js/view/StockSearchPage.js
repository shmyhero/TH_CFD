'use strict';

var React = require('react-native');

var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	Platform,
	TextInput,
} = React;

var LogicData = require('../LogicData')
var ColorConstants = require('../ColorConstants')
var StorageModule = require('../module/StorageModule')
var NetworkModule = require('../module/NetworkModule')

var StockSearchPage = React.createClass({

	setSearchText: function() {

	},

	renderNavBar: function() {
		return (
			<View style={styles.navBarContainer} >
				<View style={styles.navBarInputContainer}>
					<Image 
						style={styles.searchButton} 
						source={require('../../images/search.png')}/>

					<TextInput style={styles.searchInput}
							onChangeText={(text) => this.setSearchText(text)}
							placeholder='搜索金融产品'
							placeholderTextColor='#bac6e6'
							underlineColorAndroid='#1553bc'/>
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
		height: (Platform.OS === 'ios') ? 65 : 50,
		backgroundColor: ColorConstants.TITLE_BLUE,
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-between',
		paddingTop: (Platform.OS === 'ios') ? 15 : 0,
	},

	navBarInputContainer: {
		flex: 5,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#1553bc',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#3877df',
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

	searchButton: {
		width: 15,
		height: 15,
		marginLeft: 5,
		resizeMode: Image.resizeMode.contain,
	},

	searchInput: {
		flex: 1,
		height: 36,
		fontSize: 16,
		marginLeft: 10,
		marginRight: 10,
		paddingLeft: 10,
		color: '#ffffff',
	},

	cancelText: {
		fontSize: 16,
		textAlign: 'center',
		color: '#ffffff',
		marginRight: 5,
	},
});

module.exports = StockSearchPage;