'use strict';

import React,{Component} from 'react'
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  Platform,
  View,
  Dimensions,
  ListView,
  Alert,
  TouchableOpacity,
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
var UIConstants = require('../UIConstants')
var NetworkErrorIndicator = require('./NetworkErrorIndicator');
var ColorConstants = require('../ColorConstants')
var MainPage = require('./MainPage')
var LS = require('../LS')

var didTabSelectSubscription = null
const NETWORK_ERROR_INDICATOR = "networkErrorIndicator";
var RANKING_TYPE_0 = 0;
var RANKING_TYPE_1 = 1;
var emptyStar = '***'
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
            rankType: RANKING_TYPE_0,
            rankSource:[],
            rankData: ds.cloneWithRows([]),
            rankDataFollowing:ds.cloneWithRows([]),
            noMessage: false,
        }

        this.onTabChanged = this.onTabChanged.bind(this);
 
    }

	componentDidMount(){
        didTabSelectSubscription = EventCenter.getEventEmitter().addListener(EventConst.RANKING_TAB_PRESS_EVENT, this.onTabChanged);
        this.getRankList();
	}

    componentWillUnmount() {
        didTabSelectSubscription && didTabSelectSubscription.remove();
    }

    renderTopSticker(){
      if(this.state.rankType == RANKING_TYPE_0){
        return null
      }else{
        var strSL = LS.str('GZR')
        var strLZSYL = LS.str('LZSYL')
          return(
            <View style={styles.topSticker}>
              <Text style={styles.fontTopSticker}>{strSL}</Text>
              <Text style={styles.fontTopSticker}>{strLZSYL}</Text>
            </View>
          );
      } 
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
    var isPrivate = !rowData.showData
        // if(LogicData.isUserSelf(rowData.id)) {
		// 		isPrivate = false
		// }
		this.props.navigator.push({
            name: MainPage.USER_HOME_PAGE_ROUTE,
            userData:{userId:rowData.id,userName:rowData.username,isPrivate:isPrivate},
            backRefresh:()=>this.backRefresh(),
		});
	}

  backRefresh(){
    // console.log("backRefresh ...");
    if(this.state.rankType == RANKING_TYPE_1){
      this.getRankList();
    }
  }

  getRankList(){
    console.log("getRankList ==> " + LogicData.getAccountState());
    if(!LogicData.getAccountState())return;

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
                    rankSource:responseJson,
                    rankData:ds.cloneWithRows(responseJson),
                    contentLoaded: true,
                    isRefreshing: false,
                })
                //,/*()=>this.refs['listview'].scrollTo({x:0,y:0,animated:false})*/
              }else{
                var noMessage = responseJson.length == 0;
                this.setState({
                    rankDataFollowing:ds.cloneWithRows(responseJson),
                    contentLoaded: true,
                    isRefreshing: false,
                    noMessage:noMessage,
                },()=>this.refs['listview2'].scrollTo({x:0,y:0,animated:false}))
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
	  console.log("===> Tab Changed");
	  this.refreshData(true);
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
    var strDR = LS.str('TWOWEEKS')
    var strGZ = LS.str('GUAZZHUDE')
    return(
      <View style={[styles.container,  this.props.barStyle]} >
        <View style = {styles.headerContainer}>
          <TouchableOpacity
            onPress={()=>{this._onRankTypeSelected(RANKING_TYPE_0)}}
            style = {{backgroundColor:this.state.rankType == RANKING_TYPE_0?colorBgSelected:'transparent'}}>
            <Text style={[styles.fontHeaderType,{color:this.state.rankType == RANKING_TYPE_0?'white':colorTextUnSelected}]}>{strDR}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{this._onRankTypeSelected(RANKING_TYPE_1)}}
            style = {{backgroundColor:this.state.rankType == RANKING_TYPE_1?colorBgSelected:'transparent'}}>
            <Text style={[styles.fontHeaderType,{color:this.state.rankType == RANKING_TYPE_1?'white':colorTextUnSelected}]}>{strGZ}</Text>
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
    var headRank = LogicData.getRankHead(rowData.rank);
    if(head){
      head = {uri:head}
    }else{
      head = require('../../images/head_portrait.png')
    }

    var isUserSelf = LogicData.isUserSelf(rowData.id); 
    var winRateShow = (rowData.showData)?rate:emptyStar;
    var posCountShow = (rowData.showData)?rowData.posCount:emptyStar; 
    var strSL = LS.str('SL')+":";
    var strPCBS = LS.str('PCBS')
    return(

        <View>
          <TouchableHighlight onPress={()=>this._onPressedUserItem(rowData)} >
            <View style={styles.rowDataStyle}>
              <View style={{flexDirection:'row',marginLeft:5}}>
                <View style={{'paddingTop':5}}>
                  <Image style = {[styles.userHeader]} source={head}></Image>
                  <Image style = {styles.userHeaderIconRound} source={headRank}></Image>
                </View>

                <View style = {{marginLeft:15}}>
                  <Text style={[styles.userName]}>{rowData.nickname}</Text>
                  <View style = {styles.userInfo}>
                    <Text style={styles.userInfoTitle}>{strSL}</Text>
                    <Text style={styles.userWinRate}>{winRateShow.replace('.00','')}%</Text>
                    {/* <Text style={[styles.userInfoTitle,{marginLeft:10}]}>{strPCBS}</Text>
                    <Text style={styles.userWinRate}>{posCountShow}</Text> */}
                  </View>
                </View>
              </View>
              <View>
                <View style = {[styles.rateArea]}>
                  <Text style = {[styles.rateText,{color:roi<0?ColorConstants.STOCK_DOWN_GREEN:'#c24a17'}]}>{roi}%</Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
          {this.renderMyRankBottomView(rowID)}
        </View>

    )
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View style={styles.line} key={rowID}>
        <View style = {styles.separator}></View>
      </View>
    );
  }

 

  renderFooter(){
    return(
      <View style={{width:width,height:UIConstants.TAB_BAR_HEIGHT*1.5}}>
      </View>
    )
  }
  
  renderHeader(){
    return(
      <View style={{paddingTop:2,backgroundColor:'#425a85'}}>
        {this.renderMe()}
        {this.renderThreeHero()} 
      </View>
    )
  }

  refreshData(forceRefetch){
    this.getRankList()
  }

  renderEmptyView(){
    if(this.state.noMessage){
      return (
        <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>没有关注的人</Text>
        </View>
      );
    }
  }

  renderMe(){ 
    var add = this.state.rankSource[0].roi>0?'+':'';
    return(
        <TouchableOpacity onPress={()=>this._onPressedUserItem(this.state.rankSource[0])}>
            <ImageBackground style={{width:width-20,height:69,marginTop:0, alignSelf:'center', alignItems:'center',justifyContent:'space-between',flexDirection:'row'}} source={require('../../images/rank_bg_me.png')}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image style={{height:34,width:34,borderRadius:17,marginLeft:28,marginBottom:5,borderWidth:1,borderColor:'#6f8dc3'}} source={{uri:this.state.rankSource[0].picUrl}}></Image>
                    <View style={{marginLeft:10}}>
                        <Text style={{backgroundColor:'transparent',fontSize:15,color:'white'}}>我的</Text>
                        <View style={{flexDirection:'row',marginBottom:5,alignItems:'center'}}>
                            <Text style={{backgroundColor:'transparent',fontSize:12,color:'#6e90cc'}}>胜率：</Text>
                            <Text style={{backgroundColor:'transparent',fontSize:16,color:'#d8effc'}}>{(this.state.rankSource[0].winRate*100).toFixed(2).replace('.00','')}%</Text>
                        </View>
                    </View>
                </View>     
                <View style={{marginRight:30}}>
                    <Text style={{backgroundColor:'transparent',color:'white',fontSize:17}}>{add}{(this.state.rankSource[0].roi*100).toFixed(2)}%</Text>
                </View> 
            </ImageBackground>
        </TouchableOpacity>
    )
}

renderThreeHero(){

    // var rate = width/345*0.75;

    var headRank2 = LogicData.getRankHead(this.state.rankSource[2].rank);
    var headRank1 = LogicData.getRankHead(this.state.rankSource[1].rank);
    var headRank3 = LogicData.getRankHead(this.state.rankSource[3].rank);
    var bgWidth = (width-39.5)/3;
    var bgHeight = bgWidth;
    var bgHeightLR = bgHeight*201/230;

    return(
        <View>
            <View style={styles.containerAll}>
                <TouchableOpacity activeOpacity={0.90} style={{flex:1}} onPress={()=>this._onPressedUserItem(this.state.rankSource[2])}>
                    <View style={{alignItems:'center',height:68}}>
                      <Image style={styles.headPortrait} source={{uri:this.state.rankSource[2].picUrl}}></Image>
                      <Image style = {[styles.userHeaderIconRoundBig]} source={headRank2}></Image>
                    </View>
                    <View style={{marginBottom:-5}}> 
                      <Text style={styles.textTopUserName}>{this.state.rankSource[2].nickname}</Text>
                      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                          <Text style={styles.textWinRate}>胜率: </Text>
                          <Text style={styles.textTopUserScore}>{(this.state.rankSource[2].winRate*100).toFixed(2).replace('.00','')}%</Text>
                      </View>    
                    </View>  
                    <ImageBackground style={{height:bgHeightLR,width:bgWidth,marginBottom:-10,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_ag.png')}>
                        <Text style={styles.textProfit}>+{(this.state.rankSource[2].roi*100).toFixed(2)}%</Text>
                    </ImageBackground>  
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.90} style={{flex:1}} onPress={()=>this._onPressedUserItem(this.state.rankSource[1])}>
                    <View style={{alignItems:'center',height:68}}>
                      <Image style={styles.headPortrait} source={{uri:this.state.rankSource[1].picUrl}}></Image>
                      <Image style = {[styles.userHeaderIconRoundBig]} source={headRank1}></Image>
                    </View>
                    <View style={{marginBottom:0}}> 
                      <Text style={styles.textTopUserName}>{this.state.rankSource[1].nickname}</Text>
                      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                          <Text style={styles.textWinRate}>胜率: </Text>
                          <Text style={styles.textTopUserScore}>{(this.state.rankSource[1].winRate*100).toFixed(2).replace('.00','')}%</Text>
                      </View> 
                    </View> 
                    <ImageBackground style={{height:bgHeight ,width:bgWidth,marginBottom:-5,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_gd.png')}>
                        <Text style={styles.textProfit}>+{(this.state.rankSource[1].roi*100).toFixed(2)}%</Text>
                    </ImageBackground>  
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.90} style={{flex:1}} onPress={()=>this._onPressedUserItem(this.state.rankSource[3])}>
                    <View style={{alignItems:'center',height:68}}>
                      <Image style={styles.headPortrait} source={{uri:this.state.rankSource[3].picUrl}}></Image>
                      <Image style = {[styles.userHeaderIconRoundBig]} source={headRank3}></Image>
                    </View>
                    <View style={{marginBottom:-5}}>
                      <Text style={styles.textTopUserName}>{this.state.rankSource[3].nickname}</Text>
                      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                          <Text style={styles.textWinRate}>胜率: </Text>
                          <Text style={styles.textTopUserScore}>{(this.state.rankSource[3].winRate*100).toFixed(2).replace('.00','')}%</Text>
                      </View>  
                    </View>  
                    <ImageBackground style={{height:bgHeightLR ,width:bgWidth,marginBottom:-10,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_cu.png')}>
                        <Text style={styles.textProfit}>+{(this.state.rankSource[3].roi*100).toFixed(2)}%</Text>
                    </ImageBackground>  
                </TouchableOpacity> 
            </View>
        </View>
    )
}


_renderRow2 = (rowData, sectionID, rowID) => {
    var rate = (rowData.winRate*100).toFixed(2) 
    var roi = (rowData.roi*100).toFixed(2)
    var head = (rowData.picUrl)
    var headRank = LogicData.getRankHead(rowData.rank); 
    if(head){
      head = {uri:head}
    }else{
      head = require('../../images/head_portrait.png')
    }

    var winRateShow = (rowData.showData)?rate:emptyStar;
   
    if(rowID>=4){
        return( 
            <View> 
              <TouchableOpacity onPress={()=>this._onPressedUserItem(rowData)} style={{height:68,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                      <View style={{'paddingTop':5}}>
                        <Image style={{height:40,width:40,marginLeft:28,borderRadius:20}} source={head}></Image>
                        <Image style = {[styles.userHeaderIconRound,{marginLeft:8}]} source={headRank}></Image>
                      </View>
                      <View style={{marginLeft:10,paddingTop:10}}>
                          <Text style={{fontSize:15,color:'#454545'}}>{rowData.nickname}</Text>
                          <View style={{flexDirection:'row',marginBottom:5,alignItems:'center',justifyContent:'center'}}>
                              <Text style={{fontSize:12, color:'#999999'}}>胜率：</Text>
                              <Text style={{fontSize:14, color:'#666666'}}>{winRateShow.replace('.00','')}%</Text>
                          </View>
                      </View>
                  </View>
                  <View style={{marginRight:30}}>
                      <Text style={{fontSize:17, color:'#ca3538'}}>+{roi}%</Text>
                  </View> 
              </TouchableOpacity> 
              <View style={styles.separatorShort}></View>
            </View>
        )
    }else{
        return null
    }
    
} 

renderListAll(){
    return(
        <View style={{flex:1,width:width,backgroundColor:'white',marginBottom:20}}>
            <ListView
                ref="listview"
                dataSource={this.state.rankData}
                renderRow={this._renderRow2}
                enableEmptySections={true}
                // renderSeparator={this.renderSeparator} 
                removeClippedSubviews={false}
                renderFooter={this.renderFooter}
                renderHeader={this.renderHeader.bind(this)}
            />
        </View>
    )
}
 

  renderListView(){
    if(!this.state.contentLoaded){ 
			return (
				<NetworkErrorIndicator onRefresh={()=>this.refreshData(true)} ref={NETWORK_ERROR_INDICATOR} refreshing={this.state.isRefreshing}/>
			)
	  }else{
      if(this.isRankingType0()){
        return ( 
          <View style={{flex:1,backgroundColor:'#425a85'}}> 
                 {/* {this.renderMe()}
                 {this.renderThreeHero()} */}
                 {this.renderListAll()} 
          </View>
        )
      }else{ 
        return(
          <View style={{flex:1}}>
              {this.renderEmptyView()} 
              <ListView 
                style={styles.list}
                ref="listview2"
                initialListSize={11}
                dataSource={this.state.rankDataFollowing}
                enableEmptySections={true}
                renderFooter={this.renderFooter}
                renderRow={this._renderRow.bind(this)}
                renderSeparator={this.renderSeparator} 
                removeClippedSubviews={false}/> 
          </View>
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
            <NavBar onlyShowStatusBar={true} backgroundColor={ColorConstants.title_blue()}/>
            {this.renderHead()}
            {this.renderTopSticker()}
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
    // height: UIConstants.HEADER_HEIGHT,
    height:60,
    backgroundColor: '#425a85',
    // backgroundColor:'white',
		alignItems:'center',
    justifyContent:'center',
		paddingTop: (Platform.OS === 'ios') ? 20 : 0,
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
     height:60,
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
    color:'#576b95',
    marginTop:6,
    marginBottom:6,
    marginLeft:10,
    marginRight:10,
  },
  headerContainer:{
    flexDirection:'row',
    // backgroundColor:'#4c668e',
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
		backgroundColor: 'white',
    marginLeft:0,
	},
  separator: {
		height: 0.5,
		backgroundColor: '#eeeeee',
    marginLeft:15,
  },
  separatorShort:{
    height: 0.5,
		backgroundColor: '#eeeeee',
    marginLeft:20,
    marginRight:20,
  },
  userHeader:{
    width:40,
    height:40,
    marginLeft:10,
    borderRadius:20,
  },
  HeaderOffset:{
    width:28,
    height:28,
    marginRight:5,
    marginLeft:15.5,
    borderRadius:14,
  },
  userHeaderIconRound:{
    width:80,
    height:80,
    marginTop:-18,
    marginLeft:-12,
    position:'absolute',
  },
  
  rateArea:{
    width:80,
    height:30,
    marginRight:10,
    alignItems:'flex-end',
    justifyContent:'center',
    borderRadius:2,
  },
  rateText:{
    fontSize:16,
    color:'white',
    marginRight:5,
    fontWeight: 'bold',
  },
  userName:{
    fontSize:11,
    marginTop:3,
    color:'#2d2d2d'
  },
  userInfoTitle:{
    fontSize:11,
    marginTop:6,
    color:'#5d5d5d'
  },
  userWinRate:{
    fontSize:14,
    marginTop:5,
    color:'#000000',
    fontWeight: 'bold',
    marginLeft:2,
  },
  userInfo:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
 
    containerAll:{
        marginTop:-5,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'flex-end', 
        height:218,
        width:width,
        paddingLeft:20,
        paddingRight:20, 
    },

    headPortrait:{
        width:48,
        height:48, 
        marginTop:15,
        marginBottom:15,
        borderRadius:24,
        borderWidth:1,
        borderColor:'#6f8dc3'
    },

    userHeaderIconRoundBig:{
      width:96,
      height:96,
      marginTop:-96+15/2, 
      // position:'absolute'
    },


    textTopUserName:{
        alignSelf:'center',
        marginTop:8,
        color:'#cedfff',
        fontSize:12,
    },
    textTopUserScore:{
        alignSelf:'center',
        marginBottom:2,
        color:'#e1e8f6',
        fontSize:13,
    },
    textProfit:{
        color:'#ffffff',
        fontSize:15,
        backgroundColor:'transparent'
    },
    textWinRate:{
        fontSize:12,
        color:'#6e90cc',
    }

});


module.exports = RankingPage;
