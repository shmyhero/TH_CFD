'use strict';

/*
存取资金->入金
*/

import React,{Component} from 'react'
import {StyleSheet,Text,TextInput,Keyboard,Image,View,Dimensions,ListView,Alert,TouchableOpacity} from 'react-native'


var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var UIConstants = require('../UIConstants')
var ColorConstants = require('../ColorConstants')
var MainPage = require('./MainPage')

var listRawData = [
{'type':'paytype','title':'支付宝钱包', 'image':require('../../images/icon_alipay.png'), 'subtype': 'alipay', },
{'type':'paytype','title':'银联卡', 'image':require('../../images/icon_unionpay.png'), 'subtype': 'unionpay', },
// {'type':'paydetail','title':'支付详情', 'image':null, 'subtype': 'paydetail'},
]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
// var dataSource = ds.cloneWithRows(listRawData);
//0: alipay 1:unionpay
var inputError = false;
var inputValue = '';
var rmbValue = 0;
var _protocolSelected = true;


export default class DepositPage extends Component{

	constructor(props){
		super(props);
		this.state = {
			noLessMoney:100,
			fxRate:0.144,
			payStateTip:'最低入金额度：100美元',
			payStateTip2:'对应人民币：0.00元',
			payMethodSelected:0,
			dataSource:ds.cloneWithRows(listRawData),
			protocolSeleceted:true,
			confirmButtonEnable:false,
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
				},()=>this.validatePrice(''))
			},
			(result) => {
			}
		)
	}

	onSelectNormalRow(rowData){
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

	pressConfirmButton(){
		if(this.state.confirmButtonEnable){
			this.requestPayConfirm();
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
						确定
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

	validatePrice (text){
		inputValue = text
		var text_ = text
		var value = parseFloat(text_);
		var error = null
		rmbValue = value / this.state.fxRate;
		rmbValue = (text.length>0 ? rmbValue.toFixed(2):0.00.toFixed(2))

		if(text_ && value < this.state.noLessMoney){
			error = "入金金额不低于"+this.state.noLessMoney+'美元！';

			console.log("Text1 = " + text_);
			this.setState({
				payStateTip: error,
			  payStateTip2:'对应人民币：'+rmbValue+'元',
			})
				inputError = true
		}else{
			console.log("Text2 = " + text_);
			this.setState({
				payStateTip: '最低入金额度：'+this.state.noLessMoney+'美元',
				payStateTip2:'对应人民币：'+rmbValue+'元',
			})

				inputError = false
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
											 onChangeText={(text) => this.validatePrice(text)}
												//  onFocus={() => this.onTextFocus(type)}
												//  onBlur={() => this.onTextBlur(type)}
												//  value={value}
											 defaultValue={inputValue}
											 maxLength={8}
											 autoFocus={true}
											 underlineColorAndroid='transparent'
											 keyboardType='numeric'>
						</TextInput>
					</View>
				<View style = {styles.lineSep}></View>
				<Text style = {styles.payStateTip2}>{this.state.payStateTip2}</Text>
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

	renderRow(rowData, sectionID, rowID) {
		if(rowData){
			if(rowData.type == 'paytype'){
				console.log('this.state.payMethodSelected = ' + this.state.payMethodSelected +'rowID = '+rowID);
				var checkBox = this.state.payMethodSelected == rowID ? require('../../images/check_selected.png'):require('../../images/check_unselected.png')
				return(
					<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
						<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
							<Image source={checkBox} style={styles.checkbox} />
							<Image source={rowData.image} style={styles.image} />
							<Text style={styles.title}>{rowData.title}</Text>
						</View>
					</TouchableOpacity>
				);
			}
		}
		return (<View></View>)
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted){
		var nextID = parseInt(rowID) + 1;
		 	return (
				<View style={[styles.line, {height: 10}]} key={rowID}>
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
				 console.log('responseJson = ' + responseJson + 'payMethodSelected = ' + this.state.payMethodSelected);//rmbValue
 			 		 var alipayUrl = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-alipay.html'+'?Amount='+1.00+'&TransRef='+responseJson
					 var unionpayUrl = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-quick.html'+'?Amount='+1.00+'&TransRef='+responseJson
					 var url = this.state.payMethodSelected == 0? alipayUrl:unionpayUrl;
						//  if(index == 3){url = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-wechat.html';}
					 this.props.navigator.push({
			 			name: MainPage.PAYMENT_PAGE,
			 			url: url,
			 			title: responseJson,
			 		});
				})
			}

	go2Question(){
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: NetConstants.TRADEHERO_API.HELP_CENTER_URL_ACTUAL,
			isShowNav: false,
			title: "入金帮助",
		});
	}

	pressBlank(){
		Keyboard.dismiss();
	}

	render(){

		return(
			<View style={{flex:1,backgroundColor:ColorConstants.SEPARATOR_GRAY}}>
				<NavBar title='入金' showBackButton={true}
					imageOnRight={require('../../images/icon_question.png')}
					rightImageOnClick={()=>this.go2Question()}
					navigator={this.props.navigator}/>
				<View style = {styles.listViewContainer}>
					<ListView
						style={styles.list}
						dataSource={this.state.dataSource}
						renderRow={(rowData, sectionID, rowID)=>this.renderRow(rowData, sectionID, rowID)}
						renderSeparator={(sectionID, rowID, adjacentRowHighlighted)=>this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)} />
				</View>
				<View style = {{flex:1}}>
					{this.renderDetail()}
					<TouchableOpacity style={styles.blank} onPress={()=>this.pressBlank()}>
						<View></View>
					</TouchableOpacity>
					<View style = {{flex:1,justifyContent:'flex-end'}}>
					{this.renderProtocol()}
					{this.renderConfirm()}
					</View>
				</View>

			</View>
		);
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

	title:{
		flex:1,
		fontSize:17,
		marginLeft:15,
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
		fontSize:14,
		color:'#5a5a5a',
		padding:15,
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

	protocalRight:{
		fontSize:12,
		color:'#ff6666'
	},

	blank:{
		flex:1,
	},

});


module.exports = DepositPage;