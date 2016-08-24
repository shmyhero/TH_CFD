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
	Alert,
	ScrollView,
} from 'react-native';

var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var NavBar = require('./NavBar')
var Button = require('./component/Button')
var MainPage = require('./MainPage')
var NativeSceneModule = require('../module/NativeSceneModule')
var ImagePicker = require('react-native-image-picker');
var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')

var {height, width} = Dimensions.get('window')
var scrollHeight = height - UIConstants.HEADER_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER
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
	maxWidth: Math.floor(width), // photos only
	maxHeight: Math.floor(height), // photos only
	aspectX: 3, // android only - aspectX:aspectY, the cropping image's ratio of width to height
	aspectY: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
	quality: 0.7, // 0 to 1, photos only
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
			imagesData: [],
		};
	},

	componentWillMount: function() {
		imageNumber = 0
		if(this.props.phone !== undefined) {
			this.setState({
				phoneNumber: this.props.phone,
			})
		}
	},

	pressBackButton: function() {
		this.props.showTabbar()
		this.props.navigator.pop()
	},

	pressCommitButton: function() {
		if(this.state.text.length == 0) {
			Alert.alert('', '反馈内容不能为空');
			return
		}

		var userData = LogicData.getUserData()
		var url = NetConstants.FEEDBACK_API
		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=utf-8',
				},
				body: JSON.stringify({
					text: this.state.text,
					phone: this.state.phoneNumber,
					photos: this.state.imagesData,
				}),
				showLoading: true,
			},
			(responseJson) => {
				Alert.alert('提交成功', '感谢你的反馈',
					[{text:'确定', onPress: ()=>this.pressBackButton()}]);
			},
			(errorMessage) => {
				Alert.alert('', errorMessage);
			}
		)
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
				const source = {uri: 'data:image/jpeg;base64,' + response.data};

				if (index === imageNumber && imageNumber < MaxImageNumber-1) {
					// last one, can add 1 more
					this.state.imagesSource.splice(index, 0, source)
					imageNumber += 1
					this.state.imagesData.splice(index, 0, response.data)
				}
				else {
					// replace this one
					this.state.imagesSource.splice(index, 1, source)
					if(imageNumber === MaxImageNumber - 1) {
						imageNumber += 1
						this.state.imagesData.splice(index, 0, response.data)
					}
					else {
						this.state.imagesData.splice(index, 1, response.data)
					}
				}
				this.setState({
					imagesSource: this.state.imagesSource,
					imagesData: this.state.imagesData,
				})
			}
		});
	},

	pressDeleteImage: function(index) {
		this.state.imagesSource.splice(index, 1)
		if(imageNumber === MaxImageNumber) {
			// add the add button back
			this.state.imagesSource.splice(imageNumber-1, 0, add_image)
		}
		imageNumber -=  1
		this.state.imagesData.splice(index, 1)

		this.setState({
			imagesSource: this.state.imagesSource,
			imagesData: this.state.imagesData,
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
					enableRightText={this.state.text.length>0}
					navigator={this.props.navigator}/>
				<ScrollView style={styles.scrollWrapper}
					contentContainerStyle={styles.scrollWrapper}>
					  <TextInput style={styles.textInput}
							autoCapitalize="none"
							multiline={true}
							maxLength={limit}
							placeholder={'请描述您的问题'}
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
							keyboardType='numeric'
							onChangeText={(phoneNumber) => {this.setState({phoneNumber});}}
							value={this.state.phoneNumber}>
						</TextInput>
					</View>
					<View style={{flex:2}}/>
					</ScrollView>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: width,
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
	scrollWrapper: {
		height:scrollHeight ,
	},
	textInput: {
		fontSize: 17,
		flex: 1,
		padding: 15,
		marginTop: 0,
		backgroundColor:'transparent',
		textAlignVertical:'top',
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
		marginTop:10,
		marginRight: 5,
	},
	wordNumberText: {
		flex: 0.3,
		marginRight: 15,
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
		flex: 1.5,
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
