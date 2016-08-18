'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Alert,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';

var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var Button = require('./component/Button')
var MainPage = require('./MainPage')
var WechatModule = require('../module/WechatModule')

var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var listRawData = [
{'type':'mobile','title':'手机号', 'subtype': 'bindMobile'},
{'type':'wechat','title':'微信', 'subtype': 'bindWeChat'}
]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var MeAccountBindingPage = React.createClass({
	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(listRawData),
			phoneNumber: null,
			wechatBinded: false
		};
	},

	componentDidMount: function() {
		//Once user moves into this page, check server setting.
		this.loadAccountBindingInfo()
	},

	onSelectNormalRow: function(rowData) {
		if(rowData.subtype === 'bindWeChat') {
			this.wechatPressed();
		}else if(rowData.subtype === 'bindMobile'){
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
			});
		}
	},

	loadAccountBindingInfo: function(){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if (notLogin) {
			console.log("not loggined");

			this.setState({
				phoneNumber: null,
			});
			this.hideWechatIfNotInstalled();

		}else{
			NetworkModule.fetchTHUrl(
				NetConstants.GET_USER_INFO_API,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
				},
				function(responseJson) {
					var phoneNumber = responseJson.phone
					var weChatOpenId = responseJson.weChatOpenId
					var isWechatBinded = weChatOpenId != null

					this.setState({
						phoneNumber: phoneNumber,
						wechatBinded: isWechatBinded,
						dataSource: ds.cloneWithRows(listRawData),
					});

					if(!isWechatBinded){
						this.hideWechatIfNotInstalled()
					}
				}.bind(this),
				function(errorMessage) {
					Alert.alert('提示',errorMessage);
				}
			)
		}
	},

	hideWechatIfNotInstalled: function() {
		if(!WechatModule.isWechatInstalled()){
			//WHAT'S WRONG?
			if(listRawData.length > 1){
				listRawData.slice(1, 1);
			}
		}else{
		}
	},

	wechatPressed: function() {
		/*
		WechatModule.wechatLogin(
			() => {
				this.wechatLogin()
			},

			function() {}.bind(this)
		)*/
		this.wechatLogin();
	},

	wechatLogin: function() {
		var wechatUserData = LogicData.getWechatUserData()

		var out = Object.keys(wechatUserData).map(function(data){
			return [data, wechatUserData[data]]
		})
		console.log(out);

		NetworkModule.fetchTHUrl(
			NetConstants.WECHAT_LOGIN_API,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify({
					openid: wechatUserData.openid,
					unionid: wechatUserData.unionid,
					nickname: wechatUserData.nickname,
					headimgurl: wechatUserData.headimgurl,
				}),
				showLoading: true,
			},
			(responseJson) => {
				this.loginSuccess(responseJson);
			},
			(errorMessage) => {
				Alert.alert('提示',errorMessage);
			}
		)
	},

	loginSuccess: function(userData) {
		StorageModule.setUserData(JSON.stringify(userData))
		LogicData.setUserData(userData);
		console.log(LogicData.getUserData());

		NetworkModule.syncOwnStocks(userData)
		WebSocketModule.alertServiceLogin(userData.userId + '_' + userData.token)

		this.setState({
			phoneLoginButtonEnabled: true
		});
		this.props.navigator.push({
			name: MainPage.UPDATE_USER_INFO_ROUTE,
		});
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		var marginLeft = 0
		return (
			<View style={styles.line} key={rowID}>
				<View style={[styles.separator, {marginLeft: marginLeft}]}/>
			</View>
			)
	},

	renderRow: function(rowData, sectionID, rowID) {
		if (rowData.type === 'mobile'){
			//TODO: Use Real Data
			if(this.state.phoneNumber != null){
				return(
					<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
						<Text style={styles.title}>{rowData.title}</Text>
						<View style={styles.extendRight}>
							<Text style={styles.message}>{this.state.phoneNumber}</Text>
						</View>
					</View>
				);
			}else{
				return(
					<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
						<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
							<Text style={styles.title}>{rowData.title}</Text>
							<View style={styles.extendRight}>
								<Text style={styles.clickableMessage}>未绑定</Text>
							</View>
							<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
						</View>
					</TouchableOpacity>
				);
			}
		}else if (rowData.type === 'wechat'){
			if(this.state.wechatBinded){
				return(
					<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
						<Text style={styles.title}>{rowData.title}</Text>
					</View>
				);
			} else {
					return(
						<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
							<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
								<Text style={styles.title}>{rowData.title}</Text>
								<View style={styles.extendRight}>
									<Text style={styles.clickableMessage}>未绑定</Text>
								</View>
								<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
							</View>
						</TouchableOpacity>
					);
			}
		}
	},

	render: function() {
		return (
	    <ListView
	    	style={styles.list}
				dataSource={this.state.dataSource}
				renderRow={this.renderRow}
				renderSeparator={this.renderSeparator} />
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
	message:{
		flex: 1,
		fontSize: 17,
		marginLeft: 10,
		marginRight: 10,
		color: '#757575',
	},
	clickableMessage: {
		flex: 1,
		fontSize: 17,
		marginLeft: 10,
		marginRight: 10,
		color: ColorConstants.TITLE_BLUE,
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
	headImage: {
		width: Math.round(62*heightRate),
		height: Math.round(62*heightRate),
	},
});


module.exports = MeAccountBindingPage;
