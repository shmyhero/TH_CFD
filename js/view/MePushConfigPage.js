'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Platform,
	Navigator,
	Switch,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';

var LogicData = require('../LogicData')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var NavBar = require('./NavBar')
var MainPage = require('./MainPage')
var UIConstants = require('../UIConstants')

var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var listRawData = [
{'type':'normal', 'title':'系统平仓提示', 'subtype': 'closepositionpush'},
{'type':'text', 'title':'虽然全力以赴传递通知，却也不能保证。', 'subtype': 'hint'}
]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var closePositionPushUpdated = false

var MePushConfigPage = React.createClass({

	propTypes: {
		routeMapper: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			routeMapper: function(route, navigationOperations, onComponentRef) {

			},
		}
	},

	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(listRawData),
			autoCloseAlertIsOn: true,
		};
	},

	componentDidMount: function() {
		//Once user moves into this page, check server setting.
		this.loadPushConfigInfo()

		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0

		if (notLogin) {
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
				popToRoute: MainPage.ME_PUSH_CONFIG_ROUTE,
				onPopToRoute: this.loadPushConfigInfo
			});
		}
	},

	onSelectNormalRow: function(rowData) {
		//DO NOTHING!
	},

	loadPushConfigInfo: function(){
		var userData = LogicData.getUserData()
		var meData = LogicData.getMeData()
		var notLogin = Object.keys(meData).length === 0

		if (!notLogin) {
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_USER_INFO_API,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
				},
				function(responseJson) {
					var autoCloseAlert = LogicData.getAccountState() ? responseJson.autoCloseAlert_Live : responseJson.autoCloseAlert;
					this.setState({
						autoCloseAlertIsOn: autoCloseAlert,
						dataSource: ds.cloneWithRows(listRawData),
					});
				}.bind(this),
				function(result) {
					Alert.alert('提示', result.errorMessage);
				}
			)
		}
	},

	changeAutoCloseAlertSetting: function(value){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if (notLogin) {
		}else{
			var url = LogicData.getAccountState() ? NetConstants.CFD_API.AUTO_CLOSE_ALERT_LIVE_API : NetConstants.CFD_API.AUTO_CLOSE_ALERT_API
			url = url.replace(/<setting>/, value)

			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'POST',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
				},
				function(responseJson) {
					//Do nothing?
				}.bind(this),
				function(result) {
					Alert.alert('提示', result.errorMessage);
				}
			)
		}
	},

	onSwitchPressed: function(value, rowData) {
		if(rowData.subtype === 'closepositionpush'){
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				autoCloseAlertIsOn: value
			})

			this.changeAutoCloseAlertSetting(value);
		}
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		var marginLeft = 0
		//if (rowID > 1 && rowID < 3){
		//	marginLeft = 15
		//}
		return (
			<View style={styles.line} key={rowID}>
				<View style={[styles.separator, {marginLeft: marginLeft}]}/>
			</View>
			)
	},

	renderRow: function(rowData, sectionID, rowID) {
		if (rowData.type === 'normal') {
			var switchIsOn = this.state.autoCloseAlertIsOn;
			return(
				<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
					<Text style={styles.title}>{rowData.title}</Text>
					<View style={styles.extendRight}>
						<Switch
							onValueChange={(value) => this.onSwitchPressed(value, rowData)}
							value={switchIsOn}
							onTintColor={ColorConstants.title_blue()} />
					</View>
				</View>
			);
		}else if (rowData.type === 'text'){
			return(
				<View style={styles.hintWrapper}>
						<Text style={styles.hintText}>{rowData.title}</Text>
				</View>
			);
		}
	},

	render: function() {
		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0
		if(loggined){
			return (<View style={styles.wrapper}>
				<NavBar title="推送设置" showBackButton={true} navigator={this.props.navigator}/>
				<ListView
					style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator} />
			</View>
			);
		}else{
			return (<Navigator
				style={styles.container}
				initialRoute={{name: MainPage.LOGIN_ROUTE,
					popToRoute: MainPage.ME_PUSH_CONFIG_ROUTE,
					onPopToRoute: this.loadPushConfigInfo}}
				configureScene={() => Navigator.SceneConfigs.PushFromRight}
				renderScene={this.props.routeMapper} />);
		}
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: width,
   		alignItems: 'stretch',
    	justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},

	list: {
		flex: 1,
		// borderWidth: 1,
	},
	rowWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: UIConstants.LIST_ITEM_LEFT_MARGIN,
		paddingRight: 15,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: 'white',
	},
	hintWrapper: {
		//flex: 1,
		paddingLeft: UIConstants.LIST_ITEM_LEFT_MARGIN,
		paddingTop: 12,
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	image: {
		marginLeft: -10,
		width: 40,
		height: 40,
	},
	title: {
		flex: 1,
		fontSize: 17,
		color: '#303030',
	},

	moreImage: {
		alignSelf: 'center',
		width: 7.5,
		height: 12.5,
	},

	buttonArea: {
		flex: 1,
		borderRadius: 3,
	},
	buttonView: {
		height: Math.round(44*heightRate),
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	hintText: {
		flex:1,
		fontSize: 12,
		textAlign: 'left',
		color: '#8d8d8d',
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},

	defaultText: {
		flex: 1,
		fontSize: 17,
		marginLeft: 10,
		color: '#6d6d6d',
	},
	headImage: {
		width: Math.round(62*heightRate),
		height: Math.round(62*heightRate),
	},
});


module.exports = MePushConfigPage;
