'use strict';

var React = require('react-native');
var { 
	StyleSheet,
	View,
	Text,
	ListView,
	TouchableHighlight,
	TouchableOpacity,
	Dimensions,
	Image,
} = React;


var ColorConstants = require('../ColorConstants')

var {height, width} = Dimensions.get('window');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
		return r1.id !== r2.id || r1.profitPercentage!==r2.profitPercentage || r1.hasSelected!==r2.hasSelected
	}});

var tempData = [
	{id:13001, symbol:'AAPL UW', name:'苹果', tag: 'US', profitPercentage: 0.1, hasSelected:false},
	{id:13002, symbol:'AAPL UW2', name:'苹果2', tag: 'US', profitPercentage: 0.05, hasSelected:false},
	{id:13003, symbol:'AAPL UW3', name:'苹果3', profitPercentage: -0.08, hasSelected:false},
	{id:13004, symbol:'AAPL UW4', name:'苹果4', profitPercentage: 0, hasSelected:false},
]

var extendHeight = 0

var StockOpenPositionPage = React.createClass({
	
	getInitialState: function() {
		return {
			stockInfo: ds.cloneWithRows(tempData),
			selectedRow: -1,
			selectedSubItem: 0,
		};
	},

	onEndReached: function() {

	},

	stockPressed: function(rowData, sectionID, rowID, highlightRow) {
		var newData = []
		$.extend(true, newData, tempData)	// deep copy
		if (this.state.selectedRow == rowID) {
			newData[rowID].hasSelected = false
			this.setState({
				stockInfo: this.state.stockInfo.cloneWithRows(newData),
				selectedRow: -1,
				selectedSubItem: 0,
			})
			tempData = newData
		} else {
			var height = this.refs['listview'].getMetrics().contentLength
			if (this.state.selectedRow >=0 ) {
				newData[this.state.selectedRow].hasSelected = false
				height -= extendHeight
			}
			newData[rowID].hasSelected = true
			this.setState({
				stockInfo: this.state.stockInfo.cloneWithRows(newData),
				selectedRow: rowID,
				selectedSubItem: 0,
			})
			tempData = newData
			var y = Math.floor(height/tempData.length*rowID)
			this.refs['listview'].scrollTo({x:0, y:y, animated:true})
		}
	},

	subItemPress: function(item) {
		this.setState({
			selectedSubItem: this.state.selectedSubItem === item ? 0 : item,
		})
	},

	okPress: function() {

	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
	},

	renderFooter: function() {

	},

	renderCountyFlag: function(rowData) {
		if (rowData.tag !== undefined) {
			return (
				<View style={styles.stockCountryFlagContainer}>
					<Text style={styles.stockCountryFlagText}>
						{rowData.tag}
					</Text>
				</View>
			);
		}
	},

	renderProfit: function(percentChange) {
		percentChange = percentChange.toFixed(2)
		if (percentChange > 0) {
			return (
				<Text style={[styles.stockPercentText, {color: ColorConstants.STOCK_RISE_RED}]}>
					 +{percentChange} %
				</Text>
			);
		} else if (percentChange < 0) {
			return (
				<Text style={[styles.stockPercentText, {color: ColorConstants.STOCK_DOWN_GREEN}]}>
					 {percentChange} %
				</Text>
			);
			
		} else {
			return (
				<Text style={[styles.stockPercentText, {color: '#a0a6aa'}]}>
					 {percentChange} %
				</Text>
			);
		}
		
	},

	renderSubDetail: function(rowData) {
		if (this.state.selectedSubItem === 1) {
			return (
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>开仓费</Text>
						<Text style={styles.extendTextBottom}>0.12</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>留仓费</Text>
						<Text style={styles.extendTextBottom}>0.02</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>平仓费</Text>
						<Text style={styles.extendTextBottom}>0.6</Text>
					</View>
				</View>
			);
		}
		else {
			return (
				<View style={{height: 10}}/>
			);
		}
	},

	renderDetailInfo: function(rowData) {
		var buttonEnable = true
		var tradeImage = true ? require('../../images/dark_up.png') : require('../../images/dark_down.png')
		var showNetIncome = false
		extendHeight = 222
		if (showNetIncome) {
			extendHeight += 20
		}
		if (this.state.selectedSubItem === 1) {
			extendHeight += 51
		}
		if (this.state.selectedSubItem === 2) {
			extendHeight += 10
		}
		return (
			<View style={[{height: extendHeight}, styles.extendWrapper]} >
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>类型</Text>
						<Image style={styles.extendImageBottom} source={tradeImage}/>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>本金</Text>
						<Text style={styles.extendTextBottom}>100</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>杠杆</Text>
						<Text style={styles.extendTextBottom}>x10</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>开仓价格</Text>
						<Text style={styles.extendTextBottom}>10.24</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>当前价格</Text>
						<Text style={styles.extendTextBottom}>11.24</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>涨跌幅</Text>
						<Text style={styles.extendTextBottom}>＋9.77%</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />

				<View style={styles.extendRowWrapper}>
					<TouchableOpacity onPress={()=>this.subItemPress(1)} style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>手续费</Text>
						<Image style={styles.extendImageBottom} source={require('../../images/charge.png')}/>
					</TouchableOpacity>
					<TouchableOpacity onPress={()=>this.subItemPress(2)} style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>行情</Text>
						<Image style={styles.extendImageBottom} source={require('../../images/market.png')}/>
					</TouchableOpacity>
					<View style={styles.extendRight}>
					</View>
				</View>

				{this.state.selectedSubItem !== 0 ? <View style={styles.darkSeparator} />: null}
				{this.state.selectedSubItem !== 0 ? this.renderSubDetail(rowData): null}

				<View style={styles.darkSeparator} />
				{showNetIncome ? 
				<Text style={styles.netIncomeText}>净收益:9.26</Text>
				: null}

				<TouchableHighlight 
					underlayColor={	'#164593'}
					onPress={this.okPress} style={[styles.okView, !buttonEnable && styles.okViewDisabled]}>
					<Text style={[styles.okButton, !buttonEnable && styles.okButtonDisabled]}>获利:$10</Text>
				</TouchableHighlight>
			</View>
		);
	},

	renderRow: function(rowData, sectionID, rowID, highlightRow) {
		var bgcolor = this.state.selectedRow === rowID ? '#f5f5f5' : 'white'
		return (
			<View>
				<TouchableHighlight activeOpacity={1} onPress={() => this.stockPressed(rowData, sectionID, rowID, highlightRow)}>
					<View style={[styles.rowWrapper, {backgroundColor: bgcolor}]} key={rowData.key}>
						<View style={styles.rowLeftPart}>
							<Text style={styles.stockNameText}>
								{rowData.name}
							</Text>

							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								{this.renderCountyFlag(rowData)}
								<Text style={styles.stockSymbolText}>
									{rowData.symbol}
								</Text>
							</View>
						</View>

						<View style={styles.rowRightPart}>
							{this.renderProfit(rowData.profitPercentage * 100)}
						</View>
					</View>
				</TouchableHighlight>

				{this.state.selectedRow === rowID ? this.renderDetailInfo(rowData): null}
			</View>
		);
	},

	render: function() {
		return (
			<View style={{width : width, flex : 1}}> 
				<ListView 
					style={styles.list}
					ref="listview"
					initialListSize={11}
					dataSource={this.state.stockInfo}
					renderFooter={this.renderFooter}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator}
					onEndReached={this.onEndReached}/>
			</View>
		)
	},
});

var styles = StyleSheet.create({
	list: {
		alignSelf: 'stretch',
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

	stockCountryFlagContainer: {
		backgroundColor: '#00b2fe',
		borderRadius: 2,
		paddingLeft: 3,
		paddingRight: 3,
		marginRight: 6,
	},

	stockCountryFlagText: {
		fontSize: 10,
		textAlign: 'center',
		color: '#ffffff',
	},

	rowLeftPart: {
		flex: 1,
		alignItems: 'flex-start',
		paddingLeft: 0,
	},

	rowRightPart: {
		flex: 1,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 5,
		alignItems: 'flex-end',
		borderRadius: 2,
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

	stockPercentText: {
		fontSize: 18,
		color: '#ffffff',
		fontWeight: 'bold',
	},

	darkSeparator: {
		marginLeft: 15,
		height: 1,
		backgroundColor: '#dcdcdc',
	},

	extendWrapper: {
		alignItems: 'stretch',
		justifyContent: 'space-around',
		backgroundColor: '#f5f5f5',
	},

	extendRowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingBottom: 8,
		paddingTop: 8,
		justifyContent: 'space-around',
		height: 51,
	},

	extendLeft: {
		flex: 1,
		alignItems: 'flex-start',
		marginLeft: 15,
	},
	extendMiddle: {
		flex: 1,
		alignItems: 'center',
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
	},

	extendTextTop: {
		fontSize:14,
		color: '#7d7d7d',
	},
	extendTextBottom: {
		fontSize:13,
		color: 'black',
		marginTop: 5,
	},
	extendImageBottom: {
		width: 24,
		height: 24,
	},

	okView: {
		width: 312,
		height: 39,
		backgroundColor: '#1962dd',
		paddingVertical: 10,
    	borderRadius:5,
		marginTop: 15,
		marginBottom: 15,
		justifyContent: 'space-around',
		alignSelf: 'center',
	},
	okViewDisabled: {
		backgroundColor: '#f5f5f5',
    	borderWidth:1,
    	borderColor: '#1962dd',
	},
	okButton: {
		color: 'white',
		textAlign: 'center',
		fontSize: 17,
	},
	okButtonDisabled: {
		color: '#1962dd',
	},

	netIncomeText: {
		fontSize: 14,
		color: '#e60b11',
		alignSelf: 'center',
		marginTop: 10,
	},
});


module.exports = StockOpenPositionPage;
