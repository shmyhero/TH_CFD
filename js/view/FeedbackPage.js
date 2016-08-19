'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Text,
	TextInput,
	Image,
	TouchableOpacity,
} from 'react-native';

var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var Button = require('./component/Button')
var MainPage = require('./MainPage')
var NativeSceneModule = require('../module/NativeSceneModule')
var ImagePicker = require('react-native-image-picker');

var {height, width} = Dimensions.get('window')
var imageSize = width >= 375 ? 65 : Math.floor(width/5-10)
var add_image = require("../../images/feedback_add.png")

var FeedbackPage = React.createClass({
	getInitialState: function() {
		return {
			commitButtonEnabled: true,
			text: '',
			phoneNumber: '',
			imagesSource: [add_image],
		};
	},


	pressBackButton: function() {
		this.props.showTabbar()
		this.props.navigator.pop()
	},

	pressCommitButton: function() {
		//todo
	},

	pressAddImage: function(index) {
		//todo
	},

	render: function() {
		var images = this.state.imagesSource.map(
			(source, i) =>
				<TouchableOpacity onPress={() => this.pressAddImage(i)} key={i}>
					<View style={styles.imageArea}>
						<Image style={styles.image} source={source}/>
					</View>
				</TouchableOpacity>
			)
		var limit = 240
    	var remainder = limit - this.state.text.length;
		return (
			<View style={styles.wrapper}>
				<NavBar title='产品反馈'
					showBackButton={true}
					backButtonOnClick={this.pressBackButton}
					textOnRight='提交'
					rightTextOnClick={this.pressCommitButton}
					navigator={this.props.navigator}/>
				<TextInput style={styles.textInput}
					autoCapitalize="none"
					multiline={true}
					maxLength={limit} 
					onChangeText={(text) => {this.setState({text});}}
					value={this.state.text}/>
				<View style={styles.rowWrapper}>
					{images}
				</View>
				<Text style={styles.wordNumberText}>{remainder}</Text>
				<View style={[styles.rowWrapper, {backgroundColor: 'white', flex: 0.3}]}>
					<Text style={styles.phoneText}>手机号</Text>
					<TextInput style={styles.phoneTextInput}
						multiline={false}
						maxLength={11}
						placeholder={'选填，便于我们给你答复'}
						onChangeText={(phoneNumber) => {this.setState({phoneNumber});}}>
					</TextInput>
				</View>
				<View style={{flex:2}}/>
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
	textInput: {
		flex: 1,
		padding: 15,
		marginTop: 8,
	},
	rowWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
	},
	image: {
		width: imageSize,
		height: imageSize,
		marginRight: 5,
	},
	wordNumberText: {
		flex: 0.3,
		paddingRight: 15,
		marginTop: 10,
		// borderWidth: 1,
		textAlign: 'right',
		color: '#888888',
		fontSize: 14,
	},
	phoneText: {
		flex: 1,
		fontSize: 14,
		color: '#7f7f7f',
	},
	phoneTextInput:{
		flex: 1,
		fontSize: 14,
		textAlign: 'right',
		color: '#3f3f3f',
	}
});


module.exports = FeedbackPage;