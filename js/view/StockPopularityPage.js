'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	ListView,
	Alert,
	TouchableOpacity,
} from 'react-native';

var MainPage = require('./MainPage')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants');
var NetworkModule = require('../module/NetworkModule');
var TimerMixin = require('react-timer-mixin');

var {height, width} = Dimensions.get('window')
var barWidth = Math.round(width/3)-12

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var StockPopularityPage = React.createClass({
	mixins: [TimerMixin],

	propTypes: {
		initialInfo: React.PropTypes.array,
	},

	getInitialState: function() {
		return {
			rawInfo: [],
			popularityInfo: ds.cloneWithRows([]),
		};
	},

	componentDidMount: function() {
		// todo, push to refresh.
		// delay 3 seconds to load again.
		// this.setTimeout(
		// 	() => {
		// 		NetworkModule.fetchTHUrl(
		// 			NetConstants.GET_POPULARITY_API,
		// 			{
		// 				method: 'GET',
		// 			},
		// 			(responseJson) => {
		// 				this.setState({
		// 					rawInfo: responseJson,
		// 					popularityInfo: ds.cloneWithRows(responseJson),
		// 				})
		// 			},
		// 			(errorMessage) => {
		// 				Alert.alert('', errorMessage);
		// 			}
		// 		)
		// 	 },
		// 	3000
		// );
	},

	gotoStockDetail: function(rowData) {
  		this.props.navigator.push({
			name: MainPage.STOCK_DETAIL_ROUTE,
			stockRowData: rowData
		});
	},

	renderPopularityRow: function(rowData, sectionID, rowID, highlightRow) {
		var percent = 0
		var stockName = ""
		var stockSymbol = ""
		var peopleNum = 0
		if(rowData.userCount !== undefined) {
			percent = rowData.longCount / (rowData.longCount + rowData.shortCount)
			percent = Math.round(100*percent)/100
			stockName = rowData.name
			stockSymbol = rowData.symbol
			peopleNum = rowData.userCount
		}
		var buyWidth = barWidth * percent
		var sellWidth = barWidth * (1-percent)
		percent = Math.round(percent*100)
		return (
			<TouchableOpacity style={[styles.popularityRowContainer, {width: width}]} onPress={()=>this.gotoStockDetail(rowData)}>
				<View style={styles.popularityRowLeft}>
					<Text style={styles.buyTitle}>买涨 {percent}%</Text>
					<View style={[styles.grayBar, {width:barWidth}]}>
						<View style={[styles.redBar, {width:buyWidth}]}/>
					</View>
				</View>
				<View style={styles.popularityRowCenter}>
					<Text style={styles.stockName}>{stockName}</Text>
					<Text style={styles.stockCode}>{stockSymbol}</Text>
					<Text style={styles.stockPeople}>{peopleNum}人参与</Text>
				</View>
				<View style={styles.popularityRowRight}>
					<Text style={styles.sellTitle}>买跌 {100-percent}%</Text>
					<View style={[styles.grayBar, {width:barWidth}]}>
						<View style={[styles.greenBar, {width:sellWidth}]}/>
					</View>
				</View>
			</TouchableOpacity>)
	},

	renderSeparator:function(sectionID, rowID, adjacentRowHighlighted) {
		return(<View key={rowID} style={styles.separator}/>)
	},

	render: function() {
		var dataSource = this.state.rawInfo.length > 0 ? this.state.popularityInfo : ds.cloneWithRows(this.props.initialInfo)
		return (
			<View style={styles.wrapper}>
				<ListView
					style={styles.popularitylist}
					ref="popularitylist"
					dataSource={dataSource}
					enableEmptySections={true}
					renderRow={this.renderPopularityRow}
					renderSeparator={this.renderSeparator}/>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
   		alignItems: 'stretch',
    	justifyContent: 'space-around',
		backgroundColor: 'white',
	},

	popularityRowContainer:{
		height:66,
		flexDirection: 'row',
		alignItems: 'center',
	},
	popularitylist: {
		flex: 1,
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	popularityRowLeft: {
		flex: 1,
		alignItems: 'flex-start',
		marginLeft: 12,
	},
	popularityRowCenter: {
		flex: 1,
		alignItems: 'center',
	},
	popularityRowRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 12,
	},
	buyTitle: {
		color: ColorConstants.STOCK_RISE_RED,
		fontSize: 12,
		paddingBottom: 2,
	},
	sellTitle: {
		color: ColorConstants.STOCK_DOWN_GREEN,
		fontSize: 12,
		paddingBottom: 2,
	},
	grayBar: {
		height: 8,
		backgroundColor: '#e5e5e5',
		borderRadius: 4,
	},
	redBar: {
		height: 8,
		backgroundColor: ColorConstants.STOCK_RISE_RED,
		borderRadius: 4,
	},
	greenBar: {
		height: 8,
		backgroundColor: ColorConstants.STOCK_DOWN_GREEN,
		borderRadius: 4,
		alignSelf: 'flex-end',
	},
	stockName: {
		fontSize: 14,
		color: "#1862df",
		paddingBottom: 2,
	},
	stockCode: {
		fontSize: 12,
		color: "#525252",
	},
	stockPeople: {
		fontSize: 11,
		color: "#bebebe",
	}
});


module.exports = StockPopularityPage;
