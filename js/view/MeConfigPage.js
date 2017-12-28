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
var VersionControlModule = require('../module/VersionControlModule')
var LS = require('../LS')
var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var listRawData = [
{'type':'normal','title':'TGM', 'subtype': 'promotionCode'},
{'type':'normal','title':'YHXY', 'subtype': 'protocol'},
{'type':'normal','title':'SZ', 'subtype': 'pushconfig'},
{'type':'normal','title':'ZHBD', 'subtype': 'accountbinding'},
{'type':'normal','title':'QHDMNJY', 'subtype': 'change2Simulator'},
{'type':'normal','title':'DCSPZH', 'subtype': 'logoutAccountActual'},
{'type':'normal','title':'XGSPDLMM', 'subtype': 'modifyLoginActualPwd'},
{'type':'normal','title':'TCYJYZH', 'subtype': 'logout'},
{'type':'normal','title':'YYQH', 'subtype': 'language'},
{'type':'normal','title':'BBH', 'subtype': 'version'},
]

if (Platform.OS === 'ios') {
	listRawData.pop()
}

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var {EventCenter, EventConst} = require("../EventCenter");
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
			promotionCode: null,
		};
	},

	componentWillMount: function(){
		//TODO: use real API.
		this.refreshData();
		this.setState({
			languageSetting: LogicData.getLanguageEn()=='1'?'Change to Chinese':'切换成英文'
		})
	},

	refreshData: function(){
		var meData = LogicData.getMeData();
		var notLogin = Object.keys(meData).length === 0

    meData = LogicData.getMeData()
		if (!notLogin && meData.promotionCode){
			this.setState({
				promotionCode: meData.promotionCode,
			})
		}
	},

	gotoWebviewPage: function(targetUrl, title, hideNavBar) {
		var userData = LogicData.getUserData()
		var userId = userData.userId
		if (userId == undefined) {
			userId = 0
		}

		if (targetUrl.indexOf('?') !== -1) {
			targetUrl = targetUrl + '&userId=' + userId
		} else {
			targetUrl = targetUrl + '?userId=' + userId
		}

		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: targetUrl,
			title: title,
			isShowNav: hideNavBar ? false : true,
		});
	},

	onSelectNormalRow: function(rowData) {
		//todo
		if(rowData.subtype === 'promotionCode'){
			var meData = LogicData.getMeData();
			console.log(JSON.stringify(meData));
			if(meData.phone){
				this.props.navigator.push({
					name: MainPage.PROMOTION_CODE_PAGE_ROUTE,
					onPop: this.refreshData
				});
			}else{
				this.props.navigator.push({
					name: MainPage.LOGIN_ROUTE,
					isMobileBinding: true,
					getNextRoute: ()=>{
						return {
							name: MainPage.PROMOTION_CODE_PAGE_ROUTE,
							onPop: this.refreshData
						}
					}
				});
			}
		}
		if(rowData.subtype === 'protocol'){
			var protocolUrl = LogicData.getAccountState()?NetConstants.TRADEHERO_API.WEBVIEW_SIGNTERMS_PAGE_ACTUAL:NetConstants.TRADEHERO_API.WEBVIEW_SIGNTERMS_PAGE
			this.gotoWebviewPage(protocolUrl, '用户协议',true);
		}else if(rowData.subtype === 'pushconfig') {
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
			LS.str("TS"),
			LS.str("CONFIG_CHANGE_EMAIL_ALERT").replace("{1}", meData.liveEmail),
				[
					{text: LS.str("QX")},
					{text: LS.str("CONFIG_SEND"), onPress: () => this.sendEmailForModifyPwd()},
				]
			)
	},

	sendEmailForModifyPwd:function(){
		var userData = LogicData.getUserData()

		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.RESET_PASSWORD,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			function(responseJson) {
			 console.log('忘记密码。。。邮件发送成功');
			 Toast.show(LS.str("CONFIG_SEND_SUCCESS"));
			}.bind(this),
			function(result) {
				console.log('登出失败 1');
			}.bind(this),
			function(result) {
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
			VersionControlModule.gotoDownloadPage();
		}

	},

	logoutAccountActualAlert:function(){
		Alert.alert(
			LS.str("TS"),
			LS.str("CONFIG_LOGOUT_LIVE"),
				[
					{text: LS.str("QX")},
					{text: LS.str("QD"), onPress: () => this.logoutAccountActual()},
				]
			)
	},

	change2ActualOrSimu:function() {
		Alert.alert(
			LS.str("TS"),
			LS.str("CONFIG_GO_TO_DEMO"),
				[
					{text: LS.str("QX")},
					{text: LS.str("QD"), onPress: () => this.logout2Simulator()},
				]
			)
	},

	logout: function(){
		//TODO
		Alert.alert(
			LS.str("TS"),
			LS.str("CONFIG_LOGOUT_ACCOUNT"),
				[
					{text: LS.str("QX")},
					{text: LS.str("QD"), onPress: () => this.sendToSwitchAccountDemo()},
				]
			)
	},

	logoutAccountActual:function(){
		var userData = LogicData.getUserData()

		NetworkModule.fetchTHUrl(
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
			function(result) {
				this.logoutAccountActualNative()
				console.log('登出失败 1');
			}.bind(this),
			function(result) {
			  this.logoutAccountActualNative()
				console.log('登出失败 2');
			}.bind(this)
		)
	},

	logoutAccountActualNative(){
		LogicData.setActualLogin(false);
		// if(this.props.onPopBack){
		//  this.props.onPopBack();
		// }
		this.props.navigator.pop();
	},

	logout2Simulator: function(){
		LogicData.setAccountState(false)
		this.props.navigator.pop();
		// if(this.props.onPopBack){
		// 	this.props.onPopBack();
		// }
		MainPage.refreshMainPage()
	},

	logoutCurrentAccount: function(){
		LocalDataUpdateModule.removeUserData();

		this.props.navigator.pop();
		// if(this.props.onPopBack){
		// 	this.props.onPopBack();
		// }
	},

	sendToSwitchAccountDemo:function(){
		var userData = LogicData.getUserData()
		var urlToSend = NetConstants.CFD_API.SWITCH_TO_DEMO;
		console.log('sendToSwitchAccountStatus url = ' + urlToSend);
		NetworkModule.fetchTHUrl(
			urlToSend,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			(responseJson) =>{
				 console.log(responseJson)
				 this.logoutCurrentAccount();
			},
			(result) => {
				console.log(result.errorMessage)
			}
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

	languageChange: function(){
		LogicData.setLanguageEn(LogicData.getLanguageEn()=='0'?'1':'0');
		this.setState({
			languageSetting: LogicData.getLanguageEn()=='1'?'Change to Chinese':'切换成英文'
		},console.log('languageEN:'+LogicData.getLanguageEn()))
		EventCenter.emitLanguageChangedEvent();

		this.postLanguageSetting();
	},

	postLanguageSetting: function(){
		var userData = LogicData.getUserData();
		var notLogin = Object.keys(userData).length === 0;
		if (!notLogin) {
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.POST_USER_LANGUAGE,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8',
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
					body: JSON.stringify({
						language: LogicData.getLanguageEn()=="1"?'en':'cn',
					}),
				},
				(responseJson) => {
					if (responseJson.message){

					}else{

					}
				},
				(result) => {

				})
		}
	},



	renderRow: function(rowData, sectionID, rowID) {
		var meData = LogicData.getMeData();

		var notLogin = Object.keys(meData).length === 0
		if(notLogin && rowData.subtype !== 'protocol' && rowData.subtype !== 'language' ){
			return(
				null
			)
		}else if(!LogicData.getAccountState() &&
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
			 		 <Text style={styles.title}>{LS.str(rowData.title)}</Text>
					 {this.renderVersion()}
			 	 </View>
			  </TouchableOpacity>
			 )
		 } else if (rowData.subtype === 'promotionCode' && this.state.promotionCode){
			 return(
				<TouchableOpacity activeOpacity={0.5}>
				 	<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
					 	<Text style={styles.title}>{LS.str(rowData.title)}</Text>
					 	<Text style={styles.contentValue}>{this.state.promotionCode}</Text>
			 		</View>
				</TouchableOpacity>
		 		);
		 } else if (rowData.subtype === 'language'){
			 return(
				<TouchableOpacity activeOpacity={0.5} onPress={()=>this.languageChange()}>
				 	<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
					 	<Text style={styles.title}>{this.state.languageSetting}</Text>
						<View style={[styles.rightContent,{width:150,justifyContent:'flex-end'}]}>
							{/* <Text style={styles.contentValue}>中文</Text> */}
		 					<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
						</View>
			 		</View>
				</TouchableOpacity>
		 		);
		 } else{
			 var visable = rowData.subtype === 'accountbinding'&&meData.phone==null ? 1.0:0;
			 return(
	 			<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
	 				<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
	 					<Text style={styles.title}>{LS.str(rowData.title)}</Text>
						<View style={styles.rightContent}>
							<Text style={[styles.circle,{opacity:visable}]}>●</Text>
		 					<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
						</View>
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

	circle: {
		flex: 1,
		fontSize: 8,
		color: '#e30e20',
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
	rightContent:{
		flexDirection:'row',
		width:20,
	},
});


module.exports = MeConfigPage;
