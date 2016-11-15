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

var Swiper = require('react-native-swiper')
var Touchable = require('Touchable');
var merge = require('merge');
var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var StockTransactionInfoBar = require('./StockTransactionInfoBar');
var AchievementCard = require('./AchievementCard');
var SharePage = require('./SharePage')
var MainPage = require('./MainPage')
var StockTransactionInfoPage = require('./StockTransactionInfoPage');
var NetworkModule = require('../module/NetworkModule');

var {height, width} = Dimensions.get('window');

var StockTransactionInfoModal = React.createClass({
	mixins: [Touchable.Mixin],

	getInitialState: function() {
		return merge(
			this.touchableGetInitialState(),
			{
				modalVisible: false,
				transactionInfo: null,
			}
		);
	},

	show: function(transactionInfo, callback, pageSettings) {
		var state = {
			modalVisible: true,
			hideCallback: callback,
		};
		if (transactionInfo !== null) {
			state.transactionInfo = transactionInfo;
		}
		if(pageSettings){
			state.pageSettings = pageSettings;
		}
		this.setState(state);
	},

	showAchievement: function(cardList, currentIndex, callback, pageSettings) {
		var state = {
			modalVisible: true,
			hideCallback: callback,
		};
		if(cardList !== null){
			state.isCardList = true;
			state.cardList = cardList;
			state.currentIndex = currentIndex;

			if(cardList && cardList.length > currentIndex){
				this.setPageViewed(cardList[currentIndex]);
			}
		}
		if(pageSettings){
			state.pageSettings = pageSettings;
		}
		this.setState(state);
	},

	hide: function() {
		this.setState({
			modalVisible: false,
		});
		this.state.hideCallback && this.state.hideCallback();
	},

	_setModalVisible: function(visible) {
    this.setState({modalVisible: visible});
  },

	setPageViewed: function(cardInfo){
		if(cardInfo.isNew){
			var url = NetConstants.CFD_API.SET_CARD_READ;
			url = url.replace("<id>", cardInfo.cardId);
			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'GET',
				},
				(responseJson) => {
					cardInfo.isNew = false;
				},
				(errorMessage) => {
					console.log(errorMessage)
				}
			)
		}
	},

	onSwipeTouchEnd: function() {
		var index = this.refs["swiper"].state.index;
		console.log(index);
		if(this.state.cardList && this.state.cardList[index]){
			this.setPageViewed(this.state.cardList[index]);
		}
	},

	renderPage: function(transactionInfo, i){
		if(!i){
			i = 0;
		}
		return (
			<StockTransactionInfoPage transactionInfo={transactionInfo}
				pageSettings={this.state.pageSettings}
				key={i}
				hideFunction={()=>this.hide()}/>
		);
	},

	renderPageWithCard: function(card, i){
		if(!i){
			i = 0;
		}
		return (
			<StockTransactionInfoPage card={card}
				pageSettings={this.state.pageSettings}
				showReward={false}
				key={i}
				hideFunction={()=>this.hide()}
				style={{
					flex: 1,
					justifyContent: 'center',
					marginLeft: 10,
					marginRight: 10,
					//alignSelf: 'center',
					backgroundColor: 'purple',
					alignSelf: 'flex-end',
				}}/>
		);
	},

	renderContent: function(){
		//return (<View style={{backgroundColor:'red', height: 100, width: 100}}/>);
		if(this.state.isCardList){
			var activeDot = <View/>;
			var dot = <View/>;
			var slides = [];
			for(var i = 0 ; i < this.state.cardList.length; i ++){
				slides.push(
					<View style={{flex: 1, flexDirection: 'row'}} key={i}>
						{this.renderPageWithCard(this.state.cardList[i], i)}
					</View>
				);
			}
			return (
				<Swiper
					ref={"swiper"}
					loop={false}
					bounces={false}
					autoplay={false}
					paginationStyle={{
						bottom: null, top: 12, left: null, right: 10,
					}}
					loadMinimal={true}
					index={this.state.currentIndex}
					activeDot={activeDot}
					dot={dot}
					onMomentumScrollEnd={(a,b,c)=>this.onSwipeTouchEnd()}
					>
					{slides}
				</Swiper>
			);
		}else{
			return this.renderPage(this.state.transactionInfo);
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
						<TouchableOpacity activeOpacity={1} onPress={()=>this.hide()}>
							<View style={styles.modalContainer}>
								{this.renderContent()}
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

  modalInnerContainer: {
    //borderRadius: 4,
    alignItems: 'stretch',
    backgroundColor: '#05FFFFFF',
  },

  actionButton:{
    marginTop:28,
  },

  imgAction:{
    width:61,
    height:61,
  },

	modalContainer:{
		flex: 1,
		justifyContent: 'center',
		backgroundColor:'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		height: height,
		width: width,
	},
});


module.exports = StockTransactionInfoModal;
