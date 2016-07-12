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

var OAReviewStatusPage = React.createClass({

	gotoNext: function() {
		this.props.navigator.popToTop();
	},

	render: function() {
		var startDate = new Date()
		startDate.Format('yy/MM/dd')
		var endDate = new Date(startDate.valueOf()+7*24*60*60*1000)
		return (
			<View style={styles.wrapper}>
				<View />
				<Text style={styles.text1}>感谢您开设Ayondo账户</Text>
				<View style={styles.rowWrapper}>
					<Image style={styles.image} source={require('../../../images/icon_review1.png')}/>
					<Image style={styles.image} source={require('../../../images/icon_review2.png')}/>
					<Image style={styles.image} source={require('../../../images/icon_review3.png')}/>
				</View>
				<View style={styles.rowWrapper}>
					<Text style={styles.text2}>{"提交申请\n"+startDate.Format('yy/MM/dd')+"\n"+startDate.Format('hh:mm:ss')}</Text>
					<Text style={styles.text2}>{"正在审核"}</Text>
					<Text style={styles.text2}>{"预计审核时间\n"+endDate.Format('yy/MM/dd')+"\n"+startDate.Format('hh:mm:ss')}</Text>
				</View>
				<Text style={styles.text3}>{"开户成功后，我们将以短信告知您的审核结果"}</Text>
				<Button style={styles.buttonArea}
					enabled={true}
					onPress={this.gotoNext}
					textContainerStyle={styles.buttonView}
					textStyle={styles.buttonText}
					text='返回首页' />
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
		justifyContent: 'space-around',
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
		paddingTop: 15,
		paddingBottom: 15,
	},
	image: {
		alignSelf: 'center',
		width: 31,
		height: 31,
	},

	buttonArea: {
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 16,
		borderRadius: 3,
	},
	buttonView: {
		height: 40,
		borderRadius: 3,
		backgroundColor: '#f36b6f',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
});


module.exports = OAReviewStatusPage;