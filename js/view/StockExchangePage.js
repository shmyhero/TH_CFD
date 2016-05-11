'use strict';

var React = require('react-native');
var LinearGradient = require('react-native-linear-gradient');
var {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableHighlight,
} = React;

var {EventCenter, EventConst} = require('../EventCenter')

var ScrollTabView = require('./component/ScrollTabView')
var StockOpenPositionPage = require('./StockOpenPositionPage')
var StockClosedPositionPage = require('./StockClosedPositionPage')
var StockStatisticsPage = require('./StockStatisticsPage')
var ColorConstants = require('../ColorConstants')
var NavBar = require('../view/NavBar')
var LogicData = require('../LogicData')
var AppNavigator = require('../../AppNavigator')

var tabNames = ['持仓', '平仓', '统计']
var didTabSelectSubscription = null

var StockExchangePage = React.createClass({

	registerPressed: function() {
		this.props.navigator.push({
			name: AppNavigator.LOGIN_ROUTE,
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
		this.onTabChanged()
	},

	onTabChanged: function(){
		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0
		if (loggined && this.refs['page' + this.state.currentSelectedTab]) {
			this.refs['page' + this.state.currentSelectedTab].tabPressed()
		}
		this.forceUpdate()
	},

	render: function() {
		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0

		var {height, width} = Dimensions.get('window');
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

		if (loggined) {
			return (
				<View style={{flex: 1}}>
					<NavBar title="我的交易" showSearchButton={true} navigator={this.props.navigator}/>
					<ScrollTabView tabNames={tabNames} viewPages={viewPages} removeClippedSubviews={true}
						onPageSelected={(index) => this.onPageSelected(index)} />
				</View>
			)
		}
		else {
			return (
				<LinearGradient colors={['#3475e3', '#123b80']} style={[styles.wrapper, {height: height}]}>
					<View style={styles.rowWrapper}>
						<Text style={styles.headerText}>模拟交易</Text>
					</View>
					<Image style={styles.logoImage} source={require('../../images/login_logo.png')}/>
					<View style={styles.rowWrapper}>
						<Text style={styles.text1}>体验十万模拟资金</Text>
					</View>
					<View style={[styles.rowWrapper, {alignItems:'flex-start'}]}>
						<Text style={styles.text2}>全民有份 任性挥霍</Text>
					</View>

					<TouchableHighlight
						activeOpacity={0.7}
						underlayColor={'transparent'}
						onPress={this.registerPressed}
						style={styles.registerView}>
						<Text style={styles.registerButton}>快速注册</Text>
					</TouchableHighlight>

					<View style={{flex:3}}/>
				</LinearGradient>
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
