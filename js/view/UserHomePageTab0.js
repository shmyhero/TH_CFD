'use strict';

import React,{Component,PropTypes} from 'react'
import {StyleSheet,Text,Image,ScrollView,Platform,View,Dimensions,ListView,Alert,TouchableOpacity} from 'react-native'


var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var Reward = require('./Reward')
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var LineChart = require('./component/lineChart/LineChart');
var StockTransactionInfoModal = require('./StockTransactionInfoModal')
var UIConstants = require('../UIConstants')
var MainPage = require('./MainPage')
var ColorConstants = require('../ColorConstants')
var StatisticBarBlock = require('./personalPage/StatisticBarBlock')
var ProfitBlock = require('./personalPage/ProfitBlock')
var TradeStyleBlock = require('./personalPage/TradeStyleBlock')

var CHART_TYPE_2MONTH = 0;
var CHART_TYPE_ALL = 1;
var emptyStar = '***'
var LS = require('../LS')

const STATISTIC_BAR_BLOCK = "statisticBarBlock";
const TRADE_STYLE_BLOCK = "tradeStyleBlock";
const PROFIT_BLOCK = 'profitBlock';

export default class UserHomePageTab0 extends Component{


  static propTypes = {
    isStatisticPage: PropTypes.bool,
    userId: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    backRefresh: React.PropTypes.func,
    isPrivate: PropTypes.bool,
  }

  static defaultProps = {
    isStatisticPage: false,
    userId: '',
    userName: '',
    isPrivate: true,
  }

    constructor(props){
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
            // isPrivate: false,
            avgLeverage: 0,
            orderCount: 0,
            avgHoldPeriod: 0,
            avgInvestUSD: 0,
        }
    }


  componentDidMount(){
    this.loadUserInfo()
  }

  componentWillUnmount() {
  }

  loadUserInfo() {
		var url = NetConstants.CFD_API.GET_USER_LIVE_DETAIL;
		url = url.replace("<id>", this.props.userId);
		var userData = LogicData.getUserData()
		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=utf-8',
				},
			},
			(responseJson) => {
				console.log(responseJson);
                // var isPrivate = responseJson.showData == undefined ? true : (!responseJson.showData);
                // if(LogicData.isUserSelf(this.state.id)) {
                //   isPrivate = false;
                // }
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
                    // isPrivate: isPrivate,
                    avgLeverage: responseJson.avgLeverage,
                    orderCount: responseJson.orderCount,
                    avgHoldPeriod: responseJson.avgHoldPeriod,
                    avgInvestUSD: responseJson.avgInvestUSD,
				}, () => {
                    this.refreshData();
				})
				this.loadPlCloseData()
			},
			(result) => {

			},
			true
		)
	}

  _onPressedAskForRank() {
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: NetConstants.TRADEHERO_API.WEBVIEW_TRADE_LEVEL,
			isShowNav: false,
		});
	}

	_onPressedCardDetail() {
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: NetConstants.TRADEHERO_API.WEBVIEW_CARD_RULE,
			isShowNav: false,
		});
	}

	_onPressedCards() {
		console.log('_onPressedCards')
	}

  tabPressed(index) {
    console.log("tabPressed==>"+index);
    this.refreshData();
    // this.loadUserInfo();
  }

  refresh(){
    this.loadUserInfo();
  }

  refreshData(){
    var tradeStyle = {
      avgLeverage: this.state.avgLeverage,
      orderCount:this.state.orderCount,
      avgHoldPeriod: this.state.avgHoldPeriod,
      avgInvestUSD: this.state.avgInvestUSD,
      avgPl:this.state.avgPl,
      winRate:this.state.winRate,
      isPrivate:this.props.isPrivate,
    }

    var staticBarBlock = {
      isPrivate:this.props.isPrivate,
    }


//    this.refs[STATISTIC_BAR_BLOCK].refresh(staticBarBlock);
    this.refs[TRADE_STYLE_BLOCK].refresh(tradeStyle);
    this.refs[PROFIT_BLOCK].refresh();
  }

  middleWarpperRender() {

		var rankColor = this.state.rank > 0 ? {
			color: '#fa2c21'
		} : null;

    var add = this.state.avgPl >0? '+':'';
    var strJYDJ = LS.str('JYDJ')
    var strPJMBSY = LS.str('PJMBSY')
    var strSL = LS.str('SL')
		return(
			<View style = {styles.middleWapper}>
				<View style={{flexDirection:'row',height:40}}>
					<View style = {[styles.oneOfThree,{flexDirection:'row'}]}>

							<TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>this._onPressedAskForRank()}>
								<Text style={styles.font1}>{strJYDJ}</Text>
								<Image style={{width:16,height:16,marginLeft:2}} source = {require('../../images/icon_ask.png')}></Image>
							</TouchableOpacity>

     			</View>
					<View style = {styles.oneOfThree}>
						<Text style={styles.font1}>{strPJMBSY}</Text>

     			</View>
					<View style = {styles.oneOfThree}>
						<Text style={styles.font1}>{strSL}</Text>
     			</View>
				</View>
				<View style={{flexDirection:'row',flex:1,marginBottom:15}}>
					<View style = {styles.oneOfThree}>
     				<Text style={[styles.font2,rankColor]}>{this.props.isPrivate ? emptyStar:this.state.rankDescription}</Text>
     			</View>
					{this.rowSepartor()}
					<View style = {styles.oneOfThree}>
						{/* {this.renderPrivateOne()} */}
     				<Text style={styles.font2}>{this.props.isPrivate ? emptyStar:add+this.state.avgPl.toFixed(2)}</Text>
     			</View>
					{this.rowSepartor()}
					<View style = {styles.oneOfThree}>
     				<Text style={styles.font2}>{this.props.isPrivate ? emptyStar:this.state.winRate.toFixed(2)}</Text>
            {this.renderPrivateTwo()}
     			</View>
				</View>
   		</View>
		)
	}

  bottomWarpperRender() {
		var pl2wShow = this.props.isPrivate ? emptyStar : this.state.pl2w.toFixed(2);
    var addValue = this.state.pl2w>0 ? "+":""
		var totolPlColor = totolPlColor = '#474747'
		if(!this.props.isPrivate) {
			totolPlColor = this.state.pl2w.toFixed(2) >= 0 ? '#fa2c21' : ColorConstants.STOCK_DOWN_GREEN
		}

		var userData = LogicData.getUserData();
    // if(this.props.isPrivate){
    //   return(
    //     <View style = {[styles.bottomWapper]}>
    //       <View style ={styles.ceilWapper}>
    //         <Text style = {{color:'#474747',fontSize:15}}>近2周收益：</Text>
    //         <Text style = {[{color:totolPlColor,fontSize:15},]}>{emptyStar}</Text>
    //       </View>
    //       {this.lineSepartor()}
    //       <View style = {{flex:1, alignItems:'center',justifyContent:'center'}} >
    //         <Text style = {styles.loadingText}>用户未公开数据</Text>
    //       </View>
    //     </View>
    //   )
    // }else{


//     			<View style ={styles.ceilWapper}>
//        		    <Text style = {{color:'#474747',fontSize:15}}>近2周收益：</Text>
//  					<Text style = {[{color:totolPlColor,fontSize:15},]}>{addValue}{pl2wShow}</Text>
//        	    </View>
    var strJ2Z = LS.str('J2Z')
    var strQB = LS.str('QB')
    var strTDSYZS = LS.str('TDSYZS')
      return(
  		  <View style = {styles.bottomWapper}>
          <View style={styles.separatorLine}/>

  				<View style ={styles.ceilWapper2}>
  					<View style = {styles.ceilLeft}>
       				<View style = {styles.chartTypeBorder}>
  							<TouchableOpacity onPress={()=>this._onPressedChartType(CHART_TYPE_2MONTH)} style = {[styles.chartType,{backgroundColor:this.state.chartType == CHART_TYPE_2MONTH ? ColorConstants.TITLE_BLUE_LIVE:'white'}]}>
         					<Text style = {{fontSize:13,color:this.state.chartType == CHART_TYPE_2MONTH ? 'white' : ColorConstants.INPUT_TEXT_COLOR}}>{strJ2Z}</Text>
         				</TouchableOpacity>
  							<TouchableOpacity onPress={()=>this._onPressedChartType(CHART_TYPE_ALL)} style = {[styles.chartType,{backgroundColor:this.state.chartType == CHART_TYPE_ALL ? ColorConstants.TITLE_BLUE_LIVE:'white'}]}>
         					<Text style = {{fontSize:13,color:this.state.chartType == CHART_TYPE_ALL ? 'white' : ColorConstants.INPUT_TEXT_COLOR}}>{strQB}</Text>
         				</TouchableOpacity>
           		</View>
       			</View>
  					<View style = {styles.ceilRight}>
  						<View style = {[styles.tipIcon,{backgroundColor:ColorConstants.TITLE_BLUE_LIVE}]}></View>
       				<Text style = {{fontSize:10,color:'#474747'}}>{strTDSYZS}</Text>
       			</View>
      		</View>
  				{this.chartRender()}
     		</View>
  		)
    // }

	}

  _onPressedChartType(type) {
		console.log('loadPlCloseData:' + type)

		if(this.state.chartType == type) {
			console.log('same type clicked , return null')
			return
		}
		var chartTypeName = "";
		if(type == CHART_TYPE_2MONTH) {
			chartTypeName = NetConstants.PARAMETER_CHARTTYPE_2WEEK_YIELD;
		} else if(type == CHART_TYPE_ALL) {
			chartTypeName = NetConstants.PARAMETER_CHARTTYPE_ALL_YIELD;
		}

		this.setState({
			chartType: type,
			chartTypeName: chartTypeName,
		}, () => this.loadPlCloseData())
	}

  loadPlCloseData() {
		console.log("loadPlCloseData this.props.isPrivate =" + this.props.isPrivate);
		// if(this.props.isPrivate) {
		// 	return
		// }
		console.log("loadPlCloseData:start " + this.state.chartType);
		var url = NetConstants.CFD_API.GET_POSITION_CHART_PLCLOSE_LIVE
		if(this.state.chartType == CHART_TYPE_2MONTH) {
			url = NetConstants.CFD_API.GET_POSITION_CHART_PLCLOSE_2W_LIVE
		}

		url = url.replace("<id>", this.props.userId)

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
					plCloseData: responseJson
				})
			},
			(result) => {

			},
			true
		)
	}

  pressCard(index) {
		console.log("pressedCard:" + index);
  }

  cardWarpperRender() {
		var _scrollView: ScrollView;

		if(this.state.cards.length > 0 && !this.props.isPrivate) {
			var lastIndex = this.state.cards.length - 1;
			var cardItems = this.state.cards.map(
				(card, i) =>
				<TouchableOpacity onPress={() => this.pressCard(i)} key={i}>
					<View style={[styles.cardItem,{marginRight:i==0?4:10},{marginRight:i==lastIndex?10:4}]}>
						<Image style={styles.cardImage} source={{uri:this.state.cards[i].imgUrlMiddle}}></Image>
						<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
							<Text style={{color:'#fa2c21',fontSize:14,marginBottom:5}}>{this.state.cards[i].plRate.toFixed(2)}%</Text>
							<Text style={{color:'#3f3f3f',fontSize:14}}>{this.state.cards[i].stockName}</Text>
						</View>
					</View>
				</TouchableOpacity>
			)

      var strKPCJ = LS.str('KPCJ')
      var strLJXQ = LS.str('LJXQ')
			return(

				<View style = {styles.cardWapper}>
					<View style={styles.cardWapperContainer}>
						<Text style={styles.cardWapperTitle}>
							{strKPCJ}
						</Text>
						<TouchableOpacity onPress={()=>this._onPressedCardDetail()}>
							<Text style={styles.more}>
								{strLJXQ} >
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{flexDirection:'row',
					  backgroundColor: ColorConstants.TITLE_BLUE_LIVE,}}>
						<ScrollView
							ref={(scrollView) => { _scrollView = scrollView; }}
							automaticallyAdjustContentInsets={false}
							horizontal={true}
							style={styles.horizontalScrollView}>
							{cardItems}
						</ScrollView>
					</View>

				</View>
			)
		} else {
			return null
		}
	}

  chartRender() {
		if(Platform.OS === "ios") {
			return(
				<LineChart style={styles.lineChart}
					data={JSON.stringify(this.state.plCloseData)}
					chartType={this.state.chartTypeName}
          isPrivate={this.props.isPrivate}>
				</LineChart>
			)
		} else {
			var textColor = "#999999"; //text bottom and right
			var backgroundColor = "white"
			var borderColor = "#EEEEEE"; //line
			var lineChartGradient = ['#8ea2c6', '#fefeff']

			return(
				<LineChart style={styles.lineChart}
					chartType={this.state.chartTypeName}
					data={JSON.stringify(this.state.plCloseData)}
					xAxisPosition="BOTTOM"
					borderColor={borderColor}
					xAxisTextSize={8}
					rightAxisTextSize={8}
					textColor={textColor}
					rightAxisDrawGridLines={true}
					rightAxisLabelCount={5}
					rightAxisPosition="OUTSIDE_CHART"
					rightAxisEnabled={true}
					rightAxisDrawLabel={true}
					chartPaddingTop={15}
					chartPaddingBottom={5}
					drawBackground={true}
					backgroundColor={backgroundColor}
					chartPaddingLeft={15}
					chartPaddingRight={15}
          chartIsPrivate={this.props.isPrivate}
					lineChartGradient={lineChartGradient}
				>
				</LineChart>
			)
		}
	}

  renderEmptyBottom() {
		if(Platform.OS === "ios") {
      return(
				<View style={{height:0,width:width}}></View>
			)
		} else {
			return(
				<View style={{height:280,width:width}}></View>
			)
		}
	}

  lineSepartor() {
    return(
      <View style ={styles.lineSepartor}></View>
    )
  }

  rowSepartor() {
		return(
			<View style ={styles.rowSepartor}></View>
		)
	}

  renderPrivateOne() {
		if(this.props.isPrivate) {
			return(null)
		} else {
			return(<Text style={{fontSize:12,color:'#424242',marginTop:5}}>$</Text>)
		}
	}

	renderPrivateTwo() {
		if(this.props.isPrivate) {
			return(null)
		} else {
			return(<Text style={{fontSize:12,color:'#424242',marginTop:5}}>%</Text>)
		}
	}

//   <StatisticBarBlock userId={this.props.userId}
//            isStatisticPage={this.props.isStatisticPage}
//            ref={STATISTIC_BAR_BLOCK}/>

	render(){
		return(
      <ScrollView showsHorizontalScrollIndicator={false}>
        {/* {this.middleWarpperRender()} */}
        {/* <View style = {styles.separator}></View> */}
        {this.bottomWarpperRender()}
        <View style = {styles.separator}></View>
        <ProfitBlock userId={this.props.userId}
        					isPrivate={this.props.isPrivate}
        					type="open"
        					ref={PROFIT_BLOCK}/>
        <View style = {styles.separator}></View>
		    <TradeStyleBlock userId={this.props.userId} ref={TRADE_STYLE_BLOCK}/>
        <View style = {styles.separator}></View>
        {this.props.isStatisticPage ? null : this.cardWarpperRender()}
        <View style = {styles.separator}></View>
			</ScrollView>
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
    color: '#424242',
    fontWeight:'bold'
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
    borderColor: '#EEEEEE',
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
  loadingText: {
		fontSize: 13,
		color: '#9f9f9f'
	},

  separatorLine: {
    height: 0.5,
    backgroundColor: ColorConstants.SEPARATOR_GRAY,
  },

});


module.exports = UserHomePageTab0;
