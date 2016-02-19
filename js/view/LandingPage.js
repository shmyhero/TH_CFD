'use strict'

import * as WechatAPI from 'react-native-wx';

var React = require('react-native');
var Swiper = require('react-native-swiper')

var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight
} = React;

var LoginPage = require('./LoginPage')

var LandingPage = React.createClass({
	loginPress: function() {
		// this.props.navigator.push({
		// 	title: '邮箱登陆',
		// 	component: LoginPage,
		// 	backButtonTitle: ' ',
		// 	navigationBarHidden: 'false',
		// });

		this.props.navigator.replace({
			name: 'login',
		});
	},

	guestLoginPress: function() {
		if (WechatAPI.isWXAppInstalled()) {
			console.log("We chat is installed.")
			WechatAPI.login().
			then((reply) => {
				console.log(reply)
				console.log(reply.code)

				this.props.navigator.replace({
					name: 'login',
					code: reply.code,
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
							source={require('../../images/guide_screen1.png')}/>
					</View>
					<View style={styles.slide}>
						<Image 
							style={styles.image} 
							source={require('../../images/guide_screen2.png')}/>
					</View>
					<View style={styles.slide}>
						<Image 
							style={styles.image} 
							source={require('../../images/guide_screen3.png')}/>
					</View>
					<View style={styles.slide}>
						<Image 
							style={styles.image} 
							source={require('../../images/guide_screen4.png')}/>
					</View>
				</Swiper>
				<TouchableHighlight style={styles.guestLoginClickableArea}
					onPress={this.guestLoginPress}>
					<Text style={styles.guestLoginText}>
						马上体验
					</Text>
				</TouchableHighlight>
				<TouchableHighlight style={styles.loginClickableArea}
					onPress={this.loginPress}>
					<Text style={styles.loginText}>
						登录
					</Text>
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
	cloudImage: {
		flex: 1,
		height: 50,
		marginTop: -50,
		resizeMode: Image.resizeMode.contain,
	},
	guestLoginClickableArea: {
		marginTop: 0,
	},
	loginClickableArea: {
		marginTop: 10,
	},
	guestLoginText: {
		fontSize: 20,
		width: 200,
		height: 30,
		lineHeight: 25,
		textAlign: 'center',
		color: '#ffffff',
		backgroundColor: '#D78F91',
	},
	loginText: {
		fontSize: 20,
		width: 200,
		height: 30,
		lineHeight: 25,
		textAlign: 'center',
		color: '#ffffff',
		backgroundColor: '#1789d5',
	},
})

module.exports = LandingPage;