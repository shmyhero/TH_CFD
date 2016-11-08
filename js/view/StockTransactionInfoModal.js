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
var StockTransactionInfoPage = require('./StockTransactionInfoPage')

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

	showSwiper: function(transactionInfoList, currentIndex, callback, pageSettings) {
		var state = {
			modalVisible: true,
			hideCallback: callback,
		};
		if(transactionInfoList !== null){
			state.isArray = true;
			state.transactionInfoList = transactionInfoList;
			state.currentIndex = currentIndex;
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

	renderContent: function(){
		if(this.state.isArray){
			var activeDot = <View/>;
			var dot = <View/>;
			var slides = [];
			for(var i = 0 ; i < this.state.transactionInfoList.length; i ++){
				slides.push(
					this.renderPage(this.state.transactionInfoList[i], i)
				);
			}
			return (
				<Swiper
					loop={false}
					bounces={false}
					autoplay={false}
					paginationStyle={{
						bottom: null, top: 12, left: null, right: 10,
					}}
					index={this.state.currentIndex}
					activeDot={activeDot}
					dot={dot}>
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
							{this.renderContent()}
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
    width:61,
    height:61,
  },
});


module.exports = StockTransactionInfoModal;
