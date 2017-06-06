'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	Dimensions,
	Image,
	TouchableOpacity,
	Alert,
	Modal,
	Animated,
	Easing,
} from 'react-native';


var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var NativeDataModule = require('../module/NativeDataModule')
var NavBar = require('./NavBar')
var TalkingdataModule = require('../module/TalkingdataModule')
//var TongDaoModule = require('../module/TongDaoModule')
var HeaderLineDialog = require('./HeaderLineDialog')
var {EventCenter, EventConst} = require('../EventCenter')

var {height, width} = Dimensions.get('window');
var heightRate = height/667.0;
//var heightShow = height - UIConstants.HEADER_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER
var roundR = (width-10)/2
var roundDayMargin = 5
var roundDayLength = 11
var roundDay =  (width - roundDayMargin * roundDayLength * 2 - 5)  / roundDayLength


var imgWidth = width*4/5;
var imgHeight = imgWidth * 72 /264 ;
var modelTextW = width/28;
var signEnable = true;//防止网络不畅多次点击事件发生

var RULE_DIALOG = "ruleDialog";
var layoutSizeChangedSubscription = null

var DaySignPage = React.createClass({
	propTypes: {
    shareFunction: React.PropTypes.func,
  },

  getDefaultProps: function(){
    return {
      shareFunction: ()=>{}
    }
  },

	getInitialState() {
    return {
			modalCoinVisible: false,
			monthToday: '-',
			monthDays:31,

			totalUnpaidAmount: 0, //总计交易金
  		totalSignDays: 0, //累计签到天数
  		isSignedToday: false, //今天是否已签到
  		amountToday: 0.5, //今天的签到奖励金额

      days : [false,false,false,false,false,false,
							false,false,false,false,false,false,
							false,false,false,false,false,false,
							false,false,false,false,false,false,
							false,false,false,false,false,false,false],
			bounceValue: new Animated.Value(0),
      rotateValue: new Animated.Value(0),
			fadeInValue: new Animated.Value(0),
			height: UIConstants.getVisibleHeight(),
    };
  },

	componentDidMount:function(){
		this._refresh()
	  signEnable = true

		layoutSizeChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.LAYOUT_SIZE_CHANGED, () => {
			this.onLayoutSizeChanged();
		});
	},

	componentWillUnmount: function() {
		layoutSizeChangedSubscription && layoutSizeChangedSubscription.remove();
	},

	onLayoutSizeChanged: function(){
		console.log("onLayoutSizeChanged");
		this.setState({
			height: UIConstants.getVisibleHeight(),
		})
	},

	_refresh:function() {
		this._loadDailySignInfo()
		this._loadDailySignMonth()
	},

	_actionAni:function(){
		console.log('_actionAni');
		this.setState({
			modalCoinVisible:true,
		})
		// this._playSound();

		 this.state.bounceValue.setValue(0);
     this.state.rotateValue.setValue(0);
		 this.state.fadeInValue.setValue(0);

	   Animated.parallel([
	       //通过Animated.spring等函数设定动画参数
	       //可选的基本动画类型: spring, decay, timing
	       Animated.spring(this.state.bounceValue, {
	           toValue: 1,      //变化目标值
						 duration: 200,
	           friction: 20,    //friction 摩擦系数，默认40
	       }),
	       Animated.timing(this.state.rotateValue, {
	           toValue: 1,
	           duration: 200,
	           easing: Easing.out(Easing.quad),
	       }),
				 Animated.timing(this.state.fadeInValue, {
	           toValue: 1,
	           duration: 200,
	       })
	       //调用start启动动画,start可以回调一个函数,从而实现动画循环
	   ]).start(()=>this._actionAni2());


		// Animated.timing(this.state.fadeInValue, {
		//             toValue: 1, // 目标值
		//             duration: 2500, // 动画时间
		//             easing: Easing.linear // 缓动函数
		//         }).start();

	},

	_actionAni2:function(){
		console.log('_actionAni2');
		 this.state.fadeInValue.setValue(1);
		 this.state.bounceValue.setValue(1);

	   Animated.parallel([
				 Animated.timing(this.state.fadeInValue, {
	           toValue: 0,
	           duration: 200,
	       }),

	       //调用start启动动画,start可以回调一个函数,从而实现动画循环
	   ]).start(()=>this.setState({modalCoinVisible:false}));
	},

	_playSound:function(){
		NativeDataModule.passDataToNative('playSound', "0")
	},

	//获取当天的签到状态
	_loadDailySignInfo:function() {
		// Alert.alert('_loadDailySignInfo')
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_USER_DAILY_SIGN_INFO,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
					cache: 'offline',
				},
				(responseJson) =>{

					this.setState(
					  {
							totalUnpaidAmount: responseJson.TotalUnpaidAmount, //总计交易金
				  		totalSignDays: responseJson.TotalSignDays, //累计签到天数
				  		isSignedToday: responseJson.IsSignedToday, //今天是否已签到
				  		amountToday: responseJson.AmountToday //今天的签到奖励金额
						}
					)
				}
			)
		}
	},

	//获取当月的签到状态
	_loadDailySignMonth:function(){
		// Alert.alert('_loadDailySignMonth')
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_USER_DAILY_SIGN_MONTH,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
					cache: 'offline',
				},
				(responseJson, isCache) =>{
					if(isCache){
						var date = new Date();
						var currentMonth = date.getMonth() + 1;
						if(responseJson.month != currentMonth){
							console.log("current month has changed! Do not show cache then!")
							return;
						}
					}

					if(responseJson!==null && responseJson.days!=null && responseJson.days.length>0){
						var _days = this.state.days
						for( var i = 0;i<responseJson.days.length;i++){
							_days[responseJson.days[i].day - 1] = true
						}
						this.setState(
							{
								monthToday: responseJson.month,
								monthDays:responseJson.monthDayCount,
								days:_days.splice(0,responseJson.monthDayCount)
							}
						)
					}
				}
			);
		}
	},

	_share: function(){
		TalkingdataModule.trackEvent(TalkingdataModule.CHECK_IN_SHARE_EVENT);
    if(this.props.shareFunction){
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_CHECK_IN_SHARE_DATA,
				{
					method: 'GET',
				},
				(responseJson) => {
					console.log("shareInfo: " + JSON.stringify(responseJson));
					var data = {
						webpageUrl: responseJson.url,
						imageUrl: responseJson.imgUrl,
						title: responseJson.title,
						description: responseJson.text,
					}
					this.props.shareFunction(data);
				}
			);
    }
	},

	renderTop: function(){
		var heightShow = this.state.height - UIConstants.HEADER_HEIGHT;

			return(
				<View style = {[styles.topLayout, {height: heightShow*(1*0.33),backgroundColor:ColorConstants.title_blue()}]}>

						<View style = {styles.bottomSepContainer}>
							<View style = {styles.topSep}>

								<Text style = {styles.textTopLine1}>总计交易金(元)</Text>
								<Text style = {styles.textTopLine2}>{this.state.totalUnpaidAmount}</Text>

							</View>

							<View style = {[styles.lineLittleTop,{backgroundColor:LogicData.getAccountState()?'#7f99c9':'#4c86ec'}]}>
							</View>

							<View style = {styles.topSep}>
								<Text style = {styles.textTopLine1}>累计签到数(天)</Text>
								<Text style = {styles.textTopLine2}>{this.state.totalSignDays}</Text>
							</View>
 						</View>
				</View>
			);
	},

	renderCoin:function(){
		return(
				<Animated.View
						 style={{
									 justifyContent: 'center',
									 alignItems: 'center',
									 opacity: this.state.fadeInValue,
									 transform: [
												{scale: this.state.bounceValue },
												{translateY:this.state.rotateValue.interpolate({
												inputRange: [0,0.5,1],
												outputRange: [0, -15,-200],
												})},
												{translateX:this.state.rotateValue.interpolate({
												inputRange: [0,0.8,1],
												outputRange: [0, -5,-80],
												})},
										 ]
									 }}>

									 	<Image style = {styles.imgCoin} source = {require('../../images/coin.png')}></Image>

				</Animated.View>


		);
	},

	renderMiddle: function(){
		var heightShow = this.state.height - UIConstants.HEADER_HEIGHT;
		return(
			<View style = {[styles.middleLayout, {height: heightShow*(1*0.57) + (roundR/2),}]}>
					<View style = {styles.signLayout}>
						<View style = {styles.roundButtonBoard}>
						<TouchableOpacity onPress={() => this._clickSign()}>
						 <View style = {[styles.roundButton,{backgroundColor:this.state.isSignedToday?'#b6b6b6':'#f5a228'}]}>
						 		<Text style = {styles.textSign}>{this.state.isSignedToday?'已签到':'签到'}</Text>
								<Text style = {styles.textSignIntro}>赚{this.state.amountToday}元</Text>
						 </View>
						 </TouchableOpacity>
	     			</View>
						<View style={{flex:1,justifyContent:'flex-end',flexDirection:'row'}}>

									<TouchableOpacity onPress={() => this._clickStratgy()}>
										<View style = {[styles.signStrategy,LogicData.getAccountState()?{backgroundColor:'#5b75a4'}:null]}>
											<Text style={styles.textSignStrategy}>签到攻略</Text>
											<View style={styles.textSignDot}></View>
										</View>
									</TouchableOpacity>

						</View>

					</View>

					<View style = {styles.belowSign}>
						<Text style = {styles.textMoreIntro}> 连签越多，赚的实盘交易金越多</Text>
						{this.renderCalendar()}
					</View>

			</View>
		);
	},

	_clickStratgy:function(){
		this.refs[RULE_DIALOG].show();
	},

	_clickSign:function(){
		if(!this.state.isSignedToday && signEnable){
			var userData = LogicData.getUserData()
			var notLogin = Object.keys(userData).length === 0
			if(!notLogin){
				TalkingdataModule.trackEvent(TalkingdataModule.CHECK_IN_BUTTON_EVENT);
				signEnable = false
				//TongDaoModule.trackDaySignEvent(this.state.totalSignDays>0)
				NetworkModule.fetchTHUrl(
					NetConstants.CFD_API.USER_DAILY_SIGN,
					{
						method: 'GET',
						headers: {
							'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						},
					},
					(responseJson) =>{
						// Alert.alert('签到成功')
						this.setState(
							{isSignedToday:true}
						)
						this._refresh()
						this._actionAni()
					},
					(result) => {
						signEnable = true
						//Alert.alert(error)
						// this._actionAni()
					}
				)
			}
		}else{
			// this._actionAni()
		}
	},

	_isSignedToday:function(){
		return this.state.isSignedToday
	},

	_isSignedDay:function(index){
		return this.state.days[index]
	},

	renderCalendar: function(){
		// var days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
		var colorSign = LogicData.getAccountState()?'#7294d0':'#4c88f1';
		var daysView = this.state.days.map(
			(day, i) =>
					<View style = {[styles.day ,  {backgroundColor:this._isSignedDay(i)?colorSign:'transparent'}  ]} key={i}>
						<Text style = {[styles.textDayNumber,{color:this._isSignedDay(i)?'#FFFFFF':'#B6B6B6'}]}>{i+1}</Text>
					</View>
			)

		return(
			<View style = {styles.calendar}>

			<View style = {styles.lineLeftRightTextContainer}>
			  <Image style = {styles.lineLeftRight} source = {require('../../images/line_left.png')} ></Image>
				<Text style = {styles.textMonth}>{this.state.monthToday}月签到日历</Text>
				<Image style = {styles.lineLeftRight} source = {require('../../images/line_right.png')} ></Image>
		  </View>
				<View style = {styles.calendarContainer}>
					{daysView}
				</View>
			</View>
		);
	},

	renderBottom: function(){
		var heightShow = this.state.height - UIConstants.HEADER_HEIGHT;

		return(
			<View style = {[styles.bottomLayout, {height:heightShow*(1*0.12),}]}>
					<View style = {styles.lineLeftRightTextContainer}>
						<Image style = {styles.lineLeftRight} source = {require('../../images/line_left.png')} ></Image>
     			 	<Text style = {[styles.textBottom]}>更多交易金获取方式</Text>
						<Image style = {styles.lineLeftRight} source = {require('../../images/line_right.png')} ></Image>
     			</View>

					<View style = {styles.bottomSepContainer}>
						<View style = {styles.bottomSep}>
							<View style = {styles.lineLittle}></View>
							<Text style = {styles.textBottom}>每日模拟交易送0.5元</Text>
						</View>
						<View style = {styles.bottomSep2}>
							<View style = {styles.lineLittle}></View>
							<Text style = {styles.textBottom}>{"注册盈交易即送" + LogicData.getRegisterReward() + "元"}</Text>
						</View>
					</View>
			</View>
		);
	},

	renderModal:function(){
		return(
			<HeaderLineDialog ref={RULE_DIALOG}
				headerImage={require('../../images/sign_stratgy.png')}
				messageLines={this.rules}/>
		);
	},

	renderModalCoin:function(){
		return(
			<Modal
				transparent={true}
			  visible={this.state.modalCoinVisible}
				animationType={"slide"}
				style={{height: height, width: width}}
				onRequestClose={() => {this._setModalCoinVisible(false)}}
				>
				<View style={[styles.modalCoinContainer]}>
					{this.renderCoin()}
				</View>

			</Modal>
		);
	},

 _setModalCoinVisible(visible) {
 	 this.setState({modalCoinVisible: visible});
  },


	render: function() {
		return (
			<View style={{flex: 1}}>
				<NavBar title='每日签到' showBackButton={true} navigator={this.props.navigator}
							imageOnRight={require('../../images/share01.png')}
							rightImageOnClick={this._share}/>
				<View style = {styles.scrollView}>
				  {this.renderModal()}
					{this.renderModalCoin()}
					{this.renderTop()}
					{this.renderMiddle()}
				  {this.renderBottom()}
				</View>
			</View>
		);
	},
});



var styles = StyleSheet.create({

	scrollView: {
		flex:1,
		backgroundColor: '#FFFFFF',
	  //height:height - UIConstants.HEADER_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER ,
	},

	topLayout:{
		//height:heightShow*(1*0.33),
		backgroundColor: ColorConstants.TITLE_BLUE,
	},

	middleLayout:{
		//height:heightShow*(1*0.57) + (roundR/2),
		marginTop:-roundR/2,
		// marginLeft:(width-roundR)/2,
		backgroundColor: '#00000000',
	},

	signLayout:{
		flexDirection:'row',
	},

	bottomLayout:{
		flex:1,
		//height:heightShow*(1*0.12),
		backgroundColor: '#F6F6F6',
	  alignItems:'center',
		justifyContent:'center',
	},

	bottomSepContainer:{
		 flexDirection:'row',
	},

	bottomSep:{
		flex:1,
		flexDirection:'row',
		width:width/2,
		alignItems:'center',
		justifyContent:'flex-start',
		paddingLeft:15,
		marginTop:5,
	},

	bottomSep2:{
		flex:1,
		flexDirection:'row',
		width:width/2,
		alignItems:'center',
		justifyContent:'flex-end',
		paddingRight:15,
		marginTop:5,
	},

	topSep:{
		flex:1,
		width:width/2,
		alignItems:'center',
		justifyContent:'center',
		marginTop:20,
	},

	calendar:{
		flex:1,
		alignItems:'center',
		justifyContent:'center',
	},

	day:{
		width:roundDay,
		height:roundDay,
		margin:5,

		borderRadius:roundDay/2,
		alignItems:'center',
		justifyContent:'center',
	},

	calendarContainer:{
		flexDirection:'row',
		flexWrap:'wrap',
		width:width,
		alignItems:'center',
		justifyContent:'flex-start',
	},

	lineLittle:{
		width:1.5,
		height:10,
		backgroundColor:'#aaaaaa',
		marginRight:5,
	},

	lineLittleTop:{
		width:1,
		height:40,
		backgroundColor:'#4c86ec',
		marginTop:25,
	},

	textBottom:{
    // textAlign:'left',
		fontSize:13,
		color:'#aaaaaa',
	},

	textDayNumber:{
		fontSize:10,
		textAlign:'center',
	},

	textDayNumber2:{
		fontSize:10,
		color:'#FFFFFF',
		textAlign:'center',
	},

	textTopLine1:{
		textAlign:'center',
		fontSize:17,
		marginBottom:5,
		color:'#E0E0E0',
	},

	textTopLine2:{
		textAlign:'center',
		fontSize:21,
		color:'#FFFFFF',
	},

	textMonth:{
		color:'#bebebe',
		marginTop:10,
		marginBottom:10,
		fontSize:14,
	},

	belowSign:{
		flex:1,
		// marginLeft:-(width-roundR)/2,
	},

	textSign:{
		textAlign:'center',
		fontSize:34,
		backgroundColor:'transparent',
		color:'#FFFFFF',
	},

	textSignStrategy:{
		fontSize:14,
		color:'#ffffff',
		paddingRight:8,
		flex:1,
		// borderTopLeftRadius:10,
		// borderBottomLeftRadius:10,
	  // borderRadius:10,
		// paddingLeft:10,
		// paddingTop:5,
		// paddingBottom:5,
		// paddingRight:20,
		textAlignVertical:'center',
		textAlign:'center',
	},

	textSignDot:{
			width:2,
			height:2,
			borderRadius:2,
			backgroundColor:'#f6b044',
			marginLeft:-10,
			marginRight:12,
			marginBottom:8,
	},

	signStrategy:{
		flexDirection:'row',
		width:80,
		height:24,
		marginRight:-5,
		borderRadius:5,
		backgroundColor:'#5a92f6',
		alignItems:'center',
	  justifyContent:'center',
	},

	textSignIntro:{
		textAlign:'center',
		fontSize:12,
		backgroundColor:'transparent',
		marginTop:5,
		color:'#E2E2E2',
	},

	textMoreIntro:{
		color:'#f5a228',
		textAlign:'center',
		marginTop:15,
		marginBottom:15,
		fontSize:19,
	},

	roundButtonBoard:{
		width:roundR,
		height:roundR,
		marginLeft:(width-roundR)/2,
		backgroundColor:'#FFFFFF',
		borderRadius: roundR/2,
	},

	roundButton:{
			width:roundR-14,
			height:roundR-14,
			marginLeft:7,
			marginTop:7,
			borderRadius: roundR/2,
			alignItems:'center',
			justifyContent:'center',
	},

	modalContainer:{
		flex: 1,
    justifyContent: 'center',
    padding: 20,
		backgroundColor:'rgba(0, 0, 0, 0.5)',
		// paddingBottom:height/2,
	},

	modalCoinContainer:{
		flex: 1,
		justifyContent: 'center',
		backgroundColor:'rgba(0, 0, 0, 0.0)',
		// paddingBottom:height/2,
	},

	modalInnerContainer: {
    borderRadius: 4,
    alignItems: 'center',
		// backgroundColor: '#fffdf4',
		// backgroundColor: '#05FFFFFF',
  },

	imgSignTexContainer:{
		alignItems: 'flex-start',
		backgroundColor: '#fffdf4',
		width:imgWidth * 0.85,
		height:imgWidth * 0.9,
		paddingTop:imgWidth / 5,
		paddingLeft:10,
		paddingRight:10,
		marginBottom:0,
	},

	imgSignStratgy:{
		// width:264,
		// height:72,
		width:imgWidth,
		height:imgHeight,
		position: 'absolute',
		top:22,
		left:(width - imgWidth - 40) / 2,
	},

	imgSignStratgyClose:{
		width:16,
		height:16,
		marginLeft:9999,
		marginBottom:32,
	},

	imgSignStratgyClose2:{
		width:16,
		height:16,
		marginLeft:0,
		marginTop:16,
	},

	textModal:{
		fontSize:modelTextW,
		width:imgWidth*0.65,
		marginTop:5,
		color:'#b7b7b7',
	},

	lineText:{
		flexDirection:'row',
		flexWrap:'wrap',
		marginTop:5,
		marginBottom:5,
	},

	number:{
		width:15,
		height:15,
		marginRight:5,
		marginTop:5,
		backgroundColor:'#4c88f1',
		borderRadius:roundDay/2,
		alignItems:'center',
		justifyContent:'center',
	},


	imgCoin:{
		width:48,
		height:48,
		// position: 'absolute',
		// top:height/2 - roundR/2,
		// left:width/2-24
	},

	lineLeftRightTextContainer:{
			justifyContent:'center',
			flexDirection:'row',
			alignItems:'center',

	},

	lineLeftRight:{
		 	width:45,
			height:1,
			margin:5,
	},

});

module.exports = DaySignPage;
