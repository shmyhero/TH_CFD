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
	Modal,
	TouchableOpacity,
} from 'react-native';

var Touchable = require('Touchable');
var merge = require('merge');
var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var StockTransactionInfoBar = require('./StockTransactionInfoBar');
var AchievementCard = require('./AchievementCard');
var SharePage = require('./SharePage')
var MainPage = require('./MainPage')

var {height, width} = Dimensions.get('window');

var StockTransactionInfoPage = React.createClass({
	mixins: [Touchable.Mixin],

	getInitialState: function() {
		return merge(
			this.touchableGetInitialState(),
			{
				modalVisible: false,
				totalHeight: height,
				transactionInfo: null,
			}
		);
	},

	show: function(transactionInfo, callback, pageSettings) {
		var state = {
			modalVisible: true,
			hideCallback: callback,
			titleColor: ColorConstants.TITLE_BLUE,
		};
		if (transactionInfo !== null) {
			state.transactionInfo = transactionInfo;
			state.totalHeight = transactionInfo.totalHeight;
			state.achievementUrl = transactionInfo.achievementUrl;
			state.transactionID = transactionInfo.id;
			if(transactionInfo.achievementThemeColor){
				state.titleColor = transactionInfo.achievementThemeColor;
			}
		}
		if(pageSettings){
			state.showShare = pageSettings.showShare;
			state.showLike = pageSettings.showLike;
		}
		this.setState(state);
	},

	hide: function() {
		this.setState({
			modalVisible: false,
		});
	},

	touchableHandlePress: function(e: Event) {
		this.hide()
		this.state.hideCallback && this.state.hideCallback()
	},

	_setModalVisible: function(visible) {
    this.setState({modalVisible: visible});
  },

	_showSharePanel: function(){
		this.hide();
		MainPage.showSharePage({
			title: "aaaa",
      url: "http://baidu.com",
      description: "cest",
      imgUrl: "http://baidu.com",
			transactionID: this.state.transactionID
		});
	},

	likeTransaction: function(){
		alert("I like it!")
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
					style={{backgroundColor: 'yellow',}}/>
			</View>
		)
	},

	renderShare: function(){
		if(this.state.showShare){
			return (
				<TouchableOpacity style={styles.actionButton} onPress={() => this._showSharePanel()}>
					<Image style = {styles.imgAction} source = {require('../../images/sign_stratgy_close.png')} ></Image>
				</TouchableOpacity>
			);
		}
	},

	renderLike: function(){
		if(this.state.showLike){
			return (
				<TouchableOpacity style={styles.actionButton} onPress={() => this.likeTransaction()}>
					<Image style = {styles.imgAction} source = {require('../../images/advantage.png')} ></Image>
				</TouchableOpacity>
			);
		}
	},

	render: function() {
		return (
			<View>
				<Modal
					transparent={true}
					visible={this.state.modalVisible}
					animationType={"slide"}
					style={{height: height, width: width}}
					onRequestClose={() => {this._setModalVisible(false)}}>
					<TouchableOpacity onPress={() => {this._setModalVisible(false)}}>
						<View style={styles.modalContainer}>
							<TouchableOpacity activeOpacity={1}>
							  <View style={[styles.modalInnerContainer, {backgroundColor: 'green'}]}>
									{this.renderContent()}
								</View>
							</TouchableOpacity>
							<View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'}}>
								{this.renderShare()}
								{this.renderLike()}
							</View>
						</View>
					</TouchableOpacity>
				</Modal>
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
    backgroundColor: '#05FFFFFF',
  },

  actionButton:{
    marginTop:28,
  },

  imgAction:{
    width:36,
    height:36,
  },
});


module.exports = StockTransactionInfoPage;
