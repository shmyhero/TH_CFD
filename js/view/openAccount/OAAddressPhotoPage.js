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
	TextInput,
	ScrollView,
	Keyboard,
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
var OpenAccountHintBlock = require('./OpenAccountHintBlock')
// var OpenAccountUtils = require('./OpenAccountUtils')
var {height, width} = Dimensions.get('window')

const imageWidth = Math.round(width * 0.85)
const imageHeight = Math.round(height * 0.3)

var SCROLL_VIEW = "scrollView";
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
		var addressText = "";

		if(this.props.data){
			if(this.props.data.addressPhotoData){
				addressPhoto = {uri: 'data:image/jpeg;base64,' + this.props.data.addressPhotoData};
				addressPhotoData = this.props.data.addressPhotoData;
			}

			if(this.props.data.values){
				for(var i = 0; i < this.props.data.values.length; i++ ){
					if(this.props.data.values[i].key === "addr"){
						addressText = this.props.data.values[i].value;
					}
				}
			}
		}

		return {
			addressPhoto: addressPhoto,
			addressPhotoData: addressPhotoData,
			addressText: addressText,
			error: null,
			validateInProgress: false,
			isProcessing: false,
		};
	},

	componentWillMount: function(){
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	},

	componentWillUnmount: function(){
		this.keyboardDidHideListener.remove();
	},

	_keyboardDidHide: function(){
		this.refs[SCROLL_VIEW] && this.refs[SCROLL_VIEW].scrollTo({y:0})
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
				});
			}
		});
	},

	gotoNext: function() {
		this.setState({
			isProcessing: true,
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
							isProcessing: false,
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
							isProcessing: false,
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
		var addressText = null;
		if(this.state.addressPhoto !== defaultAddressPhoto){
			addressPhotoData = this.state.addressPhotoData;
		}

		if(this.state.addressText !== ""){
			addressText = this.state.addressText;
		}

		return {
			addressPhotoData: addressPhotoData,
			values: [{"key":"addr","value":addressText}],
		};
	},

	textInputChange: function(text){
		this.setState({
			addressText: text,
		})
	},

	render: function() {
		var nextEnabled = this.state.addressPhotoData != null && this.state.addressText!= null && this.state.addressText != "";

		return (
			<View style={styles.wrapper}>
				<ErrorBar error={this.state.error}/>
				<ScrollView style={{flex:1}} ref={SCROLL_VIEW}>
					<View style={styles.container}>
						<Text style={styles.hintText}>请上传以下任意一种与身份证名字一致的图片：</Text>
						<TouchableOpacity style={styles.imageArea} onPress={() => this.pressAddImage()}>
							<Image style={styles.addImage} source={this.state.addressPhoto}/>
						</TouchableOpacity>
						<View style={styles.reminderArea}>
							<Text style={styles.hintText}>有效的地址证明包含：</Text>
		  					<Text style={styles.reminderText}>• <Text style={styles.highlight}>居住证、户口本、房产证</Text></Text>
		  					<Text style={styles.reminderText}>• <Text style={styles.highlight}>宽带/水电煤/固话账单(近3个月内)</Text></Text>
		  					<Text style={styles.reminderText}>• <Text style={styles.highlight}>银行账单(近3个月内)</Text></Text>
		  					<Text style={styles.reminderText}>• <Text style={styles.highlight}>驾照</Text></Text>
						</View>
						<Text style={styles.hintText}>输入的地址必须与上传图片中的地址保持一致！</Text>
						<TextInput style={styles.inputText}
							autoCapitalize="none"
							autoCorrect={false}
							defaultValue={this.state.addressText}
							multiline={false}
							numberOfLines={3}
							maxLength={50}
							selectionColor={ColorConstants.INOUT_TEXT_SELECTION_COLOR}
							underlineColorAndroid='transparent'
							onChangeText={(text)=>this.textInputChange(text)}
							/>
					</View>
					<OpenAccountHintBlock />
				</ScrollView>
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={nextEnabled && !this.state.isProcessing}
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

	container: {
		marginTop: 15,
    marginLeft: width*0.09,
    marginRight: width*0.09,
		flex: 1,
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
    marginBottom: 10,
		justifyContent: 'center',
		//alignItems: 'center',
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
	},
	hintText:{
		fontSize: 12,
		color: "#6c6c6c",
	},
	inputText:{
		textAlign: 'left',
		marginTop: 10,
		marginBottom: 10,
		borderRadius:3,
		height: 49,
		fontSize: 15,
		backgroundColor:'white',
	}
});


module.exports = OAAddressPhotoPage;
