'use strict';

var React = require('react-native');
var {
	AppRegistry,
	StyleSheet,
	ListView,
	Text,
	Image,
	View,
	TouchableHighlight,
} = React;
var LogicData = require('../LogicData')


var MyHomePage = React.createClass({
	getInitialState: function() {
		return {
			userData: LogicData.getUserData()
		};
	},

	myActivitiesOnClick: function() {

	},

	myNoticeOnClick: function() {
		this.props.navigator.push({
			name: 'myNotifications',
		});
	},

	mySettingsOnClick: function() {
		this.props.navigator.push({
			name: 'mySettings',
		});
	},

	render: function() {
		return (
			<View style={styles.wrapper}>

				<View style={styles.profileContainer}>
					<Image
						style={styles.logo}
						source={{uri: this.state.userData.profileDTO.picture}}
					/>
					<View style={styles.nameContainer}>
						<Text style={styles.displayName}>
							{this.state.userData.profileDTO.displayName}
						</Text>
						<Text style={styles.roi}>
							收益率：{this.state.userData.profileDTO.portfolio.roiSinceInception * 100}
						</Text>
						<Text style={styles.signature}>
							收益率：{this.state.userData.profileDTO.signature}
						</Text>
					</View>
				</View>

				<View style={styles.line}/>

				<View style={styles.portfolio}>
					<View style={styles.portfolioDataContainer}>
						<Text style={styles.portfolioData}>
							$ {Math.round(this.state.userData.profileDTO.portfolio.totalValue)}
						</Text>
						<Text style={styles.portfolioKey}>
							总资产
						</Text>
					</View>
					<View style={styles.portfolioDataContainer}>
						<Text style={styles.portfolioData}>
							{this.state.userData.profileDTO.heroIds.length}
						</Text>
						<Text style={styles.portfolioKey}>
							股神
						</Text>
					</View>
					<View style={styles.portfolioDataContainer}>
						<Text style={styles.portfolioData}>
							{this.state.userData.profileDTO.allFollowerCount}
						</Text>
						<Text style={styles.portfolioKey}>
							粉丝
						</Text>
					</View>
				</View>

				<View style={styles.line}/>

				<View style={styles.liveTrade}>
					<Text style={styles.liveTradeButton}>
						开通实盘
					</Text>
					<Text style={styles.liveTradeButton}>
						实盘交易
					</Text>
				</View>

				<View style={styles.line}/>

				<TouchableHighlight 
					style={styles.toaClickableArea}
					onPress={this.myActivitiesOnClick}
					underlayColor='#d0d0d0'>
					<View style={styles.toa}>
						<Image 
							style={styles.toaIcon} 
							source={require('../../images/icon_me_dynamic.png')}/>
						<Text style={styles.toaName}>
							我的动态
						</Text>
					</View>
				</TouchableHighlight>

				<View style={styles.line}/>

				<TouchableHighlight 
					style={styles.toaClickableArea}
					onPress={this.myNoticeOnClick}
					underlayColor='#d0d0d0'>
					<View style={styles.toa}>
						<Image 
							style={styles.toaIcon} 
							source={require('../../images/icon_me_message.png')}/>
						<Text style={styles.toaName}>
							通知
						</Text>
					</View>
				</TouchableHighlight>

				<View style={styles.line}/>

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
});

module.exports = MyHomePage;