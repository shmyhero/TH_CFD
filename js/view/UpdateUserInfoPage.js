'use strict'

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	Dimensions,
	TextInput,
	Alert,
} from 'react-native';

var Button = require('./component/Button')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var LogicData = require('../LogicData')
var StorageModule = require('../module/StorageModule')
var NetworkModule = require('../module/NetworkModule')
var UIConstants = require('../UIConstants')
var LocalDataUpdateModule = require('../module/LocalDataUpdateModule')
var MainPage = require('./MainPage')
var NavBar = require('./NavBar')
var rowHeight = 40;
var fontSize = 16;

var originalName = null;

var NOTE_STATE_NORMAL = 0;
var NOTE_STATE_NORMAL_WECHAT = 1;

class ErrorMsg extends Component{
	constructor(prop){
		super(prop);
	}

	render(){
		if(this.props.showView){
			return (
				<View style={styles.errorMsg}>
						<Image source={require('../../images/error_dot.png')} style={[styles.errorDot]}/>
						<Text style={styles.errorText}>{this.props.showText}</Text>
				</View>
			);
		}else {
			return(
				<View></View>
			);
		}
	}

}

var UpdateUserInfoPage = React.createClass({
	propTypes: {
		popToRoute: React.PropTypes.string,
		showRegisterSuccessDialog: React.PropTypes.func,
		popToStackTop: React.PropTypes.bool,
		getNextRoute: React.PropTypes.func,
		onLoginFinish: React.PropTypes.func,
		needShowPromoCode:React.PropTypes.bool,
	},

	getDefaultProps() {
		return {
			popToRoute: null,
			showRegisterSuccessDialog: ()=>{},
			popToStackTop: false,
			getNextRoute: null,
			onLoginFinish: null,
		}
	},

	getInitialState: function() {
		return {
			noteState: NOTE_STATE_NORMAL,
			nickName: '',
			promoCode: '',
			saveButtonEnabled: false,
			errorPromo:'推广码不正确！'
		};
	},

	initialMeData: null,

	componentDidMount: function() {
		this.initialMeData = LogicData.getMeData();

		if (LogicData.getWechatUserData().nickname !== undefined) {
			this.setState({
				noteState: NOTE_STATE_NORMAL_WECHAT,
			})
		}

		var userData = LogicData.getUserData()

		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.GET_USER_INFO_API,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			function(responseJson) {
				originalName = responseJson.nickname
				this.setState({
					nickName: originalName ,
					saveButtonEnabled: true
				});

				this.verifyNickName(originalName)

			}.bind(this),
			function(result) {
				Alert.alert('提示',result.errorMessage);
			}
		)
	},

	setUserName: function(name) {
		this.setState({
			nickName: name
		})

		this.verifyNickName(name);
	},

	verifyNickName: function(name) {
		var errorMsg = undefined

		if (name.length == 0) {
			errorMsg = "昵称不能为空"
		}
		else if(name.length > UIConstants.MAX_NICKNAME_LENGTH){
			errorMsg = "昵称不能超过" + UIConstants.MAX_NICKNAME_LENGTH + "个字段"
		}

		this.setState({
			isShowError: errorMsg != undefined,
			errorText: errorMsg,
			saveButtonEnabled: errorMsg == undefined
		})
	},

	setPromoCode: function(code) {
		this.setState({
			promoCode: code
		})

		this.verifyPromoCode(code);
	},

	verifyPromoCode: function(code) {
		var errorMsg = undefined

		// if (code.length == 0) {
		// 	errorMsg = "昵称不能为空"
		// }
		// else if(name.length > UIConstants.MAX_NICKNAME_LENGTH){
		// 	errorMsg = "昵称不能超过" + UIConstants.MAX_NICKNAME_LENGTH + "个字段"
		// }

		// this.setState({
		// 	isShowError: errorMsg != undefined,
		// 	errorText: errorMsg,
		// 	saveButtonEnabled: errorMsg == undefined
		// })
	},

	savePressed: function() {
		var userData = LogicData.getUserData();
		var promoCode = this.state.promoCode;
		var promoUrl = '';
		if(promoCode!=undefined&&promoCode.length>=3){
			 promoUrl = promoCode;
		}
		//Use the old me data since the reward amount only occur once.
		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.POST_UPDATE_FIRST_LOGIN_INFO, // + '?' + NetConstants.PARAMETER_NICKNAME + '=' + this.state.nickName + promoUrl,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
				body: JSON.stringify({
					nickName: this.state.nickName,
					promotionCode: promoUrl,
				}),
			},
			function(responseJson) {
				LocalDataUpdateModule.updateMeData(userData, function(){
					this.backButtonPressed();
				}.bind(this));
			}.bind(this),
			function(result) {
				Alert.alert('提示',result.errorMessage);
			}
		)
	},

	renderHintOrError: function(){
		if(this.state.isShowError){
			return (
				<ErrorMsg showView={this.state.isShowError} showText={this.state.errorText}/>
			);
		}else{
				return (
					<View style={styles.noteView}>
						<Text style={styles.noteText}>
							此昵称为系统自动分配给您的，您也可以修改
						</Text>
					</View>
				);
		}
	},

	renderNotes: function() {
		if (this.state.noteState == NOTE_STATE_NORMAL) {
			return this.renderHintOrError();
		} else if(this.state.noteState == NOTE_STATE_NORMAL_WECHAT) {
			return (
				<View style={styles.noteView}>
					<Text style={styles.noteText}>
						微信昵称将作为您的昵称，你也可以修改！
					</Text>
				</View>
			);
		}
	},

	renderPromoHintOrError: function(){
			return (
				<View style={styles.noteView}>
					<Text style={styles.noteText}>
						推广码是用于确定归属关系，确定后不能修改
					</Text>
				</View>
			);
	},

	renderPromoNotes: function() {
	 		return this.renderPromoHintOrError();
	},

	backButtonPressed: function(){
		if(this.props.onLoginFinish){
			this.props.onLoginFinish();
		}else{
			if(this.props.popToStackTop){
				this.props.navigator.popToTop();
			}else if(this.props.getNextRoute != null){
				var routes = this.props.navigator.getCurrentRoutes();
				var currentRouteIndex = -1;
				for (var i=0; i<routes.length; ++i) {
					if(routes[i].name === MainPage.LOGIN_ROUTE){
						currentRouteIndex = i;
					}
				}
				var nextRoute = this.props.getNextRoute();
				this.props.navigator.replaceAtIndex(nextRoute, currentRouteIndex, ()=>{
					this.props.navigator.pop();
				});
			}else	if(this.props.popToRoute != null){
				var routes = this.props.navigator.getCurrentRoutes();
				var backRoute = null;

				var currentRouteIndex = -1;
				for (var i=0; i<routes.length; ++i) {
					if(routes[i].name === this.props.popToRoute){
						backRoute = routes[i];
						break;
					}
					if(routes[i].name === MainPage.LOGIN_ROUTE){
						currentRouteIndex = i;
					}
				}

				if(backRoute!=null){
					this.props.navigator.popToRoute(backRoute);
				}else if(currentRouteIndex >= 0 ){
					var route = {name: this.props.popToRoute};
					this.props.navigator.replaceAtIndex(route, currentRouteIndex, ()=>{
						this.props.navigator.popToRoute(route);
					});
				}else{
					this.props.navigator.pop();
				}
			}else{
				this.props.navigator.pop();
			}
		}
		if(this.props.showRegisterSuccessDialog){
			this.props.showRegisterSuccessDialog(this.initialMeData.rewardAmount);
		}
	},

	renderNickName:function(){
		return(
			<View>
				<View style={styles.rowWrapperWithBorder}>
					<View style={styles.nickNameTextView}>
						<Text style={styles.nickNameText}>
							昵称
						</Text>
					</View>

					<TextInput style={styles.nickNameInput}
						autoFocus={true}
						placeholder='请输入昵称'
						onChangeText={(text) => this.setUserName(text)}
						underlineColorAndroid='#ffffff'
						maxLength={4}
						value={this.state.nickName}/>
				</View>
				{this.renderNotes()}
			</View>
		)
	},

	renderPromoCode:function(){
		if(this.props.needShowPromoCode){
			return(
				<View>
					<View style={[styles.rowWrapperWithBorder,{marginTop:15}]}>
						<View style={styles.nickNameTextView}>
							<Text style={styles.nickNameText}>
								推广码
							</Text>
						</View>

						<TextInput style={styles.nickNameInput}
							autoFocus={true}
							placeholder='请输入推广码'
							onChangeText={(text) => this.setPromoCode(text)}
							underlineColorAndroid='#ffffff'
							maxLength={UIConstants.MAX_NICKNAME_LENGTH}
							value={this.state.promoCode}/>
					</View>
					{this.renderPromoNotes()}
				</View>
			)
		}else{
			return(
				<View></View>
			)
		}

	},

	render: function() {
		var {height, width} = Dimensions.get('window');

		return (
			<View>
				<NavBar title="设置昵称" textOnLeft="跳过"
							leftTextOnClick={this.backButtonPressed}/>

				<View style={[styles.wrapper, {height: height}]}>
					<View style={styles.upperContainer}>

						{this.renderNickName()}

						{this.renderPromoCode()}

						<View style={styles.rowWrapper}>
							<Button style={styles.saveClickableArea}
								enabled={this.state.saveButtonEnabled}
								onPress={this.savePressed}
								textContainerStyle={styles.saveTextView}
								textStyle={styles.saveText}
								text='确认' />
						</View>

					</View>

					<View style={styles.lowerContainer}>

					</View>

				</View>
			</View>
		)
	},

});

var styles = StyleSheet.create({

	upperContainer: {
		marginTop:30,
		alignItems: 'stretch',
		justifyContent: 'center',
	},
	lowerContainer: {

		alignItems: 'stretch',
	},
	rowWrapperWithBorder: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		marginLeft: 10,
		marginRight: 10,
		borderWidth: 1,
		borderRadius: 3,
		borderColor: ColorConstants.TITLE_BLUE,
		backgroundColor: '#ffffff',
	},
	rowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		paddingTop: 10,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
	},
	nickNameTextView: {
		flex: 1,
		height: rowHeight,
		justifyContent: 'center',
	},
	nickNameText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#c7c7cd',
	},
	nickNameInput: {
		flex: 4,
		height: rowHeight,
		fontSize: fontSize,
		paddingLeft: 10,
	},
	saveClickableArea: {
		flex: 1,
		alignSelf: 'center',
	},
	saveTextView: {
		padding: 5,
		height: rowHeight,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	saveText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#ffffff',
	},
	noteView: {
		alignSelf: 'flex-start',
		marginLeft: 10,
		marginTop: 10,
	},
	noteText: {
		fontSize: 14,
		textAlign: 'center',
		color: '#c7c7cd',
	},
	errorDot: {
		width: 15,
		height: 15,
 		marginLeft: 15,
	},
	errorText:{
		fontSize:12,
		color:'red',
		marginLeft:10
	},
	errorMsg:{
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10
	},
});

module.exports = UpdateUserInfoPage
