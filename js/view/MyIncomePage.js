'use strict';

import React from 'react';
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
var heightRate = height/667.0

var UP_INPUT_REF = "upInput"
var DOWN_INPUT_REF = "downInput"

var listRawData = [
{'type':'header'},
{'type':'normal','title':'签到交易金(元)', 'subtype': 'totalDailySign'},
{'type':'normal','title':'模拟下单交易金(元)', 'subtype': 'demoTransaction'},
{'type':'normal','title':'注册交易金(元)', 'subtype': 'demoRegister'},
{'type':'normal','title':'卡片交易金(元)', 'subtype': 'totalCard'}
]
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var RULE_DIALOG = "ruleDialog";
var MyIncomePage = React.createClass({
	rules: [
		"盈交易交易金等同于现金，用户获取的交易金，开通实盘账户后，会转入现金账户；",
    "用户累计交易金额达到5000元后，赠送的交易金即可提现；",
    "交易金可以通过签到、模拟交易、实盘交易等方式获取；",
    "模拟交易金：用户通过模拟下单交易，每日可以获得0.5元交易金。",
  ],

	getInitialState: function() {
		return {
			totalIncome: '--',
			totalDailySign: '--',
			totalCard: '--',
			demoTransaction: '--',
			demoRegister: '--',
			dataSource: ds.cloneWithRows(listRawData),
		};
	},

	componentDidMount: function(){
  	this.refreshData();
	},

	refreshData: function(){
		var userData = LogicData.getUserData();
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
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
					console.log("my unpaid income: " + JSON.stringify(responseJson));

					var totalDailySign = responseJson.totalDailySign;
					var demoTransaction = responseJson.totalDemoTransaction;
					var demoRegister = responseJson.demoRegister
					var totalCard = responseJson.totalCard ? responseJson.totalCard : 0;
					var totalIncome = totalDailySign + demoTransaction + demoRegister + totalCard;
					LogicData.setTotalUnpaidIncome(totalIncome);
					console.log("totalIncome: " + totalIncome.toString())
					console.log("totalDailySign: " + totalDailySign.toString())
					console.log("demoTransaction: " + demoTransaction.toString())
					console.log("demoRegister: " + demoRegister.toString())
					console.log("totalCard: " + totalCard.toString())
					this.setState({
						totalIncome: totalIncome.toString(),
						totalDailySign : totalDailySign.toString(),
						totalCard: totalCard.toString(),
						demoTransaction: demoTransaction.toString(),
						demoRegister: demoRegister.toString(),
						dataSource: ds.cloneWithRows(listRawData),
					});
				},
				(result) => {
					LogicData.setTotalUnpaidIncome(0);
					console.log(result.errorMessage)
				}
			)
		}else{
			LogicData.setTotalUnpaidIncome(0);
			this.setState({
				totalIncome: 0,
				totalDailySign: 0,
				demoTransaction: 0,
				demoRegister: 0,
				totalCard: 0,
				dataSource: ds.cloneWithRows(listRawData),
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

	gotoNext: function(){
		this.props.navigator.push({
			name: MainPage.WITHDRAW_INCOME_ROUTE,
			popToOutsidePage: ()=>{this.refreshData();}
		});
	},

	gotoOpenAccount: function(){
		OpenAccountRoutes.getLatestInputStep()
		.then(step=>{
			console.log("getLatestInputStep " + step)
			this.props.navigator.push({
				name: MainPage.OPEN_ACCOUNT_ROUTE,
				step: step,
				onPop: ()=>{this.refreshData()},
			})
		});
	},

  renderTotalIncome: function(){
    return(
			<View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around'}}>
				<View style={styles.totalTextContainer}>
	        <Text style={styles.totalIncomeTitleText}>
	          累计获得交易金(元)
	        </Text>
	        <Text style={styles.totalIncomeText}>
	          {this.state.totalIncome}
	        </Text>
	      </View>
				<View style={styles.totalTextContainer}>
					<Text style={styles.totalIncomeTitleText}>
						剩余交易金(元)
					</Text>
					<Text style={styles.totalIncomeText}>
						{this.state.totalIncome}
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
		else if(rowData.type == 'normal'){
			var value;
			if(rowData.subtype == 'totalDailySign'){
				value = this.state.totalDailySign;
			}
			if(rowData.subtype == 'demoTransaction'){
				value = this.state.demoTransaction;
			}
			if(rowData.subtype == 'demoRegister'){
				value = this.state.demoRegister;
			}
			if(rowData.subtype == 'totalCard'){
				value = this.state.totalCard;
			}

			return(
				<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
					<Text style={styles.title}>{rowData.title}</Text>
					<Text style={styles.contentValue}>{value}</Text>
				</View>
			);
		}
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
						开通实盘账户
					</Text>
				</TouchableOpacity>
			)
		}else if(liveAccStatus == 2){
			return(
				<Text style={styles.noticeText}>
					开通实盘账户
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
									注意：交易金转入实盘账户前，必须
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

	render: function() {
		var nextEnabled = true;

		return (
			<View style={{flex: 1}}>
				<NavBar title='我的交易金' showBackButton={true} navigator={this.props.navigator}
					textOnRight='规则'
					rightTextOnClick={()=>this.showDialog()}/>
				<ListView
					style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator} />
				{this.renderNoticeView()}
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={this.state.validateInProgress ? false : nextEnabled}
						onPress={()=>this.gotoNext()}
						textContainerStyle={[styles.buttonView, {backgroundColor: ColorConstants.TITLE_BLUE,}]}
						textStyle={styles.buttonText}
						text={'转入实盘账户'} />
				</View>
				<HeaderLineDialog ref={RULE_DIALOG}
				headerImage={require('../../images/my_income_strategy.png')}
				messageLines={this.rules}/>
			</View>
		);
	},
});

var styles = StyleSheet.create({
  wrapper:{
		flex: 1,
		width: width,
   	alignItems: 'stretch',
  },
	headerWrapper: {
		backgroundColor: ColorConstants.MAIN_CONTENT_BLUE,
    height: 186,
	},
  totalTextContainer:{
    flexDirection: 'column',
    alignItems:'center',
		marginLeft:32,
		marginRight:32,
  },
  totalIncomeTitleText:{
    fontSize: 14,
		marginTop: 41,
    color: 'white',
  },
  totalIncomeText:{
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
		fontSize: 17,
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
