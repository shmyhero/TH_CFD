'use strict';

var React = require('react-native');
var LineChart = require('./component/lineChart/LineChart');
var LinearGradient = require('react-native-linear-gradient');

var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	Alert,
	Dimensions,
} = React;

var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')
var NavBar = require('../view/NavBar')


var StockDetailPage = React.createClass({
	propTypes: {
		stockCode: React.PropTypes.string,
	},

	getDefaultProps() {
		return {
			stockCode: '14993',
		}
	},

	getInitialState: function() {
		return {
			stockInfo: '',
		};
	},

	componentDidMount: function() {
		var url = NetConstants.GET_STOCK_DETAIL_API
		url = url.replace(/<stockCode>/, this.props.stockCode)

		NetworkModule.fetchTHUrl(
			url, 
			{
				method: 'GET',
			},
			(responseJson) => {
				this.setState({
					stockInfo: JSON.stringify(responseJson)
				})
			},
			(errorMessage) => {
				Alert.alert('网络错误提示', errorMessage);
			}
		)
	},


	render: function() {
		var {height, width} = Dimensions.get('window');

		return (
			<View style={styles.wrapper}>
				<LinearGradient colors={['#1c5fd1', '#123b80']} style={{height: height}}>
					<View style={{flex: 1}}>
						<LineChart style={{flex: 1, backgroundColor:'rgba(0,0,0,0)'}} data={this.state.stockInfo}/>
					</View>

					<View style={{flex: 1}}>

					</View>
				</LinearGradient>
			</View>
		)
	},

	renderHeader: function() {
		return (
			<NavBar title="苹果" 
				textOnLeft={this.state.currentSelectedTab==0 ? '编辑' : null}
				leftTextOnClick={this.editButtonClicked}
				imageOnRight={require('../../images/search.png')}
				rightImageOnClick={this.searchButtonClicked}/>
		)
	}
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'stretch',
	},
});

module.exports = StockDetailPage;