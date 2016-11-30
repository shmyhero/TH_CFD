'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Text,
	Image,
	TouchableOpacity,
	Alert,
	ScrollView,
	Linking,
	Platform,
} from 'react-native'
import {
	packageVersion,
} from 'react-native-update';

var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var Button = require('./component/Button')
var MainPage = require('./MainPage')
var LocalDataUpdateModule = require('../module/LocalDataUpdateModule')
var UIConstants = require('../UIConstants')
var LogicData = require('../LogicData')
var NetworkModule = require('../module/NetworkModule')
var NetConstants = require('../NetConstants')
var Toast = require('./component/toast/Toast');

var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var listRawData = [
{'type':'normal','title':'推送设置', 'subtype': 'pushconfig'},
{'type':'normal','title':'账号绑定', 'subtype': 'accountbinding'},
{'type':'normal','title':'推荐给好友', 'subtype': 'share'},
{'type':'normal','title':'切换到模拟交易', 'subtype': 'change2Simulator'},
{'type':'normal','title':'登出实盘账号', 'subtype': 'logoutAccountActual'},
{'type':'normal','title':'修改实盘登录密码', 'subtype': 'modifyLoginActualPwd'},
{'type':'normal','title':'退出盈交易账号', 'subtype': 'logout'},
{'type':'normal','title':'版本号', 'subtype': 'version'},
]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var MeConfigPage = React.createClass({

	propTypes: {
		onPopBack: React.PropTypes.func,
	},

	getDefaultProps: function(){
		return {
				onPopBack: ()=>{}
		};
	},

	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(listRawData),
			currentVersionCode: LogicData.getCurrentVersionCode(),
			onlineVersionCode: LogicData.getOnlineVersionCode(),
			onlineVersionName: LogicData.getOnlineVersionName(),
		};
	},

	onSelectNormalRow: function(rowData) {
		//todo
		if(rowData.subtype === 'pushconfig') {
			this.props.navigator.push({
				name: MainPage.ME_PUSH_CONFIG_ROUTE,
			});
		}else if(rowData.subtype === 'accountbinding') {
			this.props.navigator.push({
				name: MainPage.ME_ACCOUNT_BINDING_ROUTE,
			});
		}else if(rowData.subtype === 'share'){
			this.shareApp();
		}else if(rowData.subtype === 'logout'){
			this.logout();
		}else if(rowData.subtype === 'change2Simulator'){
			this.change2ActualOrSimu();
		}else if(rowData.subtype === 'logoutAccountActual'){
			this.logoutAccountActualAlert();
		}else if(rowData.subtype === 'modifyLoginActualPwd'){
			// this.props.navigator.push({
			// 	name: MainPage.ME_CONFIG_MODIFY_PWD_ROUTE,
			// });
			this.askForSendEmailToModifyPwd();
		}else if(rowData.subtype === 'version'){
			this.upgradeAppVersion();
		}
	},

	askForSendEmailToModifyPwd:function(){

		var meData = LogicData.getMeData();

		Alert.alert(
			"提示",
			"是否需要发送修改密码邮件到您的邮箱"+meData.liveEmail+"?",
				[
					{text: '取消'},
					{text: '发送', onPress: () => this.sendEmailForModifyPwd()},
				]
			)
	},

	sendEmailForModifyPwd:function(){
		var userData = LogicData.getUserData()

		NetworkModule.fetchTHUrlWithNoInternetCallback(
			NetConstants.CFD_API.RESET_PASSWORD,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			function(responseJson) {
			 console.log('忘记密码。。。邮件发送成功');
			 Toast.show("邮件发送成功");
			}.bind(this),
			function(errorMessage) {
				console.log('登出失败 1');
			}.bind(this),
			function(errorMessage) {
				console.log('登出失败 2');
			}.bind(this)
		)
	},

	shareApp:function(){
		var url = NetConstants.TRADEHERO_API.SHARE_DOWNLOAD_URL;
		MainPage.showSharePage({
			title: "盈交易-ayondo亚洲中文交易平台",
			circleTitle: "盈交易-ayondo亚洲中文交易平台，提供实时免费的全球行情系统",
      description: "提供实时免费的全球行情系统，您可做多做空全球的美股、指数、外汇、商品等。",
      webpageUrl: url,
      imageUrl: NetConstants.TRADEHERO_API.SHARE_LOGO_URL,
		});
	},

	upgradeAppVersion: function(){
		if(this.state.onlineVersionCode > this.state.currentVersionCode){
			var url = null;
			if(Platform.OS === 'android'){
				url = 'market://details?id=com.tradehero.cfd';
			}
			else if(Platform.OS === 'ios'){
				//TODO: add iOS download page here.
			}
			if(url){
				Linking.openURL(url)
			}
		}

	},

	logoutAccountActualAlert:function(){
		Alert.alert(
			"提示",
			"确认登出实盘账号？",
				[
					{text: '取消'},
					{text: '确定', onPress: () => this.logoutAccountActual()},
				]
			)
	},

	change2ActualOrSimu:function() {
		Alert.alert(
			"提示",
			"确认切换到模拟账号？",
				[
					{text: '取消'},
					{text: '确定', onPress: () => this.logout2Simulator()},
				]
			)
	},

	logout: function(){
		//TODO
		Alert.alert(
			"提示",
			"是否确认退出？",
				[
					{text: '取消'},
					{text: '确定', onPress: () => this.logoutCurrentAccount()},
				]
			)
	},

	logoutAccountActual:function(){
		var userData = LogicData.getUserData()

		NetworkModule.fetchTHUrlWithNoInternetCallback(
			NetConstants.CFD_API.USER_ACTUAL_LOGOUT,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			function(responseJson) {
			 this.logoutAccountActualNative()
			 console.log('登出成功。。。');
			}.bind(this),
			function(errorMessage) {
				this.logoutAccountActualNative()
				console.log('登出失败 1');
			}.bind(this),
			function(errorMessage) {
			  this.logoutAccountActualNative()
				console.log('登出失败 2');
			}.bind(this)
		)
	},

	logoutAccountActualNative(){
		this.props.navigator.pop();
		if(this.props.onPopBack){
		 this.props.onPopBack();
		}
		LogicData.setActualLogin(false);
	},

	logout2Simulator: function(){
		this.props.navigator.pop();
		if(this.props.onPopBack){
			this.props.onPopBack();
		}
		LogicData.setAccountState(false)
		MainPage.refreshMainPage()
	},

	logoutCurrentAccount: function(){
		LocalDataUpdateModule.removeUserData();
		this.props.navigator.pop();
		if(this.props.onPopBack){
			this.props.onPopBack();
		}
		LogicData.setAccountState(false)
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

	renderVersion: function(){
		if(this.state.onlineVersionCode > this.state.currentVersionCode){
			return (
				 <Text style={[styles.contentValue, {color:ColorConstants.title_blue()}]}>更新到{this.state.onlineVersionName}版本</Text>
			)
		}else{
			return (
				 <Text style={styles.contentValue}>{packageVersion}</Text>
			)
		}
	},

	renderRow: function(rowData, sectionID, rowID) {
		if(!LogicData.getAccountState() &&
		(rowData.subtype === 'change2Simulator' ||
		 rowData.subtype === 'logoutAccountActual' ||
		 rowData.subtype === 'modifyLoginActualPwd' )){
			 return(
				 null
			 )
		 } else if(LogicData.getAccountState() && (!LogicData.getActualLogin()) && rowData.subtype === 'logoutAccountActual'){
			 	//实盘状态 实盘未登录 不显示 ‘登出实盘账号’
				return(null)
		 } else if(rowData.subtype === 'version'){
			 return(
			  <TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
			 	 <View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
			 		 <Text style={styles.title}>{rowData.title}</Text>
					 {this.renderVersion()}
			 	 </View>
			  </TouchableOpacity>
			 )
		 } else{
			 return(
	 			<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
	 				<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
	 					<Text style={styles.title}>{rowData.title}</Text>
	 					<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
	 				</View>
	 			</TouchableOpacity>
	 		)
		 }
	},

	renderListView: function(){
		var listDataView = listRawData.map((data, i)=>{
			var row = this.renderRow(data, 's1', i)
			return(
				<View key={i}>
					{row}
					{row != null ? this.renderSeparator('s1', i, false) : null}
				</View>
			);
		})

		return (
			<View>
				{listDataView}
			</View>);
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<ScrollView>
					{this.renderListView()}
				</ScrollView>
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
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
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
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
	contentValue: {
		fontSize: 17,
		marginRight: 5,
		color: '#757575',
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


module.exports = MeConfigPage;
