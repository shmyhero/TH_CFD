'use strict'

import React, { Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
	Dimensions,
	ListView,
	TextInput,
	TouchableOpacity,
	Image,
	Platform,
	ScrollView,
  Keyboard,
} from 'react-native';

var NavBar = require('../NavBar');
var Button = require('../component/Button');

var MainPage = require('../MainPage')
var LogicData = require('../../LogicData')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')

// var OpenAccountRoutes = require('./OpenAccountRoutes')
// var OpenAccountUtils = require('./OpenAccountUtils')
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require('../../NetConstants');
var LogicData = require('../../LogicData');


var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)

var rowTitleWidth = (width - (2 * rowPadding)) / 4;
var rowValueWidth = (width - (2 * rowPadding)) / 4 * 3;

var defaultRawData = [
		{"type": "cardEntry",},
		{"type": "withdraw", value: null},
];

export default class WithdrawIncomePage extends Component {
  static propTypes = {
		popToOutsidePage: PropTypes.func,
  }

  static defaultProps = {
		popToOutsidePage: ()=>{},
  }

  hardwareBackPress = ()=>{return this.onBackButtonPressed();}
  listRawData = [];
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 });
  constructor(props) {
	  super(props);

    // this.listRawData = JSON.parse(JSON.stringify(defaultRawData));
    //
    // var liveUserInfo = LogicData.getLiveUserInfo();
    // var balanceData = LogicData.getBalanceData();
    // if(liveUserInfo){
    //   var cardNumber = liveUserInfo.bankCardNumber.split(" ").join('');
    //   var lastCardNumber = cardNumber.length>4 ? cardNumber.slice(cardNumber.length-4) : cardNumber;
    //
    //   var cardBank = liveUserInfo.bankName;
    //   var bankIcon = liveUserInfo.bankIcon;
    //   var withdrawChargeHint = balanceData.comment;
    //
    //   this.state={
    //     dataSource: this.ds.cloneWithRows(this.listRawData),
    //     cardImageUrl: bankIcon,
  	// 		cardBank: cardBank,
  	// 		lastCardNumber: lastCardNumber,
    //     refundableBanalce: LogicData.getBalanceData().refundable,
    //     withdrawValueText: "",
    //     withdrawValue: 0,
    //     hasRead: true,
    //     withdrawChargeHint: withdrawChargeHint,
    //     refundETA: 3,
    //   }
    // }

    this.state={
      dataSource: this.ds.cloneWithRows(this.listRawData),
      refundableBanalce: LogicData.getTotalUnpaidIncome(), //TODO: use real data.
      withdrawValueText: "",
      withdrawValue: 0,
      hasRead: true,
      //withdrawChargeHint: withdrawChargeHint,
    }
  }

  componentDidMount(){
    var userData = LogicData.getUserData()
    if(userData.token == undefined){return}

    // NetworkModule.loadUserBalance(true, (response)=>{
    //   this.setState({
    //     refundableBanalce: response.refundable,
    //   })
    // })
    //
    // NetworkModule.fetchTHUrl(NetConstants.CFD_API.REFUND_ESTIMATED_DAYS,
    //   {
    //     method: 'GET',
    //   },
    //   (days)=>{
    //     this.setState({
    //       refundETA: days,
    //     })
    //   });
  }

  hideKeyboard(){
    Keyboard.dismiss();
    this.setState({
      keyboardHiderShown: false,
    })
  }

  withdrawAll(){
    var newState = {
      withdrawValueText: "" + this.state.refundableBanalce,
      withdrawValue: this.state.refundableBanalce,
    }
    console.log("withdrawAll " + JSON.stringify(newState))
    console.log("this.state.withdrawValue1" + this.state.withdrawValue);
    this.setState({
      withdrawValueText: "" + this.state.refundableBanalce,
      withdrawValue: this.state.refundableBanalce,
    }, ()=>{
      console.log("this.state.withdrawValue2" + this.state.withdrawValue);
    })
  }

  onChangeWithdrawValue(text){
    var newState = {
      withdrawValueText: this.state.withdrawValueText,
    };//{withdrawValueText: text,}
    if(text !== ""){
      var re = /^\d+\.?\d{0,2}$/;
      var found = text.match(re);
      if(found){
        var value = parseFloat(text);
        if(!isNaN(value)){
          newState.withdrawValueText = text;
          newState.withdrawValue = value;
        }
      }
    }else{
      newState.withdrawValueText = "";
      newState.withdrawValue = 0;
    }

    console.log("newState " + JSON.stringify(newState));
    this.setState(newState);
  }

  onClickCheckbox(value){
    this.setState({
      hasRead: value
    })
  }

  isWithdrawValueAvailable(){
    if(this.state.withdrawValue > this.state.refundableBanalce){
      return false;
    }
    return true;
  }

  gotoCardInfoPage(){
    this.props.navigator.push({
      name: MainPage.WITHDRAW_RESULT_ROUTE,
      popToOutsidePage: this.props.popToOutsidePage,
      bankCardStatus: "Approved",
    })
  }

  renderWithdraw(rowData, section, rowID){
    var withdrawValue = this.state.withdrawValueText;
    var withdrawValueError = false;
    var inputStyle = styles.normalInputText;
    var fundableValueStyle = styles.fundableValueText;
    var fundableValueText = "剩余交易金: " + this.state.refundableBanalce + "元， ";
    if(!this.isWithdrawValueAvailable()){
      inputStyle = styles.errorInputText;
      fundableValueStyle = styles.errorInputText;
      withdrawValueError = true;
      fundableValueText = "大于剩余交易金: " + this.state.refundableBanalce + "元， ";
    }

    return (
      <View style={[styles.rowWrapper, styles.depositRowWrapper]}>
        <Text style={{fontSize: 15, color: '#5a5a5a', marginTop: 18}}>转入金额</Text>
        <View style={{flexDirection: 'row', marginTop:10, alignItems:"center"}}>
          <Text style={{fontSize: 17, fontWeight: 'bold', color: '#333333'}}>人民币</Text>
          <TextInput style={[styles.inputText, inputStyle]}
            autoCapitalize="none"
            autoFocus={true}
            autoCorrect={false}
            defaultValue={this.state.withdrawValue}
            // placeholder={rowData.hint}
            placeholderTextColor={ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR}
            selectionColor={'#bfccfb'}
            underlineColorAndroid='transparent'
            value={withdrawValue}
            onChangeText={(text)=>this.onChangeWithdrawValue(text)}
            keyboardType={"numeric"}
            //  onChange={(text)=>this.ontextInputChange(text, rowID)}
            />
        </View>
        <View style={[styles.line, {alignSelf: 'stretch'}]} key={rowID}>
          <View style={styles.separator}/>
        </View>
        <View style={{height:38, flexDirection: 'row', marginTop: 13,}}>
          <Text style={fundableValueStyle}>{fundableValueText}</Text>
          <TouchableOpacity onPress={()=>this.withdrawAll()}>
            <Text style={{fontSize: 14, color: '#415a86', }}>
              全部转入
              <Text style={{color: 'transparent'}}>
                0
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderSeparator(rowData, section, rowID){
    if(rowData.type === 'cardEntry'){
      return(
        <View style={styles.bigSeparator} key={rowID}>
          <View style={styles.separator}/>
        </View>
      )
    }else if(rowData.type === 'withdraw'){
      return(
        <View style={styles.line} key={rowID}>
          <View style={styles.separator}/>
        </View>
      )
    }
  }

  renderListView(){
		var listDataView = this.listRawData.map((data, i)=>{
			return(
				<View key={i} style={{marginTop: 10}}>
					{this.renderRow(data, 's1', i)}
					{this.renderSeparator(data, 's1', i, false)}
				</View>
			);
		})

		return (
			<View>
				{listDataView}
			</View>);
	}

  gotoNext(){
    Keyboard.dismiss();
    this.props.navigator.replace({
      name: MainPage.WITHDRAW_INCOME_SUBMITTED_ROUTE,
      popToOutsidePage: this.props.popToOutsidePage,

    });
    // var body = {
    //   Amount: this.state.withdrawValue,
    // }
    //
    // var userData = LogicData.getUserData()
    // if(userData.token == undefined){return}
    //
    // this.setState({
    //   validateInProgress: true,
    // })
    //
    // NetworkModule.fetchTHUrl(NetConstants.CFD_API.REQUEST_WITHDRAW,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
    //       'Content-Type': 'application/json; charset=utf-8',
    //     },
    //     body: JSON.stringify(body),
    //   },
    //   (transferID)=>{
    //     console.log("Request withdraw success. TransferID: " + transferID);
    //     this.setState({
    //       validateInProgress: false,
    //     })
    //     this.props.popToOutsidePage && this.props.popToOutsidePage();
    //     this.props.navigator.push({
    //       name: MainPage.WITHDRAW_SUBMITTED_ROUTE,
    //     });
    //   },
    //   (result)=>{
    //     alert(result.errorMessage);
    //   });
  }

  showWithdrawDocument(){
    this.props.navigator.push({
      name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
      url: NetConstants.TRADEHERO_API.WITHDRAW_AGREEMENT_URL,
      title: "出金协议",
    });
  }

  onBackButtonPressed(){
    this.props.popToOutsidePage && this.props.popToOutsidePage();
		this.props.navigator.pop();
    return true;
  }

  render() {
		var nextEnabled = true;//OpenAccountUtils.canGoNext(this.listRawData);
		//console.log("listRawData: " + JSON.stringify(listRawData));
		if(!this.state.withdrawValue || !this.isWithdrawValueAvailable()){
      nextEnabled = false;
    }else if(!this.state.hasRead){
      nextEnabled = false;
    }

    return (
			<View style={styles.wrapper}>
        <NavBar title="转入"
          showBackButton={true}
          leftButtonOnClick={()=>this.onBackButtonPressed()}
          navigator={this.props.navigator}
          imageOnRight={require('../../../images/icon_question.png')}
          />
        <View style={{flex:1}}>
					{this.renderWithdraw()}
          <TouchableOpacity style={{flex:1}} onPress={()=>this.hideKeyboard()} activeOpacity={1}>
            <Text style={[styles.readMeText, {margin:15, }]}>
              注意：转入申请在3个工作日内完成，资金到账后，系统会根据汇率兑换成相应的美元金额，并以短信告知您。
            </Text>
          </TouchableOpacity>
  				<View style={styles.bottomArea}>
  					<Button style={styles.buttonArea}
  						enabled={this.state.validateInProgress ? false : nextEnabled}
  						onPress={()=>this.gotoNext()}
  						textContainerStyle={[styles.buttonView, {backgroundColor: ColorConstants.TITLE_BLUE,}]}
  						textStyle={styles.buttonText}
  						text={this.state.validateInProgress? "信息正在检查中...": '确认转入'} />
  				</View>
        </View>
			</View>
		);
  }
}

const styles = StyleSheet.create({
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
	},
  cardRowWrapper: {
    height: 60
  },
  depositRowWrapper:{
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  bigSeparator: {
    marginLeft: 0,
    marginBottom: 0,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
  },
	rowTitle:{
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		width:rowTitleWidth,
	},
	valueText: {
		fontSize: 30,
		color: ColorConstants.INPUT_TEXT_COLOR,
		flex: 1,
		alignItems:'center',
		justifyContent:'center',
		marginLeft:0,
		paddingLeft:0
	},
	centerText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		alignItems:'center',
		justifyContent:'center',
		margin: 0,
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
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
	moreImage: {
		alignSelf: 'center',
		width: 7.5,
		height: 12.5,
	},
  bankTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
  },
  cardNumberText: {
    fontSize: 17,
    color: '#5a5a5a',
    marginTop: 5,
  },
  bottomHintText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
    color: '#415a87',
  },
  inputText:{
    fontSize: 50,
    color: '#000000',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    marginLeft:10,
    paddingLeft:0,
    height: 80
  },
  normalInputText: {
    color: '#000000',
  },
  fundableValueText: {
    color: '#747474',
  },
  errorInputText: {
    color: '#d71a18',
  },
  readMeText:{
    fontSize: 12,
    color: '#858585',
  },
  documentText:{
    fontSize: 12,
    color: '#ff6666',
  }
});

module.exports = WithdrawIncomePage;
