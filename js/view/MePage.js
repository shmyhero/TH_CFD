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
} from 'react-native';
var CookieManager = require('react-native-cookies')

var {EventCenter, EventConst} = require('../EventCenter')
var LS = require('../LS');
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

var listRawData = [
{'type':'account','subtype':'accountInfo'},
// {'type':'button','title':'开设实盘账户'},
{'type':'Separator', 'height':10},
{'type':'accountState'},
// {'type':'normal','title':'存取资金', 'image':require('../../images/icon_depositwithdraw.png'), 'subtype':'depositWithdraw'},
// {'type':'normal','title':'邀请好友', 'image':require('../../images/icon_invite_friends.png'), 'subtype':'inviteFriends'},
// {'type':'normal','title':'我的积分', 'image':require('../../images/icon_credits.png'), 'subtype':'credits'},
// {'type':'normal','title':'我的交易金', 'image':require('../../images/icon_income.png'), 'subtype':'income'},
// {'type':'normal','title':'我的卡片', 'image':require('../../images/icon_mycard.png'), 'subtype':'mycard'},
// {'type':'normal','title':'帮助中心', 'image':require('../../images/icon_helpcenter.png'), 'subtype':'helpcenter'},
// {'type':'normal','title':'线上咨询', 'image':require('../../images/icon_onlinehelp.png'), 'subtype':'onlinehelp'},
// //{'type':'normal','title':'产品反馈', 'image':require('../../images/icon_response.png'), 'subtype':'feedback'},
// // {'type':'normal','title':'关于我们', 'image':require('../../images/icon_aboutus.png'), 'subtype':'aboutus'},
// //{'type':'normal','title':'用户协议', 'image':require('../../images/icon_protocol.png'), 'subtype':'protocol'},
// {'type':'normal','title':'MORE', 'image':require('../../images/icon_config.png'), 'subtype':'config'},

{'type':'normal','title':'CQZJ', 'image':require('../../images/icon_depositwithdraw.png'), 'subtype':'depositWithdraw'},
{'type':'normal','title':'YQHY', 'image':require('../../images/icon_invite_friends.png'), 'subtype':'inviteFriends'},
{'type':'normal','title':'WDJF', 'image':require('../../images/icon_credits.png'), 'subtype':'credits'},
{'type':'normal','title':'WDJYJ', 'image':require('../../images/icon_income.png'), 'subtype':'income'},
// {'type':'normal','title':'WDKP', 'image':require('../../images/icon_mycard.png'), 'subtype':'mycard'},
{'type':'normal','title':'BZZX', 'image':require('../../images/icon_helpcenter.png'), 'subtype':'helpcenter'},
{'type':'normal','title':'XSZX', 'image':require('../../images/icon_onlinehelp.png'), 'subtype':'onlinehelp'},
{'type':'normal','title':'MORE', 'image':require('../../images/icon_config.png'), 'subtype':'config'},
]

//0未注册 1已注册 2审核中 3审核失败
//"liveAccRejReason": "实盘注册申请信息未达到欧盟金融工具市场法规(MiFID)的要求" //审核失败原因
var accountInfoData = [
	{title:'KTSPZH',color:ColorConstants.TITLE_BLUE},//0未注册
	{title:'DLSPZH',color:ColorConstants.TITLE_BLUE},//1已注册
	{title:'SPKHSHZ',color:'#757575'},//2审核中
	{title:'CXKH',color:ColorConstants.TITLE_BLUE},//3审核失败
	{title:'JXKH',color:ColorConstants.TITLE_BLUE},//0－未注册情况下 获取本地Step 如2/5
]

var OpenAccountInfos = [
	 "",
	 "上传身份证照片",
	 "完善个人信息",
	 //"上传地址证明信息",
	 "完善财务信息",
	 "设置账户信息",
	 "提交申请",
]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var didTabSelectSubscription = null
var didAccountStateChangeSubscription = null
var didLoginSubscription = null;
var didLogoutSubscription = null;
var accStatus
var LIST_SCROLL_VIEW = "listScrollView"

class MePage extends React.Component {
    state = {
        loggedIn: false,
        dataSource: ds.cloneWithRows(listRawData),
        lastStep:0,
        unreadMessageCount: 0, 
    };

    componentWillMount() {
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
	}

    componentDidMount() {
		didTabSelectSubscription = EventCenter.getEventEmitter().
			addListener(EventConst.ME_TAB_PRESS_EVENT, this.onTabChanged);
		didAccountStateChangeSubscription = EventCenter.getEventEmitter().
			addListener(EventConst.ACCOUNT_STATE_CHANGE, ()=>this.reloadMeData());
		didLoginSubscription = EventCenter.getEventEmitter().
			addListener(EventConst.ACCOUNT_LOGIN, ()=>this.reloadMeData());
		didLogoutSubscription = EventCenter.getEventEmitter().
			addListener(EventConst.ACCOUNT_LOGOUT, ()=>this.reloadMeData());


	}

    componentWillUnmount() {
		didTabSelectSubscription && didTabSelectSubscription.remove();
		didAccountStateChangeSubscription && didAccountStateChangeSubscription.remove();
		didLoginSubscription && didLoginSubscription.remove();
		didLogoutSubscription && didLogoutSubscription.remove();
	}

    reloadMeDataFromStorage = () => {
		StorageModule.loadMeData()
		.then(function(value) {
			if (value) {
				LogicData.setMeData(JSON.parse(value))
				this.reloadMeData();
			}
		}.bind(this));
	};

    onTabChanged = () => {
		LogicData.setTabIndex(MainPage.ME_PAGE_TAB_INDEX);
		WebSocketModule.cleanRegisteredCallbacks();
		this.reloadMeData();
		this.loadUnreadMessage();
	};

    reloadMeData = () => {
		// if(LogicData.getTabIndex() == MainPage.ME_PAGE_TAB_INDEX){
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
						NativeDataModule.passRawDataToNative('Lang', LogicData.getLanguageEn() == '1'?'en':'cn')
						NativeDataModule.passRawDataToNative('AUTH_DATA', userData.userId + '_' + userData.token)
						if(responseJson.firstDayRewarded&&responseJson.firstDayRewarded==true){
							StorageModule.loadFirstDayWithDraw().then((value) => {
								if (value !== null&&value !== '2'||value==undefined) {
									console.log("meData num2="+value);
									 LogicData.setFirstDayWithDraw('1');
								}
							});
						}
						if (Platform.OS === 'ios') {
							this.setCookie();
						}
						console.log("about cookie " + "userName = " + responseJson.liveUsername + " && userEmail = " + responseJson.liveEmail + " && AUTH_DATA = " + userData.userId + '_' + userData.token);
					}.bind(this)
				)
			}

			var datasource = ds.cloneWithRows(listRawData);
			this.setState({
				dataSource: datasource,
			})
		// }
	};

    requestForFirstDayClicked = () => {
		var userData = LogicData.getUserData();
		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.GET_REWARD_FIRSTDAY_CLICKED,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
				cache: 'offline',
			},
			function(responseJson) {
			}.bind(this)
		)
	};

    gotoOpenAccount = () => {
		this.props.navigator.push({
			name: MainPage.LOGIN_ROUTE,
		});
	};

    gotoLogin = () => {
		this.props.navigator.push({
			name: MainPage.LOGIN_ROUTE,
			popToRoute: MainPage.ME_ROUTE,	//Set to destination page
			//onPopToRoute: this.reloadMeData,
		});
	};

    gotoUserInfoPage = () => {
		//TODO: Use real page.
		this.props.navigator.push({
			name: MainPage.ACCOUNT_INFO_ROUTE,
			//backButtonOnClick: this.reloadMeData,
			//popToRoute: MainPage.ME_PUSH_CONFIG_ROUTE,	//Set to destination page
		});
	};

    gotoOpenLiveAccount = () => {
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
	};

    setCookie = () => {

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

				CookieManager.set({
					  name: 'Lang',
					  value: LogicData.getLanguageEn() == '1'?'en':'cn',
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


				CookieManager.set({
				  name: 'username',
				  value: meData.liveUsername,
				  domain: 'web.typhoontechnology.hk',
				  origin: 'web.typhoontechnology.hk',
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
					  domain: 'web.typhoontechnology.hk',
					  origin: 'web.typhoontechnology.hk',
					  path: '/',
					  version: '1',
					  expiration: '2029-05-30T12:30:00.00-05:00'
					}, (err, res) => {
					  console.log('cookie set email!');
					  console.log(err);
					  console.log(res);
					});

					CookieManager.set({
						  name: 'Lang',
						  value: LogicData.getLanguageEn() == '1'?'en':'cn',
						  domain: 'web.typhoontechnology.hk',
						  origin: 'web.typhoontechnology.hk',
						  path: '/',
						  version: '1',
						  expiration: '2029-05-30T12:30:00.00-05:00'
						}, (err, res) => {
						  console.log('cookie set email!');
						  console.log(err);
						  console.log(res);
						});
	};

    ////0未注册 1已注册 2审核中 3审核失败
    gotoAccountStateExce = () => {
		if(accStatus == 0){
			this.gotoOpenLiveAccount();
		}else if(accStatus == 1){//已注册，去登录
			MainPage.gotoLiveLogin(this.props.navigator, false, ()=>this.forceUpdate());
		}else if(accStatus == 2){
			console.log('审核中...');
		}else if(accStatus == 3){
			this.gotoOpenLiveAccount();
		}else{

		}
	};

    getWebViewPageScene = (targetUrl, title, hideNavBar) => {
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

		return {
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: targetUrl,
			title: title,
			isShowNav: hideNavBar ? false : true,
		}
	};

    gotoWebviewPage = (targetUrl, title, hideNavBar) => {
		this.props.navigator.push(this.getWebViewPageScene(targetUrl, title, hideNavBar));
	};

    onSelectNormalRow = (rowData) => {
		if(rowData.subtype === 'inviteFriends'){
			var url = LogicData.getAccountState()?NetConstants.TRADEHERO_API.NEW_USER_INVITATION_ACTUAL:NetConstants.TRADEHERO_API.NEW_USER_INVITATION;
			var userData = LogicData.getUserData()
			var notLogin = Object.keys(userData).length === 0
			if(!notLogin){
				this.gotoWebviewPage(url, LS.str('YQHY'), true);
			}else{
				this.props.navigator.push({
					name: MainPage.LOGIN_ROUTE,
					getNextRoute: ()=> this.getWebViewPageScene(url,  LS.str('YQHY'), true),
				});
			}
		}else if(rowData.subtype === 'depositWithdraw'){
			console.log("LogicData.getActualLogin() " + LogicData.getActualLogin())
			if(LogicData.getActualLogin()){
				this.props.navigator.push({
					name: MainPage.DEPOSIT_WITHDRAW_ROUTE,
					onPopToOutsidePage: this.reloadMeData,
				});
				this.requestForFirstDayClicked();
			}else{
				MainPage.gotoLiveLogin(this.props.navigator, true,
					()=>{
					this.props.navigator.replace({
						name: MainPage.DEPOSIT_WITHDRAW_ROUTE,
						onPopToOutsidePage: this.reloadMeData,
					});
				});
			}
		}else if(rowData.subtype === 'credits'){
			var userData = LogicData.getUserData()
			var notLogin = Object.keys(userData).length === 0
			if(!notLogin){
				this.props.navigator.push({
					name: MainPage.MY_CREDITS_ROUTE,
				})
			}else{
				this.props.navigator.push({
					name: MainPage.LOGIN_ROUTE,
					nextRoute: {
						name: MainPage.MY_CREDITS_ROUTE,
					},
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
		}else if(rowData.subtype === 'mycard'){
			this.props.navigator.push({
				name:MainPage.MY_CARD_ROUTE,
			})
		}
		else if(rowData.subtype === 'helpcenter') {
			var qaUrl = LogicData.getAccountState()? NetConstants.TRADEHERO_API.HELP_CENTER_URL_ACTUAL:NetConstants.TRADEHERO_API.HELP_CENTER_URL;
			qaUrl = qaUrl.replace('<version>', VersionConstants.WEBVIEW_QA_VERSION);
			this.gotoWebviewPage(qaUrl, LS.str("BZZX"), true);
		}
		else if(rowData.subtype === 'onlinehelp') {
			NativeSceneModule.launchNativeScene('MeiQia')
		}
		else if(rowData.subtype === 'aboutus') {
			var aboutUrl = LogicData.getAccountState()?NetConstants.TRADEHERO_API.WEBVIEW_URL_ABOUT_US_ACTUAL:NetConstants.TRADEHERO_API.WEBVIEW_URL_ABOUT_US
			this.gotoWebviewPage(aboutUrl, '关于我们');
		}
		else if(rowData.subtype === 'protocol') {
			var protocolUrl = LogicData.getAccountState()?NetConstants.TRADEHERO_API.WEBVIEW_SIGNTERMS_PAGE_ACTUAL:NetConstants.TRADEHERO_API.WEBVIEW_SIGNTERMS_PAGE
			this.gotoWebviewPage(protocolUrl, '用户协议',true);
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
	};

    renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
		var marginLeft = 0
		// if (rowID > 1 && rowID < 6){
			marginLeft = 15
		// }
		return (
			<View style={styles.line} key={rowID}>
				<View style={[styles.separator, {marginLeft: marginLeft}]}/>
			</View>
			)
	};

    renderUserNameView = () => {
		var meData = LogicData.getMeData();
		var sZhangHao = LS.str('ZHANGHAO');
		if(meData.phone){
			return (
				<View style={[styles.userInfoWrapper]}>
					<Text style={styles.userNameText}>{meData.nickname ? meData.nickname : "--"}</Text>
					<Text style={styles.phoneText}>{meData.phone ? sZhangHao + meData.phone : "--"}</Text>
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
	};

    renderUserPortraitView = () => {
		var meData = LogicData.getMeData();
//		Alert.alert(""+meData.rank)
		var headRank = LogicData.getRankHead(meData.rank);
		if(meData.picUrl){
			return (
			    <View>
			        <Image source={{uri: meData.picUrl}} style={styles.headImage}
                    				defaultSource={require('../../images/head_portrait.png')}/>
                    <Image style = {styles.userHeaderIconRound} source={headRank}></Image>
			    </View>
			);
		}else{
			return (
			    <View>
			        <Image source={require('../../images/head_portrait.png')} style={styles.headImage} />
                    <Image style = {styles.userHeaderIconRound} source={headRank}></Image>
			    </View>

			);
		}
	};

    renderUserInfoView = () => {
		return(
			<TouchableOpacity activeOpacity={0.5} onPress={()=>this.gotoUserInfoPage()}>
				<View style={[styles.rowWrapper, {height:Math.round(108*heightRate)}]}>
					{this.renderUserPortraitView()}
					{this.renderUserNameView()}
					<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
				</View>
			</TouchableOpacity>
		);
	};

    renderAccountStateView = () => {
		var meData = LogicData.getMeData();
		console.log('提示：','liveAccStatus = '+meData.liveAccStatus + ', liveAccRejReason = '+ meData.liveAccRejReason)
	  	accStatus = meData.liveAccStatus;
		//accStatus = 0
		var strStatus = '';
		var colorStatus = ColorConstants.TITLE_BLUE

		if(accStatus!==undefined && accStatus<accountInfoData.length){
			strStatus = LS.str(accountInfoData[accStatus].title);
			colorStatus = accountInfoData[accStatus].color;

			if(accStatus == 0 && this.state.lastStep > 0 ){
				//未注册 显示最后的Step
				var totalSteps = OpenAccountInfos.length - 1
				strStatus = '继续开户:' + OpenAccountInfos[this.state.lastStep]
				+ "(" + this.state.lastStep + "/"+ totalSteps +")"
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


	};

    renderRowRight = (rowData) => {
		var meData = LogicData.getMeData();
		if(rowData.subtype === "depositWithdraw"){
			var hasError = LogicData.getMeData().bankCardStatus === "Rejected";
			if(hasError){
				return (
					<View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
						<View style={styles.newEventImage}/>
						<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
					</View>
				);
			}else if(!meData.firstDayClicked){
				return (
					<View style={{flexDirection:'row'}}>
						<Image style={styles.redPackageImage} source={require('../../images/icon_red_package.png')} />
						<Text style={styles.redPackageText}>{LS.str("ME_DEPOSIT_REWARD")}</Text>
						<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
					</View>
				)
			}
		}else if(rowData.subtype === "config"&&meData.phone==null){
			return (
				<View style={{flexDirection:'row'}}>
					<Image style={styles.redPackageImage} source={require('../../images/icon_red_package.png')} />
					<Text style={styles.redPackageText}>{LS.str("ME_BIND_MOBILE_REWARD")}</Text>
					<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
				</View>
			)
		}
		return (
			<View style={{flexDirection:'row'}}>
				<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
			</View>
		);
	};

    renderRow = (rowData, sectionID, rowID) => {


		if (rowData.type === 'normal') {
			if((rowData.subtype === 'mycard') && !this.state.loggedIn){
				return (
					null
				);
			}
			else if((rowData.subtype === 'depositWithdraw' || rowData.subtype === 'mycard'|| rowData.subtype === 'credits') && !LogicData.getAccountState()){
				return (
					null
				);
			}
			else if(rowData.subtype === 'onlinehelp' && LogicData.getAccountState() ){
				return (
					null
				);
			}else{
				return(
					<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
						<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
							<Image source={rowData.image} style={styles.image} />
							<Text style={styles.title}>{LS.str(rowData.title)}</Text>
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
							<Text style={styles.defaultText}>{LS.str("ME_LOGIN")}</Text>
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
	};

    renderNavBar = () => {
		var strMe = LS.str('WODE');
		return(
			<NavBar title={strMe}
				navigator={this.props.navigator}
				viewOnRight={this.renderMessageIcon()}
			 />
		);
	};

    loadUnreadMessage = () => {
		var userData = LogicData.getUserData();
		var login = Object.keys(userData).length !== 0
		if (!login){
			return
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
					'Accept-Language': LogicData.getLanguageEn() == '1'?'en':'cn',
				},
				//cache: 'offline',
			},
			function(response) {
				this.setState(
					{
						unreadMessageCount: response,
					}
				)
			}.bind(this),
			(result) => {
				console.log(result.errorMessage)
			}
		);
	};

    renderUnreadCount = () => {
		if(this.state.unreadMessageCount > 0){
			var text = this.state.unreadMessageCount > 9 ? "9+" : "" + this.state.unreadMessageCount;
			return (
				<View style={styles.unreadMessageView}>
					<Text style={styles.unreadMessageText}>
						{text}
					</Text>
				</View>
			)
		}else{
			return null;
		}
	};

    goToMailPage = () => {
		this.props.navigator.push({
			name: MainPage.MY_MESSAGES_ROUTE,
			onPopToRoute: this.loadUnreadMessage,
		});
	};

    renderMessageIcon = () => {
		if(!LogicData.getAccountState()){
			return null;
		}

		var userData = LogicData.getUserData()
		var login = Object.keys(userData).length !== 0
		if(login){
			return (
				<TouchableOpacity onPress={()=>this.goToMailPage()}
					style={styles.navBarRightView}>
					<Image
							style={[styles.navBarIcon, styles.navBarIconRight]}
							source={require('../../images/icon_my_message.png')}/>
					{this.renderUnreadCount()}
				</TouchableOpacity>
			);
		}
		return null;
	};

    renderListView = () => {
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
	};

    render() {
		console.log("HELLO = " + LS.str('HELLO'));

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
				{this.renderNavBar()}
				<ScrollView ref={LIST_SCROLL_VIEW}>
					{this.renderListView()}
				</ScrollView>
				<View style={{width:width,height:UIConstants.TAB_BAR_HEIGHT}}></View>
			</View>
		);
	}
}

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
		marginLeft:10,
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

	redPackageImage:{
		alignSelf:'center',
		width:24,
		height:24,
		marginRight:1,
	},

	redPackageText:{
		alignSelf:'center',
		color:'#e60012',
		fontSize:11,
		marginRight:1,
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
		backgroundColor: '#ff0000',
		borderRadius: 5,
		marginRight: 8,
    },
    userHeaderIconRound:{
      width:114,
      height:114,
      marginTop:-85,
      marginLeft:-30,
      position:'absolute'
	},
	
	navBarIcon: {
		width: 21,
		height: 21,
		resizeMode: 'contain',
	},

	navBarIconRight: {
		marginRight: 20,
	},

	unreadMessageView:{
		backgroundColor:'#ff3333',
		position:'absolute',
		top:0,
		right:13,
		width:20,
		height:14,
		alignItems:'center',
		justifyContent:'center',
		borderRadius: 6,
	},

	unreadMessageText:{
		color:'white',
		fontSize:10,
	},

	navBarLeftView:{
		flex:1,
		height: 30,
		alignItems:"flex-start",
		justifyContent:"center",
	},
	navBarRightView:{
		flex:1,
		height: 30,
		alignItems:"flex-end",
		justifyContent:"center",
	},

});


module.exports = MePage;
