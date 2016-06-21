'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Image,
	Text,
	Dimensions,
} from 'react-native';

var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var {height, width} = Dimensions.get('window')

var OAIdPhotoPage = React.createClass({

	pressAddImage: function() {
		//todo
	},

	gotoNext: function() {
		//TODO, check
		this.props.navigator.push({
			name: MainPage.OPEN_ACCOUNT_ROUTE,
			step: 1,
		});
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<View style={{height: 15}} />
				<TouchableOpacity onPress={this.pressAddImage}>
					<View style={styles.imageArea}>
						<Image style={styles.addImage} source={require('../../../images/add_front.png')}/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.pressAddImage}>
					<View style={styles.imageArea}>
						<Image style={styles.addImage} source={require('../../../images/add_back.png')}/>
					</View>
				</TouchableOpacity>
				<Text style={styles.reminderText}>请保持身份证四边框清晰完整，背景干净
				</Text>
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
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},

	imageArea: {
		flex: 4,
		alignSelf: 'center',
		alignItems: 'center',
	},
	addImage: {
		width: width*0.85,
		height: height*0.3,
		marginTop: 10,
		marginBottom: 10,
		borderRadius: 3,
	},

	reminderText: {
		marginTop: 10,
		flex: 1,
		textAlign: 'center',
		fontSize: 14,
	},

	bottomArea: {
		height: 72, 
		backgroundColor: 'white',
		alignItems: 'flex-end',
		flexDirection:'row'
	},
	buttonArea: {
		backgroundColor: 'green',
		width: width*0.92,
		marginLeft: width*0.04,
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


module.exports = OAIdPhotoPage;