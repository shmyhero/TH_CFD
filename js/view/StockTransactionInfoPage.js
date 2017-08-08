'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Animated,
	Dimensions,
	PanResponder,
	TouchableOpacity,
	Alert,
	Platform,
} from 'react-native';

var Touchable = require('Touchable');
var merge = require('merge');
var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var StockTransactionInfoBar = require('./StockTransactionInfoBar');
var AchievementCard = require('./AchievementCard');
var SharePage = require('./SharePage')
var MainPage = require('./MainPage')
var NetConstants = require('../NetConstants');
var LogicData = require('../LogicData');
var NetworkModule = require('../module/NetworkModule');
var Toast = require('./component/toast/Toast');

var {height, width} = Dimensions.get('window');
var actionButtonSize = 61;

const BODY_HORIZON_MARGIN = Platform.OS === 'ios' ? 15 : 20;
const BODY_TOP_MARGIN = 0;
const BODY_BOTTOM_MARGIN = Platform.OS === 'ios' ? 0 : 30;
const CONTENT_WIDTH = width - BODY_HORIZON_MARGIN * 2;
const CARD_BORDER_WIDTH = CONTENT_WIDTH * 0.02;
const BOTTOM_CARD_BORDER_WIDTH = CARD_BORDER_WIDTH*3;
const BORDER_WIDTH = (width - BODY_HORIZON_MARGIN * 2 + CARD_BORDER_WIDTH * 2);
const BORDER_HEIGHT = (BORDER_WIDTH/ 720 * 1090);
const CARD_BORDER_HEADER_HEIGHT = BORDER_HEIGHT * 0.063;
const CARD_TITLE_POSITION = BORDER_HEIGHT * 0.026;
const CARD_TITLE_HEIGHT = BORDER_HEIGHT * 0.04;
const TITLE_FONT_SIZE = 20 / 375 * width;

var StockTransactionInfoPage = React.createClass({
	mixins: [Touchable.Mixin],

	propTypes: {
		transactionInfo: React.PropTypes.object,
		card: React.PropTypes.object,
		pageSettings: React.PropTypes.object,
		hideFunction: React.PropTypes.func,
		showReward: React.PropTypes.bool,
	},

	getDefaultProps() {
		return {
			transactionInfo: null,
			card: null,
			pageSettings: {showShare: true},
			hideFunction: ()=>{},
			showReward: true,
		}
	},

	getInitialState: function() {
		return merge(
			this.touchableGetInitialState(),
			{
				transactionInfo: null,
			}
		);
	},

	componentWillMount: function(){
		var state = {};
		if(this.props.card !== null){
			state.card = this.props.card;
			state.liked = this.props.card.liked ? true : false;
			state.likes = this.props.card.likes;
		}
		if (this.props.transactionInfo !== null) {
			state.transactionInfo = this.props.transactionInfo;
			if(this.props.transactionInfo.card !== null){
				state.card = this.props.transactionInfo.card;
				if(this.props.transactionInfo.card){
					state.liked = this.props.transactionInfo.card.liked ? true : false;
					state.likes = this.props.transactionInfo.card.likes;
				}
			}
		}

		state.showShare = true;	//Default is show Share.
		if(this.props.pageSettings){
			state.showShare = this.props.pageSettings.showShare;
			state.showLike = this.props.pageSettings.showLike;
		}
		this.setState(state);
	},

	_showSharePanel: function(){
		this.props.hideFunction && this.props.hideFunction();
		var url = NetConstants.TRADEHERO_API.SHARE_ACHIEVEMENT_CARD_URL;
		url = url.replace("<id>", this.state.card.cardId);
		MainPage.showSharePage({
			title: "我获得了一张盈交易卡片奖励",
      description: "盈交易-风靡全球的投资神器登陆亚洲",
      webpageUrl: url,
      imageUrl: NetConstants.TRADEHERO_API.SHARE_LOGO_URL,
			card: this.state.card,
			onShareToSession: ()=>{this.shareToWechat(2)},
			onShareToTimeline: ()=>{this.shareToWechat(3)},
		});
	},

	shareToWechat: function(type){
		console.log("shareToWechat " + type)
		var url = NetConstants.CFD_API.SHARE_CARD_TO_HOME;
		url = url.replace("<id>", this.state.card.cardId);
		url = url.replace("<share_id>", type);
		var userData = LogicData.getUserData();
		var login = Object.keys(userData).length !== 0
		if(login){
			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=UTF-8',
					},
				},
				(responseJson) => {
					if(responseJson.score){
						Toast.show("分享成功，赚" + responseJson.score + "积分", {
							duration: 500,
						})
					}
				},
				(result) => {
					console.log(result.errorMessage)
				}
			)
		}
	},

	likeTransaction: function(){
		if(!this.state.liked){
			var userData = LogicData.getUserData();
			var login = Object.keys(userData).length !== 0
			if(!login){
				Alert.alert("请先登录");
			}else{
				var url = NetConstants.CFD_API.SET_CARD_LIKED;
				url = url.replace("<id>", this.state.card.cardId);
				NetworkModule.fetchTHUrl(
					url,
					{
						method: 'GET',
						headers: {
							'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
							'Content-Type': 'application/json; charset=UTF-8',
						},
					},
					(responseJson) => {
						if(responseJson.success){
							this.setState({
								likes: this.state.liked ? this.state.likes - 1 : this.state.likes + 1,
								liked: !this.state.liked,
							})
							if(responseJson.score){
								Toast.show("赚" + responseJson.score + "积分", {
									duration: 500,
								})
							}
						}
					},
					(result) => {
						console.log(result.errorMessage)
					}
				)
			}
		}
	},

	renderAchievementCard: function(){
		if(this.state.card){
			return (
				<AchievementCard card={this.state.card} showReward={this.props.showReward}
					width={CONTENT_WIDTH}
				/>
			)
		}
	},

	gotoTrade:function(){
		console.log("gotoTrade");
		MainPage.gotoTrade()
	},

	renderCardBorder: function(){
		if(this.state.card){

			var cardBorder = require('../../images/card_border_bronze.png');
			if(this.state.card.cardType == 1){
				cardBorder = require('../../images/card_border_bronze.png');
			}else if(this.state.card.cardType == 2){
				cardBorder = require('../../images/card_border_silver.png');
			}else if(this.state.card.cardType == 3){
				cardBorder = require('../../images/card_border_gold.png');
			}else if(this.state.card.cardType == 4){
				cardBorder = require('../../images/card_border_blue.png');
			}
			return (
				<View style={{
					position:'absolute',
					top: 0, bottom:0,
					left:BODY_HORIZON_MARGIN-CARD_BORDER_WIDTH,
					right: BODY_HORIZON_MARGIN-CARD_BORDER_WIDTH,
				}}>
					<Image source={cardBorder}
						style={{width: BORDER_WIDTH, height: BORDER_HEIGHT,
						resizeMode: "contain"}}>
					</Image>
					<View style={{position:'absolute', top: CARD_TITLE_POSITION, left:0, right:0, justifyContent:'center', alignItems:'center', height:CARD_TITLE_HEIGHT,}}>
						<Text style={{textAlign: 'center', color:'white', fontSize: TITLE_FONT_SIZE, width:120,} }>
							{this.state.card.title}
						</Text>
					</View>
				</View>
			)
		}
	},

	renderContent: function(){
		if(this.state.card){
			return (
				<View style={{/*flex: 1,*/ flexDirection:'column', alignSelf: 'stretch',
					paddingTop:CARD_BORDER_HEADER_HEIGHT,
					paddingBottom: BOTTOM_CARD_BORDER_WIDTH}}>
					<View style={styles.realContent}>
						<View style={{/*flex: 1,*/ flexDirection:'column', alignSelf: 'stretch'}}>
							{this.renderAchievementCard()}
							<StockTransactionInfoBar card={this.state.card} transactionInfo={this.state.transactionInfo}
								hideTopCornerRadius={this.state.card !== undefined && this.state.card !== null}
								width={CONTENT_WIDTH} bigMargin={true}/>
						</View>
					</View>
					{this.renderCardBorder()}
				</View>
			);
		}else{
			return (
				<View style={{marginLeft: 10, marginRight: 10,}}>
					<View style={{/*flex: 1,*/ flexDirection:'column', alignSelf: 'stretch'}}>
						{this.renderAchievementCard()}
						<TouchableOpacity activeOpacity={1.0} onPress={()=>this.gotoTrade()}>
							<StockTransactionInfoBar transactionInfo={this.state.transactionInfo}
								hideTopCornerRadius={this.state.card !== undefined && this.state.card !== null}
								/>
					 </TouchableOpacity>
					</View>
				</View>
			);
		}
	},

	renderShare: function(){
		if(this.state.card && this.state.showShare){
			return (
				<TouchableOpacity style={styles.actionButton} onPress={() => this._showSharePanel()}>
					<Image style = {styles.imgAction} source = {require('../../images/action_share.png')} ></Image>
				</TouchableOpacity>
			);
		}
	},

	renderLike: function(){
		if(this.state.card  && this.state.showLike){
			var imgSource = this.state.liked ? require('../../images/action_like_liked.png') : require('../../images/action_like.png');
			return (
				<TouchableOpacity style={[styles.actionButton, {flexDirection: 'row'}]} onPress={() => this.likeTransaction()}>
					<Image style={styles.imgAction} source={imgSource} ></Image>
					<Text style={{alignSelf: 'center', color: '#eeeeee', marginLeft: 5}}>{this.state.likes}</Text>
				</TouchableOpacity>
			);
		}
	},

	render: function() {
		return (
			<View style={styles.container}>
				<TouchableOpacity activeOpacity={1}>
				  <View style={styles.modalInnerContainer}>
						{this.renderContent()}
					</View>
				</TouchableOpacity>
				<View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around',}}>
					{this.renderShare()}
					{this.renderLike()}
				</View>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	container: {
		/*position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'transparent',
		*/
		//flex: 1,
		marginTop: BODY_TOP_MARGIN,
		justifyContent: 'center',
		alignSelf: 'center',
		//backgroundColor: "red",
		// paddingBottom:height/2,
	},

	realContent: {
		marginLeft: BODY_HORIZON_MARGIN,
		marginRight: BODY_HORIZON_MARGIN,
	},

  modalInnerContainer: {
    //borderRadius: 4,
    alignItems: 'stretch',
    //backgroundColor: '#05FFFFFF',
  },

  actionButton:{
    marginTop: (height - actionButtonSize - BORDER_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER)/3,
		flexDirection: 'row',
		marginBottom:BODY_BOTTOM_MARGIN,
  },

  imgAction:{
    width:actionButtonSize,
    height:actionButtonSize,
  },
});


module.exports = StockTransactionInfoPage;
