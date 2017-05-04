'use strict';

import React, {Component, PropTypes} from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	Platform,
	ScrollView,
	Modal,
	Alert,
	BackAndroid,
	Keyboard,
} from 'react-native';

var NativeSceneModule = require('../../module/NativeSceneModule')
var Button = require('../component/Button')
var CheckBoxButton = require('../component/CheckBoxButton')
var MainPage = require('../MainPage')
var LogicData = require('../../LogicData')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var NavBar = require('../NavBar')
var UserInfoSelectorProvider = require('./UserInfoSelectorProvider')
var ErrorBar = require('../component/ErrorBar')
var SentIntent = require('../component/nativeIntent/SendIntent')
var dateFormat = require('dateformat');

var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require('../../NetConstants');
var LogicData = require('../../LogicData');

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)

var rowTitleWidth = (width - (2 * rowPadding)) / 4;
var rowValueWidth = (width - (2 * rowPadding)) / 4 * 3;

var defaultRawData = [
		{"title":"姓名", "key": "AccountHolder", "value":""},
		{"title":"开户城市", "key": "ProvinceAndCity", "value":"",},
		{"title":"开户银行", "key": "NameOfBank", "value":"",},
		{"title":"支行名称", "key": "Branch", "value":"",},
		{"title":"银行卡号", "key": "AccountNumber", "value":"",},
		{"title":"出金金额", "key": "lastWithdraw", "value":""},
		{"title":"出金时间", "key": "lastWithdrawAt", "value":"",},
];

var CALL_NUMBER = '66058771';

export default class BindCardResultPage extends Component {
	hardwareBackPress = ()=>{return this.backButtonPressed();};
  listRawData = [];
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 });
  provinceAndCities = [];

  static propTypes = {
		bankCardStatus: PropTypes.string, //None, PendingReview, Approved, Rejected
		popToOutsidePage: PropTypes.func,
		withdrawData: PropTypes.object,
  }

  static defaultProps = {
		bankCardStatus: "None", //
		popToOutsidePage: ()=>{},
		withdrawData: null,
  }

  constructor(props) {
	  super(props);

    this.listRawData = JSON.parse(JSON.stringify(defaultRawData));

    this.state={
      dataSource: this.ds.cloneWithRows(this.listRawData),
			validateInProgress: false,
			bankCardRejectReason: "",
    }
  }

	componentWillUnmount(){
		BackAndroid.removeEventListener('hardwareBackPress', this.hardwareBackPress);
	}

  componentWillMount(){
		BackAndroid.addEventListener('hardwareBackPress', this.hardwareBackPress);

		var liveUserInfo = LogicData.getLiveUserInfo();
		this.setState({
			bankCardRejectReason: liveUserInfo.bankCardRejectReason,
			pendingDays: liveUserInfo.pendingDays,
		})
		this.listRawData[0].value = liveUserInfo.lastName + liveUserInfo.firstName;

		if(this.props.bankCardStatus === "Rejected"){
			this.unbindCard();
		}

    //Get the users card information.
		for(var i = 0; i < this.listRawData.length; i++){
      switch(this.listRawData[i].key){
        case "ProvinceAndCity":
          this.listRawData[i].value = "" + liveUserInfo.province + "," + liveUserInfo.city;
          break;
        case "AccountHolder":
          this.listRawData[i].value = liveUserInfo.lastName + liveUserInfo.firstName;
          break;
        case "NameOfBank":
          this.listRawData[i].value = liveUserInfo.bankName;
          break;
        case "Branch":
          this.listRawData[i].value = liveUserInfo.branch;
          break;
        case "AccountNumber":
          var cardNumber = liveUserInfo.bankCardNumber;

					//Star the card number!
          var realNumberString = cardNumber.split(" ").join('');
          var startIndex = Math.max(0, (realNumberString.length > 10 ? 6 : ((realNumberString.length / 2).toFixed(0) - 1)));
          var endIndex = Math.max(0, realNumberString.length > 10 ? 4 : ((realNumberString.length / 2).toFixed(0) - 2));
          var starSize = realNumberString.length - startIndex - endIndex;

          var stars = Array(starSize+1).join("*")
          var staredCardNumber = realNumberString.substr(0, startIndex) + stars + realNumberString.substr(realNumberString.length - endIndex);

          var finalText = "";
          for(var j = 0; j < staredCardNumber.length; j +=4){
            if(j!=0){
              finalText+=" ";
            }
            finalText += staredCardNumber.slice(j, j+4);
          }
          this.listRawData[i].value = finalText;

          break;
				// case "lastWithdraw":
				// 	if(this.props.bankCardStatus !== "Approved"){
				// 		this.listRawData[i].value = liveUserInfo.lastWithdraw;
				// 	}
				// 	break;
				// case "lastWithdrawAt":
				// 	if(this.props.bankCardStatus !== "Approved"){
				// 		var dt = new Date(liveUserInfo.lastWithdrawAt);
			  //     var month = dt.getMonth()+1;
			  //     var timeString = dateFormat(dt, "yyyy.mm.dd HH:MM:ss");
				// 		this.listRawData[i].value = timeString;
				// 	}
				// 	break;
        default:
          break;
    	}
		}

		console.log("this.listRawData" + JSON.stringify(this.listRawData));
	}

	backButtonPressed(){
		this.props.popToOutsidePage && this.props.popToOutsidePage();
		this.props.navigator.pop();

		return true;
	}

  pressHelpButton(){
		this.props.navigator.push({
      name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
      url: NetConstants.TRADEHERO_API.HELP_CENTER_URL_ACTUAL,
      isShowNav: false,
      title: "帮助中心",
    });
  }

	helpPressed() {
		NativeSceneModule.launchNativeScene('MeiQia')
		// SentIntent.sendPhoneDial(CALL_NUMBER)
	}

	goToBindCardPage(){
		this.setState({
			validateInProgress: true,
		})

		this.props.navigator.replace({
			name: MainPage.WITHDRAW_BIND_CARD_ROUTE,
			popToOutsidePage: this.props.popToOutsidePage,
		});
	}

	readyToUnbindCard(){
		// this.setState({
		// 	modalVisible: true,
		// });
		var liveUserInfo = LogicData.getLiveUserInfo();
		var cardNumber = liveUserInfo.bankCardNumber;
		var realNumberString = cardNumber.split(" ").join('');
		var lastNumber = realNumberString.slice(realNumberString.length - 4);

		Alert.alert(
		  '确认删除',
		  '尾号为' + lastNumber + "的银行卡",
		  [
		    {text: '取消', onPress: () => console.log('cancel unbind  d'), style: 'cancel'},
			  {text: '确认', onPress: () => this.unbindCard()},
		  ]
		)
	}

  unbindCard(){
		// this.setState({
		// 	modalVisible: false,
		// });

		var userData = LogicData.getUserData()
		if(userData.token == undefined){return}

		//Get userinfo
		NetworkModule.fetchTHUrl(NetConstants.CFD_API.REQUEST_UNBIND_CARD,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			(responseJson)=>{
				console.log("aaaa");
				var liveUserInfo = LogicData.getLiveUserInfo();
				var clearedInfo = {};
				clearedInfo.firstName = liveUserInfo.firstName;
				clearedInfo.lastName = liveUserInfo.lastName;
				LogicData.setLiveUserInfo(clearedInfo);

				if(this.props.bankCardStatus === "Approved"){
					console.log("bbbb");

					var routes = this.props.navigator.getCurrentRoutes();
					var popToRoute = null;
					for(var i = routes.length - 2; i >= 0 ;i --){
						if(routes[i].name === MainPage.DEPOSIT_WITHDRAW_ROUTE){
							popToRoute = routes[i];
							break;
						}
					}

					if(popToRoute){
						this.props.navigator.popToRoute(popToRoute);
					}else{
						this.props.navigator.pop();
					}
				}
			},
			(result)=>{
				alert(result.errorMessage);
			});

  }

	renderHelp() {
		if(this.props.bankCardStatus === "Rejected"){
	    return(
	      <TouchableOpacity style={{flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom: 20}} onPress={()=>this.helpPressed()}>
	        <Image style = {styles.lineLeftRight} source = {require('../../../images/line_left2.png')} ></Image>
					<Text style={styles.helpTitle}>{"盈盈在线24小时服务"}</Text>
	        {/* <Text style={styles.helpTitle}>服务热线：{CALL_NUMBER}</Text> */}
	        <Image style = {styles.lineLeftRight} source = {require('../../../images/line_right2.png')} ></Image>
	      </TouchableOpacity>
	    );
		}
  }

	renderRowValue(rowData, rowID){
		var displayText = rowData.value;

		return (<Text style={styles.valueText}
				ellipsizeMode="middle"
				value={displayText}
				underlineColorAndroid='transparent'
				numberOfLines={1}>
				{displayText}
			</Text>);
	}

	displayRow(rowID){
		if(this.listRawData[rowID].value == null || this.listRawData[rowID].value === ""){
			return false;
		}else{
			return true;
		}
	}

	renderRow(rowData, sectionID, rowID) {
		if(!this.displayRow(rowID)){
			return null;
		}
    return (
      <View style={styles.rowWrapper}>
				<Text style={styles.rowTitle}>{rowData.title}</Text>
				<Text style={styles.valueText}>
          {rowData.value}
        </Text>
			</View>
    );
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted){
		if(!this.displayRow(rowID)){
			return null;
		}
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
			)
	}

	renderHintView(){
		var hintText = "";
		switch(this.props.bankCardStatus){
			case "PendingReview":
			 	hintText = "";//"注意：首次出金需审核银行卡信息，出金于3个工作日内完成";
				break;
			case "Rejected":
				hintText = "";//"注意：出金金额于3个工作日内退还到您的实盘账户";
				break;
		}
		if(hintText!==""){
			return (
				<View>
					<Text style={styles.hintText}>{hintText}</Text>
				</View>
			)
		}
		return null;
	}

  renderActionButton(){
    var nextEnabled = true;
    var buttonText = "";
		var buttonAction = ()=>{};
		switch(this.props.bankCardStatus){
			case "PendingReview":
				buttonText = "预计"+ this.state.pendingDays + "个工作日内绑定成功";
				nextEnabled = false;
				break;
			case "Rejected":
				buttonText = "重新绑卡";
				buttonAction = ()=>this.goToBindCardPage();
				break;
			case "Approved":
				buttonText = "解除绑定";
				buttonAction = ()=>this.readyToUnbindCard();
		}

    return (
      <View style={styles.bottomArea}>
        <Button style={styles.buttonArea}
          enabled={this.state.validateInProgress ? false : nextEnabled}
          onPress={buttonAction}
          textContainerStyle={styles.buttonView}
          textStyle={styles.buttonText}
          text={this.state.validateInProgress? "信息正在检查中...": buttonText} />
      </View>
    );
  }

	renderError(){
		if(this.props.bankCardStatus === "Rejected"){
			return (
				<ErrorBar error={this.state.bankCardRejectReason}/>
			);
		}
		return null;
	}

	render() {
		var title = "";
		console.log("this.props.bankCardStatus " + this.props.bankCardStatus)
		title = "我的银行卡";
		// switch(this.props.bankCardStatus){
		// 	case "PendingReview":
		// 		title = "我的银行卡";
		// 		break;
		// 	case "Approved":
		// 		title = "我的银行卡";
		// 		break;
		// 	case "Rejected":
		// 		title = "我的银行卡";
		//	}
		return (
			<View style={styles.wrapper}>
        <NavBar title={title}
          showBackButton={true}
					leftButtonOnClick={()=>this.backButtonPressed()}
          navigator={this.props.navigator}
          imageOnRight={require('../../../images/icon_question.png')}
          rightImageOnClick={()=>this.pressHelpButton()}
          />
				{this.renderError()}
				<ScrollView style={styles.list}>
					{this.renderListView()}
				</ScrollView>
				{this.renderHelp()}
        {this.renderActionButton()}
			</View>
		);
	}

	renderListView(){
		var listDataView = this.listRawData.map((data, i)=>{
			return(
				<View key={i}>
					{this.renderRow(data, 's1', i)}
					{this.renderSeparator('s1', i, false)}
				</View>
			);
		})

		return (
			<View>
				{listDataView}
				{/* {this.renderHintView()} */}
			</View>);
	}
};

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
   		alignItems: 'stretch',
    	justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},

	list: {
		flex: 1,
	},
	rowWrapper: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#ffffff',
		paddingTop: rowPadding,
		paddingBottom: rowPadding,
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		marginLeft: 0,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	rowTitle:{
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		width:rowTitleWidth,
	},
	valueText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		flex: 1,
		marginTop: -rowPadding,
		marginBottom: -rowPadding,
		alignItems:'center',
		justifyContent:'center',
		marginLeft:0,
		paddingLeft:0
	},
	hintText: {
		fontSize: 12,
		color: '#858585',//ColorConstants.INPUT_TEXT_COLOR,
		alignItems:'center',
		justifyContent:'center',
		margin: 15,
	},
	valueContent:{
		flex: 1,
		flexDirection: 'row',
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
		backgroundColor: ColorConstants.TITLE_DARK_BLUE,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
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
});


module.exports = BindCardResultPage;
