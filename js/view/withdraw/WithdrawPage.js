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

var InputAccessory = require('../component/InputAccessory')
var CheckBoxButton = require('../component/CheckBoxButton')
var MainPage = require('../MainPage')
var LogicData = require('../../LogicData')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')

// var OpenAccountRoutes = require('./OpenAccountRoutes')
// var OpenAccountUtils = require('./OpenAccountUtils')
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require('../../NetConstants');
var LogicData = require('../../LogicData');

var LS = require('../../LS')

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)

var rowTitleWidth = (width - (2 * rowPadding)) / 4;
var rowValueWidth = (width - (2 * rowPadding)) / 4 * 3;

var defaultRawData = [
		{"type": "cardEntry",},
		{"type": "withdraw", value: null},
];

export default class WithdrawPage extends Component {
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

    this.listRawData = JSON.parse(JSON.stringify(defaultRawData));

    var liveUserInfo = LogicData.getLiveUserInfo();
    var balanceData = LogicData.getBalanceData();
    if(liveUserInfo){
      var cardNumber = liveUserInfo.bankCardNumber ? liveUserInfo.bankCardNumber.split(" ").join('') : "";
      var lastCardNumber = cardNumber.length>4 ? cardNumber.slice(cardNumber.length-4) : cardNumber;

      var cardBank = liveUserInfo.bankName;
      var bankIcon = liveUserInfo.bankIcon;
      var bankCardStatus = liveUserInfo.bankCardStatus;
      var pendingDays = liveUserInfo.pendingDays;
      var withdrawChargeHint = balanceData ? balanceData.comment : LS.str("WITHDRAW_CHARGE_HINT");

      this.state={
        dataSource: this.ds.cloneWithRows(this.listRawData),
        cardImageUrl: bankIcon,
        cardBank: cardBank,
        lastCardNumber: lastCardNumber,
        refundableBanalce: LogicData.getBalanceData().refundable,
        minRefundableBanalce: LogicData.getBalanceData().minRefundable,
        withdrawValueText: "",
        withdrawValue: 0,
        hasRead: false,
        withdrawChargeHint: withdrawChargeHint,
        refundETA: "3-5",
        feeRate: 0.01,
        minFee: 5.00,
        fee: (0.00).toFixed(2),
        bankCardStatus: bankCardStatus,
        pendingDays: pendingDays,
      }
    }
  }

  componentDidMount(){
    var userData = LogicData.getUserData()
    if(userData.token == undefined){return}

    NetworkModule.loadUserBalance(true, (response)=>{
      this.setState({
        refundableBanalce: response.refundable,
        minRefundableBanalce: response.minRefundable,
      })
    })

    NetworkModule.fetchTHUrl(NetConstants.CFD_API.REFUND_SETTINGS,
      {
        method: 'GET',
      },
      (responseJson)=>{
        //{"charge":{"minimum":0.0,"rate":0.0},"eta":3}
        this.setState({
          refundETA: responseJson.eta,
          minFee: responseJson.charge.minimum,
          feeRate: responseJson.charge.rate
        })
      });
  }

  hideKeyboard(){
    Keyboard.dismiss();
    this.setState({
      keyboardHiderShown: false,
    })
  }

  pressHelpButton(){
    this.props.navigator.push({
      name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
      url: NetConstants.TRADEHERO_API.HELP_CENTER_URL_ACTUAL,
      isShowNav: false,
      title: LS.str("BZZX"),
    });
  }

  withdrawAll(){
    this.setState({
      withdrawValueText: "" + this.state.refundableBanalce,
      withdrawValue: this.state.refundableBanalce,
      fee: this.generateFee(this.state.refundableBanalce),
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
        newState.fee = this.generateFee(newState.withdrawValue);
      }
    }else{
      newState.withdrawValueText = "";
      newState.withdrawValue = 0;
      newState.fee = (0.00).toFixed(2)
    }
    console.log("newState " + JSON.stringify(newState));
    this.setState(newState);
  }

  onClickCheckbox(value){
    this.setState({
      hasRead: value
    })
  }

  generateFee(withdrawValue){
    if(withdrawValue == 0){
      return 0.00.toFixed(2);
    }
    var fee = (withdrawValue * this.state.feeRate).toFixed(2);
    if(fee < this.state.minFee){
      fee = (this.state.minFee).toFixed(2);
    }
    return fee;
  }

  isWithdrawValueAvailable(){
    var error = this.getWithdrawValueError()
    return error == null;
  }

  getWithdrawValueError(){
    if(this.state.withdrawValueText && this.state.withdrawValueText.length > 0){
      if(this.state.withdrawValue > this.state.refundableBanalce){
        return LS.str("WITHDRAW_GT_AVAILABLE").replace("{1}", this.state.refundableBanalce);
      }
      if (this.state.refundableBanalce < this.state.minRefundableBanalce && this.state.withdrawValue < this.state.refundableBanalce){
        return LS.str("WITHDRAW_LT_AVAILABLE")
      }
      if(this.state.withdrawValue < this.state.minRefundableBanalce && this.state.refundableBanalce >= this.state.minRefundableBanalce){
        return LS.str("WITHDRAW_MINIMUM_VALIE")
      }
      return null;
    }
  }

  gotoCardInfoPage(){
    this.props.navigator.push({
      name: MainPage.WITHDRAW_RESULT_ROUTE,
      popToOutsidePage: this.props.popToOutsidePage,
      bankCardStatus: this.state.bankCardStatus,
    })
  }

  renderBindCardStatus(){
    if(this.state.bankCardStatus === "PendingReview"){
      return(
        <Text style={[styles.hintText, styles.warningHintText]}>{LS.str("WITHDRAW_VERIFING")}</Text>
      )
    }
    else{
      return(
        <Text style={[styles.hintText, styles.successHintText]}>{LS.str("WITHDRAW_BIND_SUCCEED_AND_UNBIND")}</Text>
      )
    }
  }

  renderRow(rowData, section, rowID){
    if(rowData.type === 'cardEntry'){
      return (
        <TouchableOpacity style={[styles.rowWrapper, styles.cardRowWrapper]} onPress={()=>this.gotoCardInfoPage()}>
          <Image source={{uri: this.state.cardImageUrl}} style={{height: 40, width: 40, resizeMode: 'contain', margin: 15, marginLeft: 0,}} />
          <View style={{flexDirection: 'column', flex: 1,}}>
   					<Text style={styles.bankTitle}>{this.state.cardBank}</Text>
  	        <Text style={styles.cardNumberText}>{LS.str("WITHDRAW_CARD_NUMBER_END_WITH").replace("{1}", this.state.lastCardNumber)}</Text>
          </View>
          {/* {this.renderBindCardStatus()} */}
          <Image style={styles.moreImage} source={require("../../../images/icon_arrow_right.png")} />
        </TouchableOpacity>
      );
    }else if(rowData.type === 'withdraw'){
      var withdrawValue = this.state.withdrawValueText;
      var withdrawValueError = false;
      var inputStyle = styles.normalInputText;
      var fundableValueStyle = styles.fundableValueText;
      var refundableBalance = this.state.refundableBanalce;
      if(!refundableBalance){
        refundableBalance = (0.00).toFixed(2)
      }

      var withdrawAllText = LS.str("WITHDRAW_ALL");

      var fundableValueText = LS.str("WITHDRAW_AVAILABLE_AMOUNT").replace("{1}", refundableBalance);
      var errorText = this.getWithdrawValueError();
      if(errorText != null){
        inputStyle = styles.errorInputText;
        fundableValueStyle = styles.errorInputText;
        withdrawValueError = true;
        fundableValueText = errorText;
        if (this.state.refundableBanalce < this.state.minRefundableBanalce
           && this.state.withdrawValue < this.state.refundableBanalce){
          withdrawAllText = LS.str("WITHDRAW_MUST_WITHDRAW_ALL");
        }
      }

      return (
        <View style={[styles.rowWrapper, styles.depositRowWrapper]}>
          <View style={{flexDirection: 'row', alignSelf:'stretch', justifyContent:'space-between'}}>
 					    <Text style={styles.midiumText}>{LS.str('WITHDRAW_AMOUNT')}</Text>
              <Text style={[styles.midiumText, {alignSelf: 'flex-end'}]}>{LS.str("WITHDRAW_FEE").replace("{1}", this.state.fee)}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop:10, alignItems:"center"}}>
   					<Text style={{fontSize: 17, fontWeight: 'bold', color: '#333333'}}>{LS.str("WITHDRAW_DOLLAR")}</Text>
            <TextInput style={[styles.inputText, inputStyle]}
   						autoCapitalize="none"
              autoFocus={true}
   						autoCorrect={false}
   						defaultValue={rowData.value}
   						placeholder={rowData.hint}
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
                {withdrawAllText}
                <Text style={{color: 'transparent'}}>
                  0
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
 				</View>
      )
    }
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

    var body = {
      Amount: this.state.withdrawValue,
    }

    var userData = LogicData.getUserData()
    if(userData.token == undefined){return}

    this.setState({
      validateInProgress: true,
    })

    NetworkModule.fetchTHUrl(NetConstants.CFD_API.REQUEST_WITHDRAW,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
      },
      (transferID)=>{
        console.log("Request withdraw success. TransferID: " + transferID);
        this.setState({
          validateInProgress: false,
        })
        this.props.popToOutsidePage && this.props.popToOutsidePage();
        this.props.navigator.push({
          name: MainPage.WITHDRAW_SUBMITTED_ROUTE,
        });
      },
      (result)=>{
        alert(result.errorMessage);
      });
  }

  showWithdrawDocument(){
    this.props.navigator.push({
      name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
      url: NetConstants.TRADEHERO_API.WITHDRAW_AGREEMENT_URL,
      title: LS.str("WITHDRAW_DOCUMENT_HEADER"),
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

    var buttonText = LS.str("WITHDRAW_WITHDRAW_REQUIRED_DAYS").replace("{1}", this.state.refundETA);
    if(this.state.bankCardStatus === "PendingReview"){
      nextEnabled = false;
      buttonText = LS.str("WITHDRAW_BINDING_CARD_REQUIRED_DAYS").replace("{1}", this.state.pendingDays);
    }

    return (
			<View style={styles.wrapper}>
        <NavBar title={LS.str("WITHDRAW_HEADER")}
          showBackButton={true}
          leftButtonOnClick={()=>this.onBackButtonPressed()}
          navigator={this.props.navigator}
          imageOnRight={require('../../../images/icon_question.png')}
          rightImageOnClick={()=>this.pressHelpButton()}
          />
        <View style={{flex:1}}>
					{this.renderListView()}
          <Text style={styles.bottomHintText}>{LS.str("WITHDRAW_CHARGE_HINT_PS")+this.state.withdrawChargeHint}</Text>
          <TouchableOpacity style={{flex:1}} onPress={()=>this.hideKeyboard()}></TouchableOpacity>
          <View style={styles.checkboxView}>
            <CheckBoxButton
              defaultSelected={this.state.hasRead}
              onPress={(value)=>{this.onClickCheckbox(value)}}
              selectedIcon={require('../../../images/check_selected.png')}
              unSelectedIcon={require('../../../images/check_unselected.png')}>
              <View style={{flexDirection:'column'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.readMeText}>
                    {LS.str("WITHDRAW_READ")}
                    <Text style={{color: 'transparent',}}>0</Text>
                  </Text>
                  <TouchableOpacity onPress={()=>this.showWithdrawDocument()}>
                    <Text style={styles.documentText}>
                    {LS.str("WITHDRAW_DOCUMENT")}
                    <Text style={{color: 'transparent',}}>0</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CheckBoxButton>
          </View>
  				<View style={styles.bottomArea}>
  					<Button style={styles.buttonArea}
  						enabled={this.state.validateInProgress ? false : nextEnabled}
  						onPress={()=>this.gotoNext()}
  						textContainerStyle={styles.buttonView}
  						textStyle={styles.buttonText}
  						text={this.state.validateInProgress? LS.str("VALIDATE_IN_PROGRESS"): buttonText} />
  				</View>
        </View>
        {this.renderAccessoryBar()}
			</View>
		);
  }

  renderAccessoryBar(){
		if(Platform.OS === 'ios'){
			return(
				<InputAccessory ref='InputAccessory'
					enableNumberText={false}/>
			)
		}else{
			return(
				<View></View>
			)
		}
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
		backgroundColor: ColorConstants.TITLE_DARK_BLUE,
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
    fontSize: 12,
    color: '#858585',
    margin: 15,
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
	checkboxView: {
		height: 30,
		paddingLeft: 15,
		paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,//12,
	},
  checkbox: {
    width: 20,
    flex: 0,
  },
  readMeText:{
    fontSize: 12,
    color: '#858585',
  },
  documentText:{
    fontSize: 12,
    color: '#ff6666',
  },
  midiumText:{
    fontSize: 15,
    color: '#5a5a5a',
    marginTop: 18,
  },
  hintText:{
    fontSize:12,
    marginRight:5,
  },
  warningHintText:{
    color: '#ff6666',
  },
  successHintText:{
    color: 'gray',
  },
});

module.exports = WithdrawPage;
