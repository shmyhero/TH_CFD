'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
} from 'react-native';

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

	gotoEditAlertPage: function(alertData) {
		//todo
		this.props.navigator.push({
			name: MainPage.EDIT_ALERT_ROUTE,
      stockId: alertData,
		})
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<NavBar title='我的自选'
					leftTextOnClick={this.pressBackButton}
					textOnLeft='完成'
					navigator={this.props.navigator}/>
				<StockEditFragment style={{flex: 1}} onTapEditAlert={this.gotoEditAlertPage}/>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: width,
   		alignItems: 'stretch',
    	justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
});


module.exports = EditOwnStocksPage;
