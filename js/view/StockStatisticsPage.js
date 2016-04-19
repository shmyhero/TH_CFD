'use strict';


var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var LayoutAnimation = require('LayoutAnimation');

var {
	StyleSheet,
	View,
	Text,
	Dimensions,
} = React;

var {height, width} = Dimensions.get('window');
var barNames = ['美股', '指数', '外汇', '现货'];

var StockStatisticsPage = React.createClass({
	mixins: [TimerMixin],

	getInitialState: function() {
		return {
			barSize: [
				{invest: 0, profit: 0},
				{invest: 0, profit: 0},
				{invest: 0, profit: 0},
				{invest: 0, profit: 0},
			],
			maxBarSize: 1,
			barAnimPlayed: false,
		}
	},

	playStartAnim: function() {
		if (this.state.barAnimPlayed === false) {
			this.setState({
				barSize: [
					{invest: 100, profit: 100},
					{invest: 50, profit: 20},
					{invest: 150, profit: -80},
					{invest: 110, profit: 200},
				],
			})
			var maxBarSize = 1
			for (var i = 0; i < this.state.barSize.length; i++) {
				var barContent = this.state.barSize[i]
				if (maxBarSize < barContent.invest + barContent.profit) {
					maxBarSize = barContent.invest + barContent.profit
				}
			}
			this.setState({
				barSize: [
					{invest: 100, profit: 0},
					{invest: 50, profit: 0},
					{invest: 150, profit: 0},
					{invest: 110, profit: 0},
				],
				maxBarSize: maxBarSize,
			})
			this.setTimeout(
				() => {
					LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
					this.setState({
						barSize: [
							{invest: 100, profit: 100},
							{invest: 50, profit: 20},
							{invest: 150, profit: -80},
							{invest: 110, profit: 200},
						],
						barAnimPlayed: true,
					})
				 },
				500
			);
		}
	},

	tabPressed: function(index) {

	},

	renderBars: function() {
		var bars = this.state.barSize.map(
			(barContent, i) => {
				var investBarFlex = barContent.invest / this.state.maxBarSize
				var profitBarFlex = barContent.profit / this.state.maxBarSize
				var profitBarStyle = barContent.profit > 0 ? styles.positiveProfitBar : styles.negtiveProfitBar
				if (barContent.profit < 0) {
					profitBarFlex *= -1
					investBarFlex -= profitBarFlex
				}
				return (
					<View key={i}>
						<View style={{flex: 1 - investBarFlex - profitBarFlex}} />
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
		return (
			<View style={styles.header}>
				<View style={styles.empty}/>
				<Text style={styles.headerText1}>总资产</Text>
				<Text style={styles.headerText2}>999999.0</Text>
				<View style={styles.empty}/>
				<Text style={styles.headerText3}>剩余资金</Text>
				<Text style={styles.headerText4}>8000000.0</Text>
				<View style={styles.empty}/>
			</View>
		)
	},

	renderBody: function() {
		return (
			<View style={styles.center}>
				<View style={styles.centerView}>
					<View style={styles.empty}/>
					<Text style={styles.centerText1}>累计收益</Text>
					<Text style={styles.centerText2}>20999.9</Text>
					<View style={styles.empty}/>
				</View>
				<View style={styles.centerView}>
					<View style={styles.empty}/>
					<Text style={styles.centerText1}>总收益率</Text>
					<Text style={styles.centerText2}>21.4%</Text>
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
		return (
			<View style={styles.chart}>
				{this.renderChartHeader()}
				<View style={styles.separator}/>
				<View style={styles.empty}>
					{this.renderBars()}
				</View>
			</View>
		)
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
		flex: 1,
		alignItems: 'stretch',
	},
	empty: {
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
		justifyContent: 'space-around',
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
		height: 1,
		backgroundColor: '#dfe5ef',
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
});


module.exports = StockStatisticsPage;
