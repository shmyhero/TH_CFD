'use strict'

var React = require('react-native');
var Swiper = require('react-native-swiper')

var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	Alert
} = React;

var LogicData = require('../LogicData')
var StorageModule = require('../module/StorageModule')
var NetworkModule = require('../module/NetworkModule')

var LandingPage = React.createClass({

	getInitialState: function() {
		return {
			useTokenAvailable: false
		};
	},

	loginPress: function() {
		StorageModule.loadUserData()
			.then((value) => {
				if (value !== null) {
					LogicData.setUserData(JSON.parse(value))

					this.setState({
						useTokenAvailable: true
					})
					this.props.navigator.push({
						name: 'wechatLoginConfirm',
					});	
				} else {
					this.props.navigator.push({
						name: 'login',
					});
				}
			})
	},

	logoutPress: function() {
		if (this.state.useTokenAvailable) {
			StorageModule.removeUserData()
			.then(() => {
				this.setState({
					useTokenAvailable: false
				});
			})
		}
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<Swiper height={420} loop={false} bounces={true}>
					<View style={styles.slide}>
						<Image 
							style={styles.image} 
							source={require('image!guide_screen1')}/>
					</View>
					<View style={styles.slide}>
						<Image 
							style={styles.image} 
							source={require('image!guide_screen2')}/>
					</View>
					<View style={styles.slide}>
						<Image 
							style={styles.image} 
							source={require('image!guide_screen3')}/>
					</View>
					<View style={styles.slide}>
						<Image 
							style={styles.image} 
							source={require('image!guide_screen4')}/>
					</View>
				</Swiper>
				<TouchableHighlight style={styles.loginClickableArea}
					onPress={this.loginPress}>
					<View style={{borderRadius: 3, padding: 5, backgroundColor: '#1789d5'}}>
						<Text style={styles.loginText}>
							登录
						</Text>
					</View>
				</TouchableHighlight>
				<TouchableHighlight style={styles.loginClickableArea}
					onPress={this.logoutPress}>
					<View style={{borderRadius: 3, padding: 5, backgroundColor: '#1789d5'}}>
						<Text style={styles.loginText}>
							退出
						</Text>
					</View>
					
				</TouchableHighlight>
			</View>
		)
	}
})

var styles = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
		paddingTop: 20,
	},
	slide: {
		alignItems: 'center',
	},
	image: {
		flex: 1,
		height: 400,
		resizeMode: Image.resizeMode.contain,
	},
	loginClickableArea: {
		marginTop: 10,
	},
	loginText: {
		fontSize: 20,
		width: 200,
		height: 30,
		lineHeight: 25,
		textAlign: 'center',
		color: '#ffffff',
	},
})

module.exports = LandingPage;