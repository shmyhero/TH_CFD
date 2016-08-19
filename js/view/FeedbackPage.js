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
const add_image = require("../../images/feedback_add.png")
const delete_image = require("../../images/close.png")
const MaxImageNumber = 5

const Options = {
	title: null, // specify null or empty string to remove the title
	cancelButtonTitle: '取消',
	takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
	chooseFromLibraryButtonTitle: '照片图库', // specify null or empty string to remove this button

	cameraType: 'back', // 'front' or 'back'
	mediaType: 'photo', // 'photo' or 'video'
	maxWidth: width, // photos only
	maxHeight: height, // photos only
	aspectX: 3, // android only - aspectX:aspectY, the cropping image's ratio of width to height
	aspectY: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
	quality: 0.8, // 0 to 1, photos only
	angle: 0, // android only, photos only
	allowsEditing: false, // Built in functionality to resize/reposition the image after selection
	noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
	storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
		skipBackup: true, // ios only - image will NOT be backed up to icloud
		path: 'images' // ios only - will save image at /Documents/images rather than the root
	},
};

var imageNumber = 0

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
		ImagePicker.showImagePicker(Options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else {
				// You can display the image using either data:
				const source = {uri: 'data:image/jpeg;base64,' + response.data};

				if (index === imageNumber && imageNumber < MaxImageNumber) {
					// last one, can add 1 more
					this.state.imagesSource.splice(index, 0, source)
					imageNumber += 1
				}
				else {
					// replace this one
					this.state.imagesSource.splice(index, 1, source)
				}
				this.setState({
					imagesSource: this.state.imagesSource,
				})
			}
		});
	},

	pressDeleteImage: function(index) {
		this.state.imagesSource.splice(index, 1)
		imageNumber -=  1

		this.setState({
			imagesSource: this.state.imagesSource,
		})
	},

	renderDeleteButton: function(index){
		if(index < imageNumber) {
			return (
				<TouchableOpacity onPress={() => this.pressDeleteImage(index)} style={styles.deletaImageArea}>
					<Image style={styles.deleteImage} source={delete_image}/>
				</TouchableOpacity>
			);
		}
	},

	render: function() {
		var images = this.state.imagesSource.map(
			(source, i) =>
				<TouchableOpacity onPress={() => this.pressAddImage(i)} key={i}>
					<View>
						<Image style={styles.image} source={source}>
						{this.renderDeleteButton(i)}
						</Image>
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
	},
	deletaImageArea: {
		width: 28,
		height: 28,
		alignSelf: 'flex-end',
		overflow: 'hidden',
	},
	deleteImage: {
		width: 20,
		height: 20,
		alignSelf: 'flex-end',
	},
});


module.exports = FeedbackPage;