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
	ListView,
	Keyboard,
	TextInput,
	Platform
} from 'react-native';

import Picker from 'react-native-picker';

import DatePicker from 'react-native-datepicker'
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
var Spinner = require('react-native-spinkit');
var LS = require("../../LS")

const ID_CARD_FRONT = 1
const ID_CARD_BACK = 2
const imageWidth = Math.round(width * 0.4)
const imageHeight = imageWidth

var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)

var rowTitleWidth = (width - (2 * rowPadding)) / 4;
var rowValueWidth = (width - (2 * rowPadding)) / 4 * 3;

const DEFAULT_ERROR = "身份一致性验证失败";
const SCROLL_VIEW = "scrollView"

const GZT_Ayondo_Key_Mappings = [
	{"GZTKey": "real_name", "AyondoKey": "realName"},
	{"GZTKey": "gender", "AyondoKey": "gender"},
	{"GZTKey": "ethnic", "AyondoKey": "ethnic"},
	{"GZTKey": "id_code", "AyondoKey": "idCode"},
	{"GZTKey": "addr", "AyondoKey": "addr"},
	{"GZTKey": "issue_authority", "AyondoKey": "issueAuth"},
	{"GZTKey": "valid_period", "AyondoKey": "validPeriod"},
];

const defaultIDFront = require('../../../images/openAccountIDFront.png');
const defaultIDBack = require('../../../images/openAccountIDBack.png');
var options = {
	title: null, // specify null or empty string to remove the title

	cameraType: 'back', // 'front' or 'back'
	mediaType: 'photo', // 'photo' or 'video'
	maxWidth: Math.round(imageWidth * 12), // photos only
	maxHeight: Math.round(imageHeight * 12), // photos only
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

const GenderTranslater = [
	{"value":true, "displayText": "GENDER_MALE"},
	{"value":false, "displayText": "GENDER_FEMALE"},
] 

var defaultRawData = [
	{"title":"OPEN_ACCOUNT_LAST_NAME", "key": "lastName", "value":"", hint:"OPEN_ACCOUNT_LAST_NAME_HINT", maxLength: 50, "ignoreInRegistery": true},	//TODO: add ignoreInRegistery when API is avaliable.
	{"title":"OPEN_ACCOUNT_FIRST_NAME", "key": "firstName", "value":"", hint:"OPEN_ACCOUNT_FIRST_NAME_HINT", maxLength: 50, "ignoreInRegistery": true},
	{"title":"OPEN_ACCOUNT_GENDER", "key": "gender", "value":"", hint: "PRESS_TO_CHOOSE", "type": "choice", "choices": GenderTranslater},
	//{"title":"出生日期", "key": "birthday", "value":"", hint: "PRESS_TO_CHOOSE", "type": "date"},
	//{"title":"民族", "key": "ethnic", "value":"", hint:"请输入民族", maxLength: 10,},
	{"title":"OPEN_ACCOUNT_ID_CODE", "key": "idCode", "value":"", hint:"OPEN_ACCOUNT_ID_CODE_HINT", maxLength: 18, minLength: 18, "ignoreInRegistery": true},
	{"title":"OPEN_ACCOUNT_ID_ADDR", "key": "addr", "value":"", hint:"OPEN_ACCOUNT_ID_ADDR_HINT", maxLength:75, maxLine: 2},
	//{"title":"签发机关", "key": "issueAuth", hint:"请输入签发机关", "value":""},
	//{"title":"有效期限", "key": "validPeriod", "value":"", "type": "datePeriod"},
];

var OAIdPhotoPage = React.createClass({
	propTypes: {
		data: React.PropTypes.object,
		onPop: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			data: {},
			onPop: ()=>{},
		}
	},

	listRawData: [],
	
	ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 }),

	componentWillMount: function(){
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	},

	componentWillUnmount: function(){
		this.keyboardDidHideListener.remove();
	},

	_keyboardDidHide: function(){
		this.refs[SCROLL_VIEW] && this.refs[SCROLL_VIEW].scrollTo({y:0})
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

		this.listRawData = JSON.parse(JSON.stringify(defaultRawData));

		if (this.props.data && this.props.data.listData) {
			OpenAccountUtils.getPageListRawDataFromData(this.listRawData, this.props.data.listData);

			var routes = this.props.navigator.getCurrentRoutes();
			var lastRoute = routes[routes.length-1];
			if(lastRoute){
				console.log("lastRoute: " + JSON.stringify(lastRoute));
				if(lastRoute.isNext){
					console.log("getInitialState!");
					OpenAccountRoutes.setCurrentRouteStateAsLatest(this.props.navigator, this.listRawData);
				}
			}
		}

		var nextEnabled = idCardFrontData != null && idCardBackData != null && this.props.data.listData != null;
		return {
			idCardFront: idCardFront,
			idCardBack: idCardBack,
			idCardFrontData: idCardFrontData,
			idCardBackData: idCardBackData,

			error: null,
			nextEnabled: nextEnabled,
			showList: this.props.data.listData != null,
			dataSource: this.ds.cloneWithRows(this.listRawData),
			selectedPicker: -1,
			isImageUploading: false,
			validateInProgress: false,
		};
	},

	pressAddImage: function(idCardIndex) {
		if(!this.state.isImageUploading){
			var eventParam = {};
			eventParam[TalkingdataModule.KEY_TYPE] = (idCardIndex==ID_CARD_FRONT) ? "正面" : "反面";
			TalkingdataModule.trackEvent(TalkingdataModule.LIVE_UPLOAD_ID_IMAGE, TalkingdataModule.LABEL_OPEN_ACCOUNT, eventParam)
	
			options.cancelButtonTitle = LS.str("QX")
			options.takePhotoButtonTitle = LS.str("OPEN_ACCOUNT_TAKE_PICTURE")
			options.chooseFromLibraryButtonTitle = LS.str("OPEN_ACCOUNT_LIBRARY")		
	
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
	
					this.listRawData = [],
					this.setState({						
						showList: false,
					});

					if (idCardIndex == ID_CARD_FRONT) {
						this.setState({
							idCardFront: source,
							idCardFrontData: response.data,
						}, ()=>{
							if(this.state.idCardFrontData && this.state.idCardBackData){
								this.uploadImage();
							}
						});
					} else if (idCardIndex == ID_CARD_BACK) {
						this.setState({
							idCardBack: source,
							idCardBackData: response.data,
						}, ()=>{
							if(this.state.idCardFrontData && this.state.idCardBackData){
								this.uploadImage();
							}
						});
					}
				}
			});
		}		
	},

	uploadImage: function(){
		this.setState({
			isImageUploading: true,
			nextEnabled: false,
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
							isImageUploading: false,
						})

						if (responseJson.result == 0) {
							var dataList = OpenAccountUtils.getAyondoValuesFromGZTValue(responseJson);
							
							this.setListData(dataList);
							//TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP2, TalkingdataModule.LABEL_OPEN_ACCOUNT)
							//OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop, dataList);
						} else {
							console.log("ocr failed. error: " + JSON.stringify(decodeURIComponent(responseJson.message)))
							this.setState({
								error: LS.str("OPEN_ACCOUNT_OCR_FAILED")
							});
						}
					},
					(result) => {
						this.setState({
							//nextEnabled: true,
							isImageUploading: false,
							error: result.errorMessage
						});
					}
				)
			} else {
				//TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP2, TalkingdataModule.LABEL_OPEN_ACCOUNT)
				//OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);

				this.setState({
					showList: true,
				});
			}
		});
	},

	gotoNext: function() {
		//GZT validation.
		if(this.checkValues()){
			this.setState({
				validateInProgress: true,
				error: null,
			})

			var verifyBody = {};
			for(var i = 0; i< this.listRawData.length; i++){
				if(this.listRawData[i].ignoreInRegistery){
					var key = this.listRawData[i].key
					if(this.listRawData[i].key == "idCode"){
						key = "userId";
					}
					verifyBody[key] = this.listRawData[i].value;
				}
			}

			var userData = LogicData.getUserData()
		 	var notLogin = Object.keys(userData).length === 0
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.ID_CHECK,
				{
					method: 'POST',
					body: JSON.stringify(verifyBody),
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=utf-8',
					},
					showLoading: true,
				},
				(responseJson) => {
					if(responseJson.result == 0){
						TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP3, TalkingdataModule.LABEL_OPEN_ACCOUNT);
						OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
					}else{
						if(responseJson.message){
							var errorMessage = decodeURIComponent(responseJson.message);
							console.log("ID validation failed. Error: " + errorMessage);
							var idData = null;
							for(var i = 0; i< this.listRawData.length; i++){
								if(this.listRawData[i].key == "idCode"){
									idData = this.listRawData[i];
								}
							}
							if(errorMessage.contains("库中无此号")){
								idData.error = "身份证号码不存在";
							}
						}
						this.setState({
							error: decodeURIComponent(DEFAULT_ERROR),
							validateInProgress: false,
						})
					}
				},
				(result) => {
					this.setState({
						error: DEFAULT_ERROR,
						validateInProgress: false,
					})
				}
			);

		}
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

		var retData = {}
		retData.listData = OpenAccountUtils.getDataFromPageListRawData(this.listRawData);

		if(Object.keys(retData.listData).length > 0){
			this.setState({
				showList: true
			});
		}

		retData.idCardFrontData = idCardFrontData;
		retData.idCardBackData = idCardBackData;	

		return retData;
	},

	setListData: function(dataList){
		this.listRawData = JSON.parse(JSON.stringify(defaultRawData));		
		if (dataList) {
			OpenAccountUtils.getPageListRawDataFromData(this.listRawData, dataList);
		}

		var nextEnabled = OpenAccountUtils.canGoNext(this.listRawData);
		this.setState({
			nextEnabled: nextEnabled,
			showList: true,
		})
	},
	
	onDismiss: function(){
		this.hidePicker();
	},

	textInputChange: function(text, rowID) {
		this.listRawData[rowID].value = text;
		this.listRawData[rowID].error = null;
		this.setState({
			error: null,
		})
		this.updateList();
	},

	textInputEndChange: function(event, rowID){
		if(this.listRawData[rowID].value && this.listRawData[rowID].value.length > 0){
			this.listRawData[rowID].checked = true;
			if(this.listRawData[rowID].key === "idCode"){
				this.checkIDCode(rowID);
			}
		}
	},

	checkValues: function(){
		var valid = true;
		for(var rowID = 0; rowID < this.listRawData.length; rowID++){
			if(this.listRawData[rowID].key === "idCode"){
				valid = this.checkIDCode(rowID);
			}
		}
		return valid;
	},

	checkIDCode: function(rowID){
		if(this.listRawData[rowID].value.length < 18){
			this.listRawData[rowID].error = "请输入" + this.listRawData[rowID].minLength + "位身份证号";
			this.updateList();
			return false;
		}else{
			this.listRawData[rowID].error = null;
			this.updateList();
			return true;
		}
	},

	onPressPicker: function(rowData,rowID) {
		this.setState({
			selectedPicker: rowID,
		})

		var selectedText = "";
		var choices = [];
		for(var i = 0; i < rowData.choices.length; i++){
			if(rowData.value === rowData.choices[i].value){
				selectedText = LS.str(rowData.choices[i].displayText);
			}
			choices.push(LS.str(rowData.choices[i].displayText));
		}

		Picker.init({
			pickerData: choices,
			selectedValue: [selectedText],
					pickerTitleText: "",
					pickerConfirmBtnColor: [25,98,221,1],
					pickerCancelBtnColor: [25,98,221,1],
			onPickerConfirm: data => {
						if(data[0] === ""){
							rowData.value = rowData.choices[0].value;
						}else{
							for(var i = 0; i < rowData.choices.length; i++){
								if(data[0] === LS.str(rowData.choices[i].displayText)){
									rowData.value = rowData.choices[i].value;
								}
							}
						}
						this.setState({
							dataSource: this.ds.cloneWithRows(this.listRawData),
							selectedPicker: -1,
						})
			},
					onPickerCancel: ()=>{
						this.setState({
							selectedPicker: -1,
						})
					}
		});
		Picker.show();
	},

	hidePicker: function(){
		Picker.isPickerShow(show => {
			if(show){
				Picker.hide();
				this.setState({
					selectedPicker: -1,
				})
			}
		});
	},

	onDateTimeSelect: function(rowID, value) {
		if (rowID>= 0) {
			console.log("onDatePikcerSelect: " + value);
			this.listRawData[rowID].value = value;

			this.updateList();
		}
	},

	onStartDateSelect: function(rowID, value) {
		if (rowID >= 0) {
			var dateInfo = this.parseStartEndDate(this.listRawData[rowID].value);
			this.listRawData[rowID].value = value + "-" + dateInfo.endDate;
			this.updateList();
		}
	},

	onEndDateSelect: function(rowID, value) {
		if (rowID >= 0) {
			var dateInfo = this.parseStartEndDate(this.listRawData[rowID].value);
			this.listRawData[rowID].value = dateInfo.startDate + "-" + value;
			this.updateList();
		}
	},

	parseStartEndDate: function(period){
		var dateArray = period.split("-");
		var startDate = "";
		var endDate = "";
		if(dateArray && dateArray.length == 2){
			startDate = dateArray[0];
			endDate = dateArray[1];
		}
		console.log("startDate: " + startDate + ", endDate: " + endDate);
		return {
			"startDate": startDate,
			"endDate": endDate,
		}
	},

	updateList: function(){
		this.setState({
				dataSource: this.ds.cloneWithRows(this.listRawData),
		});
	},

	chooseBirthday: function(){
		this.refs["birthdayPicker"].onPressDate();
	},

	chooseStartDatePicker: function(){
		this.refs['startDatePicker'].onPressDate();
	},

	chooseEndDatePicker: function(){
		this.refs['endDatePicker'].onPressDate();
	},

	renderDatePeriod: function(rowID, rowData){
		var dateInfo = this.parseStartEndDate(rowData.value);

		return (
			<View style={[styles.rowWrapper, {paddingTop: 0, paddingBottom: 0}]}>
				<Text style={[styles.rowTitle, {paddingTop: rowPadding, paddingBottom: rowPadding,}]}>{LS.str(rowData.title)}</Text>
				<View style={styles.valueContent}>
					<TouchableOpacity style={styles.datePeriodButton} onPress={()=>this.chooseStartDatePicker()}>
						<DatePicker
							style={styles.datePeriodPicker}
							ref={'startDatePicker'}
							date={dateInfo.startDate}
							mode="date"
							format="YYYY.MM.DD"
							confirmBtnText={LS.str("QD")}
							cancelBtnText={LS.str("QX")}
							showIcon={false}
							minDate={"1990-01-01"}
							maxDate={dateInfo.endDate!==""?dateInfo.endDate:"2099-01-01"}
							onDateChange={(datetime) => this.onStartDateSelect(rowID, datetime)}
							customStyles={datePeriodPickerStyle}
							placeholder={LS.str("OPEN_ACCOUNT_START_DATE")}
						/>
					</TouchableOpacity>
					<View style={{alignItems:'center', alignSelf:'center', width: 60,}}>
						<Text>-</Text>
					</View>
					<TouchableOpacity style={styles.datePeriodButton} onPress={()=>this.chooseEndDatePicker()}>
						<DatePicker
							style={styles.datePeriodPicker}
							ref={'endDatePicker'}
							date={dateInfo.endDate}
							mode="date"
							format="YYYY.MM.DD"
							confirmBtnText={LS.str("QD")}
							cancelBtnText={LS.str("QX")}
							showIcon={false}
							minDate={dateInfo.startDate!==""?dateInfo.startDate:"1990-01-01"}
							maxDate={"2099-01-01"}
							onDateChange={(datetime) => this.onEndDateSelect(rowID, datetime)}
							customStyles={datePeriodPickerStyle}
							placeholder={LS.str("OPEN_ACCOUNT_END_DATE")}
						/>

					</TouchableOpacity>
				</View>
			</View>)
	},

	renderRow: function(rowData, sectionID, rowID) {
		var rowTitleStyle = styles.rowTitle;
		if(rowData.error){
			rowTitleStyle = styles.errorRowTitle;
		}

		if (rowData.type === "choice") {
			var displayText = "";
			var textColor = ColorConstants.INPUT_TEXT_COLOR;
			for(var i = 0; i < rowData.choices.length; i++){
				if(rowData.value === rowData.choices[i].value){
					displayText = LS.str(rowData.choices[i].displayText);
				}
			}
			if(displayText === ""){
				displayText = LS.str(rowData.hint);
				textColor = ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR;
			}

			return (
				<TouchableOpacity activeOpacity={0.9} onPress={() => this.onPressPicker(rowData, rowID)}>
					<View style={styles.rowWrapper}>
						<Text style={rowTitleStyle}>{LS.str(rowData.title)}</Text>
						<View style={styles.valueContent}>
							<View style={{flex: 1, flexDirection: 'column', justifyContent: "center", margin: 0,}}>
								<Text style={[styles.centerText, {color: textColor}]}
									autoCapitalize="none"
									autoCorrect={false}
									editable={false}>
									{displayText}
								</Text>
							</View>
							<Image style={{width:17.5, height:13.5}} source={require("../../../images/icon_down_arrow.png")} />
						</View>
					</View>
				</TouchableOpacity>
				)
		} else if(rowData.type === "date"){
			console.log("birthday: " + rowData.value)
			return (
				<TouchableOpacity onPress={()=>this.chooseBirthday()}>
					<View style={styles.rowWrapper}>
						<Text style={styles.rowTitle}>{LS.str(rowData.title)}</Text>
						<DatePicker
							ref={"birthdayPicker"}
							style={styles.datePicker}
							date={rowData.value}
							mode="date"
							format="YYYY.MM.DD"
							confirmBtnText={LS.str("QD")}
							cancelBtnText={LS.str("QX")}
							placeholder={LS.str("PRESS_TO_CHOOSE")}
							showIcon={false}
							onDateChange={(datetime) => this.onDateTimeSelect(rowID, datetime)}
							customStyles={datePickerStyle}
		        />
					</View>
				</TouchableOpacity>);
		} else if(rowData.type === "datePeriod"){
			return this.renderDatePeriod(rowID, rowData);
		} else{
			var numberOfLines = 1;
			var multiline = false;
			var titleStyle = styles.rowWrapper;
			var inputStyle = styles.valueText;
			if(rowData.maxLine && rowData.maxLine > 1){
				multiline = true;
				numberOfLines = rowData.maxLine;
				titleStyle = styles.multilineRowWrapper;
				inputStyle = styles.multilineValueText;
			}
			return (
				<View style={titleStyle}>
					<Text style={rowTitleStyle}>{LS.str(rowData.title)}</Text>
					<TextInput style={inputStyle}
						autoCapitalize="none"
						autoCorrect={false}
						defaultValue={rowData.value}
						placeholder={LS.str(rowData.hint)}
						placeholderTextColor={ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR}
						multiline={multiline}
						numberOfLines={numberOfLines}
						maxLength={rowData.maxLength}
						selectionColor={ColorConstants.INOUT_TEXT_SELECTION_COLOR}
						underlineColorAndroid='transparent'
						onChangeText={(text)=>this.textInputChange(text, rowID)}
						onEndEditing={(event)=>this.textInputEndChange(event, rowID)}
						/>
				</View>
				)
		}
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
			)
	},

	renderListView: function(){
		if(this.state.showList){
			var listDataView = this.listRawData.map((data, i)=>{
				return(
					<View key={i}>
						{this.renderRow(data, 's1', i)}
						{this.renderSeparator('s1', i, false)}
					</View>
				);
			})
			return (
				<View >
					<View style={styles.reminderArea}>
						<Text style={styles.reminderText}>
							{LS.str("OPEN_ACCOUNT_ID_DATA_HINT")}
							<Text style={styles.reminderText2}>
								{LS.str("OPEN_ACCOUNT_ID_DATA_HINT_2")}
							</Text>
						</Text>
					</View>
					{listDataView}
				</View>);
		}
		return null;
	},

	renderUploadingHint: function(){
		if(this.state.isImageUploading){
			return (
				<View style={{
					position:'absolute',
					width: imageWidth,
					height: imageHeight+30,
					top:0, bottom:0, left:0, right:0,
					alignItems:'center',
					justifyContent:'center'}}>
					<View style={[styles.addImageBackground, {
						backgroundColor:'#333333', 
						position:'absolute',
						opacity: 0.5,
						top:0, bottom:0, left:0, right:0,}]}/>
					<View style={{
						alignItems:'center',
						justifyContent:'center'}}>
						<Spinner size={20} type='FadingCircleAlt' color="#ffffff"/>
						<Text style={{backgroundColor:'transparent', color:"#ffffff", marginTop:10}}>上传中，请稍候...</Text>
					</View>
				</View>)
		}else{
			return null;
		}
	},

	render: function() {
		var pickerModal = null
		var error = this.state.error;

		var nextEnabled = OpenAccountUtils.canGoNext(this.listRawData);
		
		var buttonText = this.state.isImageUploading || this.state.validateInProgress? LS.str("VALIDATE_IN_PROGRESS"): LS.str("NEXT")

		//console.log("listRawData: " + JSON.stringify(listRawData));
		for (var i = 0; i < this.listRawData.length; i++) {
			if(this.listRawData[i].error){
				if(error){
					error = DEFAULT_ERROR;
				}else{
					if(this.listRawData[i].error){
						error = this.listRawData[i].error;
					}else{
						error = LS.str("OPEN_ACCOUNT_ID_INFO_ERROR").replace("{1}", LS.str(this.listRawData[i].title));
					}
				}
			}
			if (this.listRawData[i].type === "datePeriod") {
				var date = this.parseStartEndDate(this.listRawData[i].value);
				if(date.startDate === "" || date.endDate === ""){
					nextEnabled = false
				}
			}
		};

		if(error){
			nextEnabled = false;
		}

		if (this.state.selectedPicker>=0) {
			pickerModal = (
				<TouchableOpacity
					style={{backgroundColor:'transparent', flex:1, position:'absolute', top:0, left:0, right: 0, bottom:0}}
					onPress={()=>this.hidePicker()}>
				</TouchableOpacity>
			)
		}	

		var frontImageStyle = (this.state.idCardFrontData) ? styles.addImage : styles.addImagePlaceHolder;
		var backImageStyle = (this.state.idCardBackData) ? styles.addImage : styles.addImagePlaceHolder;
		
		return (
			<View style={styles.wrapper}>
				<ErrorBar error={this.state.error}/>
				<ScrollView style={{flex:1}}>
					<View style={styles.reminderArea}>
						<Text style={styles.reminderText}>
							{LS.str("OPEN_ACCOUNT_ID_UPLOAD_FRONT_REAR_HINT")}
						</Text>
					</View>
					<View style={styles.imageAreaRowWrapper}>
						<TouchableOpacity style={styles.imageArea} onPress={() => this.pressAddImage(ID_CARD_FRONT)}>
							<View style={styles.addImageBackground}>
								<View style={styles.imageWrapper}>
									<Image style={frontImageStyle} source={this.state.idCardFront}/>
								</View>
								<View style={styles.addImageTextWrapper}>
									<Text style={styles.addImageText}>拍摄个人信息面</Text>
								</View>
								{this.renderUploadingHint()}
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={styles.imageArea} onPress={() => this.pressAddImage(ID_CARD_BACK)}>
							<View style={styles.addImageBackground}>
								<View style={styles.imageWrapper}>
									<Image style={backImageStyle} source={this.state.idCardBack}/>
								</View>
								<View style={styles.addImageTextWrapper}>
									<Text style={styles.addImageText}>拍摄有效期面</Text>								
								</View>
								{this.renderUploadingHint()}
							</View>
						</TouchableOpacity>
					</View>
					<View style={{width:width}}>
						<View style={styles.reminderArea}>
							<Text style={styles.reminderText}>
								{LS.str("OPEN_ACCOUNT_ID_PHOTO_HINT")}
							</Text>
						</View>
						<View style={{backgroundColor: 'white'}}>
							<Image source={require('../../../images/openAccountIDHint.png')}
								style={{height: 110, width:width, resizeMode:'contain',}}/>
						</View>
					</View>
					{this.renderListView()}
					<OpenAccountHintBlock/>
				</ScrollView>
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={this.state.nextEnabled}
						onPress={this.gotoNext}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text={buttonText} />
				</View>
				{pickerModal}
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
	imageAreaRowWrapper:{
		flexDirection:'row',
		backgroundColor:'white',
		paddingTop: 20,
		paddingBottom: 20,
	},
	imageArea: {
		flex: 1,
		alignSelf: 'center',
		alignItems: 'center',
		borderRadius: 3,
		marginLeft:10,
		marginRight:10
	},
	imageWrapper: {
		width: imageWidth,
		height: imageHeight,
		alignItems: 'center',
		justifyContent: 'center',
	},
	addImage: {
		width: imageWidth,
		height: imageHeight,
		resizeMode: 'contain',
		alignSelf:'center',
	},
	addImagePlaceHolder: {
		width: imageWidth-40,
		height: imageHeight-40,
		resizeMode: 'contain',
		alignSelf:'center',
		justifyContent:'center'
	},
	addImageBackground:{
		width: imageWidth,
		height: imageHeight+30,
		backgroundColor: "#f0f4fc",
		borderRadius: 3,
		alignSelf:'stretch'
	},
	addImageTextWrapper: {
		backgroundColor:'#6580af', 
		alignItems:'center', 
		justifyContent:'center',
		height:30,
	},
	addImageText: {
		fontSize:15,
		color:'white',
		textAlign:'center',
	},
	reminderText: {
		marginLeft:15,
		marginRight:15,
		textAlign: 'left',
		fontSize: 14,
		color: '#666666',
	},
	reminderText2:{
		color:'#6580af', 
	},
	reminderArea:{
		height: 49,
		justifyContent:'center'
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
	list: {
		flex: 1,
	},
	rowWrapper: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#ffffff',
		paddingTop: rowPadding,
		paddingBottom: rowPadding,
	},
	multilineRowWrapper: {
		flexDirection: 'row',
		alignSelf: 'center',
		//alignItems: 'center',
		//height: 120,
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#ffffff',
		paddingTop: rowPadding,
		paddingBottom: rowPadding,
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		marginLeft: 0,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	rowTitle:{
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		width:rowTitleWidth,
	},
	errorRowTitle:{
		fontSize: fontSize,
		color: 'red',
		width:rowTitleWidth,
	},
	valueText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		flex: 1,
		marginTop: -rowPadding,
		marginBottom: -rowPadding,
		alignItems:'center',
		justifyContent:'center',
		marginLeft:0,
		paddingLeft:0
	},
	centerText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		alignItems:'center',
		justifyContent:'center',
		margin: 0,
	},
	multilineValueText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		flex: 1,
		alignItems:'center',
		justifyContent:'center',
		padding:0,
		margin: 0,
		textAlignVertical: 'top',
		height: Platform.OS === "ios" ? 48 : 65,
		marginTop: Platform.OS === "ios" ? -5 : 0,
		alignSelf: "flex-start",
	},
	valueContent:{
		flex: 1,
		flexDirection: 'row',
	},
});


module.exports = OAIdPhotoPage;
