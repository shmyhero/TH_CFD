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

var CHART_TYPE_2MONTH = 0;
var CHART_TYPE_ALL = 1;


var tabNames = ['主页', '持仓', '平仓']

var emptyStar = '***'

// { followerCount: 0,
//   pl2w: -400.62942932,
//   avgPl: -9.538795936190477,
//   winRate: 0.3333333333333333,
//   cards: [],
//   id: 2030,
//   nickname: 'RamboOne',
//   picUrl: 'https://cfdstorage.blob.core.chinacloudapi.cn/user-picture/13b07850f6fa484dbc2337216acda804' }

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
		backRefresh: React.PropTypes.func,
	}

	static defaultProps = {
		userId: '',
		userName: ''
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
			rank: 1,
			rankDescription: '',
			isFollowingStatusChanged: false,
			isPrivate: true,
			currentSelectedTab : 0,
		}
	}

	componentDidMount() {
		this.loadUserInfo()

		if(LogicData.isUserSelf(this.state.id)) {
			this.setState({
				isPrivate: false,
			})
		}

	}

	componentWillUnmount() {
		if(this.props.backRefresh && this.state.isFollowingStatusChanged) {
			this.props.backRefresh();
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
					isPrivate: responseJson.showData == undefined ? true : (!responseJson.showData),
				}, () => {
					if(LogicData.isUserSelf(this.state.id)) {
						this.setState({
							isPrivate: false,
						})
					}
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

		return(
			<Image style = {[styles.topWapper,{backgroundColor:ColorConstants.TITLE_BLUE_LIVE}]} source={require('../../images/bgbanner.jpg')}>

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


	renderAddCareButton() {
		var userData = LogicData.getUserData()
		// console.log("userData id = " + userData.userId + " state.id = " + this.state.id);
		if(userData.userId == this.state.id) {
			return null
		} else {
			return(
				<TouchableOpacity
						onPress={()=>this._onPressedAddFollow()}>
					<View style={[styles.addToCareContainer,{backgroundColor:ColorConstants.TITLE_BLUE_LIVE}]}>
						<Text style={styles.addToCareText}>
							{this.state.isFollowing ? '取消关注':'+关注'}
						</Text>
					</View>
				</TouchableOpacity>
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
		// userId: PropTypes.number.isRequired,
		// userName: PropTypes.string.isRequired,
		var tabPages = [
			<UserHomePageTab0 navigator={this.props.navigator} userName = {this.props.userName} userId={this.props.userId} ref={'page0'}/>,
			<UserHomePageTab1 navigator={this.props.navigator} ref={'page1'}/>,
			<UserHomePageTab2 navigator={this.props.navigator} ref={'page2'}/>
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

	render() {
		return(
				<View style={styles.wapper}>
					<View style={{position:'absolute',width:width,height:height,backgroundColor:'#425a85'}}>
				</View>

				<View style={{position:'absolute',width:width,height:height}}>
					{/* <ScrollView
						showsHorizontalScrollIndicator={false}
				 		onScroll={(event)=>this.handleScroll(event)}
						scrollEventThrottle={16}> */}
					 	{this.topWarpperRender()}

						{this.renderContent()}
						{/* {this.middleWarpperRender()}
						<View style = {styles.separator}></View>
						{this.bottomWarpperRender()}
						<View style = {styles.separator}></View>
						{this.cardWarpperRender()}
						{this.renderEmptyBottom()} */}
					{/* </ScrollView> */}
				</View>


				<View style={{opacity:this.state.titleOpacity,position:'absolute',backgroundColor:'#425a85',width:width,height:60}}>

				</View>

				<View style={{position:'absolute',width:width,height:60}}>
					<NavBar title={this.state.nickname==''?this.props.userName:this.state.nickname}
					showBackButton={true}
					backgroundColor={'transparent'}
					navigator={this.props.navigator}
					rightCustomContent={() => this.renderAddCareButton()}/>
				</View>

			</View>
		);
	}

	// renderPrivateOne() {
	// 	if(this.state.isPrivate) {
	// 		return(null)
	// 	} else {
	// 		return(<Text style={{fontSize:12,color:'#424242',marginTop:5}}>$</Text>)
	// 	}
	// }
	//
	// renderPrivateTwo() {
	// 	if(this.state.isPrivate) {
	// 		return(null)
	// 	} else {
	// 		return(<Text style={{fontSize:12,color:'#424242',marginTop:5}}>%</Text>)
	// 	}
	// }

	// middleWarpperRender() {
	//
	// 	var rankColor = this.state.rank > 0 ? {
	// 		color: '#fa2c21'
	// 	} : null;
	// 	return(
	// 		<View style = {styles.middleWapper}>
	// 			<View style={{flexDirection:'row',height:40}}>
	// 				<View style = {[styles.oneOfThree,{flexDirection:'row'}]}>
	//
	// 						<TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>this._onPressedAskForRank()}>
	// 							<Text style={styles.font1}>交易等级</Text>
	// 							<Image style={{width:16,height:16,marginLeft:2}} source = {require('../../images/icon_ask.png')}></Image>
	// 						</TouchableOpacity>
	//
	//    			</View>
	// 				<View style = {styles.oneOfThree}>
	// 					<Text style={styles.font1}>平均每笔收益</Text>
	//
	//    			</View>
	// 				<View style = {styles.oneOfThree}>
	// 					<Text style={styles.font1}>胜率</Text>
	//    			</View>
	// 			</View>
	// 			<View style={{flexDirection:'row',flex:1,marginBottom:15}}>
	// 				<View style = {styles.oneOfThree}>
	//    				<Text style={[styles.font2,rankColor]}>{this.state.isPrivate ? emptyStar:this.state.rankDescription}</Text>
	//    			</View>
	// 				{this.rowSepartor()}
	// 				<View style = {styles.oneOfThree}>
	// 					{this.renderPrivateOne()}
	//    				<Text style={styles.font2}>{this.state.isPrivate ? emptyStar:this.state.avgPl.toFixed(2)}</Text>
	//    			</View>
	// 				{this.rowSepartor()}
	// 				<View style = {styles.oneOfThree}>
	//    				<Text style={styles.font2}>{this.state.isPrivate ? emptyStar:this.state.winRate.toFixed(2)}</Text>
	//           {this.renderPrivateTwo()}
	//    			</View>
	// 			</View>
	//  		</View>
	// 	)
	// }

	// lineSepartor() {
	// 	return(
	// 		<View style ={styles.lineSepartor}></View>
	// 	)
	// }
	//
	// rowSepartor() {
	// 	return(
	// 		<View style ={styles.rowSepartor}></View>
	// 	)
	// }
	//
	// _onPressedChartType(type) {
	// 	console.log('loadPlCloseData:' + type)
	//
	// 	if(this.state.chartType == type) {
	// 		console.log('same type clicked , return null')
	// 		return
	// 	}
	// 	var chartTypeName = "";
	// 	if(type == CHART_TYPE_2MONTH) {
	// 		chartTypeName = NetConstants.PARAMETER_CHARTTYPE_2WEEK_YIELD;
	// 	} else if(type == CHART_TYPE_ALL) {
	// 		chartTypeName = NetConstants.PARAMETER_CHARTTYPE_ALL_YIELD;
	// 	}
	//
	// 	this.setState({
	// 		chartType: type,
	// 		chartTypeName: chartTypeName,
	// 	}, () => this.loadPlCloseData())
	// }
	//
	// _onPressedAskForRank() {
	// 	this.props.navigator.push({
	// 		name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
	// 		url: NetConstants.TRADEHERO_API.WEBVIEW_TRADE_LEVEL,
	// 		isShowNav: false,
	// 	});
	// }
	//
	// _onPressedCardDetail() {
	// 	this.props.navigator.push({
	// 		name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
	// 		url: NetConstants.TRADEHERO_API.WEBVIEW_CARD_RULE,
	// 		isShowNav: false,
	// 	});
	// }
	//
	// _onPressedCares() {
	// 	console.log('_onPressedCares')
	// }
	//
	// _onPressedCards() {
	// 	console.log('_onPressedCards')
	// }

	// loadPlCloseData() {
	// 	console.log("loadPlCloseData this.state.isPrivate =" + this.state.isPrivate);
	// 	if(this.state.isPrivate) {
	// 		return
	// 	}
	// 	console.log("loadPlCloseData:start " + this.state.chartType);
	// 	var url = NetConstants.CFD_API.GET_POSITION_CHART_PLCLOSE_LIVE
	// 	if(this.state.chartType == CHART_TYPE_2MONTH) {
	// 		url = NetConstants.CFD_API.GET_POSITION_CHART_PLCLOSE_2W_LIVE
	// 	}
	//
	// 	url = url.replace("<id>", this.props.userId)
	//
	// 	var userData = LogicData.getUserData()
	// 	NetworkModule.fetchTHUrl(
	// 		url, {
	// 			method: 'GET',
	// 			headers: {
	// 				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
	// 				'Content-Type': 'application/json; charset=utf-8',
	// 			},
	// 		},
	// 		(responseJson) => {
	// 			console.log(responseJson);
	// 			this.setState({
	// 				plCloseData: responseJson
	// 			})
	// 		},
	// 		(result) => {
	//
	// 		},
	// 		true
	// 	)
	// }
	//
	// bottomWarpperRender() {
	// 	var pl2wShow = this.state.isPrivate ? emptyStar : this.state.pl2w.toFixed(2);
	// 	var totolPlColor = totolPlColor = '#474747'
	// 	if(!this.state.isPrivate) {
	// 		totolPlColor = this.state.pl2w.toFixed(2) >= 0 ? '#fa2c21' : ColorConstants.STOCK_DOWN_GREEN
	// 	}
	//
	// 	return(
	// 		<View style = {styles.bottomWapper}>
  //  			<View style ={styles.ceilWapper}>
  //     		<Text style = {{color:'#474747',fontSize:15}}>近2周收益：</Text>
	// 				<Text style = {[{color:totolPlColor,fontSize:15},]}>{pl2wShow}</Text>
  //     	</View>
	// 			{this.lineSepartor()}
	// 			<View style ={styles.ceilWapper2}>
	// 				<View style = {styles.ceilLeft}>
  //    				<View style = {styles.chartTypeBorder}>
	// 						<TouchableOpacity onPress={()=>this._onPressedChartType(CHART_TYPE_2MONTH)} style = {[styles.chartType,{backgroundColor:this.state.chartType == CHART_TYPE_2MONTH ? ColorConstants.TITLE_BLUE_LIVE:'white'}]}>
  //      					<Text style = {{fontSize:13,color:this.state.chartType == CHART_TYPE_2MONTH ? 'white' : ColorConstants.INPUT_TEXT_COLOR}}>近2周</Text>
  //      				</TouchableOpacity>
	// 						<TouchableOpacity onPress={()=>this._onPressedChartType(CHART_TYPE_ALL)} style = {[styles.chartType,{backgroundColor:this.state.chartType == CHART_TYPE_ALL ? ColorConstants.TITLE_BLUE_LIVE:'white'}]}>
  //      					<Text style = {{fontSize:13,color:this.state.chartType == CHART_TYPE_ALL ? 'white' : ColorConstants.INPUT_TEXT_COLOR}}>全部</Text>
  //      				</TouchableOpacity>
  //        		</View>
  //    			</View>
	// 				<View style = {styles.ceilRight}>
	// 					<View style = {[styles.tipIcon,{backgroundColor:ColorConstants.TITLE_BLUE_LIVE}]}></View>
  //    				<Text style = {{fontSize:10,color:'#474747'}}>TA的收益走势</Text>
  //    			</View>
  //   		</View>
	// 			{this.chartRender()}
  //  		</View>
	// 	)
	// }
	//
	// chartRender() {
	// 	if(Platform.OS === "ios") {
	// 		return(
	// 			<LineChart style={styles.lineChart}
	// 				data={JSON.stringify(this.state.plCloseData)}
	// 				chartType={this.state.chartTypeName}>
	// 			</LineChart>
	// 		)
	// 	} else {
	// 		var textColor = "#70a5ff"; //text bottom and right
	// 		var backgroundColor = "white"
	// 		var borderColor = "#497bce"; //line
	// 		var lineChartGradient = ['transparent', 'transparent']
	//
	// 		return(
	// 			<LineChart style={styles.lineChart}
	// 				chartType={this.state.chartTypeName}
	// 				data={JSON.stringify(this.state.plCloseData)}
	// 				xAxisPosition="BOTTOM"
	// 				borderColor={borderColor}
	// 				xAxisTextSize={8}
	// 				rightAxisTextSize={8}
	// 				textColor={textColor}
	// 				rightAxisDrawGridLines={true}
	// 				rightAxisLabelCount={5}
	// 				rightAxisPosition="OUTSIDE_CHART"
	// 				rightAxisEnabled={true}
	// 				rightAxisDrawLabel={true}
	// 				chartPaddingTop={15}
	// 				chartPaddingBottom={5}
	// 				drawBackground={true}
	// 				backgroundColor={backgroundColor}
	// 				chartPaddingLeft={15}
	// 				chartPaddingRight={15}
	// 				lineChartGradient={lineChartGradient}
	// 			>
	// 			</LineChart>
	// 		)
	// 	}
	// }
	//
	// pressCard(index) {
	// 	console.log("pressedCard:" + index);
	// }
	//
	// cardWarpperRender() {
	// 	var _scrollView: ScrollView;
	//
	// 	if(this.state.cards.length > 0 && !this.state.isPrivate) {
	// 		var lastIndex = this.state.cards.length - 1;
	// 		var cardItems = this.state.cards.map(
	// 			(card, i) =>
	// 			<TouchableOpacity onPress={() => this.pressCard(i)} key={i}>
	// 				<View style={[styles.cardItem,{marginRight:i==0?4:10},{marginRight:i==lastIndex?10:4}]}>
	// 					<Image style={styles.cardImage} source={{uri:this.state.cards[i].imgUrlMiddle}}></Image>
	// 					<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
	// 						<Text style={{color:'#fa2c21',fontSize:14,marginBottom:5}}>{this.state.cards[i].plRate.toFixed(2)}%</Text>
	// 						<Text style={{color:'#3f3f3f',fontSize:14}}>{this.state.cards[i].stockName}</Text>
	// 					</View>
	// 				</View>
	// 			</TouchableOpacity>
	// 		)
	//
	// 		return(
	// 			<View style = {styles.cardWapper}>
	// 				<View style={styles.cardWapperContainer}>
	// 					<Text style={styles.cardWapperTitle}>
	// 						卡片成就
	// 					</Text>
	// 					<TouchableOpacity onPress={()=>this._onPressedCardDetail()}>
	// 						<Text style={styles.more}>
	// 							了解详情 >
	// 						</Text>
	// 					</TouchableOpacity>
	// 				</View>
	// 				<View style={{flexDirection:'row',
	// 				  backgroundColor: ColorConstants.TITLE_BLUE_LIVE,}}>
	// 					<ScrollView
	// 						ref={(scrollView) => { _scrollView = scrollView; }}
	// 						automaticallyAdjustContentInsets={false}
	// 						horizontal={true}
	// 						style={styles.horizontalScrollView}>
	// 						{cardItems}
	// 					</ScrollView>
	// 				</View>
	// 			</View>
	// 		)
	// 	} else {
	// 		return null
	// 	}
	// }


		// renderEmptyBottom() {
		// 	if(Platform.OS === "ios") {
		// 		return null
		// 	} else {
		// 		return(
		// 			<View style={{height:20,width:width}}></View>
		// 		)
		// 	}
		// }
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
		width: 158,
		height: 158,
		marginTop: -118,
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
});

module.exports = UserHomePage;
