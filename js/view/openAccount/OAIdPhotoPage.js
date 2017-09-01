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
	InteractionManager,
	ScrollView,
} from 'react-native';

var ImagePicker = require('react-native-image-picker');

var LogicData = require('../../LogicData')
var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var NetConstants = require('../../NetConstants');
var NetworkModule = require('../../module/NetworkModule')
var TalkingdataModule = require('../../module/TalkingdataModule')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var ErrorBar = require('../component/ErrorBar')
var OpenAccountUtils = require('./OpenAccountUtils')
var OpenAccountHintBlock = require('./OpenAccountHintBlock')
var {height, width} = Dimensions.get('window')

const ID_CARD_FRONT = 1
const ID_CARD_BACK = 2
const imageWidth = Math.round(width * 0.85)
const imageHeight = Math.round(height - 64 - 45 - 15 - 15 - 168 - 72) / 2

const GZT_Ayondo_Key_Mappings = [
	{"GZTKey": "real_name", "AyondoKey": "realName"},
	{"GZTKey": "gender", "AyondoKey": "gender"},
	{"GZTKey": "ethnic", "AyondoKey": "ethnic"},
	{"GZTKey": "id_code", "AyondoKey": "idCode"},
	{"GZTKey": "addr", "AyondoKey": "addr"},
	{"GZTKey": "issue_authority", "AyondoKey": "issueAuth"},
	{"GZTKey": "valid_period", "AyondoKey": "validPeriod"},
];

const defaultIDFront = require('../../../images/openAccountIDFront.jpg');
const defaultIDBack = require('../../../images/openAccountIDBack.jpg');
var options = {
	title: null, // specify null or empty string to remove the title
	cancelButtonTitle: '取消',
	takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
	chooseFromLibraryButtonTitle: '照片图库', // specify null or empty string to remove this button

	cameraType: 'back', // 'front' or 'back'
	mediaType: 'photo', // 'photo' or 'video'
	maxWidth: Math.round(imageWidth * 6), // photos only
	maxHeight: Math.round(imageHeight * 6), // photos only
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
	propTypes: {
		data: React.PropTypes.object,
		onPop: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			data: null,
			onPop: ()=>{},
		}
	},

	getInitialState: function() {
		var idCardFront = defaultIDFront;
		var idCardBack = defaultIDBack;
		var idCardFrontData = null;
		var idCardBackData = null;

		if(this.props.data && this.props.data.idCardFrontData){
			idCardFront = {uri: 'data:image/jpeg;base64,' + this.props.data.idCardFrontData};
			idCardFrontData = this.props.data.idCardFrontData;
		}
		if(this.props.data && this.props.data.idCardBackData){
			idCardBack = {uri: 'data:image/jpeg;base64,' + this.props.data.idCardBackData};
			idCardBackData = this.props.data.idCardBackData;
		}

		var nextEnabled = idCardFrontData != null && idCardBackData != null;
		return {
			idCardFront: idCardFront,
			idCardBack: idCardBack,
			idCardFrontData: idCardFrontData,
			idCardBackData: idCardBackData,
			error: null,
			nextEnabled: nextEnabled,
			validateInProgress: false,
		};
	},

	pressAddImage: function(idCardIndex) {
		var eventParam = {};
		eventParam[TalkingdataModule.KEY_TYPE] = (idCardIndex==ID_CARD_FRONT) ? "正面" : "反面";
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

					if(this.state.idCardBackData){
						this.setState({
							nextEnabled: true,
						});
					}
				} else if (idCardIndex == ID_CARD_BACK) {
					this.setState({
						idCardBack: source,
						idCardBackData: response.data,
					});

					if(this.state.idCardFrontData){
						this.setState({
							nextEnabled: true,
						});
					}
				}
			}
		});
	},

	gotoNext: function() {
		this.setState({
			nextEnabled: false,
			validateInProgress: true,
			error: null,
		})

		InteractionManager.runAfterInteractions(() => {
			if (this.state.idCardFrontData != null && this.state.idCardBackData != null) {
				var userData = LogicData.getUserData();
				NetworkModule.fetchTHUrl(
					NetConstants.CFD_API.ID_CARD_OCR,
					{
						method: 'POST',
						body: JSON.stringify({
							frontImg: this.state.idCardFrontData,
							frontImgExt: 'jpg',
							backImg: this.state.idCardBackData,
							backImgExt: 'jpg',
						}),
						headers: {
							'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
							'Content-Type': 'application/json; charset=utf-8',
						},
						showLoading: true,
					},
					(responseJson) => {
						this.setState({
							nextEnabled: true,
							validateInProgress: false,
						})

						if (responseJson.result == 0) {
							var dataList = OpenAccountUtils.getAyondoValuesFromGZTValue(responseJson);

							TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP2, TalkingdataModule.LABEL_OPEN_ACCOUNT)
							OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop, dataList);
						} else {
							console.log("ocr failed. error: " + JSON.stringify(decodeURIComponent(responseJson.message)))
							this.setState({
								error: "图片识别失败，请重新上传图片"
							});
						}
					},
					(result) => {
						this.setState({
							nextEnabled: true,
							validateInProgress: false,
							error: result.errorMessage
						});
					}
				)
			} else {
				TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP2, TalkingdataModule.LABEL_OPEN_ACCOUNT)
				OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
			}
		});
	},

	getData: function(){
		var idCardFrontData = null;
		var idCardBackData = null;

		if(this.state.idCardFront !== defaultIDFront){
			idCardFrontData = this.state.idCardFrontData;
		}
		if(this.state.idCardBack !== defaultIDBack){
			idCardBackData = this.state.idCardBackData;
		}

		return {
			idCardFrontData: idCardFrontData,
			idCardBackData: idCardBackData,
		};
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<ErrorBar error={this.state.error}/>
				<ScrollView style={{flex:1}}>
					<Text style={styles.reminderText}>
						请上传您的身份证正反面照片
					</Text>
					<TouchableOpacity style={styles.imageArea} onPress={() => this.pressAddImage(ID_CARD_FRONT)}>
						<Image style={styles.addImage} source={this.state.idCardFront}/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.imageArea} onPress={() => this.pressAddImage(ID_CARD_BACK)}>
						<Image style={styles.addImage} source={this.state.idCardBack}/>
					</TouchableOpacity>
					<View style={{backgroundColor: 'white', width:width,
						paddingLeft:15, paddingRight:15}}>
						<View style={{height: 40, justifyContent:'center'}}>
							<Text style={{}}>
							请拍摄身份证原件:
							</Text>
						</View>
						<View style={styles.separator}/>
						<Image source={require('../../../images/openAccountIDHint.jpg')} style={{height: 128, width:width - 30, resizeMode:'contain'}}/>
					</View>
					<OpenAccountHintBlock/>
				</ScrollView>
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={this.state.nextEnabled}
						onPress={this.gotoNext}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text={this.state.validateInProgress? "信息正在检查中...": '下一步'} />
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
		marginTop: 0,
		marginBottom: 15,
		borderRadius: 3,
		resizeMode: 'contain',
	},

	reminderText: {
		marginTop: 15,
		marginBottom: 15,
		textAlign: 'center',
		fontSize: 14,
	},

	reminderArea:{
		flex:1,
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
	errorText:{
		marginTop: 10,
		fontSize: 14,
		color: 'red',
		textAlign: 'center',
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
});


module.exports = OAIdPhotoPage;
