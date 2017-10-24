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
	Alert,
} from 'react-native';

var LogicData = require('../LogicData')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var NavBar = require('./NavBar')
var MainPage = require('./MainPage')
var UIConstants = require('../UIConstants')
var RULE_DIALOG = "ruleDialog";
var {height, width} = Dimensions.get('window')
var HeaderLineDialog2 = require('./HeaderLineDialog2')
var heightRate = height/667.0

var listRawData = [
{'type':'normal', 'title':'系统平仓提示', 'subtype': 'closepositionpush'},
{'type':'normal', 'title':'公布我的详细交易数据', 'subtype': 'showPersonalData'},
{'type':'text', 'title':'虽然全力以赴传递通知，却也不能保证。', 'subtype': 'hint'}
]

var headerDialogMessages = {
	messageTitle:'盈交易榜单功能条款和条件',
	messageLines: [
		"您的账户头寸以及在下文第2条内定义的相关榜单排名将对盈交易其他实盘用户实时开放。",
		"榜单排名是基于您最近两周所有已平仓交易的滚动平均投资回报率（“ROI”）计算得出。榜单排名每日更新一次",
		"盈交易用户可以从您的个人资料或交易账户内的公开信息中受益，并可能会根据此信息做出自行交易决策。",
		"对于任何因访问或使用我们网站和应用所包含的内容或数据（包括用户发布的交易账户或资料信息），而导致直接或间接的后果性、惩罚性、典型性的特别损失或损害，盈交易将不承担任何责任。",
		"盈交易是该服务唯一解释方，保留随时更换、修改或终止服务的权利，恕不另行通知。我们将通过更新网站或应用程序来通知您有关该服务或条款和条件的更改，您应定期查看此类更新。",
	],
	noDotLines: [
		"盈交易是该服务唯一解释方，保留随时更换、修改或终止服务的权利，恕不另行通知。我们将通过更新网站或应用程序来通知您有关该服务或条款和条件的更改，您应定期查看此类更新。",
		"盈交易为安易永投（ayondo markets Limited）旗下产品名称。安易永投（ayondo markets Limited）是在英格兰和威尔士注册的公司（注册号为03148972），并由英国金融行为监管局（FCA）授权和监管, FCA注册号为184333。"
	]
}

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
			showPersonalData: true,
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
					var showPersonalData = responseJson.showData;
					this.setState({
						autoCloseAlertIsOn: autoCloseAlert,
						showPersonalData: showPersonalData,
						dataSource: ds.cloneWithRows(listRawData),
					});


				}.bind(this),
				function(result) {
					Alert.alert('提示', result.errorMessage);
				}
			)
		}
	},

	changeShowPersonalDataSetting: function(value){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if (notLogin) {
		}else{
			var url = NetConstants.CFD_API.SHOW_USER_DATA_API

			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'POST',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=utf-8',
					},
					body: JSON.stringify({
						showData: value,
					}),
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
		}else if(rowData.subtype === 'showPersonalData'){
			if (this.state.showPersonalData == false){
				this.refs[RULE_DIALOG].show();
			}else{
				this.changeShowPersonalDataSetting(value);
			}

			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				showPersonalData: value
			});
		}
	},

	renderModal: function(){
		return (
			<HeaderLineDialog2 ref={RULE_DIALOG}
				proceedCallback={(value)=>this.changeShowPersonalDataSetting(value)}
				messageTitle={headerDialogMessages.messageTitle}
				messageLines={headerDialogMessages.messageLines}
				noDotLines={headerDialogMessages.noDotLines}/>
		)
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
			var switchIsOn = false;
			if(rowData.subtype === 'closepositionpush'){
				switchIsOn = this.state.autoCloseAlertIsOn;
			} else if(rowData.subtype === 'showPersonalData') {
				if(!LogicData.getAccountState() || MainPage.HIDE_RANKING_TAB){
					return null;
				}
				switchIsOn = this.state.showPersonalData;
			}
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
		return (<View style={styles.wrapper}>
			<NavBar title="设置" showBackButton={true} navigator={this.props.navigator}/>
			<ListView
				style={styles.list}
				dataSource={this.state.dataSource}
				renderRow={this.renderRow}
				renderSeparator={this.renderSeparator} />
			{this.renderModal()}
		</View>
		);
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
		flex: 2,
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
