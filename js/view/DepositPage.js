'use strict';

/*
存取资金->入金
*/

import React,{Component,PropTypes} from 'react'
import {StyleSheet,Text,TextInput,TouchableWithoutFeedback,Keyboard,Image,View,Dimensions,ListView,Alert,TouchableOpacity,Platform} from 'react-native'


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

var listRawData = [
{'type':'paytype','title':'支付宝钱包', 'image':require('../../images/icon_alipay.png'), 'subtype': 'alipay', },
{'type':'paytype','title':'银联卡', 'image':require('../../images/icon_unionpay.png'), 'subtype': 'unionpay', },
// {'type':'paydetail','title':'支付详情', 'image':null, 'subtype': 'paydetail'},
]

var bankListData = [
	{'bankID':'00','logo':require('../../images/icon_bank0.png')},
	{'bankID':'01','logo':require('../../images/icon_bank1.png')},
	{'bankID':'02','logo':require('../../images/icon_bank2.png')},
	{'bankID':'03','logo':require('../../images/icon_bank3.png')},
	{'bankID':'04','logo':require('../../images/icon_bank4.png')},
	{'bankID':'05','logo':require('../../images/icon_bank5.png')},
	{'bankID':'06','logo':require('../../images/icon_bank6.png')},
	{'bankID':'07','logo':require('../../images/icon_bank7.png')},
	{'bankID':'08','logo':require('../../images/icon_bank8.png')},
	{'bankID':'09','logo':require('../../images/icon_bank9.png')},
	{'bankID':'10','logo':require('../../images/icon_bank10.png')},
	{'bankID':'11','logo':require('../../images/icon_bank11.png')},
	{'bankID':'12','logo':require('../../images/icon_bank12.png')},
	{'bankID':'13','logo':require('../../images/icon_bank13.png')},
	{'bankID':'14','logo':require('../../images/icon_bank14.png')},
	{'bankID':'15','logo':require('../../images/icon_bank15.png')},
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
			payMethodSelected:0,
			dataSource:ds.cloneWithRows(listRawData),
			dataSourceBank:dsBank.cloneWithRows(bankListData),
			protocolSeleceted:true,
			confirmButtonEnable:false,
			showBankList:false,
			chargeRate:0.01,
			chargeMin:5,
			alipayIntro:'',
		}
	}

	componentDidMount(){
		this.loadDepositSetting()
	}

	componentWillUnmount(){
		inputValue = '';
	}

	loadDepositSetting(){

		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.GET_DEPOSIT_SETTING,
			{
				method: 'GET',
				cache: 'offline',
			},
			(responseJson) =>{
				console.log('minimun = ' + responseJson.minimum +' fxRate = ' + responseJson.fxRate);
				this.setState({
					noLessMoney: responseJson.minimum,
					fxRate : responseJson.fxRate,
					dataSourceBank:dsBank.cloneWithRows(responseJson.banks),
					chargeRate:responseJson.charge.rate,
					chargeMin:responseJson.charge.minimum,
					alipayIntro:responseJson.alipay,
				},()=>this.onChangeWithdrawValue(''))
			},
			(result) => {
			}
		)
	}

	onSelectNormalRow(rowData){
		this.dismissKB()
		switch(rowData.subtype){
			case 'alipay':
				this.setState({
					payMethodSelected:0,
					dataSource:ds.cloneWithRows(listRawData),
				})
				return;
			case 'unionpay':
				this.setState({
					payMethodSelected:1,
					dataSource:ds.cloneWithRows(listRawData),
				})
				return;
		}
	}

	getCurrentTime(){
		return new Date().getTime();
	}

	pressConfirmButton(){
		if(this.state.confirmButtonEnable && (this.getCurrentTime() - last_pressed_confirm  > 3000)){
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

	renderConfirm(){

		var color = this.state.confirmButtonEnable?'#425a85':'#d0d0d0';

		return(
			<View style = {{backgroundColor:'white'}}>
				<TouchableOpacity style={[styles.comfirmButton,{backgroundColor:color}]} onPress={()=>this.pressConfirmButton()}>
					<Text style={styles.comfirmText}>
						实时到账，确认入金
					</Text>
				</TouchableOpacity>
			</View>
		)
	}

	go2Protocol(){
		// Alert.alert('入金协议内容');
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: NetConstants.TRADEHERO_API.DEPOSIT_AGREEMENT,
			title: "入金协议",
		});
	}

	// var newState = {
	// 	withdrawValueText: this.state.withdrawValueText,
	// };//{withdrawValueText: text,}
	// if(text !== ""){
	// 	var re = /^\d+\.?\d{0,2}$/;
	// 	var found = text.match(re);
	// 	if(found){
	// 		var value = parseFloat(text);
	// 		if(!isNaN(value)){
	// 			newState.withdrawValueText = text;
	// 			newState.withdrawValue = value;
	// 		}
	// 	}
	// }else{
	// 	newState.withdrawValueText = "";
	// 	newState.withdrawValue = 0;
	// }
	//
	// console.log("newState " + JSON.stringify(newState));
	// this.setState(newState);

	onChangeWithdrawValue (text){
		inputValue = text
		var text_ = text
		var value = parseFloat(text_);
		var error = null
		rmbValue = value / this.state.fxRate;
		rmbValue = (text.length>0 ? rmbValue.toFixed(2):0.00.toFixed(2))
		var charge = (text.length>0 ? Math.max(value*this.state.chargeRate,this.state.chargeMin).toFixed(2):0.00.toFixed(2))

		if(text_ && value < this.state.noLessMoney){
			error = "入金金额不低于"+this.state.noLessMoney+'美元！';

			console.log("Text1 = " + text_);
			this.setState({
				payStateTip: error,
			  payStateTip2:/*'当前汇率：'+(1/this.state.fxRate).toFixed(2)+*/'等额人民币：'+rmbValue+'元',
				payStateTip3:'手续费'+charge+'美元',
			})
				inputError = true
		}else{
			console.log("Text2 = " + text_);
			this.setState({
				payStateTip: '最低入金额度：'+this.state.noLessMoney+'美元',
				payStateTip2:/*'当前汇率：'+(1/this.state.fxRate).toFixed(2)+*/'等额人民币：'+rmbValue+'元',
				payStateTip3:'手续费'+charge+'美元',
			})

		  inputError = false
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
						<Text style = {styles.moneyUSD}>美元</Text>
						<TextInput style={[styles.cellInput, {color: textColor}]}
											 onChangeText={(text) => this.onChangeWithdrawValue(text)}
												//  onFocus={() => this.onTextFocus(type)}
												//  onBlur={() => this.onTextBlur(type)}
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
					<Text style = {styles.payStateTip2}>{this.state.payStateTip2}</Text>
					<Text style = {styles.payStateTip3}>{this.state.payStateTip3}</Text>
				</View>


			</View>
		)
	}

	renderProtocol(){
		var checkBox = this.state.protocolSeleceted ? require('../../images/check_selected.png'):require('../../images/check_unselected.png')
		return(
			<TouchableOpacity activeOpacity={0.5} onPress={()=>this.pressSelectProtocol()} style={{flexDirection:'row',alignItems:'center',marginBottom:10}} >
				<Image source={checkBox} style={[styles.checkbox,{marginLeft:15,marginRight:10}]} />
				<Text style={styles.protocalLeft}>我已阅读并同意</Text>
				<TouchableOpacity activeOpacity={0.5} onPress={()=>this.go2Protocol()}>
					<Text style={styles.protocalRight}>入金协议内容</Text>
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
				<View></View>
			)
		}
	}

	renderAliPay(){
		var checkBox = this.state.payMethodSelected == 0 ? require('../../images/check_selected.png'):require('../../images/check_unselected.png')
		var rowData = listRawData[0]
		return(
			<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>

				<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
					<Image source={checkBox} style={styles.checkbox} />
					<Image source={rowData.image} style={styles.image} />
					<Text style={styles.title}>支付宝钱包</Text>
					<Text style={styles.titleIntro}>{this.state.alipayIntro}</Text>
				</View>
			</TouchableOpacity>
		);
	}

	renderUnionPay(){
		var checkBox = this.state.payMethodSelected == 1 ? require('../../images/check_selected.png'):require('../../images/check_unselected.png')
		var imageArrow = this.state.showBankList ? require('../../images/arrow_up.png'):require('../../images/arrow_down.png')
		var rowData = listRawData[1]
		return(
			<View>
				<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
					<View style={[styles.rowWrapper2, {height:Math.round(64*heightRate)}]}>
						<Image source={checkBox} style={styles.checkbox} />
						<Image source={rowData.image} style={styles.image} />
						<Text style={styles.title}>银联借记卡</Text>
						<TouchableOpacity activeOpacity={0.5} onPress={()=>this.bankSupport()}>
							<View style = {{flexDirection:'row',alignItems:'center'}}>
								<Text style = {styles.blankSupport}>支持的银行</Text>
								<Image style = {styles.arrow} source={imageArrow}></Image>
							</View>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
				{this.renderBankList()}
			</View>
		)
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
		var userData = LogicData.getUserData()
		NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_PAY_DEMO_TEST_ID,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=UTF-8',
				},
			},
			(responseJson) => {
				 console.log('responseJson = ' + responseJson + ' payMethodSelected = ' + this.state.payMethodSelected);//rmbValue
				   var appendVal = '&TransRef='+responseJson.transferId+'&firstName='+responseJson.firstName+'&lastName='+responseJson.lastName+'&email='+responseJson.email+'&addr='+responseJson.addr
 			 		 var alipayUrl = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-alipay.html'+'?Amount='+rmbValue+appendVal
					 var unionpayUrl = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-quick.html'+'?Amount='+rmbValue+appendVal
					 var url = this.state.payMethodSelected == 0? alipayUrl:unionpayUrl;
					 console.log('selected Url = ' + url);
					 this.props.navigator.push({
			 			name: MainPage.PAYMENT_PAGE,
			 			url: url,
						popToOutsidePage: this.props.popToOutsidePage,
			 			title: responseJson,
			 		});
				})
			}

	go2Question(){
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: NetConstants.TRADEHERO_API.HELP_CENTER_URL_ACTUAL,
			isShowNav: false,
      title: "帮助中心",
		});
	}

	pressBlank(){
		this.dismissKB();
	}

	dismissKB(){
		Keyboard.dismiss();
	}

	render(){

		return(
			<View style={{flex:1,backgroundColor:ColorConstants.SEPARATOR_GRAY}}>
				<NavBar title='入金' showBackButton={true}
					imageOnRight={require('../../images/icon_question.png')}
					rightImageOnClick={()=>this.go2Question()}
					navigator={this.props.navigator}/>

				{/* <View style = {styles.listViewContainer}>
					<ListView
						style={styles.list}
						dataSource={this.state.dataSource}
						renderRow={(rowData, sectionID, rowID)=>this.renderRow(rowData, sectionID, rowID)}
						renderSeparator={(sectionID, rowID, adjacentRowHighlighted)=>this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)} />
				</View> */}
				{this.renderSeparator()}
				{this.renderAliPay()}
				{this.renderSeparator()}
				{this.renderUnionPay()}
				{this.renderSeparator()}

				<View style = {{flex:1}}>
					{this.renderDetail()}
					<TouchableWithoutFeedback style={styles.blank} onPress={()=>this.pressBlank()}>
						<View style={{flexDirection:'row'}}>
							<Text style={styles.psLine}>注意：</Text>
							<View style={{marginRight:15,flex:1}}>
								<Text style={styles.psLine2}>入金手续费为入金金额的{this.state.chargeRate*100}%，入金账户必须与自己的身份证保持一致，以免发生交易风险。</Text>
							</View>
					  </View>
				  </TouchableWithoutFeedback>
					<TouchableOpacity style={styles.blank} onPress={()=>this.pressBlank()}>
						<View></View>
					</TouchableOpacity>

					<View style = {{flex:1,justifyContent:'flex-end'}}>
					{this.renderProtocol()}
					{this.renderConfirm()}
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
		flex:1,
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
			marginLeft:15,
			marginTop:5,
			marginRight:15,
			flexDirection:'row',
			justifyContent: 'space-between',
			flexWrap:'wrap',
	},

	imageBank:{
		width:74.7,
		height:29.7,
		marginBottom:5,
	},

	arrow:{
		width:12,
		height:12,
	}

});


module.exports = DepositPage;
