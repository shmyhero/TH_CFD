'use strict';

var React = require('react-native');
var { 
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
} = React;

var ScrollTabView = require('./component/ScrollTabView')
var StockOpenPositionPage = require('./StockOpenPositionPage')
var StockClosedPositionPage = require('./StockClosedPositionPage')
var StockStatisticsPage = require('./StockStatisticsPage')
var ColorConstants = require('../ColorConstants')

var tabNames = ['持仓', '平仓', '统计']

var StockExchangePage = React.createClass({

	render: function() {
		var tabPages = [
			<StockOpenPositionPage navigator={this.props.navigator}/>,
			<StockClosedPositionPage navigator={this.props.navigator}/>,
			<StockStatisticsPage navigator={this.props.navigator}/>
		]

		var viewPages = tabNames.map(
			(tabName, i) =>
			<View style={styles.slide} key={i}>
				{tabPages[i]}
			</View>
		)
		return (
			<ScrollTabView tabNames={tabNames} viewPages={viewPages} />
		)
	},
});

var styles = StyleSheet.create({
	
});


module.exports = StockExchangePage;
