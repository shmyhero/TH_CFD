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
  StatusBar
} from 'react-native'


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

var RANKING_TYPE_0 = 0;
var RANKING_TYPE_1 = 1;
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class RankingPage extends Component{

	constructor(props){
		super(props);
		this.state = {
      rankType : RANKING_TYPE_0,
      rankData: ds.cloneWithRows(['','','','','']),
		}
	}

	componentDidMount(){
	}

  renderTopSticker(){
    return(
      <View style={styles.topSticker}>
        <Text style={styles.fontTopSticker}>达人</Text>
        <Text style={styles.fontTopSticker}>两周收益率</Text>
      </View>
    );
  }

  onRankTypeSelected(rankSelected){
    console.log('rankType = ' + rankSelected);
    this.setState({
      rankType : rankSelected
    })
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

    var colorBgSelected = '#7191c7'
    var colorTextUnSelected = '#7091c7'

    return(
      <View style={[styles.container, {backgroundColor: backgroundColor}, this.props.barStyle]} >
        <StatusBar barStyle="light-content" backgroundColor={navBarColor}/>
        <View style = {styles.headerContainer}>
          <TouchableOpacity
            onPress={()=>{this.onRankTypeSelected(RANKING_TYPE_0)}}
            style = {{backgroundColor:this.state.rankType == RANKING_TYPE_0?colorBgSelected:'transparent'}}>
            <Text style={[styles.fontHeaderType,{color:this.state.rankType == RANKING_TYPE_0?'white':colorTextUnSelected}]}>达人榜</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{this.onRankTypeSelected(RANKING_TYPE_1)}}
            style = {{backgroundColor:this.state.rankType == RANKING_TYPE_1?colorBgSelected:'transparent'}}>
            <Text style={[styles.fontHeaderType,{color:this.state.rankType == RANKING_TYPE_1?'white':colorTextUnSelected}]}>关注的</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderMyRank(){
    if(this.state.rankType == RANKING_TYPE_0){
      return(
        <View>
          {this.renderRow()}
          <View style = {{height:10,backgroundColor:'#F1F1F1'}}></View>
        </View>
      )
    }else{
      return null;
    }
  }

  renderRow(){
    return(
      <View style={{height:60*heightRate}}>
        <Text>111</Text>
      </View>
    )
  }

  renderRankList(){
      return(
        <View style = {{flex:1}}>
          <ListView
            style={styles.list}
            ref="listview"
            initialListSize={11}
            dataSource={this.state.rankData}
            enableEmptySections={true}
            // renderFooter={this.renderFooter}
            renderRow={this.renderRow}
            // renderSeparator={this.renderSeparator}
            // onEndReached={this.onEndReached}
            removeClippedSubviews={false}/>
        </View>
      )
  }

	render(){
		return(
      <View style={{flex:1}}>
        {this.renderHead()}
        {this.renderTopSticker()}
        {this.renderMyRank()}
        {this.renderRankList()}
      </View>
		);
	}
}


const styles = StyleSheet.create({
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

	list:{
		marginLeft:5,
		marginTop:5,
		marginRight:5,
		flexDirection:'row',
		justifyContent: 'flex-start',
		flexWrap:'wrap',
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
  topSticker:{
    width:width,
    backgroundColor:'#dde7f6',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  fontTopSticker:{
    fontSize:14,
    color:'#65799f',
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
    fontSize:14,
    color:'white',
    marginLeft:15,
    marginRight:15,
    marginTop:6,
    marginBottom:6,
  },
  list: {
		flex: 1,
		alignSelf: 'stretch',
	},

});


module.exports = RankingPage;
