'use strict';

import React, {
	Component,
	PropTypes
} from 'react'
import {
	StyleSheet,
	ScrollView,
	Text,
	Image,
	View,
	Dimensions,
	ListView,
	Alert,
	Platform,
	TouchableOpacity,
} from 'react-native'

var {
	height,
	width
} = Dimensions.get('window')

var StorageModule = require('../module/StorageModule')
var heightRate = height / 667.0
var NavBar = require('./NavBar')
var Reward = require('./Reward')
var LogicData = require('../LogicData');
var LineChart = require('./component/lineChart/LineChart');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var StockTransactionInfoModal = require('./StockTransactionInfoModal')
var UIConstants = require('../UIConstants')
var NetworkErrorIndicator = require('./NetworkErrorIndicator');
var ColorConstants = require('../ColorConstants')
var MainPage = require('./MainPage')
var UserHomePageTab0 = require('./UserHomePageTab0')
var UserHomePageTab1 = require('./UserHomePageTab1')
var UserHomePageTab2 = require('./UserHomePageTab2')
var ScrollTabView = require('./component/ScrollTabView2')
var {EventCenter, EventConst} = require('../EventCenter')


var CHART_TYPE_2MONTH = 0;
var CHART_TYPE_ALL = 1;


var tabNames = ['主页', '持仓', '平仓']

var emptyStar = '***'
var btnBgColor = ['#425a85','#425a85','#425a85','#6f3d23','#55707c','#9a820e',]
var btnBorderColor = ['#ffffff','#ffffff','#ffffff','#c79779','#94afbe','#e9d670']

var layoutSizeChangedSubscription = null
// { followerCount: 5,
//   isFollowing: false,
//   totalPl: 689.62,
//   pl2w: 468.32,
//   avgPl: 9.194933333333333,
//   winRate: 0.7333333333333333,
//   cards: [],
//   rank: 1,
//   rankDescription: '财富起航',
//   showData: true,
//   avgLeverage: 0,
//   orderCount: 0,
//   avgHoldPeriod: 0,
//   avgInvestUSD: 0,
//   id: 3807,
//   nickname: 'cooler' }

// { cardId: 1,
//        invest: 1000,
//        isLong: true,
//        leverage: 50,
//        tradePrice: 5226.63,
//        settlePrice: 5308.38,
//        imgUrlBig: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_large_20170306.png',
//        imgUrlMiddle: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_middle_20170222.jpg',
//        imgUrlSmall: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_small_20170222.jpg',
//        reward: 1,
//        tradeTime: '2017-02-15T23:34:10.107',
//        ccy: 'USD',
//        stockID: 36004,
//        stockName: '美国科技股100',
//        themeColor: '#af6c47',
//        title: '独门技法',
//        cardType: 1,
//        pl: 782.05,
//        plRate: 78.2053,
//        likes: 29,
//        shared: true,
//        isNew: false }

export default class UserHomePage extends Component {

	static propTypes = {
		userId: PropTypes.number.isRequired,
		userName: PropTypes.string.isRequired,
		isPrivate: PropTypes.bool.isRequired,
		backRefresh: React.PropTypes.func,
	}

	static defaultProps = {
		userId: '',
		userName: '',
		isPrivate: false,
		isPositionPrivate:false,
	}

	constructor(props) {
		super(props);
		this.state = {
			chartType: CHART_TYPE_2MONTH,
			chartTypeName: NetConstants.PARAMETER_CHARTTYPE_2WEEK_YIELD,
			id: this.props.userId,
			plCloseData: null,
			avgPl: 0,
			winRate: 0,
			nickname: '',
			followerCount: 0,
			cards: [],
			pl2w: 0,
			picUrl: undefined,
			isFollowing: false,
			titleOpacity: 0,
			rank: 0,
			rankDescription: '',
			isFollowingStatusChanged: false,
			isPrivate: true,
			isPositionPrivate:true,
			currentSelectedTab : 0,
//			isShowGuide:false,
			height: UIConstants.getVisibleHeight(),
		}
	}

	componentDidMount() {
		this.loadUserInfo()

		layoutSizeChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.LAYOUT_SIZE_CHANGED, () => {
			this.onLayoutSizeChanged();
		});

//		if(LogicData.isUserSelf(this.state.id)) {
//
//			StorageModule.loadGuideRanking()
//			.then((value) => {
//				 if(value==null){
//					 this.setState({
//		 				isShowGuide:true,
//				 	})
//					console.log("Rambo loadGuideRanking :"+value);
//					StorageModule.setGuideRanking('True')
//			   }
//			}).done()
//		}

		this.onPageSelected(0)

	}

	componentWillUnmount() {

		layoutSizeChangedSubscription && layoutSizeChangedSubscription.remove();

		if(this.props.backRefresh && this.state.isFollowingStatusChanged) {
			this.props.backRefresh();
		}
	}

	onLayoutSizeChanged(){
		if (Platform.OS == 'android') {
			this.setState({
				height: UIConstants.getVisibleHeight(),
			});
		}
	}

	loadUserInfo() {
		var url = NetConstants.CFD_API.GET_USER_LIVE_DETAIL;
		url = url.replace("<id>", this.props.userId);
		var userData = LogicData.getUserData()
		NetworkModule.fetchTHUrl(
			url, {
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=utf-8',
				},
			},
			(responseJson) => {
				console.log(responseJson);

				let res = responseJson.showData == undefined ? true : (!responseJson.showData)
				console.log("Rambo:::"+res);

				this.setState({
					id: responseJson.id,
					avgPl: responseJson.avgPl,
					winRate: responseJson.winRate * 100,
					nickname: responseJson.nickname,
					followerCount: responseJson.followerCount,
					cards: responseJson.cards,
					pl2w: responseJson.pl2w,
					picUrl: responseJson.picUrl,
					isFollowing: responseJson.isFollowing,
					rank: responseJson.rank,
					rankDescription: responseJson.rankDescription,
					isPrivate:responseJson.showData == undefined ? true : (!responseJson.showData),
					isPositionPrivate:responseJson.showOpenCloseData == undefined ? true : (!responseJson.showOpenCloseData),
				}, () => {
					this.refs['page0'].tabPressed()
				})
				this.loadPlCloseData()
			},
			(result) => {

			},
			true
		)
	}

	topWarpperRender() {
		// console.log("this.state.rank = "+this.state.rank);
		var head = (this.state.picUrl)
		var headRank = LogicData.getRankHead(this.state.rank);
		if(head) {
			head = {
				uri: head
			}
		} else {
			head = require('../../images/head_portrait.png')
		}

		var privateStyle = this.state.isPrivate ? {
			height: 0
		} : null;

		var bgBanner = LogicData.getRankBanner(this.state.rank);

		return(

			<View>
				<Image style = {[styles.topWapper,{backgroundColor:ColorConstants.TITLE_BLUE_LIVE}]} source={bgBanner}>

					<View style = {[styles.topOneOfThree,privateStyle]}>
						<View style={{marginTop:32}}></View>
	    			<Text style = {{fontSize:36,backgroundColor:'transparent',color:'white'}}>{this.state.followerCount}</Text>
						<Text style = {{fontSize:12,backgroundColor:'transparent',color:'white'}}>关注数</Text>
	    		</View>

					<View style = {[styles.topOneOfThree,]}>
							<View style={{marginTop:32}}></View>
							<Image style = {styles.userHeaderIcon} source={head}></Image>
							<Image style = {styles.userHeaderIconRound} source={headRank}></Image>
					</View>

					<View style = {[styles.topOneOfThree,privateStyle]}>
						<View style={{marginTop:32}}></View>
						<Text style = {{fontSize:36,backgroundColor:'transparent',color:'white'}}>{this.state.cards.length}</Text>
						<Text style = {{fontSize:12,backgroundColor:'transparent',color:'white'}}>卡片数</Text>
					</View>

	   		</Image>
			</View>

		)
	}

	isUserSelf() {
		var userData = LogicData.getUserData()
		return userData.userId == this.state.id;
	}



	_onPressedAddFollow() {
		this.setState({
			isFollowing: !this.state.isFollowing
		}, this.follow())
	}

	_onPressedSetPrivate() {

		this.setState({
			isPrivate: !this.state.isPrivate
		}, this.setPrivate())

	}

	setPrivate(){
		console.log("setPrivate function clicked!");
		this.changeShowPersonalDataSetting(this.state.isPrivate)
	}

	follow() {

		var userData = LogicData.getUserData()

		if(this.state.isFollowing) {
			var url = NetConstants.CFD_API.DEL_USER_FOLLOW
			url = url.replace("<id>", this.props.userId);
			NetworkModule.fetchTHUrl(
				url, {
					method: 'DELETE',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=utf-8',
					},
				},
				(responseJson) => {
					console.log(responseJson);
					this.setState({
						isFollowing: false,
						isFollowingStatusChanged: true,
					})
				},
				(result) => {

				},
				true
			)
		} else {
			var url = NetConstants.CFD_API.PUT_USER_FOLLOW
			url = url.replace("<id>", this.props.userId);
			NetworkModule.fetchTHUrl(
				url, {
					method: 'PUT',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=utf-8',
					},
				},
				(responseJson) => {
					console.log(responseJson);
					this.setState({
						isFollowing: true,
						isFollowingStatusChanged: true,
					})
				},
				(result) => {

				},
				true
			)
		}

	}

	renderRightCustomButton(){
		var userData = LogicData.getUserData()
		if(userData.userId == this.state.id) {
			return (<View/>);
			//return this.renderPrivateSetButton()
		} else {
			return this.renderAddCareButton()
		}
	}


	renderAddCareButton() {
		// var userData = LogicData.getUserData()
		// // console.log("userData id = " + userData.userId + " state.id = " + this.state.id);
		// if(userData.userId == this.state.id) {
		// 	return null
		// } else {

			var borderColor = btnBorderColor[this.state.rank]
			var bgColor = btnBgColor[this.state.rank]

			return(
				<TouchableOpacity
						onPress={()=>this._onPressedAddFollow()}>
					<View style={[styles.addToCareContainer,{backgroundColor:bgColor,borderColor:borderColor}]}>
						<Text style={styles.addToCareText}>
							{this.state.isFollowing ? '取消关注':'+关注'}
						</Text>
					</View>
				</TouchableOpacity>
			)
		// }

	}

	//用户自己设置 公开数据or隐藏数据
	renderPrivateSetButton() {

			var borderColor = btnBorderColor[this.state.rank]
			var bgColor = btnBgColor[this.state.rank]

			return(
				<TouchableOpacity
						onPress={()=>this._onPressedSetPrivate()}>
					<View style={[styles.addToCareContainer,{backgroundColor:bgColor,borderColor:borderColor}]}>
						<Text style={styles.addToCareText}>
							{this.state.isPrivate ? '公开数据':'隐藏数据'}
						</Text>
					</View>
				</TouchableOpacity>
			)
	}

	changeShowPersonalDataSetting(value){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if (notLogin) {
		}else{
			var url = NetConstants.CFD_API.SHOW_USER_DATA_API

			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'POST',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=utf-8',
					},
					body: JSON.stringify({
						showData: value,
					}),
				},
				function(responseJson) {
					//Do nothing?
					this.onPageSelected(this.state.currentSelectedTab)
				}.bind(this),
				function(result) {
					Alert.alert('提示', result.errorMessage);
				}
			)
		}
	}


	handleScroll(event: Object) {
		var opt = Math.min(Math.abs(event.nativeEvent.contentOffset.y), 100)
		opt /= 100;
		this.setState({
			titleOpacity: opt
		})
	}

	onPageSelected(index: number) {
		this.setState({
			currentSelectedTab: index,
		})

		if (this.refs['page' + index]) {
			this.refs['page' + index].tabPressed()
		}

	}

	renderContent(){
//		console.log("Rambo:::renderContent:"+this.state.isPrivate);
		// userId: PropTypes.number.isRequired,
		// userName: PropTypes.string.isRequired,
		var tabPages = [
			<UserHomePageTab0 navigator={this.props.navigator} userName = {this.props.userName} userId={this.props.userId} isPrivate={this.state.isPrivate} ref={'page0'}/>,
			<UserHomePageTab1 navigator={this.props.navigator} userId={this.props.userId} isPrivate={(this.state.isPrivate)||(this.state.isPositionPrivate)} ref={'page1'}/>,
			<UserHomePageTab2 navigator={this.props.navigator} userId={this.props.userId} isPrivate={(this.state.isPrivate)||(this.state.isPositionPrivate)} ref={'page2'}/>
		]

		var viewPages = tabNames.map(
			(tabName, i) =>
			<View style={{width:width}} key={i}>
				{tabPages[i]}
			</View>
		)

		return (
			<View style={{flex: 1}}>
				<ScrollTabView ref={"tabPages"} tabNames={tabNames} viewPages={viewPages} removeClippedSubviews={true}
					onPageSelected={(index) => this.onPageSelected(index)} />
			</View>
		)
	}

	onPressIKnow(){
		this.setState({
			isShowGuide:false
		})
	}

	showGuide(){
		if(this.state.isShowGuide){
			return(
				<View>
					<View style={styles.guide}>
					</View>
						<View style={{position:'absolute',width:width,height:height}}>
							<Image style={{width:122,height:142,marginLeft:width-122}} source = {require('../../images/icon_guide_1.png')}></Image>
							<View style={styles.guideContent}>
								<Image style={{width:106,height:82,marginBottom:5}} source = {require('../../images/icon_guide_2.png')}></Image>
								<Text style={styles.textGuide}>打开开关，即可查看自己的交易数据，</Text>
								<Text style={styles.textGuide}>也可以让更多的人了结我哦！</Text>
								<TouchableOpacity
										onPress={()=>this.onPressIKnow()}>
										<Text style={styles.guideButton}>知道了</Text>
								</TouchableOpacity>
							</View>
						</View>
				</View>

			)
		}else{
			return null
		}
	}

	proceedCallback(result){
		console.log("Rambo  llll ",result);
		if(result){
			this.setState({
				isPrivate: !this.state.isPrivate
			}, this.setPrivate())
		}
	}

	render() {
		return(
				<View style={[styles.wapper, {height: this.state.height}]}>
					{/* <View style={{position:'absolute',width:width,height:height,backgroundColor:'#425a85'}}>
			    </View> */}

					<View style={{position:'absolute',width:width,height:this.state.height}}>
						 	{this.topWarpperRender()}
							{this.renderContent()}
					</View>

					<View style={{position:'absolute',width:width,height:60}}>
						<NavBar title={this.state.nickname==''?this.props.userName:this.state.nickname}
						showBackButton={true}
						backgroundColor={'transparent'}
						navigator={this.props.navigator}
						rightCustomContent={() => this.renderRightCustomButton()}/>
					</View>

					{/*this.showGuide()*/}

			</View>
		);
	}

}

const styles = StyleSheet.create({
	wapper: {
		width: width,
		height: height
	},

	scroolItem: {
		width: (width - 20) / 2,
		height: ((width - 20) / 2) + 80,
		marginRight: 5,
		marginBottom: 10,
	},

	list: {
		marginLeft: 5,
		marginTop: 5,
		marginRight: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		flexWrap: 'wrap',
	},

	emptyContent: {
		height: height - UIConstants.HEADER_HEIGHT,
		alignItems: 'center',
		justifyContent: 'center'
	},
	emptyText: {
		marginTop: 14,
		color: '#afafaf'
	},

	topWapper: {
		width: width,
		height: 220,
		flexDirection: 'row',
	},

	middleWapper: {
		width: width,
		height: 80,
		backgroundColor: 'white',
	},

	bottomWapper: {
		width: width,
		height: width * 3 / 4,
		backgroundColor: 'white',
	},

	separator: {
		width: width,
		height: 10,
		backgroundColor: '#f3f3f5',
	},

	cardWapper: {
		width: width,
	},

	cardWapperContainer: {
		height: 40,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white'
	},

	cardWapperTitle: {
		flex: 1,
		fontSize: 17,
		marginLeft: 15,
		color: "#3f3f3f",
	},

	more: {
		fontSize: 14,
		color: ColorConstants.MORE_ICON,
		marginRight: 15,
	},

	oneOfThree: {
		flex: 1,
		backgroundColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 5,
		flexDirection: 'row',

	},

	font1: {
		fontSize: 11,
		color: '#9c9b9b'
	},

	font2: {
		fontSize: 19,
		color: '#424242'
	},

	ceilWapper: {
		width: width,
		height: 40 * heightRate,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 15,
	},

	ceilWapper2: {
		width: width,
		height: 30 * heightRate,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		marginTop: 10,
	},

	ceilLeft: {
		flexDirection: 'row',
	},

	ceilRight: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		flex: 1,
		alignItems: 'center',
	},

	lineSepartor: {
		width: width,
		height: 0.5,
		backgroundColor: '#EEEEEE'
	},

	rowSepartor: {
		width: 0.5,
		height: 20,
		backgroundColor: '#EEEEEE'
	},

	tipIcon: {
		width: 10,
		height: 2,
		marginRight: 5,
	},

	chartTypeBorder: {
		width: 140,
		height: 30,
		borderRadius: 2,
		borderWidth: 1,
		borderColor: 'grey',
		flexDirection: 'row',
	},

	chartType: {
		flex: 1,
		borderRadius: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},

	userHeaderIcon: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 2,
		borderColor: 'white'
	},

	userHeaderIconRound: {
		width: 156,
		height: 156,
		marginTop: -120,
		marginLeft: (width / 3 - 158) / 2,
		position: 'absolute',
	},

	topOneOfThree: {
		backgroundColor: 'transparent',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},

	addToCareContainer: {
		marginRight: 10,
		paddingHorizontal: 10,
		paddingVertical: 5,
		backgroundColor: '#2d71e5',
		borderWidth: 1,
		borderRadius: 3,
		borderColor: '#ffffff',
	},

	addToCareText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#ffffff',
	},
	lineChart: {
		flex: 1,
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
		paddingTop: 6,
		paddingBottom: 16,
		marginTop: 10,
		marginBottom: 10,
	},

	cardShowWapper: {
		width: width,
		height: width * 4 / 5,
	},

	horizontalScrollView: {
		height: width * 4 / 5,
		width: width - 20,
	},

	cardItem: {
		width: (width - 30) / 2,
		height: width * 4 / 5 - 40,
		marginTop: 20,
		marginBottom: 20,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: 'white',
		borderRadius: 2,
	},
	cardImage: {
		backgroundColor: 'green',
		height: (width * 4 / 5) * 2 / 3,
		width: (width - 30) / 2
	},
	guide:{
		position:'absolute',
		width:width,
		height:height,
		opacity:0.75,
		backgroundColor:'#4c4c4c'
	},
	textGuide:{
		color:'#FFFFFF',
		fontSize:17,
		width:width,
		marginTop:5,
		textAlign:'center',
		justifyContent:'center',
	},
	guideButton:{
		borderWidth:1,
		borderColor:'#FFFFFF',
		fontSize:18,
		borderRadius:22,
		color:'white',
		paddingLeft:50,
		paddingRight:50,
		paddingTop:10,
		paddingBottom:10,
		marginTop:20
	},
	guideContent:{
		flex:1,
		marginTop:-80,
		alignItems:'center',
		justifyContent:'center'
	}
});

module.exports = UserHomePage;
