'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import {
	StyleSheet,
	View,
	Dimensions,
	Text,
	TextInput,
	Switch,
	UIManager,
	Image,
	ListView,
	TouchableOpacity,
} from 'react-native';

var MainPage = require('./MainPage')
var NetworkModule = require('../module/NetworkModule')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var NetConstants = require('../NetConstants')
var LogicData = require('../LogicData')
var WebSocketModule = require('../module/WebSocketModule')
var UIConstants = require('../UIConstants');
var HeaderLineDialog = require('./HeaderLineDialog');
var {height, width} = Dimensions.get('window')
var Button = require('./component/Button');
var OpenAccountRoutes = require('./openAccount/OpenAccountRoutes');
var StorageModule = require('../module/StorageModule');
var LS = require('../LS');

var heightRate = height/667.0

var buttonFontSize = heightRate * 17;
buttonFontSize = buttonFontSize > 17 ? 17 : buttonFontSize;

var UP_INPUT_REF = "upInput"
var DOWN_INPUT_REF = "downInput"

var headerRow = {'type':'header'};
var defaultRowData = [
	{ name: '模拟下单交易金(元)', amount: 0 },
	{ name: '卡片交易金(元)', amount: 0 },
	{ name: '注册交易金(元)', amount: 0 },
	{ name: '开户交易金(元)', amount: 0 },
	{ name: '邀请好友交易金(元)', amount: 0 },
	// { name: '首日入金交易金(元)', amount: 0 },
	{ name: '模拟收益交易金(元)', amount: 0 },
	{ name: '竞猜盈利交易金(元)', amount: 0 }
]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var RULE_DIALOG = "ruleDialog";
var MyIncomePage = createReactClass({
    displayName: 'MyIncomePage',

    rules: [
		"盈交易平台交易金等同于现金，开通实盘账户后，可以手动申请转到实盘账户，转入成功后以短信告知；",
    "用户累计交易金额（即历次交易投入的本金之和）达到5000美元、交易次数达到20次，赠送的交易金即可提现；",
    "交易金可以通过签到、模拟交易、实盘交易等方式获取；",
    "模拟交易金：用户通过模拟下单交易，每日可以获得0.5元交易金。",
  ],

    getInitialState: function() {
		return {
			totalReward: '--',
			unpaidReward: '--',
			dataSource: ds.cloneWithRows([headerRow].concat(defaultRowData)),
			minTransfer: 60,
			canTransfer: false,
			transferMessage: "",
		};
	},

    componentDidMount: function(){
		var unpaidReward = LogicData.getUnpaidReward();
		if(unpaidReward == null){
			StorageModule.loadUnpaidReward()
			.then((value)=>{
				console.log("loadUnpaidReward " + value)
				if(value != null){
					var unpaid = parseInt(value)
					LogicData.setUnpaidReward(unpaid);
				}
				this.refreshData();
			});
		}else{
  		this.refreshData();
		}
	},

    refreshData: function(){
		var userData = LogicData.getUserData();
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_TOTAL_REWARD,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=UTF-8',
					},
					cache: 'offline'
				},
				(responseJson, isCache) => {
					console.log("my total income: " + JSON.stringify(responseJson));

					var unpaid = (responseJson.total - responseJson.paid).toFixed(2);

					if(!isCache){
						LogicData.setUnpaidReward(unpaid);
						StorageModule.setUnpaidReward(""+unpaid);
					}else{
						unpaid = LogicData.getUnpaidReward()
					}
					this.setState({
						unpaidReward: unpaid,
						totalReward: responseJson.total,
						canTransfer: responseJson.canTransfer,
						transferMessage: responseJson.message,
						minTransfer: responseJson.minTransfer,
					});
				},
				(result) => {
					console.log(result.errorMessage)
				}
			);

			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_TOTAL_UNPAID,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=UTF-8',
					},
					cache: 'offline'
				},
				(responseJson) => {
					if(Array.isArray(responseJson)){
						var rowData = [headerRow].concat(responseJson);
						this.setState({
							dataSource: ds.cloneWithRows(rowData)
						})
					}
				},
				(result) => {
					console.log(result.errorMessage)
				}
			)
		}else{
			this.setState({
				dataSource: ds.cloneWithRows([headerRow].concat(defaultRowData)),
			})
		}
	},

    pressBackButton: function() {
		this.props.showTabbar()
		this.props.navigator.pop()
	},

    showDialog: function(){
		this.refs[RULE_DIALOG].show();
	},

    showRules: function(){
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			title: LS.str("MY_REWARD_RULES"),
			url:NetConstants.TRADEHERO_API.INCOME_RULE
		});
	},

    gotoNext: function(){
		this.props.navigator.push({
			name: MainPage.WITHDRAW_INCOME_ROUTE,
			minTransfer: this.state.minTransfer,
			popToOutsidePage: ()=>{this.refreshData();}
		});
	},

    gotoOpenAccount: function(){
		OpenAccountRoutes.getLatestInputStep()
		.then(step=>{
			var meData = LogicData.getMeData();
			console.log("showOARoute medata: " + JSON.stringify(meData));

			var OARoute = {
				name: MainPage.OPEN_ACCOUNT_ROUTE,
				step: step,
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
		});


	},

    renderTotalIncome: function(){
		return(
				<View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around'}}>
					<View style={styles.totalTextContainer}>
				<Text style={styles.totalRewardTitleText}>
					{LS.str("MY_REWARD_TOTAL")}
				</Text>
				<Text style={styles.totalRewardText}>
				{this.state.totalReward}
				</Text>
			</View>
					<View style={styles.totalTextContainer}>
						<Text style={styles.totalRewardTitleText}>
							{LS.str("MY_REWARD_REMAINING")}
						</Text>
						<Text style={styles.totalRewardText}>
							{this.state.unpaidReward}
						</Text>
					</View>
				</View>
			);
	},

    renderRow: function(rowData, sectionID, rowID) {
		if(rowData.type == 'header'){
			return (
				<View style={[styles.headerWrapper, {backgroundColor: ColorConstants.TITLE_BLUE}]}>
					{this.renderTotalIncome()}
				</View>
			);
		}
		return(
			<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
				<Text style={styles.title}>{rowData.name}</Text>
				<Text style={styles.contentValue}>{rowData.amount}</Text>
			</View>
		);
	},

    renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		if(rowID == 0){
			return (
				<View style={[styles.line, {height: 10}]} key={rowID}>
					<View style={[styles.separator]}/>
				</View>
				)
		}else{
			return (
				<View style={styles.line} key={rowID}>
					<View style={[styles.separator]}/>
				</View>
				)
		}
	},

    renderOpenAccountButton: function(liveAccStatus){
		if(liveAccStatus == 0 || liveAccStatus == 3){
			return (
				<TouchableOpacity onPress={()=>this.gotoOpenAccount()}>
					<Text style={[styles.openaccountText, {color: ColorConstants.TITLE_BLUE,}]}>
						{LS.str("OPEN_LIVE_ACCOUNT")}
					</Text>
				</TouchableOpacity>
			)
		}else if(liveAccStatus == 2){
			return(
				<Text style={styles.noticeText}>
					{LS.str("OPEN_LIVE_ACCOUNT")}
				</Text>
			);
		}
	},

    renderNoticeView: function(){
		var meData = LogicData.getMeData();
		var notLogin = Object.keys(meData).length === 0
		if(!notLogin){
			//meData.liveAccStatus = 0; //TEST
			if(meData.liveAccStatus != 1){
				return (
					<View style={styles.checkboxView}>
						<View style={{flexDirection:'column'}}>
							<View style={{flexDirection: 'row'}}>
								<Text style={styles.noticeText}>
									{LS.str("MY_REWARD_LIVE_ACCOUNT_WARNING")}
								</Text>
								{this.renderOpenAccountButton(meData.liveAccStatus)}
							</View>
						</View>
					</View>
				);
			}
		}
		return null;
	},

    renderTrasferButton: function(){
		var nextEnabled = false;
		var meData = LogicData.getMeData();
		var notLogin = Object.keys(meData).length === 0
		var buttonText = LS.str("MY_REWARD_TRANSFER_TO_LIVE");
		if(!notLogin && meData.liveAccStatus === 1){
			if(this.state.canTransfer){
				nextEnabled = true;
			}else{
				buttonText = this.state.transferMessage;
				nextEnabled = false;
			}
		}
		return (
			<View style={styles.bottomArea}>
				<Button style={styles.buttonArea}
					enabled={this.state.validateInProgress ? false : nextEnabled}
					onPress={()=>this.gotoNext()}
					textContainerStyle={[styles.buttonView, {backgroundColor: ColorConstants.TITLE_BLUE,}]}
					textStyle={styles.buttonText}
					text={buttonText} />
			</View>
		);
	},

    render: function() {


		return (
			<View style={styles.wrapper}>
				<NavBar title={LS.str("MY_REWARD_TITLE")} showBackButton={true} navigator={this.props.navigator}
					textOnRight={LS.str("RULES")}
					rightTextOnClick={()=>this.showRules()}/>				
				<ListView
					style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator} />
				{this.renderNoticeView()}
				{/* {this.renderTrasferButton()} */}
				{/* <HeaderLineDialog ref={RULE_DIALOG}
				headerImage={require('../../images/my_income_strategy.png')}
				messageLines={this.rules}/> */}
			</View>
		);
	},
});

var styles = StyleSheet.create({
  wrapper:{
		width: width,
   	alignItems: 'stretch',
  },
	headerWrapper: {
		backgroundColor: ColorConstants.MAIN_CONTENT_BLUE,
    height: 154,
	},
  totalTextContainer:{
    flexDirection: 'column',
    alignItems:'center',
		marginLeft:32,
		marginRight:32,
  },
  totalRewardTitleText:{
    fontSize: 14,
		marginTop: 41,
    color: 'white',
  },
  totalRewardText:{
    fontSize: 36,
		marginTop: 23,
    color: 'white',
  },
  detailsContainer:{
    flexDirection: 'column',
  },
  detailTextContainer:{
    flexDirection: 'column',
    alignItems:'center',
  },
  detailIncomeTitleText:{
    fontSize: 13,
    color: ColorConstants.SUB_TITLE_WHITE,
  },
  detailIncomeText:{
    fontSize: 17,
    color: 'white',
  },
	rowWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: UIConstants.LIST_ITEM_LEFT_MARGIN,
		paddingRight: 15,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: 'white',
	},
	title: {
		flex: 1,
		fontSize: 15,
		color: '#4c5f70',
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},

	contentValue: {
		fontSize: 15,
		marginRight: 5,
		color: '#4c5f70',
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		flex: 1,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	bottomArea: {
		height: 72,
		backgroundColor: 'white',
		alignItems: 'flex-end',
		flexDirection:'row'
	},
	buttonArea: {
		flex: 1,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 16,
		borderRadius: 3,
	},
	buttonView: {
		height: 40,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: buttonFontSize,
		textAlign: 'center',
		color: '#ffffff',
	},
	checkboxView: {
		paddingLeft: 15,
		paddingTop: 10,
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,//12,
	},
	noticeText:{
		fontSize: 12,
		color: '#858585',
	},
	openaccountText:{
		fontSize: 12,
		color: ColorConstants.TITLE_BLUE,
	}
});


module.exports = MyIncomePage;
