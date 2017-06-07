'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	ScrollView
} from 'react-native';

var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var OpenAccountHintBlock = require('./OpenAccountHintBlock')

var {height, width} = Dimensions.get('window')

var OAStartPage = React.createClass({
	propTypes: {
		onPop: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			onPop: ()=>{},
		}
	},

	gotoNext: function() {
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP0, TalkingdataModule.LABEL_OPEN_ACCOUNT);
		OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
	},

	getData: function(){
		return [];
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<ScrollView style={{flex: 1}}>
					<View style={{height:height/5*3}}>
						<View style={{flex: 1}} />
						<Text style={styles.text1}>开户前请准备好</Text>
						<Image style={styles.image} source={require('../../../images/icon1.png')}/>
						<Text style={styles.text2}>您的二代身份证，您必须年满18周岁</Text>
						<Image style={styles.image} source={require('../../../images/icon2.png')}/>
						<Text style={styles.text3}>{"有效的地址证明(以下其中的一项就行)\n居住证、户口本、房产证、宽带/水电煤/固话账单(近3个月内)、银行账单(近3个月内)、驾照"}</Text>
						<Image style={styles.image} source={require('../../../images/icon3.png')}/>
						<Text style={styles.text4}>{"开户需要上传图片等大流量数据，建议使用\nWIFI，4G或者3G网络"}</Text>
					</View>
					<OpenAccountHintBlock />
				</ScrollView>
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={true}
						onPress={this.gotoNext}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text='下一步' />
				</View>
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
	text1: {
		flex: 2,
		fontSize: 17,
		textAlign: 'center',
		paddingTop: 10,
	},
	text2: {
		flex: 2,
		fontSize: 14,
		textAlign: 'center',
		paddingTop: 10,
		marginLeft: 10,
		marginRight: 10,
	},
	text3: {
		flex: 3,
		fontSize: 14,
		textAlign: 'center',
		paddingTop: 10,
		marginLeft: 10,
		marginRight: 10,
	},
	text4: {
		flex: 2,
		fontSize: 14,
		textAlign: 'center',
		paddingTop: 10,
	},
	image: {
		alignSelf: 'center',
		width: 39,
		height: 39,
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


module.exports = OAStartPage;
