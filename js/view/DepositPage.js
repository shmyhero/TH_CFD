'use strict';

import PropTypes from 'prop-types';

/*
    我的->存取资金->入金
*/

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    View,
    Dimensions,
    ListView,
    Alert,
    TouchableOpacity,
	Platform,
	ScrollView
} from 'react-native'


var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var UIConstants = require('../UIConstants')
var ColorConstants = require('../ColorConstants')
var MainPage = require('./MainPage')
var InputAccessory = require('./component/InputAccessory')
var TalkingdataModule = require('../module/TalkingdataModule')
var LS = require('../LS')
var listRawData = [
{'type':'paytype','title':'ZFBQB', 'image':require('../../images/icon_alipay.png'), 'subtype': 'alipay', },
{'type':'paytype','title':'YLK', 'image':require('../../images/icon_unionpay.png'), 'subtype': 'unionpay', },
// {'type':'paydetail','title':'支付详情', 'image':null, 'subtype': 'paydetail'},
]

var bankListData = [
	{'bankID':'00','logo':require('../../images/icon_bank_0.png')},
	{'bankID':'01','logo':require('../../images/icon_bank_1.png')},
	{'bankID':'02','logo':require('../../images/icon_bank_2.png')},
	{'bankID':'03','logo':require('../../images/icon_bank_3.png')},
	{'bankID':'04','logo':require('../../images/icon_bank_4.png')},
	{'bankID':'05','logo':require('../../images/icon_bank_5.png')},
	{'bankID':'06','logo':require('../../images/icon_bank_6.png')},
	{'bankID':'07','logo':require('../../images/icon_bank_7.png')},
	{'bankID':'08','logo':require('../../images/icon_bank_8.png')},
	{'bankID':'09','logo':require('../../images/icon_bank_9.png')},
	{'bankID':'10','logo':require('../../images/icon_bank_10.png')},
	{'bankID':'11','logo':require('../../images/icon_bank_11.png')},
]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var dsBank = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var inputError = false;
var inputValue = '';
var rmbValue = 0;
var _protocolSelected = true;
var last_pressed_confirm = new Date().getTime();

export default class DepositPage extends Component{

	static propTypes = {
		popToOutsidePage: PropTypes.func,
	}

	static defaultProps = {
		popToOutsidePage: ()=>{},
	}

	constructor(props){
		super(props);
		this.state = {
			noLessMoney:100,
			fxRate:0.144,
			payStateTip:'最低入金额度：100美元',
			payStateTip2:'等额人民币：0.00元',
			payStateTip3:'手续费：0美元',
			payStateTip4:'注意：入金手续费为入金金额的1%，入金账户必须与自己的身份证保持一致，以免发生交易风险。',
			payMethodSelected:1,
			dataSource:ds.cloneWithRows(listRawData),
			dataSourceBank:dsBank.cloneWithRows(bankListData),
			protocolSeleceted:false,
			confirmButtonEnable:false,
			showBankList:false,
			chargeRate:0.01,
			chargeMin:5,
			alipayIntro:'',
			alipayMin: 50,
			alipayMax: 3000,
			cupMin: 50,
			cupMax: 3000,
			useEcoupon:false,
			econponValue:0,
		}
	}

	componentDidMount(){
		this.loadDepositSetting()
	}

	componentWillUnmount(){
		inputValue = '';
	}

	loadDepositSetting(){
		var userData = LogicData.getUserData()
		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.GET_DEPOSIT_SETTING,
			{
				method: 'GET',
				// cache: 'offline',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=utf-8',
				  },
			},
			(responseJson) =>{
				console.log('minimun = ' + responseJson.minimum +' fxRate = ' + responseJson.fxRate);

				var noMoreMoney = 0;
				var noLessMoney = 0;

				var cupMax = responseJson.cupMax == undefined ? this.state.cupMax : responseJson.cupMax;
				var alipayMax = responseJson.alipayMaxPing == undefined ? this.state.alipayMax : responseJson.alipayMaxPing;
				// alipayMax = 0;//hide aliPay
				// cupMax = 0;//hide unionPay
				var cupMin = responseJson.cupMin == undefined ? this.state.cupMin : responseJson.cupMin;
				var alipayMin = responseJson.alipayMinPing == undefined ? this.state.alipayMin : responseJson.alipayMinPing;
				var availableReward = responseJson.availableReward == undefined? 0:responseJson.availableReward;
				var payMethodSelected = this.state.payMethodSelected
				if (alipayMax <=0){
					payMethodSelected = 1;
				}else{
					payMethodSelected = 0;
				}

				if (payMethodSelected==0){
					noMoreMoney = alipayMax
					noLessMoney = alipayMin
				}else{
					noMoreMoney = cupMax
					noLessMoney = cupMin
				}

				this.setState({
					payMethodSelected: payMethodSelected,
					noLessMoney: noLessMoney,
					noMoreMoney: noMoreMoney,
					fxRate : responseJson.fxRate,
					dataSourceBank:dsBank.cloneWithRows(responseJson.banks),
					chargeRate:responseJson.charge.rate,
					chargeMin:responseJson.charge.minimum,
					alipayIntro:responseJson.alipayPing,
					alipayMax:alipayMax,
					alipayMin:alipayMin,
					cupMin:cupMin,
					cupMax:cupMax,
					econponValue:availableReward,
				},()=>this.onChangeWithdrawValue(''))
			},
			(result) => {
			}
		)
	}

	onSelectNormalRow(rowData){
		this.dismissKB()
		console.log("rowData.subtype " + rowData.subtype)
		var payMethodSelected = 0;
		var noMoreMoney = 0;
		var noLessMoney = 50;
		switch(rowData.subtype){
			case 'alipay':
				payMethodSelected = 0;
				noMoreMoney = this.state.alipayMax;
				noLessMoney = this.state.alipayMin;
				break;
			case 'unionpay':
				console.log("rowData.subtype " + rowData.subtype)
				payMethodSelected = 1;
				noMoreMoney = this.state.cupMax;
				noLessMoney = this.state.cupMin;
				break;
		}

		this.setState({
			payMethodSelected:payMethodSelected,
			dataSource:ds.cloneWithRows(listRawData),
			noMoreMoney: noMoreMoney,
			noLessMoney: noLessMoney,
		}, ()=>{
			this.onChangeWithdrawValue(inputValue);
		})
	}

	getCurrentTime(){
		return new Date().getTime();
	}

	pressConfirmButton(){
		if(this.state.confirmButtonEnable && (this.getCurrentTime() - last_pressed_confirm  > 3000)){
			this.dismissKB();
			this.requestPayConfirm();
			last_pressed_confirm = this.getCurrentTime();
		}
	}

	pressSelectProtocol(){
		this.setState({
			protocolSeleceted : !this.state.protocolSeleceted,
		},this.checkConfirmEnable)
	}

	checkConfirmEnable(){
		this.setState({
			confirmButtonEnable : this.state.protocolSeleceted && !inputError && inputValue.length>0,
		})
	}

	renderPartOfECoupon(){
		if(this.state.useEcoupon){
			return(
				<View style={{flexDirection:'row',alignItems:'center'}}>
					<View style={{marginLeft:5,marginRight:5,width:0.5,height:18,backgroundColor:'#999999'}}></View>
					<Text style={{fontSize:12,color:'#999999'}}>已抵用$</Text>
					<Text style={{fontSize:12,color:'#999999'}}>{this.state.econponValue}</Text>
				</View>	
			)
		}else{
			return null
		}
		
	}

	renderConfirm(){
		var value = parseFloat(inputValue)
		var color = this.state.confirmButtonEnable?'#425a85':'#d0d0d0';
		var buttonText = this.state.payMethodSelected==0?LS.str('ALIPAY_ARRIVED'):LS.str('UNIONPAY_ARRIVED')
		var inputValueAfterUseEcoupon = value - (this.state.useEcoupon?this.state.econponValue:0);
		var showInputValueAfterUseEcoupon = (inputValueAfterUseEcoupon && inputValueAfterUseEcoupon > 0) ? inputValueAfterUseEcoupon : 0
		showInputValueAfterUseEcoupon = Math.round(showInputValueAfterUseEcoupon * 100) / 100
		
		return(
			<View style = {{backgroundColor:'white'}}>
			<View style={{height:68,justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
				<View style={{paddingLeft:10,flexDirection:'row',alignItems:'center'}}>
					<Text style={{fontSize:16,marginTop:4,color:'black'}}>$</Text>
					<Text style={{fontSize:20,color:'black'}}>{showInputValueAfterUseEcoupon}</Text>
					{this.renderPartOfECoupon()}
				</View>	
				<TouchableOpacity style={[styles.comfirmButton,{backgroundColor:color}]} onPress={()=>this.pressConfirmButton()}>
					<Text style={styles.comfirmText}>
						{buttonText}
					</Text>
				</TouchableOpacity>
			</View>
				
			</View>
		)
	}

	go2Protocol(){
		// Alert.alert('入金协议内容');
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: NetConstants.TRADEHERO_API.DEPOSIT_AGREEMENT,
			title: LS.str('RJXY'),
		});
	}

	onChangeWithdrawValue (text){
		inputValue = text
		var text_ = text
		var value = parseFloat(text_);
		var error = null
		rmbValue = value / this.state.fxRate;
		rmbValue = (text.length>0 ? rmbValue.toFixed(2):(0.00).toFixed(2))
		var charge = (text.length>0 ? Math.max(value*this.state.chargeRate,this.state.chargeMin).toFixed(2):(0.00).toFixed(2))

		if(text_ && text_.length>0){
			if(value < this.state.noLessMoney){
				error = LS.str('RJBDY')+' '+this.state.noLessMoney+' '+LS.str('MY')+' '+'!';
			}else if(value > this.state.noMoreMoney){
				error = LS.str('RJBGY')+' '+this.state.noMoreMoney+' '+LS.str('MY')+' '+'!';
			}
		}

		if(error){
			console.log("Text1 = " + text_);
			this.setState({
				payStateTip: error,
				payStateTip2:/*'当前汇率：'+(1/this.state.fxRate).toFixed(2)+*/'等额人民币：'+rmbValue+'元',
				payStateTip3:LS.str('SXF')+charge+LS.str('MY'),
			});
			inputError = true
		} else{

			var payStateTip = "";
			if(this.state.noLessMoney == this.state.noMoreMoney){
				payStateTip = "单笔固定" + this.state.noMoreMoney + '美元';
			}else{
				payStateTip = this.state.noLessMoney +' '+ LS.str('RJED')+' ' +this.state.noMoreMoney+' ' + LS.str('MY');
			}
			this.setState({
				payStateTip: payStateTip,
				payStateTip2:/*'当前汇率：'+(1/this.state.fxRate).toFixed(2)+*/'等额人民币：'+rmbValue+'元',
				payStateTip3:LS.str('SXF')+' '+charge+' '+LS.str('MY'),
			})
			inputError = false;
		}

		if(text !== ""){
			var re = /^\d+\.?\d{0,2}$/;
			var found = text.match(re);
			if(found){
				var value = parseFloat(text);
				if(!isNaN(value)){
				}
			}else{
					console.log('数据错误,重置输入框')
					this.onChangeWithdrawValue('')
			}
		}

		this.checkConfirmEnable();
	}

	renderDetail(){
		var textColor = inputError?'#d71a18':'black';
		console.log("textColor = " + textColor);
		return(
			<View style = {styles.payDetail}>
				<Text style = {[styles.payStateTip,{color:textColor}]}>{this.state.payStateTip}</Text>
					<View style = {styles.cellWrapper}>
						<Text style = {styles.moneyUSD}>{LS.str('MY')}</Text>
						<TextInput
                ref="textInput"
                style={[styles.cellInput, {color: textColor}]}
                onChangeText={(text) => this.onChangeWithdrawValue(text)}
                value={inputValue}
                defaultValue={inputValue}
                maxLength={7}
                autoFocus={true}
                underlineColorAndroid='transparent'
                keyboardType='numeric'>
						</TextInput>
					</View>
				<View style = {styles.lineSep}></View>
				<View style = {styles.tipsLine}>
					<Text style = {styles.payStateTip2}>{this.state.payStateTip3}</Text>
				</View>
			</View>
		)
	}

	renderProtocol(){
		var checkBox = this.state.protocolSeleceted ? require('../../images/check_selected.png'):require('../../images/check_unselected.png')
		return(
			<TouchableOpacity activeOpacity={0.5} onPress={()=>this.pressSelectProtocol()} style={{flexDirection:'row',alignItems:'center',marginBottom:10}} >
				<Image source={checkBox} style={[styles.checkbox,{marginLeft:15,marginRight:10}]} />
				<Text style={styles.protocalLeft}>{LS.str('RJXYPart0')}</Text>
				<TouchableOpacity activeOpacity={0.5} onPress={()=>this.go2Protocol()}>
					<Text style={styles.protocalRight}>{LS.str('RJXYPart1')}</Text>
				</TouchableOpacity>
		 </TouchableOpacity>
		)
	}

	renderBankList(){
		if(this.state.showBankList){
			return(
				<View style = {styles.banklist}>
					 <View style = {[styles.line,{backgroundColor:ColorConstants.SEPARATOR_GRAY,height:0.5}]}></View>
	 					<ListView
							contentContainerStyle={styles.listBank}
							dataSource={this.state.dataSourceBank}
							enableEmptySections={true}
							removeClippedSubviews={false}
							initialListSize={16}
	 						renderRow={(rowData, sectionID, rowID)=>this.renderRowBank(rowData, sectionID, rowID)} />
	   		</View>
			)
		}else{
			return(
				<View>

				</View>
			)
		}
	}

	renderAliPay(){
		if (this.state.alipayMax > 0){
			var checkBox = this.state.payMethodSelected == 0 ? require('../../images/check_selected.png'):require('../../images/check_unselected.png')
			var rowData = listRawData[0]
			return(
				<View>
					{this.renderSeparator()}
					<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>

						<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
							<Image source={checkBox} style={styles.checkbox} />
							<Image source={rowData.image} style={styles.image} />
							<Text style={styles.title}>{LS.str('ZFBQB')}</Text>
							<Text style={styles.titleIntro}>{this.state.alipayIntro}</Text>
						</View>
					</TouchableOpacity>
				</View>
			);
		}else{
			return null;
		}
	}

	renderUnionPay(){
		if(this.state.cupMax > 0){
			var checkBox = this.state.payMethodSelected == 1 ? require('../../images/check_selected.png'):require('../../images/check_unselected.png')
			var imageArrow = this.state.showBankList ? require('../../images/arrow_up.png'):require('../../images/arrow_down.png')
			var rowData = listRawData[1]
			return(
				<View>
					{this.renderSeparator()}
					<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
						<View style={[styles.rowWrapper2, {height:Math.round(64*heightRate)}]}>
							<Image source={checkBox} style={styles.checkbox} />
							<Image source={rowData.image} style={styles.image} />
							<Text style={styles.title}>{LS.str('YLJJK')}</Text>
							<TouchableOpacity activeOpacity={0.5} onPress={()=>this.bankSupport()}>
								<View style = {{flexDirection:'row',alignItems:'center'}}>
									<Text style = {styles.blankSupport}>{LS.str('ZCDYH')}</Text>
									<Image style = {styles.arrow} source={imageArrow}></Image>
								</View>
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
					{this.renderBankList()}
				</View>
			)
		}else{
			return null;
		}
	}

	bankSupport(){
		this.setState({
			showBankList:!this.state.showBankList,
		})
	}

	renderRowBank(rowData, sectionID, rowID) {
		console.log('Image rowData = ' + rowData.logo)
		if(rowData && (typeof rowData.logo == 'string')){
				 	return(
					 <Image source={{uri:rowData.logo}} style={styles.imageBank}></Image>
				);
		}else{
			return (
				<Image source={rowData.logo} style={styles.imageBank}></Image>
			)
		}
	}

	renderSeparator(){
		 	return (
				<View style={[styles.line, {height: 10}]}>
					<View style={[styles.separator]}/>
				</View>
				)
	}



	requestPayConfirm(){
		if(this.state.payMethodSelected == 0){
			this.requestForAlipay()
		}else if(this.state.payMethodSelected == 1){
			this.requestForUnionPay()
		}
	}

	getValueOfRmbPay(){
		var value = 0.01
		if(this.state.useEcoupon){
			if(inputValue - this.state.econponValue <= 0){
				return 0.01
			}
			else {
				value =  (inputValue - this.state.econponValue) / this.state.fxRate;
			} 
		}else{
			value = inputValue / this.state.fxRate;
		}
		// 保留2位小数，fix server bug
		value = Math.round(value * 100) / 100
		return value
	}
		

	requestForAlipay(){
		var rmb = this.getValueOfRmbPay();
		var userData = LogicData.getUserData() 
		var useRewardValue = this.state.useEcoupon?this.state.econponValue:0
		// Alert.alert(''+useRewardValue)
		var alipayUrl = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-ping.html'+'?amount='+rmb+'&rewardAmount='+useRewardValue+'&channel=alipay'+'&token='+userData.userId + '_' + userData.token;
		this.props.navigator.push({
		name: MainPage.PAYMENT_PAGE,
		url: alipayUrl,
		popToOutsidePage: this.props.popToOutsidePage,
		title: '支付', 
		});
	}

	requestForUnionPay(){
		var userData = LogicData.getUserData()
		// var url = NetConstants.CFD_API.GET_PAY_DEMO_TEST_ID + '?amount=' + inputValue
		var url = NetConstants.CFD_API.GET_PAY_DEMO_TEST_FOCAL + '?amount=' + inputValue
		console.log("requestPayConfirm url = " + url);
		
		NetworkModule.fetchTHUrl(
				url,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=UTF-8',
				},
			},
			(responseJson) => {
				 console.log('responseJson = ' + responseJson + ' payMethodSelected = ' + this.state.payMethodSelected);//rmbValue
				    //  var appendVal = '&TransRef='+responseJson.transferId+'&firstName='+responseJson.firstName+'&lastName='+responseJson.lastName+'&email='+responseJson.email+'&addr='+responseJson.addr
					//  var appendVal = '&merchantSig='+responseJson.merchantSig+'&currencyCode='+responseJson.currencyCode+'&merchantAccount='+responseJson.merchantAccount+'&merchantReference='+responseJson.merchantReference+'&paymentAmount='+responseJson.paymentAmount+'&sessionValidity='+responseJson.sessionValidity+'&skinCode='+responseJson.skinCode+'&shipBeforeDate='+responseJson.shipBeforeDate+'&brandCode='+responseJson.brandCode+'&shopperLocale='+responseJson.shopperLocale
					//  var alipayUrl = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-alipay.html'+'?Amount='+rmbValue+appendVal
					 var alipayUrl = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-ping.html'+'?amount='+rmbValue+'&channel=alipay'+'&token='+userData.userId + '_' + userData.token;
					//  var unionpayUrl = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-quick.html'+'?Amount='+rmbValue+appendVal
					//  var unionpayUrl = 'https://cn.tradehero.mobi/test_form/test_form_Ayondo-adyen.html?'+appendVal
				     var appendVal = '&Merchant='+responseJson.Merchant+'&Site='+responseJson.Site+'&Amount='+responseJson.Amount+'&Currency='+responseJson.Currency+'&TransRef='+responseJson.TransRef+'&Product='+responseJson.Product+'&PaymentType='+responseJson.PaymentType+'&AttemptMode='+responseJson.AttemptMode+'&TestTrans='+responseJson.TestTrans+'&email='+responseJson.customer_email+'&first_name='+responseJson.customer_first_name+'&last_name='+responseJson.customer_last_name+'&address1='+responseJson.customer_address1+'&city='+responseJson.customer_city+'&country='+responseJson.customer_country+'&id_type='+responseJson.customer_id_type+'&id_number='+responseJson.customer_id_number+'&lang='+responseJson.lang+'&Signature='+responseJson.Signature;
					 var unionpayUrl = 'https://cn.tradehero.mobi/test_form/test_form_Ayondo-focal.html?'+appendVal
					 var url = this.state.payMethodSelected == 0? alipayUrl:unionpayUrl;
					 console.log('selected Url = ' + url);
                    // var trackingData = {};
                    // trackingData[TalkingdataModule.AD_TRACKING_KEY_USER_ID] = userData.userId;
                    // trackingData[TalkingdataModule.AD_TRACKING_KEY_ORDER_ID] = responseJson.transferId;	//don't know the order id..
                    // trackingData[TalkingdataModule.AD_TRACKING_KEY_AMOUNT] = rmbValue;
                    // trackingData[TalkingdataModule.AD_TRACKING_KEY_CURRENCY] = "RMB";
                    // trackingData[TalkingdataModule.AD_TRACKING_KEY_PAY_TYPE] = this.state.payMethodSelected == 0 ? "支付宝" : "银联";
                    // TalkingdataModule.trackADEvent(TalkingdataModule.AD_TRACKING_EVENT_PAY, trackingData);
					 this.props.navigator.push({
				 		name: MainPage.PAYMENT_PAGE,
				 		url: url,
						popToOutsidePage: this.props.popToOutsidePage,
				 		title: responseJson,
				 	});
			 	},(result) => {
				 Alert.alert(LS.str('WXTS'),LS.str('NETWORK_CHECK'));
				}) 
	}

	go2Question(){
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: NetConstants.TRADEHERO_API.HELP_CENTER_URL_ACTUAL,
			isShowNav: false,
      title: LS.str('BZZX'),
		});
	}

	pressBlank(){
		this.dismissKB();
	}

	dismissKB(){
		Keyboard.dismiss();
	}

	selectEcoupon(){
		this.setState({
			useEcoupon:!this.state.useEcoupon
		})
	}

	renderEcoupon(){
		var checkBox = this.state.useEcoupon ? require('../../images/check_selected.png'):require('../../images/check_unselected.png')

		if(this.state.econponValue != 0){
			return(
				<View>
					{this.renderSeparator()}
					<TouchableOpacity onPress={()=>this.selectEcoupon()} style={{flexDirection:'row',justifyContent:'space-between', paddingLeft:10,paddingRight:10, alignItems:'center',height:Math.round(64*heightRate),backgroundColor:'white'}}> 
						<View style={{flexDirection:'row',alignItems:'center',}}>
							<Image source={checkBox} style={styles.checkbox} />
							<Text style={{fontSize:36,color:'#000000',marginLeft:10}}>{this.state.econponValue}</Text>
							<Text style={{fontSize:11,color:'#999999',marginTop:12.5}}>美元</Text>
						</View>	
						
						<Text style={{fontSize:12,color:'#999999'}}>交易金抵用券</Text>
					</TouchableOpacity>
				</View>
			)
		}else{
			return null;
		}
		
		
	}

	render(){

		return(
			    <View style={{flex:1,backgroundColor:ColorConstants.SEPARATOR_GRAY}}>
				<NavBar title={LS.str('RJ')} showBackButton={true}
					imageOnRight={require('../../images/icon_question.png')}
					rightImageOnClick={()=>this.go2Question()}
					navigator={this.props.navigator}/>
				 
				
				{this.renderAliPay()}
				{/* {this.renderUnionPay()} */}
				{this.renderSeparator()}

				<View style = {{flex:1}}> 
					{this.renderDetail()}
					{this.renderEcoupon()}
					<TouchableWithoutFeedback style={styles.blank} onPress={()=>this.pressBlank()}>
						<View style={{flexDirection:'row'}}>
							<Text style={styles.psLine}>{LS.str('ZY')}</Text>
							<View style={{marginRight:15,flex:1}}>
								<Text style={styles.psLine2}>{LS.str('ZYPart0')}{this.state.chargeRate*100}{LS.str('ZYPart1')}</Text>
							</View>
					  </View>
				  </TouchableWithoutFeedback>
					<TouchableOpacity style={styles.blank} onPress={()=>this.pressBlank()}>
						<View></View>
					</TouchableOpacity> 

					<View style = {{flex:1,justifyContent:'space-between'}}>
						<View></View>
						<View>
							{this.renderProtocol()} 
							{this.renderConfirm()} 
						</View> 
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
	listViewContainer:{
		width:width,
		height:Math.round(64*heightRate)*listRawData.length + 30,
	},

	list:{
		marginLeft:0,
		marginTop:10,
		marginRight:0,
		flexDirection:'row',
		width:width,
	},

	banklist:{
		width:width,
		height:84,
		backgroundColor:'white',
	},

	title:{
		flex:1,
		fontSize:17,
		marginLeft:15,
	},

	titleIntro:{
        flex:1,
        fontSize:13,
        marginLeft:15,
        color:'#b4b4b4',
        alignItems:'flex-end',
        textAlign:'right',
    },

	rowWrapper: {
		width:width,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: UIConstants.LIST_ITEM_LEFT_MARGIN,
		paddingRight: 15,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: 'white',
	},

	rowWrapper2: {
		width:width,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: UIConstants.LIST_ITEM_LEFT_MARGIN,
		paddingRight: 15,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: 'white',
	},

	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	line: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	image: {
		marginLeft: 15,
		width: 32,
		height: 32,
	},

	checkbox:{
		marginLeft:0,
		width:20,
		height:20,
	},

	payDetail:{
		width:width,
		backgroundColor: 'white',
	},

	payStateTip:{
		fontSize:15,
		color:'#5a5a5a',
		padding:15,
	},

	payStateTip2:{
		fontSize:13,
		color:'#5a5a5a',
		paddingLeft:15,
		paddingTop:15,
		paddingBottom:15,
	},

	payStateTip3:{
		fontSize:13,
		color:'#5a5a5a',
		padding:15,
	},

	tipsLine:{
		flexDirection:'row',
		justifyContent:'space-between',
	},

	lineSep:{
		width:width - 10,
		marginLeft:10,
		height:0.5,
		backgroundColor:ColorConstants.SEPARATOR_GRAY,
	},

	moneyUSD:{
		fontSize:17,
		color:'black',
		margin:15,
	},

	cellWrapper: {
		height: Math.round(height/10),
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},

	cellInput: {
		fontSize: 50,
		padding: 0,
		width: Math.round(width/3),
		alignSelf: 'center',
		textAlignVertical:'center',
		flex:width,
		height:100,
		alignItems:'center',
	},

	comfirmButton: {
		height: 48,
		justifyContent: 'center',
		backgroundColor: '#425a85',
		margin:10,
		width:100,
		borderRadius:4,
	},

	comfirmText: {
		textAlign: 'center',
		fontSize: 18,
		color: '#ffffff'
	},

	protocalLeft:{
		fontSize:12,
		color:'#858585'
	},

	psLine:{
		fontSize:12,
		color:'#858585',
		marginTop:15,
		marginLeft:15,
	},

	psLine2:{
		fontSize:12,
		color:'#858585',
		marginTop:15,
	},

	protocalRight:{
		fontSize:12,
		color:'#ff6666'
	},

	blank:{ 
		height:100, 
	},

	blankSupport:{
		backgroundColor:'white',
		fontSize:12,
		paddingTop:15,
		paddingBottom:15,
		paddingLeft:15,
		paddingRight:5,
		color:'#b4b4b4'
	},

	listBank:{
			marginLeft:0,
			marginTop:5,
			marginRight:0,
			flexDirection:'row',
			// justifyContent: 'space-between',
			flexWrap:'wrap',
	},

	imageBank:{
		width:74.7,
		height:29.7,
		marginLeft:(width-20)/4 - 74.7,
		marginBottom:5,
	},

	arrow:{
		width:12,
		height:12,
	}

});


module.exports = DepositPage;
