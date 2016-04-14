'use strict';

var React = require('react-native');
var { 
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
} = React;

var {EventCenter, EventConst} = require('../EventCenter')

var ScrollTabView = require('./component/ScrollTabView')
var StockOpenPositionPage = require('./StockOpenPositionPage')
var StockClosedPositionPage = require('./StockClosedPositionPage')
var StockStatisticsPage = require('./StockStatisticsPage')
var ColorConstants = require('../ColorConstants')

var tabNames = ['持仓', '平仓', '统计']
var didTabSelectSubscription = null

var StockExchangePage = React.createClass({

	getInitialState: function() {
		return {
			currentSelectedTab : 0,
		}
	},

	componentDidMount: function() {
		this.didTabSelectSubscription = EventCenter.getEventEmitter().addListener(EventConst.EXCHANGE_TAB_PRESS_EVENT, () => {
			this.refs['page' + this.state.currentSelectedTab].tabPressed()
		});
	},

	componentWillUnmount: function() {
		this.didTabSelectSubscription.remove();
	},

	onPageSelected: function(index) {
		this.setState({
			currentSelectedTab: index,
		})
	},

	render: function() {
		var tabPages = [
			<StockOpenPositionPage navigator={this.props.navigator} ref={'page0'}/>,
			<StockClosedPositionPage navigator={this.props.navigator} ref={'page1'}/>,
			<StockStatisticsPage navigator={this.props.navigator} ref={'page2'}/>
		]

		var viewPages = tabNames.map(
			(tabName, i) =>
			<View style={styles.slide} key={i}>
				{tabPages[i]}
			</View>
		)
		return (
			<ScrollTabView tabNames={tabNames} viewPages={viewPages} 
					onPageSelected={(index) => this.onPageSelected(index)} />
		)
	},
});

var styles = StyleSheet.create({
	
});


module.exports = StockExchangePage;
