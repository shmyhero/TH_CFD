'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Text,
	TextInput,
	Switch,
} from 'react-native';

var MainPage = require('./MainPage')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')

var {height, width} = Dimensions.get('window')

var EditAlertPage = React.createClass({

	propTypes: {
		stockName: React.PropTypes.string,
		stockPrice: React.PropTypes.number,
		stockPriceAsk: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
		stockPriceBid: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
	},

	getInitialState: function() {
		return {
			currentUp: 1024.34,
			currentDwon: 1024.12,
			switchHigh:false,
			switchLow:false,
		};
	},

	gotoNext: function() {
	},

	pressBackButton: function() {
		this.props.showTabbar()
		this.props.navigator.pop()
	},

	renderSeparator: function(marginLeft) {
		return(
			<View style={{backgroundColor:'white'}}>
				<View style={[styles.separator,{marginLeft: marginLeft}]}/>
			</View>
			)
	},

	renderAlertCell: function(type){
		//type 1:买涨， 2:买跌
		var title = type === 1 ? '买涨价格高于':'买跌价格低于'
		return(
			<View style={styles.cellWrapper}>
				<Text style={styles.cellTitle}>
					{title}
				</Text>
				<TextInput style={styles.cellInput}>
				</TextInput>
				<Switch
				  value={type===1 ? this.state.switchHigh : this.state.switchLow}
					onValueChange={(value) => this.setState(type===1 ? {switchHigh:value} : {switchLow:value})}
				/>
			</View>
			)
	},

	render: function() {

		return (
			<View style={styles.wrapper}>
				<NavBar title='提醒设置'
					showBackButton={true}
					textOnRight='完成'
					rightTextOnClick={this.onComplete}
					navigator={this.props.navigator}/>
				<View style={styles.headerView}>
					<Text style={styles.nameText}>
						{this.props.stockName}
					</Text>
					<Text style={styles.priceText}>
						当前买涨价格 {this.state.currentUp} 当前买跌价格 {this.state.currentDwon}
					</Text>
				</View>
				{this.renderSeparator(0)}
				{this.renderAlertCell(1)}
				{this.renderSeparator(15)}
				{this.renderAlertCell(2)}
				{this.renderSeparator(0)}
				<Text style={styles.bottomText}>
					虽然全力以赴传递通知，却也不能保证。
				</Text>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: width,
   		alignItems: 'stretch',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
	headerView: {
		paddingLeft: 15,
		paddingTop: 12,
		paddingBottom: 12,
		justifyContent: 'space-around',
		height: Math.round(height/8),
	},
	nameText: {
		fontSize: 17,
		color: 'black',
		marginBottom: 10,
	},
	priceText: {
		fontSize: 16,
		color: '#808080',
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	cellWrapper: {
		height: Math.round(height/10),
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	cellTitle: {
		fontSize: 17,
	},
	cellInput: {
		fontSize: 17,
		borderWidth: 1.0,
		borderRadius: 2,
		borderColor: '#efeff4',
		height: 28,
		padding: 0,
		width: Math.round(width/3),
		alignSelf: 'center',
		textAlignVertical:'center',
	},
	bottomText: {
		marginTop:15,
		marginLeft: 12,
		fontSize: 12,
		color: '#8d8d8d',
	}
});


module.exports = EditAlertPage;
