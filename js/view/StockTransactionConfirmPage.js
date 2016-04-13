'use strict';

var React = require('react-native');
var { 
	StyleSheet,
	View,
	Text,
	Image,
	Animated,
	Dimensions,
	PanResponder,
} = React;

var Touchable = require('Touchable');
var merge = require('merge');
var ColorConstants = require('../ColorConstants')

var {height, width} = Dimensions.get('window');

var StockTransactionConfirmPage = React.createClass({
	mixins: [Touchable.Mixin],

	getInitialState: function() {
		return merge(
			this.touchableGetInitialState(), 
			{
				backgroundOpacity: new Animated.Value(0),
				dialogY: new Animated.Value(10000),
				visible: false,
			}
		);
	},

	show: function() {
		this.setState({
			visible: true,
		})
		this.state.dialogY.setValue(height)
		Animated.parallel([
			Animated.timing(
				this.state.backgroundOpacity, 
				{
					toValue: 0.6,
					duration: 300,
				},
			),
			Animated.timing(
				this.state.dialogY, 
				{
					toValue: height / 3,
					duration: 100,
				}
			),
		]).start();
	},

	hide: function() {
		Animated.parallel([
			Animated.timing(
				this.state.backgroundOpacity, 
				{
					toValue: 0,
					duration: 300,
				},
			),
			Animated.timing(
				this.state.dialogY, 
				{
					toValue: height,
					duration: 100,
				}
			),
		]).start((finished) => {
			this.setState({
				visible: false,
			})
		});
	},

	touchableHandlePress: function(e: Event) {
		this.hide()
	},

	render: function() {
		if (!this.state.visible) {
			return null
		}
		return (
			<View style={styles.container}>

				<Animated.View style={[styles.maskBackground, {height: height, opacity: this.state.backgroundOpacity}]}
						onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
						onResponderTerminationRequest={this.touchableHandleResponderTerminationRequest}
						onResponderGrant={this.touchableHandleResponderGrant}
						onResponderMove={this.touchableHandleResponderMove}
						onResponderRelease={this.touchableHandleResponderRelease}
						onResponderTerminate={this.touchableHandleResponderTerminate} />


				<Animated.View style={[styles.contentContainer, {top: this.state.dialogY}]}>
					<View style={styles.titleContainer}>
						<Text style={styles.titleText}>
							新东方 - 开仓
						</Text>
					</View>
					<View style={styles.centerContainer}>
						<View style={{flex: 1, alignItems: 'flex-start', paddingLeft: 20, paddingVertical: 8}}>
							<Text style={styles.itemTitleText}>
								类型
							</Text>
							<Image style={styles.sortImage} source={require('../../images/downsort.png')}/>
						</View>
						<View style={{flex: 1, alignItems: 'center'}}>
							<Text style={styles.itemTitleText}>
								本金
							</Text>
							<Text style={styles.itemValueText}>
								100
							</Text>
						</View>
						<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 20}}>
							<Text style={styles.itemTitleText}>
								杠杆
							</Text>
							<Text style={styles.itemValueText}>
								X 10
							</Text>
						</View>
					</View>
					<View style={styles.line}/>
					<View style={styles.bottomContainer}>
						<View style={{flex: 1, alignItems: 'flex-start', paddingLeft: 20, paddingVertical: 8}}>
							<Text style={styles.itemTitleText}>
								交易价格
							</Text>
							<Text style={styles.itemValueText}>
								10.12
							</Text>
						</View>
						<View style={{flex: 1, alignItems: 'center'}}>
							<Text style={styles.itemTitleText}>
								止损
							</Text>
							<Text style={styles.itemValueText}>
								100
							</Text>
						</View>
						<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 20}}>
							<Text style={styles.itemTitleText}>
								16/03/24
							</Text>
							<Text style={styles.itemValueText}>
								14:30
							</Text>
						</View>
					</View>
				</Animated.View>

			</View>
			
		);
	},
});

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'transparent',
	},

	maskBackground: {
		backgroundColor: '#000000',
	},

	contentContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
	},

	titleContainer: {
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		alignItems: 'flex-start',
	},

	centerContainer: {
		flexDirection: 'row', 
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
	},

	bottomContainer: {
		borderBottomLeftRadius: 3,
		borderBottomRightRadius: 3,
		flexDirection: 'row', 
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
	},

	titleText: {
		fontSize: 20,
		textAlign: 'center',
		color: '#ffffff',
		marginLeft: 20,
		marginVertical: 8,
	},

	itemTitleText: {
		fontSize: 16,
		textAlign: 'center',
		color: '#7d7d7d',
	},

	itemValueText: {
		fontSize: 14,
		textAlign: 'center',
		color: '#000000',
	},

	line: {
		height: 1,
		backgroundColor: '#c9c9c9',
	},
});


module.exports = StockTransactionConfirmPage;
