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

var {height, width} = Dimensions.get('window');
var actionButtonSize = 61;

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
		});
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
				<AchievementCard card={this.state.card} showReward={this.props.showReward}/>
			)
		}
	},

	gotoTrade:function(){
		console.log("gotoTrade");
		MainPage.gotoTrade()
	},

	renderContent: function(){
		if(this.state.card){
			return (
				<View style={{/*flex: 1,*/ flexDirection:'column', alignSelf: 'stretch'}}>
					{this.renderAchievementCard()}
					<StockTransactionInfoBar card={this.state.card} transactionInfo={this.state.transactionInfo}
						hideTopCornerRadius={this.state.card !== undefined && this.state.card !== null}/>
				</View>
			);
		}else{
			return (
				<View style={{/*flex: 1,*/ flexDirection:'column', alignSelf: 'stretch'}}>
					{this.renderAchievementCard()}
					<TouchableOpacity activeOpacity={1.0} onPress={()=>this.gotoTrade()}>
						<StockTransactionInfoBar transactionInfo={this.state.transactionInfo}
							hideTopCornerRadius={this.state.card !== undefined && this.state.card !== null}
							/>
				 </TouchableOpacity>
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
		justifyContent: 'center',
		marginLeft: 10,
		marginRight: 10,
		alignSelf: 'center',
		//backgroundColor: "red",
		// paddingBottom:height/2,
	},

  modalInnerContainer: {
    //borderRadius: 4,
    alignItems: 'stretch',
    //backgroundColor: '#05FFFFFF',
  },

  actionButton:{
    marginTop: (height
			- UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER
			- actionButtonSize - 160 - ((width - 20) / 690 * 644))/3 + 8,
		flexDirection: 'row',
  },

  imgAction:{
    width:actionButtonSize,
    height:actionButtonSize,
  },
});


module.exports = StockTransactionInfoPage;
