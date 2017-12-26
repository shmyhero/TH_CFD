'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	ScrollView,
} from 'react-native';

var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var NetworkModule = require('../../module/NetworkModule')
var NetConstants = require('../../NetConstants')
var OpenAccountHintBlock = require('./OpenAccountHintBlock');
var LS = require("../../LS")

var {height, width} = Dimensions.get('window')

var OAReviewStatusPage = React.createClass({
	propTypes: {
		onPop: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			onPop: ()=>{},
		}
	},

	gotoNext: function() {
		OpenAccountRoutes.goToNextRoute(this.props.navigator, {}, this.props.onPop);
	},

	render: function() {
		var startDate = new Date()
		startDate.Format('yy/MM/dd')
		//var endDate = new Date(startDate.valueOf()+7*24*60*60*1000)
		//endDate.Format('yy/MM/dd')+"\n"+startDate.Format('hh:mm:ss')
		return (
			<View style={styles.wrapper}>
				<ScrollView style={{flex:1}}>
					<Text style={styles.text1}>{LS.str("OPEN_ACCOUNT_THANKS")}</Text>
					<View style={styles.rowWrapper}>
						<Image style={styles.image} source={require('../../../images/icon_review1.png')}/>
						<Text style={styles.ellipse}>· · ·</Text>
						<Image style={styles.image} source={require('../../../images/icon_review2.png')}/>
						<Text style={styles.ellipse}>· · ·</Text>
						<Image style={styles.image} source={require('../../../images/icon_review3.png')}/>
					</View>
					<View style={styles.rowWrapper}>
						<Text style={styles.text2}>{LS.str("OPEN_ACCOUNT_APPLICATION_SUBMIT") + "\n"+startDate.Format('yyyy-MM-dd')+"\n"+startDate.Format('hh:mm:ss')}</Text>
						<Text style={styles.text2}>{LS.str("OPEN_ACCOUNT_REVIEWING")}</Text>
						<Text style={styles.text2}>{LS.str("OPEN_ACCOUNT_REVIEW_FINISH")}</Text>
					</View>
					<Text style={styles.text3}>{LS.str("OPEN_ACCOUNT_SUCCEED_REMINDER")}</Text>
					<OpenAccountHintBlock/>
			 	</ScrollView>
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={true}
						onPress={this.gotoNext}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text={LS.str("FINISH")} />
				</View>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
 		alignItems: 'stretch',
  	justifyContent: 'flex-start',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
	rowWrapper: {
		flexDirection: 'row',
		backgroundColor: 'white',
		justifyContent: 'center',
		paddingBottom: 10,
	},
	text1: {
		fontSize: 17,
		textAlign: 'center',
		paddingTop: 20,
		paddingBottom: 20,
		backgroundColor: 'white',
	},
	text2: {
		flex: 1,
		fontSize: 14,
		textAlign: 'center',
		color: '#f36b6f',
		paddingBottom: 10,
	},
	text3: {
		fontSize: 13,
		textAlign: 'center',
		padding: 15,
		lineHeight: 20,
	},
	image: {
		alignSelf: 'center',
		width: 31,
		height: 31,
	},

	buttonArea: {
		flex: 1,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 16,
		borderRadius: 3,
	},
	buttonView: {
		height: 40,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_DARK_BLUE,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
	ellipse:{
		fontSize: 50,
		marginLeft: 20,
		marginRight: 20,
		color: ColorConstants.TITLE_DARK_BLUE,
	},
	bottomArea: {
		height: 72,
		backgroundColor: 'white',
		alignItems: 'flex-end',
		flexDirection:'row'
	},
});


module.exports = OAReviewStatusPage;
