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

var {height, width} = Dimensions.get('window')

var OAStartPage = React.createClass({

	gotoNext: function() {
		this.props.navigator.push({
			name: MainPage.OPEN_ACCOUNT_ROUTE,
			step: 1,
		});
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<View style={{flex: 1}} />
				<Text style={styles.text1}>开户前请准备好</Text>
				<Image style={styles.image} source={require('../../../images/icon1.png')}/>
				<Text style={styles.text2}>准备好您的二代身份证，您必须年满18周岁</Text>
				<Image style={styles.image} source={require('../../../images/icon2.png')}/>
				<Text style={styles.text3}>{"开户需要上传图片等大流量数据，建议使用\nWIFI，4G或者3G网络"}</Text>
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
	},
	text3: {
		flex: 7,
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
		backgroundColor: 'green',
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 16,
		borderRadius: 3,
	},
	buttonView: {
		height: 40,
		borderRadius: 3,
		backgroundColor: '#4567a4',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
});


module.exports = OAStartPage;