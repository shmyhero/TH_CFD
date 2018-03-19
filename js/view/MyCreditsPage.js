'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Text,
	TextInput,
	Switch,
	UIManager,
	Image,
	ListView,
	TouchableOpacity,
	Alert,
} from 'react-native';
var LS = require('../LS')
var MainPage = require('./MainPage')
var NetworkModule = require('../module/NetworkModule')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var NetConstants = require('../NetConstants')
var LogicData = require('../LogicData')
var WebSocketModule = require('../module/WebSocketModule')
var UIConstants = require('../UIConstants');
var HeaderLineDialog = require('./HeaderLineDialog');
var {height, width} = Dimensions.get('window')
var Button = require('./component/Button');
var OpenAccountRoutes = require('./openAccount/OpenAccountRoutes');
var StorageModule = require('../module/StorageModule');
var heightRate = height/667.0

var listRawData = [
{'type':'header'},
{'type':'banner'},
// {'type':'normal','title':'实盘下单积分', 'subtype': 'creditsGetLiveOrder'},
// {'type':'normal','title':'卡片点赞积分', 'subtype': 'creditsGetLike'},
// {'type':'normal','title':'卡片分享积分', 'subtype': 'creditsGetShare'},
]
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var MyCreditsPage = React.createClass({

	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(listRawData),
			creditsTotal:'--',
			creditsRemain:'--',
			// creditsGetLiveOrder:'--',
			// creditsGetLike:'--',
			// creditsGetShare:'--',
		};
	},

	componentDidMount: function(){
		this.refreshData();
	},

	refreshData: function(){
		var userData = LogicData.getUserData();
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_SCORE_V2,
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
					var ITEMS = responseJson.Items
					listRawData = [
					{'type':'header'},
					{'type':'banner'},
					];

					for(var i = 0;i<ITEMS.length;i++){
						listRawData.push(
							{'type':'normal','title':ITEMS[i].name,'value':ITEMS[i].score}
						)
					}

					this.setState({
						dataSource: ds.cloneWithRows(listRawData),
						creditsTotal:responseJson.total,
						creditsRemain:responseJson.remaining,
						// creditsGetLiveOrder:responseJson.liveOrder,
						// creditsGetLike:responseJson.like,
						// creditsGetShare:responseJson.share,
					});


				},
				(result) => {
					console.log(result.errorMessage)
				}
			);
 		}
	},

	pressBackButton: function() {
		this.props.showTabbar()
		this.props.navigator.pop()
	},

	showRules: function(){
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			title: LS.str('JFGZ'),
			url:NetConstants.TRADEHERO_API.CREDITS_RULE
		});
	},

	enterCredits:function(){
		var userData = LogicData.getUserData();
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			var url = NetConstants.TRADEHERO_API.CREDITS_PLAY;
			url = url.replace("<id>", userData.userId);
			this.props.navigator.push({
				name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
				url: url,
				isShowNav:false,
				backFunction: ()=>{this.refreshData()}
			});
		}
	},

  renderTotalIncome: function(){
		var strLJHDJF = LS.str('LJHDJF')
		var strSYJF = LS.str('SYJF')
    return(
				<View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around'}}>
					<View style={styles.totalTextContainer}>
		        <Text style={styles.totalRewardTitleText}>
		          {strLJHDJF}
		        </Text>
		        <Text style={styles.totalRewardText}>
		          {this.state.creditsTotal}
		        </Text>
		      </View>
					<View style={styles.totalTextContainer}>
						<Text style={styles.totalRewardTitleText}>
							{strSYJF}
						</Text>
						<Text style={styles.totalRewardText}>
							{this.state.creditsRemain}
						</Text>
					</View>
				</View>
    );
  },

	renderBanner:function(){
		return(
			<View style = {{height:126,width:width,marginBottom:10}}>
			 <TouchableOpacity onPress={()=>this.gotoBannerPage()}>
					<Image
						style = {{height:126,width:width}}
						source = {require('../../images/bannner_credits.jpg')}>
					</Image>
				</TouchableOpacity>
			</View>
		)
	},

	gotoBannerPage:function(){
		this.enterCredits()
	},

	renderRow: function(rowData, sectionID, rowID) {
		if(rowData.type == 'header'){
			return (
					<View style={[styles.headerWrapper, {backgroundColor: ColorConstants.TITLE_BLUE}]}>
						{this.renderTotalIncome()}
					</View>
			);
		}else if(rowData.type=='banner'){
			 return (this.renderBanner())
		}else if(rowData.type == 'normal'){
			// var value;
			// if(rowData.subtype == 'creditsGetLiveOrder'){
			// 	value = this.state.creditsGetLiveOrder;
			// }
			// else if(rowData.subtype == 'creditsGetLike'){
			// 	value = this.state.creditsGetLike;
			// }
			// else if(rowData.subtype == 'creditsGetShare'){
			// 	value = this.state.creditsGetShare;
			// }
			return(
				<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
					<Text style={styles.title}>{rowData.title}</Text>
					<Text style={styles.contentValue}>{rowData.value}</Text>
				</View>
			);
		}
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		if(rowID == 0){
			return (
				<View style={[styles.line, {height: 10}]} key={rowID}>
					<View style={[styles.separator]}/>
				</View>
				)
		}else{
			return (
				<View style={styles.line} key={rowID}>
					<View style={[styles.separator]}/>
				</View>
				)
		}
	},


	render: function() {
		var strWDJF = LS.str('WDJF')
		var strGZ = LS.str('RULES')
		return (
			<View style={styles.wrapper}>
				<NavBar title={strWDJF} showBackButton={true} navigator={this.props.navigator}
					textOnRight={strGZ}
					rightTextOnClick={()=>this.showRules()}/>
				<ListView
					style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator} />
			</View>
		);
	},
});

var styles = StyleSheet.create({
  wrapper:{
		width: width,
   	alignItems: 'stretch',
		height:height,
  },
	headerWrapper: {
		backgroundColor: ColorConstants.MAIN_CONTENT_BLUE,
    height: 154,
	},
  totalTextContainer:{
    flexDirection: 'column',
    alignItems:'center',
		marginLeft:32,
		marginRight:32,
  },
  totalRewardTitleText:{
    fontSize: 14,
		marginTop: 41,
    color: 'white',
  },
  totalRewardText:{
    fontSize: 36,
		marginTop: 23,
    color: 'white',
  },
  detailsContainer:{
    flexDirection: 'column',
  },
  detailTextContainer:{
    flexDirection: 'column',
    alignItems:'center',
  },
  detailIncomeTitleText:{
    fontSize: 13,
    color: ColorConstants.SUB_TITLE_WHITE,
  },
  detailIncomeText:{
    fontSize: 17,
    color: 'white',
  },
	rowWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: UIConstants.LIST_ITEM_LEFT_MARGIN,
		paddingRight: 15,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: 'white',
	},
	title: {
		flex: 1,
		fontSize: 15,
		color: '#4c5f70',
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},

	contentValue: {
		fontSize: 15,
		marginRight: 5,
		color: '#4c5f70',
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		flex: 1,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	bottomArea: {
		height: 72,
		backgroundColor: 'white',
		alignItems: 'flex-end',
		flexDirection:'row'
	},
	buttonArea: {
		flex: 1,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 16,
		borderRadius: 3,
	},
	buttonView: {
		height: 40,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	checkboxView: {
		paddingLeft: 15,
		paddingTop: 10,
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,//12,
	},
	noticeText:{
		fontSize: 12,
		color: '#858585',
	},
	openaccountText:{
		fontSize: 12,
		color: ColorConstants.TITLE_BLUE,
	}
});


module.exports = MyCreditsPage;
