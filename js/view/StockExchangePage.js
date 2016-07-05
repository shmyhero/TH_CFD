'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableHighlight,
} from 'react-native';

var {EventCenter, EventConst} = require('../EventCenter')

var LoginPage = require('./LoginPage');
var ScrollTabView = require('./component/ScrollTabView')
var StockOpenPositionPage = require('./StockOpenPositionPage')
var StockClosedPositionPage = require('./StockClosedPositionPage')
var StockStatisticsPage = require('./StockStatisticsPage')
var ColorConstants = require('../ColorConstants')
var NavBar = require('../view/NavBar')
var LogicData = require('../LogicData')
var MainPage = require('./MainPage')

var tabNames = ['持仓', '平仓', '统计']
var didTabSelectSubscription = null

var StockExchangePage = React.createClass({

	registerPressed: function() {
		this.props.navigator.push({
			name: MainPage.LOGIN_ROUTE,
		});
	},

	getInitialState: function() {
		return {
			currentSelectedTab : 0,
		}
	},

	componentDidMount: function() {
		didTabSelectSubscription = EventCenter.getEventEmitter().
			addListener(EventConst.EXCHANGE_TAB_PRESS_EVENT, this.onTabChanged);
	},

	componentWillUnmount: function() {
		didTabSelectSubscription && didTabSelectSubscription.remove();
	},

	onPageSelected: function(index: number) {
		this.setState({
			currentSelectedTab: index,
		})
		if (index == 2) {
			this.refs['page' + this.state.currentSelectedTab].playStartAnim()
		}
		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0
		if (loggined && this.refs['page' + index]) {
			this.refs['page' + index].tabPressed()
		}
	},

	onTabChanged: function(){
		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0
		// if (loggined && this.refs['page' + this.state.currentSelectedTab]) {
		// 	this.refs['page' + this.state.currentSelectedTab].tabPressed()
		// }
		// this.forceUpdate()
		if (loggined && this.refs['page0']){
			this.refs['tabPages'].tabClicked(0)
			this.setState({
				currentSelectedTab: 0
			})
			this.refs['page0'].tabPressed()
		}
	},

	render: function() {
		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0

		var {height, width} = Dimensions.get('window');
		var tabPages = [
			<StockOpenPositionPage navigator={this.props.navigator} ref={'page0'}
					showTutorial={(type)=>this.props.showTutorial(type)}/>,
			<StockClosedPositionPage navigator={this.props.navigator} ref={'page1'}/>,
			<StockStatisticsPage navigator={this.props.navigator} ref={'page2'}/>
		]

		var viewPages = tabNames.map(
			(tabName, i) =>
			<View style={styles.slide} key={i}>
				{tabPages[i]}
			</View>
		)

		if (loggined) {
			return (
				<View style={{flex: 1}}>
					<NavBar title="我的交易" showSearchButton={true} navigator={this.props.navigator}/>
					<ScrollTabView ref={"tabPages"} tabNames={tabNames} viewPages={viewPages} removeClippedSubviews={true}
						onPageSelected={(index) => this.onPageSelected(index)} />
				</View>
			)
		}
		else {
			return (
				<LoginPage navigator={this.props.navigator}/>
			)
		}
	},
});

var styles = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	rowWrapper: {
		flex:1,
		alignItems:'center',
		flexDirection:'row',
	},

	headerText: {
		flex: 1,
		fontSize: 17,
		color: 'white',
	},

	text1: {
		flex: 1,
		fontSize: 27,
		color: 'white',
	},
	text2: {
		flex: 1,
		fontSize: 14,
		color: '#92b9fa',
	},

	logoImage: {
		flex: 3,
		width: 190,
		height: 190,
	},

	registerView: {
		alignSelf: 'stretch',
		height: 42,
		backgroundColor: 'transparent',
		paddingVertical: 10,
    	borderRadius:5,
		borderWidth: 1,
		borderColor: 'white',
		margin: 15,
	},

	registerButton: {
		color: 'white',
		fontSize: 17,
		textAlign: 'center',
	}
});


module.exports = StockExchangePage;
