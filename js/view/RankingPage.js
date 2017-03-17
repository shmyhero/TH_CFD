'use strict';

import React,{Component} from 'react'
import {
  StyleSheet,
  Text,
  Image,
  Platform,
  View,
  Dimensions,
  ListView,
  Alert,
  TouchableOpacity,
  StatusBar,
  TouchableHighlight
} from 'react-native'

var {EventCenter, EventConst} = require('../EventCenter')
var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var Reward = require('./Reward')
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var StockTransactionInfoModal = require('./StockTransactionInfoModal')
var UIConstants = require('../UIConstants')
var NetworkErrorIndicator = require('./NetworkErrorIndicator');
var ColorConstants = require('../ColorConstants')
var MainPage = require('./MainPage')

var didTabSelectSubscription = null
const NETWORK_ERROR_INDICATOR = "networkErrorIndicator";
var RANKING_TYPE_0 = 0;
var RANKING_TYPE_1 = 1;
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//
// { roi: 0,
//     posCount: 0,
//     winRate: 0,
//     id: 3235,
//     nickname: 'nexus52',
//     picUrl: 'https://cfdstorage.blob.core.chinacloudapi.cn/user-picture/9f5661d8e8084fc9a9ca28b240a4e82f' },

export default class RankingPage extends Component{

	constructor(props){
		super(props);
		this.state = {
      contentLoaded: false,
			isRefreshing: true,
      rankType : RANKING_TYPE_0,
      rankData: ds.cloneWithRows([]),
      rankDataFollowing:ds.cloneWithRows([]),
		}
	}

	componentDidMount(){
    didTabSelectSubscription = EventCenter.getEventEmitter().addListener(EventConst.EXCHANGE_TAB_PRESS_EVENT, this.onTabChanged);
    this.getRankList();
	}

  componentWillUnmount() {
    didTabSelectSubscription && didTabSelectSubscription.remove();
  }

  renderTopSticker(){
    return(
      <View style={styles.topSticker}>
        <Text style={styles.fontTopSticker}>达人</Text>
        <Text style={styles.fontTopSticker}>两周收益率</Text>
      </View>
    );
  }

  _onRankTypeSelected(rankSelected){
    console.log('rankType = ' + rankSelected);
    this.setState({
      rankType : rankSelected
    },()=>{this.getRankList()})
  }

  _onPressedUserItem(rowData){
    console.log('_onPressedUserItem = ' + rowData.id);
    this.gotoUserHomePage(rowData);
  }

  gotoUserHomePage(rowData) {
		this.props.navigator.push({
			name: MainPage.USER_HOME_PAGE_ROUTE,
      userData:{userId:rowData.id,userName:rowData.username},
		});
	}

  getRankList(){
    if(!this.state.contentLoaded){
			this.setState({
				isRefreshing: true,
			});
		}

    var url = NetConstants.CFD_API.GET_RANK_LIVE_PLCLOSED_2W
    if(this.state.rankType == RANKING_TYPE_1){
      url = NetConstants.CFD_API.GET_RANK_LIVE_FOLLOWING_2W
    }
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
          if(this.isRankingType0()){
            this.setState({
                rankData:ds.cloneWithRows(responseJson),
                contentLoaded: true,
                isRefreshing: false,
            },()=>this.refs['listview'].scrollTo({x:0,y:0,false}))
          }else{
            this.setState({
                rankDataFollowing:ds.cloneWithRows(responseJson),
                contentLoaded: true,
                isRefreshing: false,
            },()=>this.refs['listview2'].scrollTo({x:0,y:0,false}))
          }
			},
			(result) => {
        this.setState({
          contentLoaded: false,
          isRefreshing: false,
        })
        this.refs[NETWORK_ERROR_INDICATOR] && this.refs[NETWORK_ERROR_INDICATOR].stopRefresh();
			},
			true
		)
  }

  isRankingType0(){
    return this.state.rankType == RANKING_TYPE_0
  }

  onTabChanged(){
	  LogicData.setTabIndex(MainPage.RANKING_TAB_INDEX);
	}

  renderHead(){
    var backgroundColor = ColorConstants.title_blue();
		if(this.props.backgroundColor){
			backgroundColor = this.props.backgroundColor;
		}

		var navBarColor = ColorConstants.title_blue();
		if(this.props.backgroundColor !== "transparent"){
			navBarColor = this.props.backgroundColor;
		}

    var colorBgSelected = '#6485c2'
    var colorTextUnSelected = '#6485c2'

    return(
      <View style={[styles.container, {backgroundColor: backgroundColor}, this.props.barStyle]} >
        <StatusBar barStyle="light-content" backgroundColor={navBarColor}/>
        <View style = {styles.headerContainer}>
          <TouchableOpacity
            onPress={()=>{this._onRankTypeSelected(RANKING_TYPE_0)}}
            style = {{backgroundColor:this.state.rankType == RANKING_TYPE_0?colorBgSelected:'transparent'}}>
            <Text style={[styles.fontHeaderType,{color:this.state.rankType == RANKING_TYPE_0?'white':colorTextUnSelected}]}>达人榜</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{this._onRankTypeSelected(RANKING_TYPE_1)}}
            style = {{backgroundColor:this.state.rankType == RANKING_TYPE_1?colorBgSelected:'transparent'}}>
            <Text style={[styles.fontHeaderType,{color:this.state.rankType == RANKING_TYPE_1?'white':colorTextUnSelected}]}>关注的</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderMyRankBottomView(id){
    if(this.state.rankType == RANKING_TYPE_1){
      return null
    }else{
      if(id==0){
        return(
          <View style = {{height:8,backgroundColor:'transparent'}}></View>
        )
      }else{
        return null
      }
    }
  }

  _renderRow(rowData,sectionID,rowID){
    var rate = (rowData.winRate*100).toFixed(2)
    var roi = (rowData.roi*100).toFixed(2)
    var head = (rowData.picUrl)
    if(head){
      head = {uri:head}
    }else{
      head = require('../../images/head_portrait.png')
    }
    return(
      <TouchableHighlight onPress={()=>this._onPressedUserItem(rowData)}>
        <View>
          <View style={styles.rowDataStyle}>
            <View style={{flexDirection:'row',}}>
              <Image style = {styles.userHeader} source={head}></Image>
              <View style = {{marginLeft:2}}>
                <Text style={[styles.userName]}>{rowData.nickname}</Text>
                <View style = {styles.userInfo}>
                  <Text style={styles.userInfoTitle}>胜率:</Text>
                  <Text style={styles.userWinRate}>{rate}%</Text>
                  <Text style={[styles.userInfoTitle,{marginLeft:10}]}>平仓笔数:</Text>
                  <Text style={styles.userWinRate}>{rowData.posCount}</Text>
                </View>
              </View>
            </View>
            <View>
              <View style = {[styles.rateArea,{backgroundColor:roi<0?ColorConstants.STOCK_DOWN_GREEN:'#c24a17'}]}>
                <Text style = {styles.rateText}>{roi}%</Text>
              </View>
            </View>
          </View>
          {this.renderMyRankBottomView(rowID)}
        </View>
      </TouchableHighlight>
    )
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View style={styles.line} key={rowID}>
        <View style={styles.separator}/>
      </View>
    );
  }

  renderFooter(){
    return(
      <View style={{width:width,height:UIConstants.TAB_BAR_HEIGHT}}>
      </View>
    )
	}

  refreshData(forceRefetch){
    this.getRankList()
  }

  renderListView(){
    if(!this.state.contentLoaded){
			return (
				<NetworkErrorIndicator onRefresh={()=>this.refreshData(true)} ref={NETWORK_ERROR_INDICATOR} refreshing={this.state.isRefreshing}/>
			)
		}else{
      if(this.isRankingType0()){
        return (
            <ListView
            style={styles.list}
            ref="listview"
            // initialListSize={11}
            dataSource={this.state.rankData}
            enableEmptySections={true}
            renderFooter={this.renderFooter}
            renderRow={this._renderRow.bind(this)}
            renderSeparator={this.renderSeparator}
            removeClippedSubviews={true}/>
        )
      }else{
        return(
            <ListView
              style={styles.list}
              ref="listview2"
              // initialListSize={11}
              dataSource={this.state.rankDataFollowing}
              enableEmptySections={true}
              renderFooter={this.renderFooter}
              renderRow={this._renderRow.bind(this)}
              renderSeparator={this.renderSeparator}
              removeClippedSubviews={true}/>
        )
      }
    }

  }

  renderRankList(){
      return(
        <View style = {{flex:1}}>
          {this.renderListView()}
        </View>
      )
  }

	render(){
		return(
      <View style={styles.wapper}>
        {this.renderHead()}
        {this.renderTopSticker()}
        {/* {this.renderMyRank()} */}
        {this.renderRankList()}
      </View>
		);
	}
}


const styles = StyleSheet.create({
  wapper:{
    width:width,
    height:height
  },

  container: {
		height: UIConstants.HEADER_HEIGHT,
		backgroundColor: ColorConstants.TITLE_BLUE,
		alignItems:'center',
    justifyContent:'center',
		paddingTop: (Platform.OS === 'ios') ? 15 : 0,
	},

	scroolItem:{
		width:(width-20)/2,
		height:((width-20)/2) + 80,
		marginRight:5,
		marginBottom:10,
	},

  list: {
		flex: 1,
		alignSelf: 'stretch',
    position:'absolute',
    height:height-90-UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER
	},

	emptyContent: {
		height:height-UIConstants.HEADER_HEIGHT,
    alignItems:'center',
    justifyContent: 'center'
  },
  emptyText: {
    marginTop: 14,
    color: '#afafaf'
  },
  rowDataStyle:{
     flex:1,
     flexDirection:'row',
     height:60*heightRate,
     backgroundColor:'white',
     justifyContent:'space-between',
     alignItems:'center'
  },
  topSticker:{
    width:width,
    backgroundColor:'#dde7f6',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  fontTopSticker:{
    fontSize:15,
    color:'#666999',
    marginTop:6,
    marginBottom:6,
    marginLeft:10,
    marginRight:10,
  },
  headerContainer:{
    flexDirection:'row',
    backgroundColor:'#4c668e',
    padding:0,
    borderWidth:1,
    borderRadius:4,
    borderColor:'#7091c7',
  },
  fontHeaderType:{
    fontSize:15,
    color:'white',
    marginLeft:15,
    marginRight:15,
    marginTop:6,
    marginBottom:6,
  },
  line: {
		height: 0.5,
		backgroundColor: '#e2e2e2',
	},
  userHeader:{
    width:40,
    height:40,
    marginLeft:10,
    borderRadius:20,
  },
  rateArea:{
    width:100,
    height:30,
    // backgroundColor:'#c24a17',
    marginRight:10,
    alignItems:'flex-end',
    justifyContent:'center',
    borderRadius:2,
  },
  rateText:{
    fontSize:16,
    color:'white',
    marginRight:5,
  },
  userName:{
    fontSize:11,
    marginTop:5,
    color:'#2d2d2d'
  },
  userInfoTitle:{
    fontSize:11,
    marginTop:5,
    color:'#5d5d5d'
  },
  userWinRate:{
    fontSize:14,
    marginTop:5,
    color:'#000000',
  },
  userInfo:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  }


});


module.exports = RankingPage;
