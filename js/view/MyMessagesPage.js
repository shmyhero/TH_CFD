'use strict';

import React, {
  Component,
  PropTypes,
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
var dateFormat = require('dateformat');
var LogicData = require('../LogicData')
var NetworkErrorIndicator = require('./NetworkErrorIndicator');

var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var emptyImageHintTop = height / 2 - 40;

const NETWORK_ERROR_INDICATOR = "networkErrorIndicator";
export default class MyMessagesPage extends Component {

	currentPage = 0;

  static propTypes = {
    onPopToRoute: PropTypes.func,
  }

  static defaultProps = {
    onPopToRoute: ()=>{}
  }

	constructor(props) {
	  super(props);

	  this._dataSource = new ListView.DataSource({
	      rowHasChanged: (r1, r2) => r1 !== r2,
	  });

    let dataList = []
    this.state = {
      isStartUp: true,
			noMessage: false,
      dataList: dataList,
      dataSource: this._dataSource.cloneWithRows(dataList),
      contentLoadingFailed: false,
    }
  }

  componentDidMount () {
    this._pullToRefreshListView.beginRefresh();
    //this.fetchMessages(false);
  }

  componentWillUnmount (){
    if(this.props.onPopToRoute){
      this.props.onPopToRoute();
    }
  }

  currentIndex = 1;

  fetchMessages = (isRefresh) => {
    if(this.state.isStartUp){
      //The quick loading will cause a display bug on the listview.
      setTimeout(()=>{
        this.fetchAllMessages(isRefresh);
      }, 500);
    }else{
      this.fetchAllMessages(isRefresh);
    }
  }

  fetchAllMessages = (isRefresh) => {
    var userData = LogicData.getUserData();
    var url = NetConstants.CFD_API.GET_MY_MESSAGES;
		if(LogicData.getAccountState()){
			url = NetConstants.CFD_API.GET_MY_MESSAGES_LIVE;
			console.log('live', url );
		}

    url = url.replace("<pageNum>", this.currentIndex);
    url = url.replace("<pageSize>", 20);
    NetworkModule.fetchTHUrl(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
        },
				cache: 'offline',
      },
      (responseJson) => {
        this.setState({
          contentLoadingFailed: false,
        })
        if(this._pullToRefreshListView){
          let refreshedDataList = isRefresh ? [] : this.state.dataList;
          refreshedDataList = refreshedDataList.concat(responseJson);

          var noMessage = refreshedDataList.length == 0;
          this.setState({
            dataList: refreshedDataList,
            dataSource: this._dataSource.cloneWithRows(refreshedDataList),
            noMessage: noMessage,
            isStartUp: false,
          });

          if(isRefresh){
            this._pullToRefreshListView.endRefresh();
          }else{
    	      if(responseJson.length < 20) {
    	          this._pullToRefreshListView.endLoadMore(true)
    	      }
    	      else {
    	          this._pullToRefreshListView.endLoadMore(false)
    	      }
          }
        }
      },
      (result) => {
        console.log("read message failed");
        this._pullToRefreshListView && this._pullToRefreshListView.endRefresh();
        if(!result.loadedOfflineCache){
          console.log("not loadedOfflineCache");
          this.setState({
            contentLoadingFailed: true,
          })
          this.refs[NETWORK_ERROR_INDICATOR] && this.refs[NETWORK_ERROR_INDICATOR].stopRefresh();
          console.log("NETWORK_ERROR_INDICATOR");
        }
      }
    );
    this.currentIndex++;
  }

  setMessageRead = (id) => {
    var userData = LogicData.getUserData();
    var url = NetConstants.CFD_API.SET_MESSAGE_READ;
    if(LogicData.getAccountState()){
			url = NetConstants.CFD_API.SET_MESSAGE_READ_LIVE
			console.log('live', url );
		}
    url = url.replace('<id>', id);
    NetworkModule.fetchTHUrl(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
        },
      },
      (responseJson) =>{
        //Ignore the result!
      },
      (result) => {
        Alert.alert(result.errorMessage)
      }
    )
  }

  _onRefresh = () => {
    this.currentIndex = 1;
    this.fetchMessages(true);
  }

  _onLoadMore = () => {
    if(this.state.noMessage){
      this._pullToRefreshListView.endLoadMore(true);
      return;
    }
    this.fetchMessages(false);
  }

  _onSelectNormalRow = (rowData) => {
    if(!rowData.isReaded){
      var dataList = this.state.dataList;
      var index = dataList.indexOf(rowData);
      if(index >=0){
        dataList[index].isReaded = true;

        this.setState({
          dataList: dataList,
          dataSource: this._dataSource.cloneWithRows(dataList),
        });

        //Silently sends the read property to server and ignore the result
        this.setMessageRead(rowData.id);
      }
    }
  }

  renderDateTime(rowData){
    var datetime = rowData.createdAt;
    if(datetime){
      var dt = new Date(datetime);
      var month = dt.getMonth()+1;
      var dateString = dateFormat(dt, "yyyy.mm.dd");
      var timeString = dateFormat(dt, "HH:MM")
      return (
        <View style={styles.datetime}>
          <Text style={styles.date}>
            {dateString}
            <Text> </Text>
            <Text style={styles.time}>{timeString}</Text>
          </Text>
        </View>
      );
    }else{
      return (
        <View/>
      );
    }

  }

	renderRow(rowData, sectionID, rowID) {
    var title;

    return(
      <TouchableOpacity activeOpacity={0.5} onPress={()=>this._onSelectNormalRow(rowData)}>
        <View style={styles.rowWrapper}>
      		{this._renderNewHint(rowData)}
	      	<View style={styles.messageWrapper}>
	          <Text style={styles.title}>{rowData.title}</Text>
		        <Text style={styles.message}>{rowData.body}</Text>
            {this.renderDateTime(rowData)}
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

	renderSeparator(sectionID, rowID, adjacentRowHighlighted){
		return (
			<View style={styles.line} key={rowID}>
				<View style={[styles.separator]}/>
			</View>
			)
	}

  renderContent(){
    console.log("renderContent: this.state.contentLoadingFailed: " + this.state.contentLoadingFailed)
    if(this.state.contentLoadingFailed){
      return (
				<NetworkErrorIndicator onRefresh={()=>this.fetchMessages(true)} ref={NETWORK_ERROR_INDICATOR}/>
      );
    }else{
      var pullUpDistance = 35;
      var pullUpStayDistance = 50;
      var pullDownDistance = 35;
      var pullDownStayDistance = 50;

      return(
        <View style={{flex:1}}>
          {this.renderEmptyView()}
          <PullToRefreshListView
            ref={ (component) => this._pullToRefreshListView = component }
            viewType={PullToRefreshListView.constants.viewType.listView}
            style={[styles.list,]}
            initialListSize={20}
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            pageSize={20}
            renderRow={this.renderRow.bind(this)}
            renderSeparator={this.renderSeparator.bind(this)}
            renderHeader={this._renderHeader.bind(this)}
            renderFooter={this._renderFooter.bind(this)}
            onRefresh={this._onRefresh.bind(this)}
            onLoadMore={this._onLoadMore.bind(this)}
            pullUpDistance={pullUpDistance}
            pullUpStayDistance={pullUpStayDistance}
            pullDownDistance={pullDownDistance}
            pullDownStayDistance={pullDownStayDistance}
          />
        </View>
      )
    }
  }

  render() {
    return (
			<View style={{flex: 1,}}>
				{this.renderContent()}
			</View>
		)
  }

	_renderNewHint = (rowData) => {
		if(!rowData.isReaded){
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

  _renderStartUpActivityIndicator(){
    if(this.state.isStartUp){
      return (
        <View style={{marginTop: 10}}>
          {this._renderActivityIndicator()}
        </View>
    );
    }
    return (
      <View/>
    )
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
		paddingTop: 12,
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
	},
  line: {
    height: 0.5,
    backgroundColor: 'transparent',
  },
  separator: {
    height: 0.5,
		backgroundColor: '#e2e2e2',
    marginLeft: 20
  },
})
module.exports = MyMessagesPage
//export default TimerEnhance(MyMessagesPage)

//module.exports = MyMessagesPage;
