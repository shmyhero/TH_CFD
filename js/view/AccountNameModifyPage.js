'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	Dimensions,
	Image,
	TextInput,
	Platform,
	TouchableOpacity,
} from 'react-native';

var LogicData = require('../LogicData')
var StorageModule = require('../module/StorageModule')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var {height, width} = Dimensions.get('window');
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var heightRate = height/667.0;
var NavBar = require('../view/NavBar')


class ErrorMsg extends Component{
	constructor(prop){
		super(prop);
	}

/*
	propTypes = {
		showView: React.PropTypes.bool,
	}

	getDefaultProps() {
		return {
			showView: false,
		}
	}
*/

	render(){
		if(this.props.showView){
			return (
				<View style={styles.errorMsg}>
						<Image source={require('../../images/error_dot.png')} style={[styles.error_dot,{marginLeft:5}]}/>
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

var AccountNameModifyPage = React.createClass({

	propTypes: {
		onReturnToPage: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			onReturnToPage: function() {

			},
		}
	},

	getInitialState: function() {
		return {
			isShowError:false,
			errorText:'错误提示',
			nickName:'',
		};
	},

	componentWillMount: function() {
		var meData = LogicData.getMeData()
		this.setState({
			nickName: meData.nickname,
		})
	},

	onCancel: function(){
		this.props.navigator.pop();
	},

	render: function() {

		var marginLeft = 0;

		return (
			<View style={{flex:1,backgroundColor:'white'}}>

				 {this.renderHeader()}

				 <TextInput style={styles.nickNameInputView}
					onChangeText={(text) => this.setNickName(text)}
					placeholder='请输入昵称'
					placeholderTextColor='grey'
					maxLength={8}
					value={this.state.nickName}
					/>

					<View style={styles.line}>
						<View style={[styles.separator, {marginLeft: marginLeft}]}/>
					</View>

					<ErrorMsg showView={this.state.isShowError} showText={this.state.errorText}/>

			</View>
		);
	},

	renderHeader(){
		var barHeight = 68
		if (Platform.OS == 'android') {
			barHeight = 50
		}

		return (
			<NavBar showBackButton={true} navigator={this.props.navigator}
				backButtonOnClick={this.onCancel}
				barStyle={{height: barHeight}}	titleStyle={{fontSize:18}}
				title='我的昵称'
				subTitleStyle={styles.subTitle}
				rightCustomContent={() => this.renderComplete()}/>
		)
	},

	renderComplete: function() {
		return (
			<TouchableOpacity onPress={this.onComplete}>
						<Text style={styles.subTitle}>
							保存
						</Text>
			</TouchableOpacity>
		)
	},

	onComplete(){
		var userData = LogicData.getUserData()
		NetworkModule.fetchTHUrl(
			NetConstants.SET_USER_NICKNAME_API + '?' + NetConstants.PARAMETER_NICKNAME + '=' + this.state.nickName,
			{
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			function(responseJson) {
				this.updateMeData(userData, function(){
					if(this.props.navigator.onReturnToPage){
						this.props.navigator.onReturnToPage()
					}
					this.props.navigator.pop();
				}.bind(this))
			}.bind(this),
			function(errorMessage) {
				alert(errorMessage)
				this.setState({
					isShowError:true,
					errorText:errorMessage,
				});
			}
		)
	},

	updateMeData(userData, onSuccess){
		NetworkModule.fetchTHUrl(
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

				if(onSuccess){
					onSuccess()
				}
			}.bind(this),
			function(errorMessage) {
				Alert.alert('提示',errorMessage);
			}
		)
	},

	setNickName(text){
		console.log("nickname: " + text);
		this.setState({
			nickName: text
		});
	},

});



var styles = StyleSheet.create({

	 nickNameInputView:{
		 color:'#303030',
		 height:Math.round(64*heightRate),
		 margin:5,
	 },



	 line: {
		 height: 0.5,
		 backgroundColor: 'white',
	 },

	 separator: {
		 height: 0.5,
		 backgroundColor: ColorConstants.SEPARATOR_GRAY,
	 },

	 errorDot: {
 	width: 16,
 	height: 16,
  },

  errorText:{
 	 fontSize:12,
 	 color:'red',
 	},

	subTitle: {
		fontSize: 17,
		textAlign: 'center',
		color: 'white',
		marginRight:5,
	},

  errorMsg:{
 		flexDirection: 'row',
 		alignItems: 'center',
 	},

});

module.exports = AccountNameModifyPage;
