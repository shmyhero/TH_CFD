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
} from 'react-native';

var ImagePicker = require('react-native-image-picker');

var LogicData = require('../../LogicData')
var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var NetConstants = require('../../NetConstants');
var NetworkModule = require('../../module/NetworkModule')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var ErrorBar = require('../component/ErrorBar')
// var OpenAccountUtils = require('./OpenAccountUtils')
var {height, width} = Dimensions.get('window')

const imageWidth = Math.round(width * 0.85)
const imageHeight = Math.round(height * 0.3)

// const GZT_Ayondo_Key_Mappings = [
// 	{"GZTKey": "real_name", "AyondoKey": "realName"},
// 	{"GZTKey": "gender", "AyondoKey": "gender"},
// 	{"GZTKey": "ethnic", "AyondoKey": "ethnic"},
// 	{"GZTKey": "id_code", "AyondoKey": "idCode"},
// 	{"GZTKey": "addr", "AyondoKey": "addr"},
// 	{"GZTKey": "issue_authority", "AyondoKey": "issueAuth"},
// 	{"GZTKey": "valid_period", "AyondoKey": "validPeriod"},
// ];

const defaultAddressPhoto = require('../../../images/add_photo.png');

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

var OAAddressPhotoPage = React.createClass({
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
		var addressPhotoData = null;
    var addressPhoto = defaultAddressPhoto;

		if(this.props.data && this.props.data.addressPhotoData){
			addressPhoto = {uri: 'data:image/jpeg;base64,' + this.props.data.addressPhotoData};
			addressPhotoData = this.props.data.addressPhotoData;
		}

		var nextEnabled = addressPhotoData != null;
		return {
			addressPhoto: addressPhoto,
			addressPhotoData: addressPhotoData,
			error: null,
			nextEnabled: nextEnabled,
			validateInProgress: false,
		};
	},

	pressAddImage: function() {
		ImagePicker.showImagePicker(options, (response) => {
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

				this.setState({
					addressPhoto: source,
					addressPhotoData: response.data,
					nextEnabled: true,
				});
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
			if (this.state.addressPhotoData != null) {
				var userData = LogicData.getUserData();

				NetworkModule.fetchTHUrl(
					NetConstants.CFD_API.UPLOAD_ADDRESS_PHOTO,
					{
						method: 'POST',
						body: JSON.stringify({
							imageBase64: this.state.addressPhotoData,
							text: 'jpg',
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

						if (responseJson.success) {
							// var dataList = OpenAccountUtils.getAyondoValuesFromGZTValue(responseJson);
							OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
						} else {
							console.log("upload address photo failed. error: " + JSON.stringify(decodeURIComponent(responseJson.message)))
							this.setState({
								error: "图片上传失败，请重新上传图片"
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
				OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
			}
		});
	},

	getData: function(){
		var addressPhotoData = null;

		if(this.state.addressPhoto !== defaultAddressPhoto){
			addressPhotoData = this.state.addressPhotoData;
		}

		return {
			addressPhotoData: addressPhotoData,
		};
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<ErrorBar error={this.state.error}/>
				<View style={{height: 15}} />
				<TouchableOpacity style={styles.imageArea} onPress={() => this.pressAddImage()}>
					<Image style={styles.addImage} source={this.state.addressPhoto}/>
				</TouchableOpacity>
				<View style={styles.reminderArea}>
					<Text style={styles.reminderText}>有效的地址信息包含：</Text>
  					<Text style={styles.reminderText}>• <Text style={styles.highlight}>居住证、户口本、房产证</Text></Text>
  					<Text style={styles.reminderText}>• <Text style={styles.highlight}>宽带/水电煤/固定电话账单（近3个月）</Text></Text>
  					<Text style={styles.reminderText}>• <Text style={styles.highlight}>银行账单（近3个月）</Text></Text>
  					<Text style={styles.reminderText}>• <Text style={styles.highlight}>驾照</Text></Text>
  				<Text style={styles.reminderText}>您只需上传其中一种有效的地址证明照片，上传的照片信息必须与本人身份证保持一致，以免产生不必要的交易风险。</Text>
				</View>
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
		textAlign: 'left',
		fontSize: 14,
    lineHeight: 18,
    marginTop: 8,
	},

  highlight: {
    fontSize: 16,
		color: ColorConstants.TITLE_BLUE_LIVE,
	},

	reminderArea:{
    paddingTop: 10,
    margin: width*0.09,
		flex:3,
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
	}
});


module.exports = OAAddressPhotoPage;
