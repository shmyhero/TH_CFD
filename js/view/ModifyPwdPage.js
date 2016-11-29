'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	Dimensions,
	Image,
	TouchableOpacity,
	Alert,
	Modal,
	Animated,
	Easing,
	WebView,
	TextInput,
} from 'react-native';


var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var NativeDataModule = require('../module/NativeDataModule')
var NavBar = require('./NavBar')
var TalkingdataModule = require('../module/TalkingdataModule')
var WebViewPage = require('./WebViewPage');
var {height, width} = Dimensions.get('window');
var heightRate = height/667.0;
var TimerMixin = require('react-timer-mixin');

var MainPage = require('./MainPage')

var MAX_ValidationCodeCountdown = 60
var getCompleteEnable = false;

var ModifyPwdPage = React.createClass({
	mixins: [TimerMixin],

	getInitialState: function() {
		return {
			phoneNumber: '',
			validationCode: '',
			validationCodeCountdown: -1,
			getValidationCodeButtonEnabled: false,
			phoneLoginButtonEnabled: false,
			oldPwd:'',
			newPwd:'',
			newPwdAgain:'',
			count:0,
		};
	},

	componentDidMount:function(){
	},

	render: function() {
		var getCode = '获取验证码'
		if(this.state.validationCodeCountdown>0){
			getCode = this.state.validationCodeCountdown + '秒'
		}

		return (
				<View style = {styles.container}>
					<View style = {styles.keyValueLineTop}>
						<Text style = {styles.textKey}>原登入密码</Text>
						<TextInput style = {styles.textValue}
							onChangeText={(text) => this.setOldPwd(text)}
							placeholder='8位以上数字字母组合'
							placeholderTextColor='grey'
							maxLength={32}
							underlineColorAndroid='transparent'
							secureTextEntry={true}>
      			</TextInput>
     			</View>
					<View style = {styles.keyValueLine}>
						<Text style = {styles.textKey}>新登入密码</Text>
						<TextInput style = {styles.textValue}
							onChangeText={(text) => this.setNewPwd(text)}
							placeholder='8位以上数字字母组合'
							placeholderTextColor='grey'
							underlineColorAndroid='transparent'
							maxLength={32}
							secureTextEntry={true}>
      			</TextInput>
     			</View>
					<View style = {styles.keyValueLine}>
						<Text style = {styles.textKey}>确认密码</Text>
						<TextInput style = {styles.textValue}
							onChangeText={(text) => this.setNewPwdAgain(text)}
							placeholder='确认密码'
							placeholderTextColor='grey'
							maxLength={32}
							underlineColorAndroid='transparent'
							secureTextEntry={true}>
      			</TextInput>
     			</View>

					<View style = {styles.keyValueLineCode}>
						<TextInput style = {styles.textValueCode}
							onChangeText={(text) => this.setValidationPhoneNumber(text)}
							placeholder='请输入手机号码'
							placeholderTextColor='grey'
							maxLength={11}
							keyboardType='numeric'
							underlineColorAndroid='transparent'
							>
						</TextInput>

						<TouchableOpacity onPress={this.getValidationCodePressed}>
							<View style = {[styles.validationCodeView,{backgroundColor:this.state.getValidationCodeButtonEnabled?ColorConstants.TITLE_BLUE:'grey'}]}>
								<Text style={styles.textValidCode}>{getCode}</Text>
							</View>
						</TouchableOpacity>

					</View>

					<View style = {styles.keyValueLine}>
						<TextInput style = {styles.textValue}
							onChangeText={(text) => this.setValidationCode(text)}
							placeholder='请输入验证码'
							placeholderTextColor='grey'
							maxLength={6}
							keyboardType='numeric'
							underlineColorAndroid='transparent'
							>
						</TextInput>
					</View>

					<TouchableOpacity onPress={this.getCompletePressed}>
					<View style = {[styles.complete,{backgroundColor:getCompleteEnable?ColorConstants.TITLE_BLUE:'grey'}]}>
						<Text style = {styles.textComplete}>完成</Text>
					</View>
					</TouchableOpacity>

					{/* just for render */}
					<Text style = {{fontSize:1}}>{this.state.count}</Text>
				</View>
		);
	},

	setValidationCode:function(text){
		this.setState({
			validationCode:text,
		},()=>{getCompleteEnable = this.checkForCompleteEnable()})
	},

  setOldPwd:function(text){
		this.setState({
			oldPwd:text,
		},()=>{getCompleteEnable = this.checkForCompleteEnable()})
	},

	setNewPwd:function(text){
		this.setState({
			newPwd:text,
		},()=>{getCompleteEnable = this.checkForCompleteEnable()})
	},

	setNewPwdAgain:function(text){
		this.setState({
			newPwdAgain:text,
		},()=>{getCompleteEnable = this.checkForCompleteEnable()})
	},

	setValidationPhoneNumber:function(phone){
		this.setState({
			phoneNumber:phone
		},()=>{getCompleteEnable = this.checkForCompleteEnable()})

		if(phone.length == 11 && this.state.validationCodeCountdown<=0){
			this.setState({
				getValidationCodeButtonEnabled:true
			})
		}else{
			this.setState({
				getValidationCodeButtonEnabled:false
			})
		}
	},

	checkForCompleteEnable(){
		this.setState({count:this.state.count++})
		if(this.state.oldPwd.length<8){
			return false;
		}else if(this.state.newPwd.length<8){
			return false;
		}else if(this.state.newPwdAgain.length<8){
			return false;
		}else if(this.state.phoneNumber.length<11){
			return false;
		}else if(this.state.validationCode.length<4){
			return false;
		}
		return true;
	},

	getCompletePressed(){
		if(!getCompleteEnable){
			return
		}

		Alert.alert('提示','完成');
	},


	getValidationCodePressed: function() {
		if (! this.state.getValidationCodeButtonEnabled) {
			return
		}

		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.GET_PHONE_CODE_API + '?' + NetConstants.PARAMETER_PHONE + "=" + this.state.phoneNumber,
			{
				method: 'POST',
			},
			(responseJson) => {
				// Nothing to do.
			},
			(errorMessage) => {
				Alert.alert('提示',errorMessage);
			}
		)

		this.setState({
			validationCodeCountdown: MAX_ValidationCodeCountdown,
			getValidationCodeButtonEnabled: false
		})
		var timer = this.setInterval(
			() => {
				var currentCountDown = this.state.validationCodeCountdown

				if (currentCountDown > 0) {
					this.setState({
						validationCodeCountdown: this.state.validationCodeCountdown - 1
					})
				} else {

					if (this.state.phoneNumber.length == 11) {
						this.setState({
							getValidationCodeButtonEnabled: true,
							validationCodeCountdown: -1
						})
					}
					this.clearInterval(timer)
				}
			},
			1000
		);
	},

});

var styles = StyleSheet.create({

	keyValueLineTop:{
		height:heightRate * 48,
		flex:1,
		backgroundColor:'white',
		marginTop:10,
		marginLeft:10,
		marginRight:10,
		alignItems:'center',
		flexDirection:'row',
	},

	keyValueLine:{
		height:heightRate * 48,
		flex:1,
		backgroundColor:'white',
		marginTop:10,
		marginLeft:10,
		marginRight:10,
		alignItems:'center',
		flexDirection:'row',
	},

	keyValueLineCode:{
		height:heightRate * 48,
		flex:1,
		marginTop:10,
		marginLeft:10,
		marginRight:10,
		alignItems:'center',
		flexDirection:'row',
	},

	textKey:{
		fontSize:16,
		marginLeft:5,
		justifyContent:'center',
		width:90,
	},

	textValue:{
		fontSize:16,
		marginLeft:5,
		marginRight:5,
		justifyContent:'center',
		flex:1,
	},

	textValueCode:{
		fontSize:16,
		justifyContent:'center',
		flex:1,
		paddingLeft:5,
		backgroundColor:'white',
	},

	validationCodeView:{
		width:90,
		height:48*heightRate,
		backgroundColor:ColorConstants.TITLE_BLUE,
		marginLeft:5,
		justifyContent:'center',
		alignItems:'center',
	},

	textValidCode:{
		fontSize:16,
		color:'white',
	},

	complete:{
		backgroundColor:ColorConstants.TITLE_BLUE,
		height:heightRate * 48,
		flex:1,
		marginTop:10,
		marginLeft:10,
		marginRight:10,
		justifyContent:'center',
		alignItems:'center',
	},

	textComplete:{
		fontSize:16,
		color:'white',
	},

});

module.exports = ModifyPwdPage;
