'use strict';

import React,{Component, PropTypes} from 'react'
import {StyleSheet,Text,Image,View,Dimensions,ListView,Alert,TouchableOpacity} from 'react-native'

var ColorConstants = require('../ColorConstants')
var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var Reward = require('./Reward')
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var StockTransactionInfoModal = require('./StockTransactionInfoModal')
var UIConstants = require('../UIConstants')
var PositionBlock = require('./personalPage/PositionBlock')
var MainPage = require('./MainPage')
var POSITION_BLOCK = "positionBlock"
var PraiseModal = require('./PraiseModal')
var PRAISE_MODAL = "praise_modal"
var TweetBlock = require('./tweet/TweetBlock')
var listRawData = [
]
var listResponse = []
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var enoughCredits = true



export default class UserHomePageTab3 extends Component{
	static propTypes = {
    userId: PropTypes.number.isRequired,
    isPrivate: PropTypes.bool,
  }

  static defaultProps = {
    userId: '',
    isPrivate: false,
  }

	constructor(props){
		super(props);
		this.state = {
			listRawData: ds.cloneWithRows(listRawData),
			listResponse: undefined,
			noMessage: false,
			contentLoaded: false,
			isRefreshing: false,
			trendId:undefined,
		}
	}


	componentDidMount(){
			this.refresh()
	}

	refresh(){
		this.loadArticles();
		this.refreshCredits();
	}

	loadArticles(){
		var url = NetConstants.CFD_API.GET_TREND_NEXT
		url = url.replace(/<id>/, this.props.userId)
		url = url.replace(/<page>/, 0)
		var userData = LogicData.getUserData();
		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=UTF-8',
				},
				// cache: 'offline'
			},
			(responseJson, isCache) => {
				console.log("trend: " + JSON.stringify(responseJson));
				//{"total":310,"remaining":310,"liveOrder":90,"like":20,"share":200}
				this.setState({
					// creditsRemain:responseJson.remaining,
					listRawData:ds.cloneWithRows(responseJson),
					listResponse:responseJson,
				});
			},
			(result) => {
				console.log(result.errorMessage)
			}
		);
	}

	actionLiked(tid){

		var url = NetConstants.CFD_API.GET_TREND_LIKE
		url = url.replace(/<trendId>/, tid)
		var userData = LogicData.getUserData();
		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=UTF-8',
				},
				// cache: 'offline'
			},
			(responseJson, isCache) => {
				console.log("liked: " + JSON.stringify(responseJson));
				//{"total":310,"remaining":310,"liveOrder":90,"like":20,"share":200}
				this.setState({
					// creditsRemain:responseJson.remaining,
				});

				this.loadArticles();
			},
			(result) => {
				console.log(result.errorMessage)
			}
		);
	}



	refreshCredits(){
		var userData = LogicData.getUserData();
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_SCORE,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=UTF-8',
					},
					cache: 'offline'
				},
				(responseJson, isCache) => {
					console.log("my score: " + JSON.stringify(responseJson));
					//{"total":310,"remaining":310,"liveOrder":90,"like":20,"share":200}
					this.setState({
						creditsRemain:responseJson.remaining,
					});
				},
				(result) => {
					console.log(result.errorMessage)
				}
			);
 		}
	}

  tabPressed(index) {
     console.log("tabPressed==>"+index);
		 this.loadArticles();
  }

	emptyContent(){
		var emptyTip = ''
		if(LogicData.isUserSelf(this.props.userId)){
			emptyTip = '您的见解相当重要！'
		}else{
			emptyTip = '没有任何动态'
		}

		return(
			<View style={{flex:1,width:width,justifyContent:'center',alignItems:'center'}}>
				<Text style={{color:'grey',fontSize:14}}>{emptyTip}</Text>
			</View>
		)

	}

	onPressedEditView(){
    this.props.navigator.push({
			name: MainPage.NEW_TWEET_PAGE_ROUTE,
			onPopOut: ()=>{this.refresh()}
		});
	}

	editView(){
		if(LogicData.isUserSelf(this.props.userId)){
			return(
					<TouchableOpacity style={styles.editView} onPress={()=>this.onPressedEditView()}>

							<Image style={{width:48,height:48}} source={require('../../images/icon_edit.png')}/>

  				</TouchableOpacity>
			)
		}else{
			return <View></View>
		}
	}

	renderContent(){
		// console.log("listResponse" + this.state.listResponse.length)
		if(this.state.listResponse&&this.state.listResponse.length>0){
			return this.renderList();
		}else{
			return this.emptyContent();
		}
	}

	onPressItem(rowId){

	}

	onPressedShare(rowData){
		// Alert.alert('onPressShare ' + rowData.time)
		 var url = NetConstants.TRADEHERO_API.SHARE_TREND_URL;
	 	 url = url.replace("<id>", rowData.id);
	 	 MainPage.showSharePage({
	 		 title: rowData.message.substring(0,10),
	 		 description: rowData.message,
	 		 webpageUrl: url,
	 		 imageUrl: NetConstants.TRADEHERO_API.SHARE_LOGO_URL,
			 //  card: this.state.card,
	 		 onShareToSession: ()=>{this.shareToWechat(2)},
	 		 onShareToTimeline: ()=>{this.shareToWechat(3)},
	 	 });
	}

	shareToWechat(type){
		console.log("shareToWechat " + type)

	}

	onPressedReward(rowData){
		if(LogicData.isUserSelf(this.props.userId)){

		}else{
			this.refs[PRAISE_MODAL].show(rowData.id)
		}
	}

	onPressedPraise(rowData){
		// Alert.alert('onPressPraise ' + rowData.id)
		if(!rowData.Liked){
			this.actionLiked(rowData.id);
		}

	}



	renderRow(rowData,sectionID,rowID){
		console.log("renderRow"+rowData.id+"======"+rowData.message)
		var liked = rowData.Liked
		var iconPraise = liked?require('../../images/icon_praised.png'):require('../../images/icon_praise.png')
		var textPraise = liked?{color:'#1962dd'}:{}
		return(
			<View style={styles.itemLine}>
				<View style={{width:20,flex:1,alignItems:'center'}}>
					<View style={[styles.lineV,{height:17}]}></View>
					<Image style={{width:14,height:14}} source={require('../../images/localize.png')}/>
					<View style={[styles.lineV,{flex:1}]}></View>
				</View>
			  <View style={{width:width-20,paddingRight:10}}>
					<Text style={styles.timeStyle}>{rowData.createdAt}</Text>
					<TweetBlock value={rowData.message}/>


					<View style = {styles.itemOperator}>
						<View style={styles.separator}></View>
							<View style={{flexDirection:'row'}}>
								<TouchableOpacity style={styles.operatorItem} onPress={()=>this.onPressedPraise(rowData)}>
										 <Image style={styles.iconOperator} source={iconPraise}/>
										 <Text style={[styles.textOperator,textPraise]}>{rowData.likes}</Text>
								</TouchableOpacity>
								<View style={styles.operatorSepator}/>
								<TouchableOpacity style={styles.operatorItem} onPress={()=>this.onPressedReward(rowData)}>
										<Image style={styles.iconOperator} source={require('../../images/icon_reward.png')}/>
										<Text style={styles.textOperator}>{rowData.rewardCount}</Text>
								</TouchableOpacity>
								<View style={styles.operatorSepator}/>

								<TouchableOpacity style={styles.operatorItem} onPress={()=>this.onPressedShare(rowData)}>
										<Image style={styles.iconOperator} source={require('../../images/icon_share.png')}/>
										<Text style={styles.textOperator}>分享</Text>
								</TouchableOpacity>
							</View>
						<View style={styles.separator}></View>
					</View>
				</View>


			</View>
	 	);
	}

	renderList(){
		return (
			<View style={{flex:1}}>
			<ListView
				contentContainerStyle={styles.list}
				dataSource={this.state.listRawData}
				enableEmptySections={true}
				removeClippedSubviews={false}
				renderRow={this.renderRow.bind(this)} />
			  {this.renderPraiseModal()}
			</View>
		)
	}

	renderPraiseModal(){
		enoughCredits = this.state.creditsRemain&&this.state.creditsRemain>=10?true:false
		return (
			<PraiseModal callback={()=>{this.refresh()}} enoughCredits={enoughCredits} ref={PRAISE_MODAL} getNavigator={this.getNavigator}/>
		);
	}

	render(){
		return(
			<View style={{flex:1,backgroundColor:'white'}}>
       	{this.renderContent()}
				{this.editView()}
			</View>
		);
	}

}


const styles = StyleSheet.create({
	separator: {
    height: 0.5,
    backgroundColor: '#f0f0f0',
  },

	editView:{
		width:48,
		height:48,
		justifyContent:'center',
		alignItems:'center',
		position:'absolute',
		top:height - 220 - 120,//220是ViewPage以上的部分
		left:width*3/4,
	},

	list:{
		marginLeft:5,

		marginRight:5,
		// flexDirection:'row',
		justifyContent: 'flex-start',
		flexWrap:'wrap',
	},
	itemLine:{
		// height:165,
		flexDirection:'row'
	},
	itemOperator:{
		height:32,
		marginTop:10,
		paddingRight:10,
	},
	operatorItem:{
		flex:1,
		height:30,
		margin:1,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center'
	},
	operatorSepator:{
		height:24,
		backgroundColor:'#f0f0f0',
		alignSelf:'center',
		width:0.5
	},
	textStyle:{
		lineHeight:18,
		fontSize:14,
		color:'#333333',
	},
	timeStyle:{
		fontSize:12,
		color:'#8f8f8f',
		marginTop:15,
		marginBottom:5,
	},
	iconOperator:{
		 width:16,
		 height:16,
	},
	textOperator:{
		fontSize:9,
		marginLeft:5,
		color:'#999999',
	},
	lineV:{
		width:1,
		backgroundColor:'#f0f0f0',

	}


});


module.exports = UserHomePageTab3;
