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
	ScrollView,
	Alert,
	Platform,
	StatusBar,
} from 'react-native';
var CookieManager = require('react-native-cookies')

var {EventCenter, EventConst} = require('../EventCenter')

var LogicData = require('../LogicData')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var Button = require('./component/Button')
var MainPage = require('./MainPage')
var NativeDataModule = require('../module/NativeDataModule')
var NativeSceneModule = require('../module/NativeSceneModule')
var StorageModule = require('../module/StorageModule')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var OpenAccountRoutes = require('./openAccount/OpenAccountRoutes')
var UIConstants = require('../UIConstants');
var VersionConstants = require('../VersionConstants');
var WebSocketModule = require('../module/WebSocketModule')

var {height, width} = Dimensions.get('window')
var heightRate = height/667.0

var listRawData = [{'type':'account','subtype':'accountInfo'},
// {'type':'button','title':'开设实盘账户'},
{'type':'Separator', 'height':10},
{'type':'accountState'},
{'type':'normal','title':'存取资金', 'image':require('../../images/icon_depositwithdraw.png'), 'subtype':'depositWithdraw'},
{'type':'normal','title':'我的交易金', 'image':require('../../images/icon_income.png'), 'subtype':'income'},
{'type':'normal','title':'我的卡片', 'image':require('../../images/icon_mycard.png'), 'subtype':'mycard'},
{'type':'normal','title':'帮助中心', 'image':require('../../images/icon_helpcenter.png'), 'subtype':'helpcenter'},
{'type':'normal','title':'线上咨询', 'image':require('../../images/icon_onlinehelp.png'), 'subtype':'onlinehelp'},
{'type':'normal','title':'产品反馈', 'image':require('../../images/icon_response.png'), 'subtype':'feedback'},
// {'type':'normal','title':'关于我们', 'image':require('../../images/icon_aboutus.png'), 'subtype':'aboutus'},
{'type':'normal','title':'设置', 'image':require('../../images/icon_config.png'), 'subtype':'config'},]


//0未注册 1已注册 2审核中 3审核失败
//"liveAccRejReason": "实盘注册申请信息未达到欧盟金融工具市场法规(MiFID)的要求" //审核失败原因
var accountInfoData = [
	{title:'开通实盘账户',color:ColorConstants.TITLE_BLUE},//0未注册
	{title:'登入实盘账户',color:ColorConstants.TITLE_BLUE},//1已注册
	{title:'实盘开户审核中...',color:'#757575'},//2审核中
	{title:'重新开户',color:ColorConstants.TITLE_BLUE},//3审核失败
	{title:'继续开户',color:ColorConstants.TITLE_BLUE},//0－未注册情况下 获取本地Step 如2/5
]

var OpenAccountInfos = [
	 "",
	 "设置账户信息(1/5)",
	 "上传身份证照片(2/5)",
	 "完善个人信息(3/5)",
	 "完善财务信息(4/5)",
	 "提交申请(5/5)",
]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var didTabSelectSubscription = null
var didAccountStateChangeSubscription = null
var didLoginSubscription = null;
var didLogoutSubscription = null;
var accStatus
var LIST_SCROLL_VIEW = "listScrollView"

var MePage = React.createClass({
	getInitialState: function() {
		return {
			loggedIn: false,
			hasUnreadMessage: false,
			dataSource: ds.cloneWithRows(listRawData),
			lastStep:0,
		};
	},

	componentWillMount: function(){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			//If previously logged in, fetch me data from server.
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_USER_INFO_API,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
					cache: 'offline',
				},
				function(responseJson) {
					StorageModule.setMeData(JSON.stringify(responseJson))
					LogicData.setMeData(responseJson);

					this.reloadMeData();
				}.bind(this),
				(result) => {
					this.reloadMeDataFromStorage();
				}
			)
		}else{
			this.reloadMeDataFromStorage();
		}
	},

	componentDidMount: function(){
		didTabSelectSubscription = EventCenter.getEventEmitter().
			addListener(EventConst.ME_TAB_PRESS_EVENT, this.onTabChanged);
		didAccountStateChangeSubscription = EventCenter.getEventEmitter().
			addListener(EventConst.ACCOUNT_STATE_CHANGE, ()=>this.reloadMeData());
		didLoginSubscription = EventCenter.getEventEmitter().
			addListener(EventConst.ACCOUNT_LOGIN, ()=>this.reloadMeData());
		didLogoutSubscription = EventCenter.getEventEmitter().
			addListener(EventConst.ACCOUNT_LOGOUT, ()=>this.reloadMeData());
	},

	componentWillUnmount: function() {
		didTabSelectSubscription && didTabSelectSubscription.remove();
		didAccountStateChangeSubscription && didAccountStateChangeSubscription.remove();
		didLoginSubscription && didLoginSubscription.remove();
		didLogoutSubscription && didLogoutSubscription.remove();
	},

	reloadMeDataFromStorage: function(){
		StorageModule.loadMeData()
		.then(function(value) {
			if (value) {
				LogicData.setMeData(JSON.parse(value))
				this.reloadMeData();
			}
		}.bind(this));
	},

	onTabChanged: function(){
		LogicData.setTabIndex(MainPage.ME_PAGE_TAB_INDEX);
		WebSocketModule.registerInterestedStocks(null);
		this.reloadMeData();
	},

	reloadMeData: function(){
		if(LogicData.getTabIndex() == MainPage.ME_PAGE_TAB_INDEX){
			//Check if the user has logged in and the config row need to be shown.
			if(this.refs[LIST_SCROLL_VIEW]){
				this.refs[LIST_SCROLL_VIEW].scrollTo({x:0, y:0, animated:false});
			}

			var userData = LogicData.getUserData();
			var meData = LogicData.getMeData();
			var notLogin = Object.keys(meData).length === 0
			if (notLogin) {
				this.setState({
					loggedIn: false,
				})
			}else{
				if(meData.picUrl !== undefined){
					NativeDataModule.passRawDataToNative('myLogo', meData.picUrl)
				}
				this.setState({
					loggedIn: true,
				})

				if(meData.liveAccStatus == 0 || meData.liveAccStatus == 3){
					OpenAccountRoutes.getLatestInputStep()
					.then(step=>{
						console.log("getLatestInputStep " + step)
						this.setState(
							{
								lastStep: step,
							}
						)
					});
				}

				var url = NetConstants.CFD_API.GET_UNREAD_MESSAGE;
		    if(LogicData.getAccountState()){
					url = NetConstants.CFD_API.GET_UNREAD_MESSAGE_LIVE
					console.log('live', url );
				}

				NetworkModule.fetchTHUrl(
					url,
					{
						method: 'GET',
						headers: {
							'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						},
						//cache: 'offline',
					},
					function(response) {
						this.setState(
							{
								hasUnreadMessage: response > 0,
							}
						)
					}.bind(this),
					(result) => {
						console.log(result.errorMessage)
					}
				);

				NetworkModule.fetchTHUrl(
					NetConstants.CFD_API.GET_USER_INFO_API,
					{
						method: 'GET',
						headers: {
							'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						},
						cache: 'offline',
					},
					function(responseJson) {
						StorageModule.setMeData(JSON.stringify(responseJson))
						LogicData.setMeData(responseJson);
						NativeDataModule.passRawDataToNative('userName', responseJson.liveUsername)
						NativeDataModule.passRawDataToNative('userEmail', responseJson.liveEmail)
						if (Platform.OS === 'ios') {
							this.setCookie();
						}
						console.log("about cookie " + "userName = " + responseJson.liveUsername + " && userEmail = " + responseJson.liveEmail);
					}.bind(this)
				)
			}

			var datasource = ds.cloneWithRows(listRawData);
			this.setState({
				dataSource: datasource,
			})
		}
	},

	gotoOpenAccount: function() {
		this.props.navigator.push({
			name: MainPage.LOGIN_ROUTE,
		});
	},

	gotoLogin: function(){
		this.props.navigator.push({
			name: MainPage.LOGIN_ROUTE,
			popToRoute: MainPage.ME_ROUTE,	//Set to destination page
			//onPopToRoute: this.reloadMeData,
		});
	},

	gotoUserInfoPage: function() {
		//TODO: Use real page.
		this.props.navigator.push({
			name: MainPage.ACCOUNT_INFO_ROUTE,
			//backButtonOnClick: this.reloadMeData,
			//popToRoute: MainPage.ME_PUSH_CONFIG_ROUTE,	//Set to destination page
		});
	},

	gotoOpenLiveAccount:function(){
		var meData = LogicData.getMeData();
	  console.log("showOARoute medata: " + JSON.stringify(meData));

		var OARoute = {
			name: MainPage.OPEN_ACCOUNT_ROUTE,
			step: this.state.lastStep,
			onPop: this.reloadMeData,
		};

	  if(!meData.phone){
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
				nextRoute: OARoute,
				isMobileBinding: true,
			});
		}else{
				this.props.navigator.push(OARoute);
		}
	},

	setCookie:function(){

		var meData = LogicData.getMeData();

		if(meData ==undefined || meData.liveUsername==undefined || meData.liveEmail==undefined){
			return;
		}



			CookieManager.set({
			  name: 'username',
			  value: meData.liveUsername,
			  domain: 'cn.tradehero.mobi',
			  origin: 'cn.tradehero.mobi',
			  path: '/',
			  version: '1',
			  expiration: '2029-05-30T12:30:00.00-05:00'
			}, (err, res) => {
			  console.log('cookie set username!');
			  console.log(err);
			  console.log(res);
			});

			CookieManager.set({
				  name: 'email',
				  value: meData.liveEmail,
				  domain: 'cn.tradehero.mobi',
				  origin: 'cn.tradehero.mobi',
				  path: '/',
				  version: '1',
				  expiration: '2029-05-30T12:30:00.00-05:00'
				}, (err, res) => {
				  console.log('cookie set email!');
				  console.log(err);
				  console.log(res);
				});
	},

	onWebViewNavigationStateChange: function(navState, doNotPopWhenFinished, onSuccess) {
		// todo
		console.log("my web view state changed: "+navState.url)

		CookieManager.get('http://cn.tradehero.mobi', (err, res) => {
  			console.log('about cookie 2', res);
		})

		// console.log('about cookie 3',navState.url)

		if(navState.url.indexOf('live/loginload')>0){
			console.log('success login ok');
			MainPage.ayondoLoginResult(true, doNotPopWhenFinished);

			if(onSuccess){
				onSuccess();
			}
		}else if(navState.url.indexOf('live/oauth/error')>0){
			console.log('success login error');
			MainPage.ayondoLoginResult(false, doNotPopWhenFinished)
		}
	},

	////0未注册 1已注册 2审核中 3审核失败
	gotoAccountStateExce:function(){
		if(accStatus == 0){
			this.gotoOpenLiveAccount();
		}else if(accStatus == 1){//已注册，去登录
			this.gotoLiveLogin(false, ()=>this.forceUpdate());
		}else if(accStatus == 2){
			console.log('审核中...');
		}else if(accStatus == 3){
			this.gotoOpenLiveAccount();
		}else{

		}
	},

	gotoLiveLogin: function(doNotPopWhenFinished, onSuccess){
		var userData = LogicData.getUserData()
		var userId = userData.userId
		if (userId == undefined) {
			userId = 0
		}
		console.log("gotoAccountStateExce userId = " + userId);
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			title:'实盘交易',
			themeColor: ColorConstants.TITLE_BLUE_LIVE,
			onNavigationStateChange: (navState)=>{
				this.onWebViewNavigationStateChange(navState, doNotPopWhenFinished, onSuccess)
			},
			url:'https://tradehub.net/live/auth?response_type=token&client_id=62d275a211&redirect_uri=https://api.typhoontechnology.hk/api/live/oauth&state='+userId
			// url:'http://cn.tradehero.mobi/tradehub/login.html'
			// url:'http://www.baidu.com'
			// url:'https://tradehub.net/demo/auth?response_type=token&client_id=62d275a211&redirect_uri=https://api.typhoontechnology.hk/api/demo/oauth&state='+userId
			// url:'https://www.tradehub.net/live/yuefei-beta/login.html',
			// url:'https://www.tradehub.net/demo/ff-beta/tradehero-login-debug.html',
			// url:'http://cn.tradehero.mobi/TH_CFD_WEB/bangdan1.html',
		});
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

	goToMailPage: function(){
		this.props.navigator.push({
			name: MainPage.MY_MESSAGES_ROUTE,
			onPopToRoute: this.reloadMeData,
		});
	},

	onSelectNormalRow: function(rowData) {
		if(rowData.subtype === 'depositWithdraw'){
			console.log("LogicData.getActualLogin() " + LogicData.getActualLogin())
			if(LogicData.getActualLogin()){
				this.props.navigator.push({
					name: MainPage.DEPOSIT_WITHDRAW_ROUTE,
					onPopToOutsidePage: this.reloadMeData,
				});
			}else{
				this.gotoLiveLogin(true,
					()=>{
					this.props.navigator.replace({
						name: MainPage.DEPOSIT_WITHDRAW_ROUTE,
						onPopToOutsidePage: this.reloadMeData,
					});
				});
			}
		}else if(rowData.subtype === 'income'){
			var userData = LogicData.getUserData()
			var notLogin = Object.keys(userData).length === 0
			if(!notLogin){
				this.props.navigator.push({
					name: MainPage.MY_INCOME_ROUTE,
				})
			}else{
				this.props.navigator.push({
					name: MainPage.LOGIN_ROUTE,
					nextRoute: {
						name: MainPage.MY_INCOME_ROUTE,
					},
				});
			}
		}
		else if(rowData.subtype === 'mycard'){
			this.props.navigator.push({
				name:MainPage.MY_CARD_ROUTE,
			})
		}
		else if(rowData.subtype === 'helpcenter') {
			var qaUrl = LogicData.getAccountState()? NetConstants.TRADEHERO_API.HELP_CENTER_URL_ACTUAL:NetConstants.TRADEHERO_API.HELP_CENTER_URL;
			qaUrl = qaUrl.replace('<version>', VersionConstants.WEBVIEW_QA_VERSION);
			this.gotoWebviewPage(qaUrl, '帮助中心', true);
		}
		else if(rowData.subtype === 'onlinehelp') {
			NativeSceneModule.launchNativeScene('MeiQia')
		}
		else if(rowData.subtype === 'aboutus') {
			var aboutUrl = LogicData.getAccountState()?NetConstants.TRADEHERO_API.WEBVIEW_URL_ABOUT_US_ACTUAL:NetConstants.TRADEHERO_API.WEBVIEW_URL_ABOUT_US
			this.gotoWebviewPage(aboutUrl, '关于我们');
		}
		else if(rowData.subtype === 'config') {
			this.props.navigator.push({
				name: MainPage.ME_CONFIG_ROUTE,
				onPopBack: this.reloadMeData
			});
		}
		else if(rowData.subtype === 'feedback') {
			var meData = LogicData.getMeData();
			this.props.navigator.push({
				name: MainPage.FEEDBACK_ROUTE,
				phone: meData.phone,
			});
			// LogicData.setAccountState(false)
		}
		else if(rowData.subtype === 'accountInfo') {
			this.gotoUserInfoPage()
		}
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		var marginLeft = 0
		if (rowID > 1 && rowID < 6){
			marginLeft = 15
		}
		return (
			<View style={styles.line} key={rowID}>
				<View style={[styles.separator, {marginLeft: marginLeft}]}/>
			</View>
			)
	},

	renderUserNameView: function(){
		var meData = LogicData.getMeData();
		if(meData.phone){
			return (
				<View style={[styles.userInfoWrapper]}>
					<Text style={styles.userNameText}>{meData.nickname}</Text>
					<Text style={styles.phoneText}>{"账号: " + meData.phone}</Text>
				</View>
			);
		}
		else{
			return(
				<View style={[styles.userInfoWrapper]}>
					<Text style={styles.userNameText}>{meData.nickname}</Text>
				</View>
			)
		}
	},

	renderUserPortraitView: function(){
		var meData = LogicData.getMeData();
		if(meData.picUrl){
			return (
				<Image source={{uri: meData.picUrl}} style={styles.headImage}
				defaultSource={require('../../images/head_portrait.png')}/>
			);
		}else{
			return (
				<Image source={require('../../images/head_portrait.png')} style={styles.headImage} />
			);
		}
	},

	renderUserInfoView: function(){
		return(
			<TouchableOpacity activeOpacity={0.5} onPress={()=>this.gotoUserInfoPage()}>
				<View style={[styles.rowWrapper, {height:Math.round(88*heightRate)}]}>
					{this.renderUserPortraitView()}
					{this.renderUserNameView()}
					<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
				</View>
			</TouchableOpacity>
		);
	},

	renderAccountStateView: function(){
		var meData = LogicData.getMeData();
		console.log('提示：','liveAccStatus = '+meData.liveAccStatus + ', liveAccRejReason = '+ meData.liveAccRejReason)
	  accStatus = meData.liveAccStatus;
		//accStatus = 1
		var strStatus = '';
		var colorStatus = ColorConstants.TITLE_BLUE

		if(accStatus!==undefined && accStatus<accountInfoData.length){
			strStatus = accountInfoData[accStatus].title;
			colorStatus = accountInfoData[accStatus].color;

			if(accStatus == 0 && this.state.lastStep > 0 ){
				//未注册 显示最后的Step
				strStatus = '继续开户:' + OpenAccountInfos[this.state.lastStep]
			}

			return(
				<TouchableOpacity activeOpacity={0.5} onPress={()=>this.gotoAccountStateExce()}>
					<View style={styles.accoutStateLine}>
							<View style={[styles.accoutStateButton,{backgroundColor:colorStatus}]}>
								<Text style={styles.accountStateInfo}>{strStatus}</Text>
						  </View>
					</View>
				</TouchableOpacity>
			)
		}else{
			return(
				null
			)
		}


	},

	renderRowRight: function(rowData){
		if(rowData.subtype === "depositWithdraw"){
			var hasError = LogicData.getMeData().bankCardStatus === "Rejected";
			if(hasError){
				return (
					<View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
						<Image source={require('../../images/icon_new.png')} style={styles.newEventImage}/>
						<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
					</View>
				);
			}
		}
		return (
			<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
		);
	},

	renderRow: function(rowData, sectionID, rowID) {
		if (rowData.type === 'normal') {
			if((rowData.subtype === 'config' || rowData.subtype === 'mycard') && !this.state.loggedIn){
				return (
					null
				);
			}
			else if((rowData.subtype === 'depositWithdraw') && !LogicData.getAccountState()){
				return (
					null
				);
			}
			else{
				return(
					<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
						<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
							<Image source={rowData.image} style={styles.image} />
							<Text style={styles.title}>{rowData.title}</Text>
							{this.renderRowRight(rowData)}
						</View>
					</TouchableOpacity>
				)
			}
		}
		else if (rowData.type === 'button'){
			return(
				<View style={[styles.rowWrapper, {height:Math.round(68*heightRate)}]}>
					<Button style={styles.buttonArea}
						enabled={true}
						onPress={this.gotoOpenAccount}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text= {rowData.title}/>
				</View>
			)
		}
		else if (rowData.type === 'account'){
			// account
			if(this.state.loggedIn){
				return this.renderUserInfoView();
			}else{
				return(
					<TouchableOpacity activeOpacity={0.5} onPress={()=>this.gotoLogin()}>
						<View style={[styles.rowWrapper, {height:Math.round(88*heightRate)}]}>
							<Image source={require('../../images/head_portrait.png')} style={styles.headImage} />
							<Text style={styles.defaultText}>手机号/微信号登录</Text>
							<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
						</View>
					</TouchableOpacity>
				)
			}
		}
		else if(rowData.type === 'accountState'){
				if(this.state.loggedIn && (!LogicData.getAccountState())){
					return this.renderAccountStateView()
				}else{
					return (
						null
					)
				}
		}
		else {
			// separator
			if(!LogicData.getAccountState() && this.state.loggedIn){
				return (
					null
				)
			}else{
				return (
				<View style={[styles.line, {height:rowData.height}]}>
					<View style={[styles.separator, {height:rowData.height}]}/>
				</View>
					)
			}
		}
	},

	renderNavBar: function(){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			var image;
			console.log("this.state.hasUnreadMessage: " + this.state.hasUnreadMessage)
			if(this.state.hasUnreadMessage){
				image = require('../../images/icon_my_messages_new.png');
			}else{
				image = require('../../images/icon_my_message.png');
			}
			return(
				<NavBar title="我的" imageOnRight={image}
					rightImageOnClick={this.goToMailPage}
					navigator={this.props.navigator}/>
			)
		}else{
			return(
				<NavBar title="我的"
					navigator={this.props.navigator}/>
			);
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
		//Do not use List view with image inside under RN 0.33
		//since there's a serious bug that the portrait won't update if user changes.
		/*
		<ListView
			ref={(scrollView) => { this._scrollView = scrollView; }}
			style={styles.list}
			dataSource={this.state.dataSource}
			renderRow={this.renderRow}
			renderSeparator={this.renderSeparator} />
		*/
		return (
			<View style={styles.wrapper}>
				<StatusBar barStyle="light-content" backgroundColor={ColorConstants.TITLE_BLUE}/>
				{this.renderNavBar()}
				<ScrollView ref={LIST_SCROLL_VIEW}>
					{this.renderListView()}
				</ScrollView>
				<View style={{width:width,height:UIConstants.TAB_BAR_HEIGHT}}></View>
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
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: 'white',
	},
	userInfoWrapper: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: 'white',
		alignItems: 'flex-start',
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
		marginLeft: 10,
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

	defaultText: {
		flex: 1,
		fontSize: 17,
		marginLeft: 10,
		color: '#6d6d6d',
	},

	userNameText: {
		textAlign: 'left',
		fontSize: 17,
		marginLeft: 10,
		color: '#303030',
	},

	phoneText: {

		textAlign: 'left',
		fontSize: 17,
		marginLeft: 10,
		marginTop: 9,
		color: '#757575',
	},

	headImage: {
		width: Math.round(62*heightRate),
		height: Math.round(62*heightRate),
		borderRadius: Math.round(31*heightRate),
	},

	accoutStateLine:{
		flex:1,
		height:Math.round(60*heightRate),
		alignItems:'center',
		justifyContent: 'center',
	},


	accoutStateButton:{
		width:width - 10 *2,
		height:40*heightRate,
		backgroundColor:ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
		alignItems:'center',
		borderRadius: 4,
	},

	accountStateInfo:{
		fontSize:16,
		color:'white',
	},

	newEventImage:{
    width: 6,
    height: 6,
		marginRight: 8,
  },
});


module.exports = MePage;
