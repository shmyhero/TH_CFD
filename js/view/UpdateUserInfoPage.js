'use strict'

var React = require('react-native');

var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	Dimensions,
	TextInput,
} = React;

var Button = require('./component/Button')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var LogicData = require('../LogicData')

var rowHeight = 40;
var fontSize = 16;

var originalName = null;

var UpdateUserInfoPage = React.createClass({

	getInitialState: function() {
		return {
			nickName: '',
			saveButtonEnabled: false
		};
	},

	componentDidMount: function() {
		var requestSuccess = true
		var userData = LogicData.getUserData()

		fetch(NetConstants.GET_USER_INFO_API, {
			method: 'GET',
			headers: {
				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
			},
		})
		.then((response) => {
			console.log(response)
			if (response.status === 200) {
				requestSuccess = true;
			} else {
				requestSuccess = false;
			}

			return response.json()
		})
		.then((responseJson) => {
			if (requestSuccess) {
				originalName = responseJson.nickname
				this.setState({
					nickName: originalName ,
					saveButtonEnabled: true
				});
			}
		});
	},

	setUserName: function(name) {
		this.setState({
			nickName: name
		})

		var buttonEnabled = false
		if (name.length > 0) {
			buttonEnabled = true
		} 
		this.setState({
			saveButtonEnabled: buttonEnabled
		})
	},

	savePressed: function() {
		var requestSuccess = true
		var userData = LogicData.getUserData()

		var url = NetConstants.SET_USER_NICKNAME_API + '?' + NetConstants.PARAMETER_NICKNAME + '=' + this.state.nickName
		fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
			},
		})
		.then((response) => {
			console.log(response)
			if (response.status === 200) {
				this.props.navigator.replace({
					name: 'wechatLoginConfirm',
				});
			} else {
				Alert.alert('提示','错误请重试');
			}
		})
	},

	render: function() {
		var {height, width} = Dimensions.get('window');

		return (
			<View style={[styles.wrapper, {height: height}]}>

				<View style={styles.upperContainer}>

					<View style={styles.rowWrapperWithBorder}>
						<View style={styles.nickNameTextView}>
							<Text style={styles.nickNameText}>
								昵称
							</Text>
						</View>

						<TextInput style={styles.nickNameInput}
							autoFocus={true}
							onChangeText={(text) => this.setUserName(text)}
							underlineColorAndroid='#ffffff'
							value={this.state.nickName}/>
					</View>

					<View style={styles.rowWrapper}>
						<Button style={styles.saveClickableArea}
							enabled={this.state.saveButtonEnabled}
							onPress={this.savePressed}
							textContainerStyle={styles.saveTextView}
							textStyle={styles.saveText}
							text='保存' />
					</View>

				</View>

				<View style={styles.lowerContainer}>

				</View>

			</View>
		)
	},

});

var styles = StyleSheet.create({

	upperContainer: {
		flex: 1,
		alignItems: 'stretch',
		justifyContent: 'center',
	},
	lowerContainer: {
		flex: 3,
		alignItems: 'stretch',
	},
	rowWrapperWithBorder: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		marginLeft: 10,
		marginRight: 10,
		borderWidth: 1,
		borderRadius: 3,
		borderColor: ColorConstants.TITLE_BLUE,
		backgroundColor: '#ffffff',
	},
	rowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		paddingTop: 20,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
	},
	nickNameTextView: {
		flex: 1,
		height: rowHeight,
		justifyContent: 'center',
	},
	nickNameText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#c7c7cd',
	},
	nickNameInput: {
		flex: 4,
		height: rowHeight,
		fontSize: fontSize,
		paddingLeft: 10,
	},
	saveClickableArea: {
		flex: 1,
		alignSelf: 'center',
	},
	saveTextView: {
		padding: 5,
		height: rowHeight,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	saveText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#ffffff',
	},
});

module.exports = UpdateUserInfoPage