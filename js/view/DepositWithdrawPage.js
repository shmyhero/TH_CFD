'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
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
	BackAndroid,
	ScrollView,
} from 'react-native';


var NativeSceneModule = require('../module/NativeSceneModule')
var MainPage = require('./MainPage')
var NetworkModule = require('../module/NetworkModule')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var NetConstants = require('../NetConstants')
var LogicData = require('../LogicData')
var WebSocketModule = require('../module/WebSocketModule')
var UIConstants = require('../UIConstants');
var HeaderLineDialog = require('./HeaderLineDialog');
var SentIntent = require('./component/nativeIntent/SendIntent')

var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var LS = require('../LS')
var listRawData = [
{'type':'header'},
{'type':'depositwithdraw','title':'RJ', 'image':require('../../images/deposit.png'), 'subtype': 'deposit'},
{'type':'depositwithdraw','title':'CJ', 'image':require('../../images/withdraw.png'), 'subtype': 'withdraw'},
{'type':'detail','title':'MX', 'image':require('../../images/detail.png'), 'subtype': 'details'},
]

var CALL_NUMBER = '66058771'
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class DepositWithdrawPage extends Component {
	static propTypes = {
		onPopToOutsidePage: PropTypes.func,
  }

  static defaultProps = {
		onPopToOutsidePage: ()=>{},
  }

	hardwareBackPress = ()=>{return this.pressBackButton();};
  constructor(props) {
	  super(props);

		this.state = {
			balance: '--',
			dataSource: ds.cloneWithRows(listRawData),
			hasWithdrawError: false
		};
  }

	componentWillUnmount(){
		BackAndroid.removeEventListener('hardwareBackPress', this.hardwareBackPress);
	}

	componentDidMount(){
		BackAndroid.addEventListener('hardwareBackPress', this.hardwareBackPress);
		this.refreshData();
	}

	refreshData(){
		console.log("refreshData!!!");
		var liveUserInfo = LogicData.getLiveUserInfo();
		if(liveUserInfo){
			this.setState({
				hasWithdrawError: liveUserInfo.bankCardStatus === "Rejected",
			});
		}

		NetworkModule.loadUserBalance(true, (response, isCache)=>{
			if(!isCache){
				this.setState({
					balance: response.refundable,
				});
			}
		});

		this.loadLiveUserInfo();
	}

	loadLiveUserInfo(onSuccess, onError){
		var userData = LogicData.getUserData()
  	if(userData.token == undefined){return}	//This must not be true!!!

		NetworkModule.fetchTHUrl(NetConstants.CFD_API.GET_USER_INFO,{
			method: 'GET',
			headers: {
				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
			},
		},
		(response)=>{
			// if(response.bankCardNumber && response.bankCardNumber != ""){
			// 	response.bankCardRejectReason = "这是一个错误 "
			// 	response.bankCardStatus = "Rejected";
			// 	response.WithdrawAmount = "100";
			// 	response.WithdrawTime = "2017.1.1 19:23:12";
			// }
			LogicData.setLiveUserInfo(response);

			this.setState({
				hasWithdrawError: response.bankCardStatus === "Rejected",
			}, ()=>{
				if(onSuccess){
					onSuccess();
				}
			});
			//{"lastName":"张","firstName":"三","identityID":"310104000000000000","bankCardNumber":"1234567890","bankName":"光大银行","branch":"光大银行上海分行","province":"上海","city":"上海"}
		}, (error)=>{
			if(onError){
				onError();
			}
		});
	}

	getWebViewPageScene(targetUrl, title, hideNavBar) {
		console.log("getWebViewPageScene:::"+targetUrl+" title = "+title +" hideNavBar = " + hideNavBar);
		var userData = LogicData.getUserData()
		var userId = userData.userId
		if (userId == undefined) {
			userId = 0
		}

		if (targetUrl.indexOf('?') !== -1) {
			targetUrl = targetUrl + '&userId=' + userId
		} else {
			targetUrl = targetUrl + '?userId=' + userId
		}

		return {
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: targetUrl,
			title: title,
			isShowNav: hideNavBar ? false : true,
		}
	}

	gotoWebviewPage(targetUrl, title, hideNavBar) {
		this.props.navigator.push(this.getWebViewPageScene(targetUrl, title, hideNavBar));
	}

  onSelectNormalRow(rowData){
    switch(rowData.subtype){
      case 'deposit':
				var meData = LogicData.getMeData()
				console.log("MobileDeposit==>"+meData.mobileDeposit)
				if (meData.mobileDeposit==undefined || meData.mobileDeposit){//如果不能入金，则跳网页版提示页
				    this.props.navigator.push({
                    name: MainPage.DEPOSIT_PAGE,
                    popToOutsidePage: ()=>{this.refreshData();}
                    });
				}else{
                    this.gotoWebviewPage(NetConstants.TRADEHERO_API.DEPOSIT_FLOW_HTML,'入金',false)
				}
        return;
      case 'withdraw':
				var liveUserInfo = LogicData.getLiveUserInfo();
				console.log("liveUserInfo " + JSON.stringify(liveUserInfo))
				if(liveUserInfo == null){
					this.loadLiveUserInfo((userInfo)=>{
						this.goToWithdrawPage(userInfo);
					}, ()=>{
						alert("网络错误，请重试！");
					});
				}else{
					this.goToWithdrawPage(liveUserInfo);
				}

        return;
      case 'details':
				this.props.navigator.push({
					name: MainPage.DEPOSIT_WITHDRAW_FLOW,
				});
        return;
    }
  }

	goToWithdrawPage(liveUserInfo){
		if(liveUserInfo == null){
			alert("网络错误，请重试！");	//What should happen if there's no internet connection?
		} else if(liveUserInfo.bankCardStatus == "PendingReview"
						||liveUserInfo.bankCardStatus == "Rejected"){
			this.props.navigator.push({
				name: MainPage.WITHDRAW_RESULT_ROUTE,
				bankCardStatus: liveUserInfo.bankCardStatus,
				popToOutsidePage: ()=>{this.refreshData();}
			});
		} else if(liveUserInfo.bankCardNumber && liveUserInfo.bankCardNumber !== ""){
			this.props.navigator.push({
				name: MainPage.WITHDRAW_ROUTE,
				popToOutsidePage: ()=>{this.refreshData();}
			});
		}else{
			this.props.navigator.push({
				name: MainPage.WITHDRAW_BIND_CARD_ROUTE,
				popToOutsidePage: ()=>{this.refreshData();}
			});
		}
	}

	pressBackButton() {
		console.log("pressBackButton")
		console.log("this.props.onPopToOutsidePage " + this.props.onPopToOutsidePage)
		this.props.onPopToOutsidePage && this.props.onPopToOutsidePage();
		this.props.navigator.pop();
		return true;
	}

  helpPressed() {
		NativeSceneModule.launchNativeScene('MeiQia')
    //SentIntent.sendPhoneDial(CALL_NUMBER)
  }

  renderHeader(){
		var balance = ""
		if(this.state.balance !== '--'){
			var balanceValue = this.state.balance.toFixed(2);
			if(balanceValue > 0){
				balance += balanceValue;
			}else{
				balance = "0";
			}
		}else{
			balance = "--";
		}

    return(
			<View style={styles.totalTextContainer}>
        <Text style={styles.totalIncomeTitleText}>
          {LS.str('KCZJ')}
        </Text>
        <Text style={styles.totalIncomeText}>
          {balance}
        </Text>
      </View>
    );
  }

	renderRowRightPart(rowData){
		if(rowData.subtype === "withdraw" && this.state.hasWithdrawError){
			return (
				<View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
					<View style={styles.newEventImage}/>
					<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
				</View>
			)
		}
		return (
		<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />);
	}

	renderRow(rowData, sectionID, rowID) {
    if(rowData){
			if(rowData.type == 'header'){
  			return (
  					<View style={[styles.headerWrapper, {backgroundColor: ColorConstants.TITLE_BLUE}]}>
  						{this.renderHeader()}
  					</View>
  			);
  		}
  		else {
  			return(
          <TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
            <View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
              <Image source={rowData.image} style={styles.image} />
              <Text style={styles.title}>{LS.str(rowData.title)}</Text>
							{this.renderRowRightPart(rowData)}
            </View>
          </TouchableOpacity>
  			);
  		}
    }
    return (<View></View>)
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted){
    var nextID = parseInt(rowID) + 1;
  	if(rowID == 0 || ((nextID< listRawData.length) && listRawData[nextID].type === 'detail')){
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
      );
		}
	}

  renderHelp() {
    return(
      <TouchableOpacity style={{flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom: 20}} onPress={()=>this.helpPressed()}>
        <Image style = {styles.lineLeftRight} source = {require('../../images/line_left2.png')} ></Image>
			  <Text style={styles.helpTitle}>{LS.str('SERVICE24HOURS')}</Text>
        {/* <Text style={styles.helpTitle}>{"服务热线：" + CALL_NUMBER}</Text> */}
        <Image style = {styles.lineLeftRight} source = {require('../../images/line_right2.png')} ></Image>
      </TouchableOpacity>
    );
  }

	renderListView(){
		var listDataView = listRawData.map((data, i)=>{
			var row = this.renderRow(data, 's1', i)
			return(
				<View key={i}>
					{row}
					{row != null ? this.renderSeparator('s1', i, false) : null}
				</View>
			);
		})

		return (
			<View>
				{listDataView}
			</View>);
	}

	render() {
		return (
			<View style={{flex: 1, width:width}}>
				<NavBar title={LS.str('CQZJ')} showBackButton={true} leftButtonOnClick={()=>this.pressBackButton()} navigator={this.props.navigator}/>
				<ScrollView >
					{this.renderListView()}
				</ScrollView>
        {this.renderHelp()}
			</View>
		);
	}
}

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
		flex:1,
  },
  totalIncomeTitleText:{
    fontSize: 14,
		marginTop: 41,
    color: ColorConstants.SUB_TITLE_WHITE,
  },
  totalIncomeText:{
    fontSize: 46,
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
		fontSize: 17,
		color: '#000000',
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},
	image: {
		marginLeft: 0,
		marginRight: 11,
		width: 23,
		height: 23,
	},

	contentValue: {
		fontSize: 17,
		marginRight: 5,
		color: '#757575',
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		flex: 1,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
  helpTitle: {
		fontSize: 14,
		textAlign: 'center',
		color: '#415a87',
	},
	lineLeftRight:{
	 	width:100,
		height:1,
		margin:5,
	},
	moreImage: {
		alignSelf: 'center',
		width: 7.5,
		height: 12.5,
	},
	newEventImage:{
		width: 6,
		height: 6,
		backgroundColor: '#ff0000',
		borderRadius: 5,
		marginRight: 8,
	},
});

module.exports = DepositWithdrawPage;
