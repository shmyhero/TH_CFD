'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	Text,
	Image,
	Switch,
	TouchableHighlight,
} = React;

var MySettings = React.createClass({

	getInitialState: function() {
		return {
			trueSwitchIsOn: true,
		};
	},

	quitOnClick: function() {
		this.props.navigator.replace({
			name: 'login'
		});
	},

	render: function() {
		return (
			<View style={styles.wrapper}>

				<View style={styles.rowContainer}>
					<Text style={styles.rowText}>
						去评分
					</Text>
					<Image 
						style={styles.rowImage} 
						source={require('../../images/icon_arrow_right.png')}/>
				</View>

				<View style={styles.line}/>

				<View style={styles.rowContainer}>
					<Text style={styles.rowText}>
						FAQ
					</Text>
					<Image 
						style={styles.rowImage} 
						source={require('../../images/icon_arrow_right.png')}/>
				</View>

				<View style={styles.lineSicker}/>

				<View style={styles.rowContainer}>
					<Text style={styles.rowText}>
						推送通知
					</Text>
					<Switch
						onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
						value={this.state.trueSwitchIsOn} />
				</View>

				<View style={styles.line}/>

				<View style={styles.rowContainer}>
					<Text style={styles.rowText}>
						版本
					</Text>
					<Text style={styles.rowText}>
						V4.1.1
					</Text>
				</View>

				<View style={styles.line}/>

				<View style={styles.rowContainer}>
					<Text style={styles.rowText}>
						关于
					</Text>
					<Image 
						style={styles.rowImage} 
						source={require('../../images/icon_arrow_right.png')}/>
				</View>

				<View style={styles.lineSicker}/>

				<TouchableHighlight style={styles.quitContainer}
					onPress={this.quitOnClick}
					underlayColor='#d0d0d0'>
					<Text style={styles.quitText}>
						退出当前账号
					</Text>
				</TouchableHighlight>

				<View style={styles.line}/>

			</View>
		);
	}
});

var styles = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
	},

	line: {
		alignSelf: 'stretch',
		height: 1,
		borderWidth: 0.25,
		marginLeft: 10,
		borderColor: '#d0d0d0'
	},

	lineSicker: {
		alignSelf: 'stretch',
		height: 15,
		backgroundColor: '#efefef'
	},

	rowContainer: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'space-between',
	},

	rowText: {
		fontSize: 14,
		textAlign: 'center',
	},

	rowImage: {
		width: 15,
		height: 15,
		resizeMode: Image.resizeMode.contain,
	},

	quitContainer: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'center',
	},

	quitText: {
		fontSize: 14,
		textAlign: 'center',
		color: '#ff0000'
	},
});

module.exports = MySettings;