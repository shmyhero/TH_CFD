'use strict';

import React, {
  Component,
} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  ListView,
  Image,
  ActivityIndicator,
  ProgressBarAndroid,
  ActivityIndicatorIOS,
  Platform,
	Dimensions,
	TouchableOpacity,
} from 'react-native'

import TimerEnhance from 'react-native-smart-timer-enhance'
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
import ColorConstants from '../ColorConstants'

var NavBar = require('./NavBar')
var MainPage = require('./MainPage')
var StorageModule = require('../module/StorageModule')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')

var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var emptyImageHintTop = height / 2 - 40;

var testMessages = [
  { type: '1', message: '天啊你真高', date: '2016/1/2', time: "19:20", isNew: true},
  { type: '2', message: '啊，美丽的大自然', date: '2016/1/2', time: "19:20", isNew: false},
  { type: '1', message: '美元/日元已经被系统自动平仓，平仓价格：133.93，盈利+123214.32美元', date: '2016/1/2', time: "19:20", isNew: true},
  { type: '3', message: '美国科技股100于02:43买跌价格达到3912.22，低于您设置的3913。', date: '2016/1/2', time: "19:20", isNew: false},
];

export default class MyMessagesPage extends Component {

	currentPage = 0;

	constructor(props) {
	  super(props);

	  this._dataSource = new ListView.DataSource({
	      rowHasChanged: (r1, r2) => r1 !== r2 ,
	      //sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
	  });

    let dataList = []
    this.state = {
        first: true,
				noMessage: false,
        dataList: dataList,
        dataSource: this._dataSource.cloneWithRows(dataList),
    }
  }

  componentDidMount () {
    this._pullToRefreshListView.beginRefresh()
  }

  _onRefresh = () => {
		//TODO: Use Real Data
  	setTimeout( () => {
			if(this._pullToRefreshListView){
	      var addNum = 20
				//TEST
				if(this.state.first){
					addNum = 0;
				}

	      let refreshedDataList = []
	      for(let i = 0; i < addNum; i++) {
	        refreshedDataList.push(testMessages[i%4])
	      }

				var noMessage = refreshedDataList.length == 0;
	      this.setState({
	        dataList: refreshedDataList,
	        dataSource: this._dataSource.cloneWithRows(refreshedDataList),
					first: false,
					noMessage: noMessage
	      });
	      this._pullToRefreshListView.endRefresh();
			}
    }, 2000);
  }

  _onLoadMore = () => {
		if(this.state.noMessage){
			return;
		}
    console.log('outside _onLoadMore start...')
		this.currentPage ++;
    setTimeout( () => {
			if(this._pullToRefreshListView){
	      //console.log('outside _onLoadMore end...')

	      let length = this.state.dataList.length
	      let addNum = 20
	      let addedDataList = []
				if(length >= 43){
					addNum = 0;
				}else if(length >= 40) {
	      	addNum = 3
	      }

	      for(let i = length; i < length + addNum; i++) {
	          addedDataList.push(testMessages[i%4])
	      }
	      let newDataList = this.state.dataList.concat(addedDataList)
	      this.setState({
	          dataList: newDataList,
	          dataSource: this._dataSource.cloneWithRows(newDataList),
	      })

	      let loadedAll
	      if(length >= 43) {
	          loadedAll = true
	          this._pullToRefreshListView.endLoadMore(loadedAll)
	      }
	      else {
	          loadedAll = false
	          this._pullToRefreshListView.endLoadMore(loadedAll)
	      }
			}
    }, 1000)
  }

	_onSelectNormalRow = (rowData) => {
		if(rowData.isNew){
			var dataList = this.state.dataList;
			var index = dataList.indexOf(rowData);

			if(index >=0){
				dataList[index] = {
					type: dataList[index].type,
					message: dataList[index].message,
					date: dataList[index].date,
					time: dataList[index].time,
					isNew: false
				};
			}
			this.setState({
				dataList: dataList,
				dataSource: this._dataSource.cloneWithRows(dataList),
			})
		}
	}

	renderRow(rowData, sectionID, rowID) {
    var title;
    if (rowData.type === '1') {
      title = "平仓消息"
    }
    else if (rowData.type === '2'){
      title = "止盈消息"
    }
    else if (rowData.type === '3'){
      title = "价格消息"
    }
    return(
      <TouchableOpacity activeOpacity={0.5} onPress={()=>this._onSelectNormalRow(rowData)}>
        <View style={styles.rowWrapper}>
      		{this._renderNewHint(rowData)}
	      	<View style={styles.messageWrapper}>
	          <Text style={styles.title}>{title}</Text>
		        <Text style={styles.message}>{rowData.message}</Text>
		        <View style={styles.datetime}>
		          <Text style={styles.date}>
		            {rowData.date}
		            <Text> </Text>
		            <Text style={styles.time}>{rowData.time}</Text>
		          </Text>
		        </View>
		      </View>
		    </View>
	    </TouchableOpacity>
		);
  }

	renderEmptyView(){
		if(this.state.noMessage){
			return (
				<View style={styles.emptyContent}>
						<Image style={styles.emptyImage} source={require('../../images/icon_mail.png')}/>
						<Text style={styles.emptyText}>暂无消息</Text>
				</View>
			);
		}
	}

  render() {
    return (
			<View style={{flex: 1,}}>
				{this.renderEmptyView()}
	      <PullToRefreshListView
	        ref={ (component) => this._pullToRefreshListView = component }
	        viewType={PullToRefreshListView.constants.viewType.listView}
	        style={[styles.list,
					]}
	        initialListSize={20}
	        enableEmptySections={true}
	        dataSource={this.state.dataSource}
	        pageSize={20}
	        renderRow={this.renderRow.bind(this)}
	        renderHeader={this._renderHeader.bind(this)}
	        renderFooter={this._renderFooter.bind(this)}
	        onRefresh={this._onRefresh.bind(this)}
	        onLoadMore={this._onLoadMore.bind(this)}
	        pullUpDistance={35}
	        pullUpStayDistance={50}
	        pullDownDistance={35}
	        pullDownStayDistance={50}
	      />
			</View>
		)
  }

	_renderNewHint = (rowData) => {
		console.log("_renderNewHint: " + JSON.stringify(rowData))
		if(rowData.isNew){
			return (
				<Image source={require('../../images/icon_new.png')} style={styles.image}/>
			);
		}else{
			return (
				<View style={styles.image}/>
			)
		}
	}

  _renderHeader = (viewState) => {
    let {pullState, pullDistancePercent} = viewState
    let {refresh_none, refresh_idle, will_refresh, refreshing,} = PullToRefreshListView.constants.viewState
    pullDistancePercent = Math.round(pullDistancePercent * 100)
    switch(pullState) {
      case refresh_none:
			case refresh_idle:
			case will_refresh:
        return (
            <View style={{height: 35, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.refreshTextStyle}>下拉刷新</Text>
            </View>
        )
      case refreshing:
        return (
            <View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center'}}>
                {this._renderActivityIndicator()}<Text style={styles.refreshTextStyle}>刷新中</Text>
            </View>
        )
    }
  }

  _renderFooter = (viewState) => {
		if(this.state.noMessage){
			return (<View/>);
		}
    let {pullState, pullDistancePercent} = viewState
    let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
    pullDistancePercent = Math.round(pullDistancePercent * 100)
    switch(pullState) {
      case load_more_none:
			case load_more_idle:
			case will_load_more:
        return (
          <View style={{height: 35, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.refreshTextStyle}>加载更多</Text>
          </View>
        )
      case loading_more:
        return (
          <View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center'}}>
            {this._renderActivityIndicator()}<Text style={styles.refreshTextStyle}>加载中...</Text>
          </View>
        )
      case loaded_all:
        return (
					<View/>
        )
    }
  }

  _renderActivityIndicator() {
		var color = "#7a7987";
		var styleAttr = 'small' //or "large"
    return ActivityIndicator ? (
		<ActivityIndicator
            style={{marginRight: 10,}}
            animating={true}
            color={color}
            size={styleAttr}/>
    ) : Platform.OS == 'android' ?
        (
      <ProgressBarAndroid
          style={{marginRight: 10,}}
          color={color}
          styleAttr={styleAttr}/>

        ) : (
        <ActivityIndicatorIOS
            style={{marginRight: 10,}}
            animating={true}
            color={color}
            size={styleAttr}/>
    )
  }
}

const styles = StyleSheet.create({
  itemHeader: {
      height: 35,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#ccc',
      backgroundColor: 'blue',
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
  },
  item: {
      height: 60,
      //borderBottomWidth: StyleSheet.hairlineWidth,
      //borderBottomColor: '#ccc',
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
  },

  contentContainer: {
      paddingTop: 20 + 44,
  },

  thumbnail: {
      padding: 6,
      flexDirection: 'row',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#ccc',
      overflow: 'hidden',
  },

  textContainer: {
      padding: 20,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },

	wrapper: {
    flex: 1,
    width: width,
    alignItems: 'stretch',
  	justifyContent: 'space-around',
    backgroundColor: ColorConstants.BACKGROUND_GREY,
  },

  list: {
		flex: 1,
  },
  rowWrapper: {
    flex: 1,
    flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
    paddingLeft: 9,
    paddingRight: 10,
		paddingTop: 17,
    paddingBottom: 12,
  },
  messageWrapper:{
    flex:1,
    marginLeft: 8,
    marginRight: 15,
  },
  image: {
    width: 6,
    height: 6,
		marginTop: 6,
  },
  title: {
      fontSize: 17,
      color: '#303030',
  },
  message: {
    fontSize: 14,
    marginTop: 10,
    color: '#44444d',
  },
  datetime: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  date: {
    fontSize: 10,
    color: '#7a7987',
  },
  time: {
    fontSize: 10,
    color: '#4d88be',
  },
  emptyContent: {
		position: 'absolute',
		top: 200,
		left: 0,
		right: 0,
    alignItems:'center',
    justifyContent: 'center'
  },
  emptyText: {
    marginTop: 14,
    color: '#afafaf'
  },
  emptyImage: {
    height: 84,
    width: 84,
  },
	refreshTextStyle: {
		color: '#afafaf',
	},
	refreshItemStyle: {
		color: '#7a7987',
	}
})
module.exports = MyMessagesPage
//export default TimerEnhance(MyMessagesPage)

//module.exports = MyMessagesPage;
