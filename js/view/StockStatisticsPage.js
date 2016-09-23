'use strict';

var LayoutAnimation = require('LayoutAnimation');
import React from 'react';

import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	Platform,
	Alert,
} from 'react-native';

var TimerMixin = require('react-timer-mixin');
var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants')

var {height, width} = Dimensions.get('window');

var StockStatisticsPage = React.createClass({
	mixins: [TimerMixin],

	getInitialState: function() {
		var balanceData = LogicData.getBalanceData()
		return {
			statisticsBarInfo: [],
			statisticsSumInfo: [],
			maxBarSize: 1,
			barAnimPlayed: false,
			balanceData: balanceData,
		}
	},

	tabPressed: function(index) {
		NetworkModule.loadUserBalance(true, (responseJson)=>{this.setState({balanceData: responseJson,})})
	},

	playStartAnim: function() {
		this.setState({
			statisticsBarInfo: [],
			statisticsSumInfo: [],
		})
		var userData = LogicData.getUserData()
		NetworkModule.fetchTHUrl(
			NetConstants.GET_USER_STATISTICS_API,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			(responseJson) => {
				this.playStatisticsAnim(responseJson)
			},
			(errorMessage) => {
				Alert.alert('', errorMessage);
			}
		)
	},

	playStatisticsAnim: function(statisticsInfo) {
		var originalStatisticsInfo = []
		$.extend(true, originalStatisticsInfo, statisticsInfo)	// deep copy
		this.setState({
			statisticsBarInfo: statisticsInfo,
			statisticsSumInfo: originalStatisticsInfo,
			barAnimPlayed: true,
		})
		var maxBarSize = 1
		for (var i = 0; i < statisticsInfo.length; i++) {
			var barContent = statisticsInfo[i]
			if (maxBarSize < barContent.invest + barContent.pl) {
				maxBarSize = barContent.invest + barContent.pl
			}
			barContent.pl = 0
		}
		this.setState({
			maxBarSize: maxBarSize,
		})
		this.setTimeout(
			() => {
				LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
				this.setState({
					statisticsBarInfo: originalStatisticsInfo,
					barAnimPlayed: true,
				})
			 },
			1000
		);
	},

	renderBars: function() {
		var bars = this.state.statisticsBarInfo.map(
			(barContent, i) => {
				var investBarFlex = Math.floor(barContent.invest / this.state.maxBarSize * 100)
				var profitBarFlex = Math.floor(barContent.pl / this.state.maxBarSize * 100)
				var profitBarStyle = barContent.pl > 0 ? styles.positiveProfitBar : styles.negtiveProfitBar
				if (barContent.pl < 0) {
					profitBarFlex *= -1
					investBarFlex -= profitBarFlex
				}
				return (
					<View key={i}>
						<View style={{flex: 100 - investBarFlex - profitBarFlex}} />
						<View style={[{flex: profitBarFlex}, profitBarStyle]} />
						<View style={[{flex: investBarFlex},styles.investBar]} />
					</View>
				)
			}
		)
		return (
			<View style={styles.barContainer}>
				{bars}
			</View>
		);
	},

	renderHeader: function() {
		var total = '--'
		var available = '--'
		if (this.state.balanceData) {
			total = this.state.balanceData.total.toFixed(2)
			available = this.state.balanceData.available.toFixed(2)
			if (this.state.balanceData.available < 0) {
				available = '0'
			}
		}

		return (
			<View style={styles.header}>
				<View style={styles.empty}/>
				<Text style={styles.headerText1}>总资产(美元)</Text>
				<Text style={styles.headerText2}>{total}</Text>
				<View style={styles.empty}/>
				<Text style={styles.headerText3}>剩余资金(美元)</Text>
				<Text style={styles.headerText4}>{available}</Text>
				<View style={styles.empty}/>
			</View>
		)
	},

	renderBody: function() {
		var sumPl = '--'
		var avgPlRate = '--'
		if (this.state.statisticsSumInfo.length > 0) {
			sumPl = 0
			var sumInvest = 0
			for (var i = 0; i < this.state.statisticsSumInfo.length; i++) {
				var barContent = this.state.statisticsSumInfo[i]
				sumPl += barContent.pl
				sumInvest += barContent.invest
			}

			avgPlRate = (sumInvest > 0) ? sumPl / sumInvest * 100: 0
			sumPl = sumPl.toFixed(2)
			avgPlRate = avgPlRate.toFixed(2)
		}
		return (
			<View style={styles.center}>
				<View style={styles.centerView}>
					<View style={styles.empty}/>
					<Text style={styles.centerText1}>近10天收益(美元)</Text>
					<Text style={styles.centerText2}>{sumPl}</Text>
					<View style={styles.empty}/>
				</View>
				<View style={styles.centerView}>
					<View style={styles.empty}/>
					<Text style={styles.centerText1}>近10天收益率</Text>
					<Text style={styles.centerText2}>{avgPlRate}%</Text>
					<View style={styles.empty}/>
				</View>
			</View>
		)
	},

	renderChartHeader: function() {
		return (
			<View style={styles.chartHeader}>
				<View style={styles.centerView}>
					<Text style={styles.chartHeaderText1}>累计收益</Text>
				</View>
				<View style={styles.chartHeaderRightPart}>
					<View style={styles.redSquare}/>
					<Text style={styles.chartHeaderText2}>盈利</Text>
					<View style={styles.greenSquare}/>
					<Text style={styles.chartHeaderText2}>亏损</Text>
					<View style={styles.blueSquare}/>
					<Text style={styles.chartHeaderText2}>当前资金</Text>
				</View>
			</View>
		)
	},

	renderChart: function() {
		var hasData = this.state.balanceData!==null
		var barNameText = this.state.statisticsBarInfo.map(
			(barContent, i) =>
				<Text key={i} style={styles.barNameText}>
					{barContent.name}
				</Text>
		)
		var sumInvest = 0
		for (var i = 0; i < this.state.statisticsSumInfo.length; i++) {
			var barContent = this.state.statisticsSumInfo[i]
			sumInvest += barContent.invest
		}
		if (hasData && sumInvest > 0) {
			return (
				<View style={styles.chart}>
					{this.renderChartHeader()}
					<View style={styles.separator}/>
					<View style={[styles.empty, {padding: 20}]}>
						{this.renderBars()}
					</View>
					<View style={[styles.separator, {marginBottom: 10, marginRight:15}]}/>
					<View style={styles.barNamesContainer}>
						{barNameText}
					</View>
				</View>
			)
		}
		else {
			return (
				<View style={[styles.header, styles.chart]}>
					<Text style={styles.loadingText}>暂无盈亏分布记录</Text>
				</View>
				)
		}
	},

	render: function() {
		return (
			<View style={[styles.wrapper, {width:width}]}>

				{this.renderHeader()}

				{this.renderBody()}

				{this.renderChart()}

			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		height: height
				- UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER
				- UIConstants.HEADER_HEIGHT
				- UIConstants.SCROLL_TAB_HEIGHT,
		alignItems: 'stretch',
		paddingBottom: Platform.OS === 'android' ? 40 : 0,
	},
	empty: {
		paddingBottom: 0,
		flex: 1,
	},

	header: {
		flex: 2,
		backgroundColor: '#1b65e1',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	headerText1: {
		fontSize: 17,
		color: 'white',
	},
	headerText2: {
		fontSize: 44,
		color: 'white',
	},
	headerText3: {
		fontSize: 17,
		color: '#85b1fb',
	},
	headerText4: {
		fontSize: 19,
		color: 'white',
	},

	center: {
		flex: 1,
		backgroundColor: '#eff5ff',
		flexDirection: 'row',
	},
	centerView: {
		flex: 1,
		paddingLeft: 15,
		justifyContent: 'space-around',
	},
	centerText1: {
		fontSize: 14,
		color: '#8a95a5',
	},
	centerText2: {
		fontSize: 29,
		color: '#1962dd',
	},

	chart: {
		flex: 3,
		backgroundColor: 'white',
	},

	chartHeader: {
		height: 40,
		flexDirection: 'row',
	},
	chartHeaderRightPart: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		marginRight: 10,
	},
	chartHeaderText1: {
		fontSize: 14,
		color: '#333333',
	},
	chartHeaderText2: {
		fontSize: 11,
		color: '#adadad',
		marginLeft: 3,
		marginRight: 3,
	},
	redSquare: {
		width: 10,
		height: 6,
		backgroundColor: '#f16b5f',
	},
	greenSquare: {
		width: 10,
		height: 6,
		backgroundColor: '#5fd959',
	},
	blueSquare: {
		width: 10,
		height: 6,
		backgroundColor: '#629af3',
	},

	separator: {
		marginLeft: 15,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	container: {
		alignItems: 'stretch',
		flex: 1,
	},

	barContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'stretch',
	},

	barNamesContainer: {
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'stretch',
	},
	barNameText: {
		fontSize: 13,
		color: '#adadad',
	},

	investBar: {
		backgroundColor: '#629af3',
		width: 20,
	},

	positiveProfitBar: {
		backgroundColor: '#f16b5f',
		width: 20,
	},

	negtiveProfitBar: {
		backgroundColor: '#5fd959',
		width: 20,
	},

	loadingText: {
		fontSize: 13,
		color: '#9f9f9f'
	},
});


module.exports = StockStatisticsPage;
