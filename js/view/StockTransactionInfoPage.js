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
	Swiper,
} from 'react-native';

var Touchable = require('Touchable');
var merge = require('merge');
var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var StockTransactionInfoBar = require('./StockTransactionInfoBar');
var AchievementCard = require('./AchievementCard');
var SharePage = require('./SharePage')
var MainPage = require('./MainPage')
var NetConstants = require('../NetConstants')

var {height, width} = Dimensions.get('window');

var StockTransactionInfoPage = React.createClass({
	mixins: [Touchable.Mixin],

	propTypes: {
		transactionInfo: React.PropTypes.object,
		pageSettings: React.PropTypes.object,
		hideFunction: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			transactionInfo: null,
			pageSettings: null,
			hideFunction: ()=>{},
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
		var state = {
			titleColor: ColorConstants.TITLE_BLUE,
		};
		if (this.props.transactionInfo !== null) {
			state.transactionInfo = this.props.transactionInfo;
			state.achievementUrl = this.props.transactionInfo.achievementUrl;
			state.achievementID = this.props.transactionInfo.achievementID;
			state.liked = this.props.transactionInfo.liked ? true : false;
			state.likedPerson = this.props.transactionInfo.likedPerson;
			if(this.props.transactionInfo.achievementThemeColor){
				state.titleColor = this.props.transactionInfo.achievementThemeColor;
			}
		}
		if(this.props.pageSettings){
			state.showShare = this.props.pageSettings.showShare;
			state.showLike = this.props.pageSettings.showLike;
		}
		this.setState(state);
	},

	_showSharePanel: function(){
		this.props.hideFunction && this.props.hideFunction();

		var url = NetConstants.TRADEHERO_API.SHARE_ACHIEVEMENT_CARD_URL;
		url.replace("<id>", this.state.achievementID);
		MainPage.showSharePage({
			title: "我获得了一张盈交易卡片奖励",
      description: "盈交易-风靡全球的投资神器登陆亚洲",
      url: url,
      imgUrl: NetConstants.TRADEHERO_API.SHARE_LOGO_URL,
			achievementID: this.state.achievementID
		});
	},

	likeTransaction: function(){
		if(!this.state.liked){
			this.setState({
				likedPerson: this.state.liked ? this.state.likedPerson - 1 : this.state.likedPerson + 1,
				liked: !this.state.liked,
			})
		}
	},

	renderAchievementCard: function(){
		if(this.state.achievementUrl){
			return (
				<AchievementCard cardUrl={this.state.achievementUrl}/>
			)
		}
	},

	renderContent: function(){
		return (
			<View style={{flex: 1, flexDirection:'column', alignSelf: 'stretch'}}>
				{this.renderAchievementCard()}
				<StockTransactionInfoBar transactionInfo={this.state.transactionInfo} titleColor={this.state.titleColor}
					hideTopCornerRadius={this.state.achievementUrl != null}
					style={{backgroundColor: 'yellow',}}/>
			</View>
		)
	},

	renderShare: function(){
		if(this.state.showShare){
			return (
				<TouchableOpacity style={styles.actionButton} onPress={() => this._showSharePanel()}>
					<Image style = {styles.imgAction} source = {require('../../images/action_share.png')} ></Image>
				</TouchableOpacity>
			);
		}
	},

	renderLike: function(){
		if(this.state.showLike){
			var imgSource = this.state.liked ? require('../../images/action_like_liked.png') : require('../../images/action_like.png');
			return (
				<TouchableOpacity style={styles.actionButton} onPress={() => this.likeTransaction()}>
					<Image style={styles.imgAction} source={imgSource} ></Image>
					<Text style={{alignSelf: 'center', color: '#eeeeee', marginTop: 5}}>{this.state.likedPerson}</Text>
				</TouchableOpacity>
			);
		}
	},

	render: function() {
		return (
			<View style={styles.modalContainer}>
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
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'transparent',
	},

	modalContainer:{
		flex: 1,
		justifyContent: 'center',
		backgroundColor:'rgba(0, 0, 0, 0.5)',
		paddingLeft: 10,
		paddingRight: 10,
		height: height,
		width: width,
		// paddingBottom:height/2,
	},

  modalInnerContainer: {
    //borderRadius: 4,
    alignItems: 'stretch',
    //backgroundColor: '#05FFFFFF',
  },

  actionButton:{
    marginTop:28,
  },

  imgAction:{
    width:61,
    height:61,
  },
});


module.exports = StockTransactionInfoPage;
