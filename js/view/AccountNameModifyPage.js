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
var LS = require("../LS")
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
			errorText: LS.str("ERROR_HINT"),
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
					placeholder={LS.str("ACCOUNT_NAME_INPUT_HINT")}
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
			barHeight = 50 + UIConstants.STATUS_BAR_ACTUAL_HEIGHT
		}
		return (
			<NavBar showBackButton={true} navigator={this.props.navigator}
				barStyle={{height: barHeight}}	titleStyle={{fontSize:18}}
				title={LS.str("ACCOUNT_NAME_TITLE")}
				subTitleStyle={styles.subTitle}
				textOnRight={LS.str("FINISH")}
				rightTextOnClick={this.onComplete}/>
		)
	},

	onComplete(){
		//Check if the new value is valid.

		if(!this.state.nickName || this.state.nickName.length==0 ){
			this.setState({
				isShowError:true,
				errorText:LS.str("ACCOUNT_NAME_CANNOT_BE_EMPTY"),
			});
			return;
		}else if(this.state.nickName.length > UIConstants.MAX_NICKNAME_LENGTH){
			this.setState({
				isShowError:true,
				errorText: LS.str("ACCOUNT_NAME_MAXINUM_LENGTH").replace("{1}", UIConstants.MAX_NICKNAME_LENGTH),
			});
			return;
		}

		var userData = LogicData.getUserData()
		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.SET_USER_NICKNAME_API + '?' + NetConstants.PARAMETER_NICKNAME + '=' + this.state.nickName,
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
			(result) => {
				this.setState({
					isShowError:true,
					errorText:result.errorMessage,
				});
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
