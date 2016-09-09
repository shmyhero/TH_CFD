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
		onPopToRoute: React.PropTypes.func,
		showRegisterSuccessDialog: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			popToRoute: null,
			onPopToRoute: null,
			showRegisterSuccessDialog: ()=>{},
		}
	},

	getInitialState: function() {
		return {
			noteState: NOTE_STATE_NORMAL,
			nickName: '',
			saveButtonEnabled: false,
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
			NetConstants.GET_USER_INFO_API,
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
			function(errorMessage) {
				Alert.alert('提示',errorMessage);
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

	savePressed: function() {
		var userData = LogicData.getUserData();

		//Use the old me data since the reward amount only occur once.
		NetworkModule.fetchTHUrl(
			NetConstants.SET_USER_NICKNAME_API + '?' + NetConstants.PARAMETER_NICKNAME + '=' + this.state.nickName,
			{
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			function(responseJson) {
				LocalDataUpdateModule.updateMeData(userData, function(){
					this.backButtonPressed();
				}.bind(this));
			}.bind(this),
			function(errorMessage) {
				Alert.alert('提示',errorMessage);
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
							请设置一个您喜欢的昵称！
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

	backButtonPressed: function(){
		if(this.props.popToRoute != null){
			var routes = this.props.navigator.getCurrentRoutes();
			var backRoute = null;

			for (var i=0; i<routes.length; ++i) {
				if(routes[i].name === this.props.popToRoute){
					backRoute = routes[i];
					break;
				}
			}

			if(backRoute!=null){
				if(this.props.onPopToRoute){
					this.props.onPopToRoute();
				}
				this.props.navigator.popToRoute(backRoute)
			}else{
				this.props.navigator.pop()
			}
		}else{
			this.props.navigator.pop()
		}

		if(this.props.showRegisterSuccessDialog){
			this.props.showRegisterSuccessDialog(this.initialMeData.rewardAmount);
		}
	},

	render: function() {
		var {height, width} = Dimensions.get('window');

		return (
			<View>
				<NavBar title="设置昵称" textOnLeft="返回"
							leftTextOnClick={this.backButtonPressed}/>

				<View style={[styles.wrapper, {height: height}]}>
					<View style={styles.upperContainer}>

						<View style={styles.rowWrapperWithBorder}>
							<View style={styles.nickNameTextView}>
								<Text style={styles.nickNameText}>
									昵称
								</Text>
							</View>

							<TextInput style={styles.nickNameInput}
								autoFocus={true}
								onChangeText={(text) => this.setUserName(text)}
								underlineColorAndroid='#ffffff'
								maxLength={UIConstants.MAX_NICKNAME_LENGTH}
								value={this.state.nickName}/>
						</View>

						{this.renderNotes()}

						<View style={styles.rowWrapper}>
							<Button style={styles.saveClickableArea}
								enabled={this.state.saveButtonEnabled}
								onPress={this.savePressed}
								textContainerStyle={styles.saveTextView}
								textStyle={styles.saveText}
								text='保存' />
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
		flex: 1,
		alignItems: 'stretch',
		justifyContent: 'center',
	},
	lowerContainer: {
		flex: 3,
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
