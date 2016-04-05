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
	Dimensions,
	ListView,
	Alert,
	TouchableOpacity,
} = React;

var LogicData = require('../LogicData')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var StorageModule = require('../module/StorageModule')
var NetworkModule = require('../module/NetworkModule')

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var StockSearchPage = React.createClass({

	getInitialState: function() {
		return {
			searchStockRawInfo: [],
			searchStockInfo: ds.cloneWithRows([])
		};
	},

	searchStock: function(text) {
		if (text.length > 0) {
			console.log('Start search: ' + text)
			NetworkModule.fetchTHUrl(
				NetConstants.GET_SEARCH_STOCK_API + '?keyword=' + text, 
				{
					method: 'GET',
				},
				(responseJson) => {
					if (responseJson.length == 0) {
						Alert.alert('提示', '没有找到包含此信息的商品。')
					}
					this.setState({
						searchStockRawInfo: responseJson,
						searchStockInfo: ds.cloneWithRows(responseJson)
					})
				},
				(errorMessage) => {
					Alert.alert('提示', errorMessage);
				}
			)
		}
	},

	addToMyListPressed: function(rowID) {
		LogicData.addStockToOwn(this.state.searchStockRawInfo[rowID])
		this.forceUpdate()
	},

	cancel: function() {
		this.props.navigator.pop();
	},

	renderNavBar: function() {
		return (
			<View style={styles.navBarContainer} >
				<View style={styles.navBarInputContainer}>
					<Image 
						style={styles.searchButton} 
						source={require('../../images/search.png')}/>

					<TextInput style={styles.searchInput}
							onSubmitEditing={(event) => this.searchStock(event.nativeEvent.text)}
							autoCorrect={false}
							autoCapitalize='none'
							returnKeyType='search'
							placeholder='搜索金融产品'
							placeholderTextColor='#bac6e6'
							underlineColorAndroid='#1553bc' />
				</View>

				<TouchableOpacity style={styles.navBarCancelTextContainer}
						onPress={this.cancel}>
					<Text style={styles.cancelText}>
						取消
					</Text>
				</TouchableOpacity>
			</View>
		);
	},

	renderRow: function(rowData, sectionID, rowID, highlightRow) {
		var rightPartContent = <Text style={styles.alreadyAddText}>已添加</Text>
		var myListData = LogicData.getOwnStocksData()
		var index = myListData.findIndex((stock) => {return stock.id === rowData.id})
		if (index === -1) {
			rightPartContent = 
					<TouchableOpacity style={styles.addToMyListContainer}
							onPress={() => this.addToMyListPressed(rowID)}>
						<Text style={styles.addToMyListText}>
							+
						</Text>
					</TouchableOpacity>
		}
		return (
			<View style={styles.rowWrapper} key={rowData.key}>

				<View style={styles.rowLeftPart}>
					<Text style={styles.stockNameText}>
						{rowData.name}
					</Text>

					<Text style={styles.stockSymbolText}>
						{rowData.symbol}
					</Text>
				</View>

				<View style={styles.rowRightPart}>
					{rightPartContent}
				</View>
			</View>
		);
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
	},

	render: function() {
		var {height, width} = Dimensions.get('window');
		return (
			<View style={{flex: 1, width: width}}>
				{this.renderNavBar()}
				<ListView
					style={styles.list}
					ref="listview"
					initialListSize={11}
					dataSource={this.state.searchStockInfo}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator}/>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	navBarContainer: {
		flex: 1,
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

	list: {
		flex: 12,
		alignSelf: 'stretch',
	},

	rowWrapper: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 10,
		paddingTop: 10,
		backgroundColor: '#ffffff',
	},

	rowLeftPart: {
		flex: 1,
		alignItems: 'flex-start',
		paddingLeft: 5,
	},
	rowRightPart: {
		flex: 1,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 5,
		alignItems: 'flex-end',
		borderRadius: 5,
	},

	stockNameText: {
		fontSize: 18,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
	},

	addToMyListContainer: {
		borderWidth: 1,
		borderRadius: 2,
		paddingLeft: 5,
		paddingRight: 5,
		paddingBottom: 2,
		borderColor: ColorConstants.TITLE_BLUE,
	},
	addToMyListText: {
		fontSize: 18,
		color: ColorConstants.TITLE_BLUE,		
		fontWeight: 'bold',
	},
	alreadyAddText: {
		fontSize: 14,
		color: "#5274ae",
	},
	line: {
		height: 1,
		backgroundColor: 'white',
	},
	separator: {
		marginLeft: 15,
		height: 1,
		backgroundColor: '#ececec',
	},
});

module.exports = StockSearchPage;