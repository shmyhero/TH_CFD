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
var LS = require('../LS');

var {height, width} = Dimensions.get('window');
var actionButtonSize = 61;

const BODY_HORIZON_MARGIN = Platform.OS === 'ios' ? 15 : 20;
const BODY_TOP_MARGIN = 0;
const BODY_BOTTOM_MARGIN = 30;
const CONTENT_WIDTH = width - BODY_HORIZON_MARGIN * 2 - 2 - BODY_BOTTOM_MARGIN * 2;
const CARD_BORDER_WIDTH = CONTENT_WIDTH * 0.035;
const BOTTOM_CARD_BORDER_WIDTH = Platform.OS === 'ios' ? CARD_BORDER_WIDTH * 3 : CARD_BORDER_WIDTH * 2;
const CARD_BACKGROUND_WIDTH = (width - BODY_HORIZON_MARGIN * 2 + CARD_BORDER_WIDTH * 2 - BODY_BOTTOM_MARGIN * 2);
const CARD_BACKGROUND_HEIGHT = (CARD_BACKGROUND_WIDTH/ 622 * 915);
const CARD_BACKGROUND_BORDER_WIDTH = CARD_BACKGROUND_WIDTH * 0.035;
const CARD_BORDER_HEADER_HEIGHT = CARD_BACKGROUND_HEIGHT * 0.063;
const TITLE_FONT_SIZE = 17 / 375 * width;
const IMAGE_RESIZE_SCALE =  CARD_BACKGROUND_HEIGHT / (915 / 2)
const CARD_TITLE_POSITION = 22 * IMAGE_RESIZE_SCALE;
const ACHIEVEMENT_HEIGHT = 530 / 2 * IMAGE_RESIZE_SCALE;
const ACHIEVEMENT_WIDTH = 510 / 2 * IMAGE_RESIZE_SCALE;
const ACHIEVEMENT_MARGIN_TOP = 40 * IMAGE_RESIZE_SCALE;
// const CONTENT_WIDTH = 570;
// const CONTENT_HEIGHT = 827;

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


		this.getCardLikedInfo()
	},

	getCardLikedInfo:function(){
		console.log('getCardLikedInfo')
		if(this.props.card==undefined){return}
		
		var url = NetConstants.CFD_API.SET_CARD_READ;
			url = url.replace("<id>", this.props.card.cardId);
			var userData = LogicData.getUserData();
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
					this.setState({
						liked:responseJson.liked,
						likes:responseJson.likes,
					})
				},
				(result) => {
					console.log(result.errorMessage)
				}
			)
	},

	_showSharePanel: function(){
		this.props.hideFunction && this.props.hideFunction();
		var url = NetConstants.TRADEHERO_API.SHARE_ACHIEVEMENT_CARD_URL;
		url = url.replace("<id>", this.state.card.cardId);
		MainPage.showSharePage({
			title: LS.str("CARD_SHARE_TITLE"),
			description: LS.str("CARD_SHARE_DESCRIPTION"),
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
								Toast.show(LS.str("CARD_WIN_SCORE").replace("{1}", responseJson.score ), {
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
					style={{marginTop: ACHIEVEMENT_MARGIN_TOP,}}
					width={ACHIEVEMENT_WIDTH}
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
			var cardBorder = require('../../images/card_border.png');
			return (
				<View style={{width: width,
					position:'absolute',
					top:0, bottom:0,}}>
					<Image source={cardBorder}
						style={{width: CARD_BACKGROUND_WIDTH, height: CARD_BACKGROUND_HEIGHT,
						resizeMode: "contain",
					}}>
					</Image>
				</View>
			)
		}
	},

	renderContent: function(){
		if(this.state.card){
			return (
				<View style={{/*flex: 1,*/ flexDirection:'column', alignSelf: 'stretch',
					paddingTop:CARD_BORDER_HEADER_HEIGHT,
					paddingBottom: BOTTOM_CARD_BORDER_WIDTH,
					paddingLeft: (width - CARD_BACKGROUND_WIDTH) / 2,
					paddingRight: (width - CARD_BACKGROUND_WIDTH) / 2,
				}}>
					{this.renderCardBorder()}
					<View style={styles.realContent}>
						<View style={{/*flex: 1,*/ flexDirection:'column', alignSelf: 'stretch',}}>
							{this.renderAchievementCard()}
							<View style={{position:'absolute', top: CARD_TITLE_POSITION, left:0, right:0,
							 alignItems:'center', }}>
								<Text style={{textAlign: 'center', color:'white', fontSize: TITLE_FONT_SIZE, width:120,} }>
									{this.state.card.title}
								</Text>
							</View>
							<StockTransactionInfoBar card={this.state.card} transactionInfo={this.state.transactionInfo}
								hideTopCornerRadius={this.state.card !== undefined && this.state.card !== null}
								width={CONTENT_WIDTH} bigMargin={false}/>
						</View>
					</View>
				</View>
			);
		}else{
			return (
				<View style={{marginLeft: 10, marginRight: 10,}}>
					<View style={{/*flex: 1,*/ flexDirection:'column', alignSelf: 'stretch'}}>
						<TouchableOpacity activeOpacity={1.0} onPress={()=>this.gotoTrade()}>
							<StockTransactionInfoBar transactionInfo={this.state.transactionInfo}
								hideTopCornerRadius={this.state.card !== undefined && this.state.card !== null}
								bigMargin={true}
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
					<Image style = {styles.imgAction} source = {require('../../images/card_sharing.png')} ></Image>
				</TouchableOpacity>
			);
		}
	},

	renderLike: function(){
		if(this.state.card  && this.state.showLike){
			var imgSource = this.state.liked ? require('../../images/card_liked.png') : require('../../images/cald_unliked.png');
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
				<View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'}}>
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
		//width:width,
		marginTop: BODY_TOP_MARGIN,
		justifyContent: 'center',
		alignSelf: 'center',
		//backgroundColor: "red",
		// paddingBottom:height/2,
	},

	realContent: {
		marginLeft: CARD_BACKGROUND_BORDER_WIDTH,
		marginRight: CARD_BACKGROUND_BORDER_WIDTH,
	},

  modalInnerContainer: {
    //borderRadius: 4,
    alignItems: 'stretch',
    //backgroundColor: '#05FFFFFF',
  },

  actionButton:{
    marginTop: 0,//(height - actionButtonSize - CARD_BACKGROUND_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER)/4,
		flexDirection: 'row',
		marginBottom: Platform.OS == 'android' ? 48 : 0,
  },

  imgAction:{
    width:actionButtonSize,
    height:actionButtonSize,
  },
});


module.exports = StockTransactionInfoPage;
