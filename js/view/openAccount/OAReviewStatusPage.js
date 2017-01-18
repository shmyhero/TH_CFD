'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
} from 'react-native';

var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var NetworkModule = require('../../module/NetworkModule')
var NetConstants = require('../../NetConstants')

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
				<Image source={require('../../../images/withdraw_submitted.png')} style={styles.checkImage}/>
				<Text style={styles.hintText}>{"恭喜您，实盘开户申请审核通过！"}</Text>

				<View style={{flex:1}}/>

				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={true}
						onPress={()=>this.gotoNext()}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text={'完成'} />
				</View>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
  checkImage:{
    marginTop: 65,
    width: 115,
    height: 115,
  },
  hintText:{
    marginTop: 51,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 15,
    color: '#000000',
  },
	bottomArea: {
		height: 72,
		backgroundColor: 'white',
		alignItems: 'flex-end',
		flexDirection:'row'
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
});


module.exports = OAReviewStatusPage;
