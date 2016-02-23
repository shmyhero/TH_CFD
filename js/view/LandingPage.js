'use strict'

//import * as WechatAPI from 'react-native-wx';

var React = require('react-native');
var Swiper = require('react-native-swiper')

var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight
} = React;

var LogicData = require('../LogicData')

var LandingPage = React.createClass({
	loginPress: function() {
		this.props.navigator.replace({
			name: 'login',
		});
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