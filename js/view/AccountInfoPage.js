'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	Dimensions,
	Image,
	TouchableOpacity,
	ListView,
	Alert,
} from 'react-native';

var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var LogicData = require('../LogicData')
var StorageModule = require('../module/StorageModule')
var NavBar = require('./NavBar')
var MainPage = require('./MainPage');
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var {height, width} = Dimensions.get('window');
var heightRate = height/667.0;

var listRawData = [
	{'type':'head','title':'头像', 'subtype': 'head'},
	{'type':'nickName','title':'昵称', 'subtype': 'nickName'},
	{'type':'mobile','title':'账号', 'subtype': 'mobile'},
];

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var ImagePicker = require('react-native-image-picker');

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

var AccountInfoPage = React.createClass({

	propTypes: {
		backButtonOnClick: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			backButtonOnClick: function() {

			},
		}
	},

	getInitialState: function() {
		var meData = LogicData.getMeData()
		return {
			dataSource: ds.cloneWithRows(listRawData),
			headUrl:meData.picUrl,
			nickname:meData.nickname,
			mobile: meData.phone,
			headSource:'',
			headSourceData:'',
		};
	},

	// componentWillMount: function(){
	// 	var meData = LogicData.getMeData()
	// 	var notLogin = Object.keys(meData).length === 0
	// 	if(!notLogin){
	// 			this.setState({
	// 				headUrl: meData.picUrl,
	// 				nickName: meData.nickname,
	// 				mobile: meData.phone
	// 			})
	// 	}
	// },

	onReturnToPage:function(){
		var meData = LogicData.getMeData()
		var notLogin = Object.keys(meData).length === 0
		if(!notLogin){
				this.setState({
					headUrl: meData.picUrl,
					nickname: meData.nickname,
					mobile: meData.phone,
					dataSource: ds.cloneWithRows(listRawData),

				})
		}
	},


	onSelectNormalRow: function(rowData) {
		if(rowData.subtype === 'head') {
			this.pressAddImage();
		}else if(rowData.subtype === 'nickName') {
			this.gotoAccountNameModifyPage();
		}
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
						headSource: source,
						headSourceData: response.data,
						dataSource: ds.cloneWithRows(listRawData),
					});

					this.commitHeadPhoto();
			}
		});
	},

	updateMeData(userData, onSuccess){
		NetworkModule.fetchTHUrl(
			NetConstants.GET_USER_INFO_API,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			function(responseJson) {
				StorageModule.setMeData(JSON.stringify(responseJson))
				LogicData.setMeData(responseJson);

				if(onSuccess){
					onSuccess()
				}
			}.bind(this),
			function(errorMessage) {
				Alert.alert('提示',errorMessage);
			}
		)
	},

	commitHeadPhoto: function() {

		var userData = LogicData.getUserData();
		var url = NetConstants.UPDATE_HEAD_PHOTO;
		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=utf-8',
				},
				body:this.state.headSourceData,
				showLoading: true,
			},
			(responseJson) => {
				this.updateMeData(userData, function(){
					Alert.alert('设置头像', '头像设置成功',
						[{text:'确定', onPress: ()=>this.confirmOfSuccess()}]);
				}.bind(this));
			},
			(errorMessage) => {
				Alert.alert('设置头像', errorMessage);
			}
		)
	},

	confirmOfSuccess(){

	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		var marginLeft = 0;
		return (
			<View style={styles.line} key={rowID}>
				<View style={[styles.separator, {marginLeft: marginLeft}]}/>
			</View>
			)
	},

	renderRow: function(rowData, sectionID, rowID) {

			var source = require('../../images/head_portrait.png');
			if(this.state.headSource){
				source = this.state.headSource;
			}else if(this.state.headUrl){
				source = {uri:this.state.headUrl};
			}

			if(rowData.type === 'head'){
				return(
					<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
						<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
							<Text style={styles.title}>{rowData.title}</Text>
							<Image source={source} borderRadius={24*heightRate} style={[styles.headImage,{marginRight:5}]} />
							<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
						</View>
					</TouchableOpacity>
				);
			}else if(rowData.type === 'nickName'){
				return(
					<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
						<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
							<Text style={styles.title}>{rowData.title}</Text>
							<Text style={styles.contentValue}>{this.state.nickname}</Text>
							<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
						</View>
					</TouchableOpacity>
				);
			}else if(rowData.subtype === 'mobile') {
				return(
					<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
						<Text style={styles.title}>{rowData.title}</Text>
						<Text style={styles.contentValue}>{this.state.mobile}</Text>
					</View>
				);
			}


	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<NavBar title='帐号信息' showBackButton={true} navigator={this.props.navigator}
					backButtonOnClick={this.props.backButtonOnClick}/>
				<ListView
					style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator} />
			</View>
		);
	},

	gotoAccountNameModifyPage(){
		this.props.navigator.push({
			name: MainPage.ACCOUNT_NAME_MODIFY_ROUTE,
			onReturnToPage: this.onReturnToPage,
		});
	},
});

var styles = StyleSheet.create({

	wrapper: {
		flex: 1,
		width: width,
			alignItems: 'stretch',
			justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},

	list: {
		flex: 1,
		// borderWidth: 1,
	},
	rowWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: 'white',
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	image: {
		marginLeft: -10,
		width: 40,
		height: 40,
	},
	title: {
		flex: 1,
		fontSize: 17,
		marginLeft: 10,
		color: '#303030',
	},

	contentValue: {
		fontSize: 17,
		marginRight: 5,
		color: '#757575',
	},

	moreImage: {
		alignSelf: 'center',
		width: 7.5,
		height: 12.5,
	},

	buttonArea: {
		flex: 1,
		borderRadius: 3,
	},
	buttonView: {
		height: Math.round(44*heightRate),
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},

	defaultText: {
		flex: 1,
		fontSize: 17,
		marginLeft: 10,
		color: '#6d6d6d',
	},
	headImage: {
		width: Math.round(48*heightRate),
		height: Math.round(48*heightRate),

	},

});

module.exports = AccountInfoPage;
