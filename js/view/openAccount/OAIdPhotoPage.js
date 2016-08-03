'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Image,
	Text,
	Dimensions,
	Alert,
} from 'react-native';

var ImagePicker = require('react-native-image-picker');

var LogicData = require('../../LogicData')
var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var NetConstants = require('../../NetConstants');
var NetworkModule = require('../../module/NetworkModule')
var TalkingdataModule = require('../../module/TalkingdataModule')
var {height, width} = Dimensions.get('window')

const ID_CARD_FRONT = 1
const ID_CARD_BACK = 2
const imageWidth = Math.round(width * 0.85)
const imageHeight = Math.round(height * 0.3)

var options = {
	title: null, // specify null or empty string to remove the title
	cancelButtonTitle: '取消',
	takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
	chooseFromLibraryButtonTitle: '照片图库', // specify null or empty string to remove this button

	cameraType: 'back', // 'front' or 'back'
	mediaType: 'photo', // 'photo' or 'video'
	maxWidth: imageWidth * 3, // photos only
	maxHeight: imageHeight * 3, // photos only
	aspectX: 3, // android only - aspectX:aspectY, the cropping image's ratio of width to height
	aspectY: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
	quality: 1, // 0 to 1, photos only
	angle: 0, // android only, photos only
	allowsEditing: false, // Built in functionality to resize/reposition the image after selection
	noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
	storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
		skipBackup: true, // ios only - image will NOT be backed up to icloud
		path: 'images' // ios only - will save image at /Documents/images rather than the root
	},
};

var OAIdPhotoPage = React.createClass({

	getInitialState: function() {
		return {
			idCardFront: require('../../../images/add_front.png'),
			idCardBack: require('../../../images/add_back.png'),
			idCardFrontData: null,
			idCardBackData: null,
		};
	},

	pressAddImage: function(idCardIndex) {
		var eventParam = (idCardIndex==ID_CARD_FRONT) ? {"类型":"正面"} : {"类型":"反面"}
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_UPLOAD_ID_IMAGE, TalkingdataModule.LABEL_OPEN_ACCOUNT, eventParam)
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				TalkingdataModule.trackEvent(TalkingdataModule.LIVE_UPLOAD_ID_IMAGE_CANCEL, TalkingdataModule.LABEL_OPEN_ACCOUNT, eventParam)
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else {
				// You can display the image using either data:
				const source = {uri: 'data:image/jpeg;base64,' + response.data};

				if (idCardIndex == ID_CARD_FRONT) {
					this.setState({
						idCardFront: source,
						idCardFrontData: response.data,
					});
				} else if (idCardIndex == ID_CARD_BACK) {
					this.setState({
						idCardBack: source,
						idCardBackData: response.data,
					});
				}
			}
		});
	},

	gotoNext: function() {
		if (this.state.idCardFrontData != null && this.state.idCardBackData != null) {
			NetworkModule.fetchTHUrl(
				NetConstants.GZT_OCR_CHECK_API,
				{
					method: 'POST',
					body: JSON.stringify({
						accessId: 'shmhxx',
						accessKey: 'SHMHAKQHSA',
						frontImg: this.state.idCardFrontData,
						frontImgExt: 'jpg',
						backImg: this.state.idCardBackData,
						backImgExt: 'jpg',
					}),
					showLoading: true,
				},
				(responseJson) => {
					if (responseJson.result == 0) {
						LogicData.setCertificateIdCardInfo(responseJson)

						TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP2, TalkingdataModule.LABEL_OPEN_ACCOUNT)
						this.props.navigator.push({
							name: MainPage.OPEN_ACCOUNT_ROUTE,
							step: 2,
						});
					} else {
						Alert.alert('', decodeURIComponent(responseJson.message));
					}
				},
				(errorJson) => {
					Alert.alert('', decodeURIComponent(errorJson.message));
				}
			)
		} else {
			TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP2, TalkingdataModule.LABEL_OPEN_ACCOUNT)
			this.props.navigator.push({
				name: MainPage.OPEN_ACCOUNT_ROUTE,
				step: 2,
			});
		}
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<View style={{height: 15}} />
				<TouchableOpacity onPress={() => this.pressAddImage(ID_CARD_FRONT)}>
					<View style={styles.imageArea}>
						<Image style={styles.addImage} source={this.state.idCardFront}/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => this.pressAddImage(ID_CARD_BACK)}>
					<View style={styles.imageArea}>
						<Image style={styles.addImage} source={this.state.idCardBack}/>
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
		width: imageWidth,
		height: imageHeight,
		marginTop: 10,
		marginBottom: 10,
		borderRadius: 3,
		resizeMode: 'contain',
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
		flex: 1,
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


module.exports = OAIdPhotoPage;
