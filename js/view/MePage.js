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
} from 'react-native';

var {EventCenter, EventConst} = require('../EventCenter')

var LogicData = require('../LogicData')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var Button = require('./component/Button')
var MainPage = require('./MainPage')
var NativeSceneModule = require('../module/NativeSceneModule')
var StorageModule = require('../module/StorageModule')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')

var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var configRowData = {'type':'normal','title':'设置', 'image':require('../../images/icon_config.png'), 'subtype':'config'}
var listRawData = [{'type':'account','subtype':'accountInfo'},
// {'type':'button','title':'开设实盘账户'},
{'type':'Separator', 'height':10},
{'type':'normal','title':'帮助中心', 'image':require('../../images/icon_helpcenter.png'), 'subtype':'helpcenter'},
{'type':'normal','title':'线上咨询', 'image':require('../../images/icon_onlinehelp.png'), 'subtype':'onlinehelp'},
{'type':'normal','title':'产品反馈', 'image':require('../../images/icon_response.png'), 'subtype':'feedback'},
{'type':'normal','title':'关于我们', 'image':require('../../images/icon_aboutus.png'), 'subtype':'aboutus'},
configRowData,]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var didTabSelectSubscription = null

var MePage = React.createClass({
	getInitialState: function() {
		return {
			loggedIn: false,
			dataSource: ds.cloneWithRows(listRawData),
		};
	},

	componentWillMount: function(){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			//If previously logged in, fetch me data from server.
			NetworkModule.fetchTHUrlWithNoInternetCallback(
				NetConstants.GET_USER_INFO_API,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
				},
				function(responseJson) {
					StorageModule.setMeData(JSON.stringify(responseJson))
					LogicData.setMeData(responseJson);
					this.reloadMeData();
				}.bind(this),
				function(errorMessage) {
					this.reloadMeDataFromStorage();
				}.bind(this),
				function(errorMessage) {
					this.reloadMeDataFromStorage();
				}.bind(this)
			)
		}else{
			this.reloadMeDataFromStorage();
		}
	},

	componentDidMount: function(){
		didTabSelectSubscription = EventCenter.getEventEmitter().
			addListener(EventConst.ME_TAB_PRESS_EVENT, this.reloadMeData);
	},

	componentWillUnmount: function() {
		didTabSelectSubscription && didTabSelectSubscription.remove();
	},

	reloadMeDataFromStorage: function(){
		StorageModule.loadMeData()
		.then(function(value) {
			if (value !== null) {
				LogicData.setMeData(JSON.parse(value))
				this.reloadMeData();
			}
		}.bind(this));
	},

	reloadMeData: function(){
		//Check if the user has logged in and the config row need to be shown.
		var meData = LogicData.getMeData()
		var notLogin = Object.keys(meData).length === 0
		var i = listRawData.indexOf(configRowData)

		if (notLogin) {
			this.setState({
				loggedIn: false,
			})
			if(i != -1){
				listRawData.splice(i, 1);
			}
		}else{
			this.setState({
				loggedIn: true,
			})
			if(i == -1){
				listRawData.push(configRowData);
			}
		}

		this.setState({
			dataSource: ds.cloneWithRows(listRawData),
		});
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
			onPopToRoute: this.reloadMeData,
		});
	},

	gotoUserInfoPage: function() {
		//TODO: Use real page.
		this.props.navigator.push({
			name: MainPage.ACCOUNT_INFO_ROUTE,
			backButtonOnClick: this.reloadMeData,
			//popToRoute: MainPage.ME_PUSH_CONFIG_ROUTE,	//Set to destination page
		});
	},

	onSelectNormalRow: function(rowData) {
		if(rowData.subtype === 'helpcenter') {
			this.props.navigator.push({
				name: MainPage.QA_ROUTE,
			});
		}
		else if(rowData.subtype === 'onlinehelp') {
			NativeSceneModule.launchNativeScene('MeiQia')
		}
		else if(rowData.subtype === 'aboutus') {
			this.props.navigator.push({
				name: MainPage.ABOUT_US_ROUTE,
			});
		}
		else if(rowData.subtype === 'config') {
			this.props.navigator.push({
				name: MainPage.ME_CONFIG_ROUTE,
			});
		}
		else if(rowData.subtype === 'feedback') {
			this.props.navigator.push({
				name: MainPage.FEEDBACK_ROUTE,
			});
		}
		else if(rowData.subtype === 'accountInfo') {
			this.props.navigator.push({
				name: MainPage.ACCOUNT_INFO_ROUTE,
			});
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
		if(meData.phone != null){
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
					<Text style={styles.userNameText}>{meData.nickName}</Text>
				</View>
			)
		}
	},

	renderUserPortraitView: function(){
		var meData = LogicData.getMeData();
		if(meData.picUrl != null){
			//TODO: Download image...
			return (
				<Image source={{uri: meData.picUrl}} style={styles.headImage} />
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

	renderRow: function(rowData, sectionID, rowID) {
		if (rowData.type === 'normal') {
			return(
				<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
					<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
						<Image source={rowData.image} style={styles.image} />
						<Text style={styles.title}>{rowData.title}</Text>
						<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
					</View>
				</TouchableOpacity>
			)
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
		else {
			// separator
			return (
			<View style={[styles.line, {height:rowData.height}]}>
				<View style={[styles.separator, {height:rowData.height}]}/>
			</View>
				)
		}
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<NavBar title="我的" />
			    <ListView
			    	style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator} />
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
		flex: 1,
		textAlign: 'left',
		fontSize: 17,
		marginLeft: 10,
		color: '#303030',
	},

	phoneText: {
		flex: 1,
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
});


module.exports = MePage;
