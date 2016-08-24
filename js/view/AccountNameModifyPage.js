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
var LocalDataUpdateModule = require('../module/LocalDataUpdateModule')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var {height, width} = Dimensions.get('window');
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var heightRate = height/667.0;
var NavBar = require('../view/NavBar')
var UIConstants = require('../UIConstants')
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

	render: function() {

		return (
			<View style={{flex:1,backgroundColor:'white'}}>

				 {this.renderHeader()}

				 <TextInput style={styles.nickNameInputView}
					onChangeText={(text) => this.setNickName(text)}
					placeholder='请输入昵称'
					placeholderTextColor='grey'
					maxLength={UIConstants.MAX_NICKNAME_LENGTH}
					value={this.state.nickName}
					/>

					<View style={styles.line}>
						<View style={[styles.separator, {marginLeft: 15, marginRight: 15}]}/>
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
				barStyle={{height: barHeight}}	titleStyle={{fontSize:18}}
				title='我的昵称'
				subTitleStyle={styles.subTitle}
				textOnRight='完成'
				rightTextOnClick={this.onComplete}/>
		)
	},

	onComplete(){
		//Check if the new value is valid.

		if(!this.state.nickName || this.state.nickName.length==0 ){
			this.setState({
				isShowError:true,
				errorText:"昵称不能为空",
			});
			return;
		}else if(this.state.nickName.length > UIConstants.MAX_NICKNAME_LENGTH){
			this.setState({
				isShowError:true,
				errorText: "昵称不能超过" + UIConstants.MAX_NICKNAME_LENGTH + "个字段",
			});
			return;
		}

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
				LocalDataUpdateModule.updateMeData(userData, function(){
					if(this.props.onReturnToPage){
						this.props.onReturnToPage()
					}
					this.props.navigator.pop();
				}.bind(this))
			}.bind(this),
			function(errorMessage) {
				this.setState({
					isShowError:true,
					errorText:errorMessage,
				});
			}.bind(this)
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
		backgroundColor:'transparent',
		marginLeft: 15,
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
 		marginLeft: 15,
	},

	errorText:{
		fontSize:12,
		color:'red',
		marginLeft:10
	},

	subTitle: {
		fontSize: 17,
		textAlign: 'center',
		color: 'white',
		marginRight:10,
	},

	errorMsg:{
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10
	},

});

module.exports = AccountNameModifyPage;
