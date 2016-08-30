'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
} from 'react-native';

var Button = require('./component/Button')
var MainPage = require('./MainPage')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var StockEditFragment = require('./component/StockEditFragment');

var {height, width} = Dimensions.get('window')

var EditOwnStocksPage = React.createClass({

	gotoNext: function() {
	},

	pressBackButton: function() {
		this.props.showTabbar()
		this.props.navigator.pop()
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<NavBar title='我的自选'
					leftTextOnClick={this.pressBackButton}
					textOnLeft='完成'
					navigator={this.props.navigator}/>
				<StockEditFragment style={{flex: 1}} />
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
   		alignItems: 'stretch',
    	justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
});


module.exports = EditOwnStocksPage;