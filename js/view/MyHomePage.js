'use strict';

import React from 'react';
import {
	AppRegistry,
	StyleSheet,
	ListView,
	Text,
	Image,
	View,
	TouchableHighlight,
	Dimensions,
} from 'react-native';
var ImagePicker = require('react-native-image-picker');
var {height, width} = Dimensions.get('window')
var imageWidth = width - 40
var imageHeight = Math.round(imageWidth / 1.5)
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

var LogicData = require('../LogicData')

var MyHomePage = React.createClass({
	getInitialState: function() {
		return {
			avatarSource: require('../../images/bannar01.png'),
		};
	},

	mySettingsOnClick: function() {
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				// You can display the image using either data:
				const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

				// uri (on iOS)
				//const source = {uri: response.uri.replace('file://', ''), isStatic: true};
				// uri (on android)
				//const source = {uri: response.uri, isStatic: true};

				this.setState({
					avatarSource: source
				});

			}
		});
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<TouchableHighlight
					style={styles.toaClickableArea}
					onPress={this.mySettingsOnClick}
					underlayColor='#d0d0d0'>
					<View style={styles.toa}>
						<Image
							style={styles.toaIcon}
							source={require('../../images/icon_me_setting.png')}/>
						<Text style={styles.toaName}>
							设置
						</Text>
					</View>
				</TouchableHighlight>

				<View style={styles.line}/>

				<Image source={this.state.avatarSource} style={[styles.avatar]}/>
			</View>

		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
	},
	line: {
		alignSelf: 'stretch',
		height: 1,
		borderWidth: 0.25,
		borderColor: '#d0d0d0'
	},
	profileContainer: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'flex-start',
	},
	nameContainer: {
		alignItems: 'flex-start',
		justifyContent: 'space-around',
		marginRight: 10,
	},
	logo: {
		width: 60,
		height: 60,
		backgroundColor: '#eaeaea',
		marginRight: 10,
	},
	displayName: {
		fontSize: 15,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	roi: {
		fontSize: 12,
		textAlign: 'center',
		color: '#aeaeae',
	},
	signature: {
		fontSize: 12,
		textAlign: 'center',
		color: '#aeaeae',
	},
	portfolio: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'space-around',
	},
	portfolioDataContainer: {
		alignItems: 'center',
	},
	portfolioData: {
		fontSize: 12,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	portfolioKey: {
		fontSize: 10,
		textAlign: 'center',
		color: '#888888',
	},
	liveTrade: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingTop: 15,
		paddingBottom: 15,
		justifyContent: 'space-around',
		backgroundColor: '#f1f1f1'
	},
	liveTradeButton: {
		fontSize: 15,
		width: 120,
		height: 26,
		lineHeight: 20,
		textAlign: 'center',
		color: '#ffffff',
		backgroundColor: '#1789d5',
	},
	toaClickableArea: {
		flexDirection: 'row',
		alignSelf: 'stretch',
	},
	toa: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingTop: 15,
		paddingBottom: 15,
		justifyContent: 'flex-start',
	},
	toaIcon: {
		width: 20,
		height: 20,
		marginLeft: 15,
		resizeMode: Image.resizeMode.contain,
	},
	toaName: {
		fontSize: 15,
		textAlign: 'center',
		marginLeft: 30,
	},
	avatar: {
		width: imageWidth,
		height: imageHeight,
		resizeMode: 'contain',
	}
});

module.exports = MyHomePage;
