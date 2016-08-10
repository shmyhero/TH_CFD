'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	WebView,
	Dimensions,
	NetInfo,
	Image,
	TouchableOpacity,
	Text,
} from 'react-native';

var WEBVIEW_REF = 'qawebview';
var {EventCenter, EventConst} = require('../EventCenter')
var ColorConstants = require('../ColorConstants')
var NavBar = require('../view/NavBar')
var NetConstants = require('../NetConstants');

// var didTabSelectSubscription = null;
var {height, width} = Dimensions.get('window')
var QAPage = React.createClass({
	propTypes: {
		url: React.PropTypes.string,
	},

	getDefaultProps() {
		return {
			url: NetConstants.WEBVIEW_QA_PAGE,
		}
	},

	getInitialState: function() {
		return {
			isNetConnected: true,
		};
	},

	componentDidMount: function() {
		NetInfo.isConnected.addEventListener(
			'change',
			this._handleConnectivityChange
		);
		//检测网络是否连接
		NetInfo.isConnected.fetch().done(
			(isConnected) => { this.setState({isNetConnected: isConnected}); }
		);
	},

	// componentWillMount: function() {
	// 	this.didTabSelectSubscription = EventCenter.getEventEmitter().addListener(EventConst.QA_TAB_PRESS_EVENT, this.onTabPressed);
	// },

	componentWillUnmount: function() {
    	NetInfo.isConnected.removeEventListener(
			'change',
			this._handleConnectivityChange
		);
		// this.didTabSelectSubscription.remove()
    },

	_handleConnectivityChange: function(isConnected) {
		this.setState({isNetConnected: isConnected})
		if (isConnected) {
			this.refs[WEBVIEW_REF].reload();
		}
	},

	// onTabPressed: function() {
	// 	this.refs[WEBVIEW_REF].reload();
	// },

	render: function() {
		if(this.state.isNetConnected) {
			return (
				<WebView
					ref={WEBVIEW_REF}
					style={styles.webView}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					scalesPageToFit={true}
					automaticallyAdjustContentInsets={true}
					decelerationRate="normal"
					source={{uri: this.props.url}}/>
				)
		}
		else {
			return (<View style={{flex:1, backgroundColor: 'white'}}>
						<NavBar title="问答" navigator={this.props.navigator}/>
						<View style={styles.containerView}>
							<Image style={styles.image} source={require('../../images/no_network.png')}/>
						</View>
						<View style={{flex:1}}/>
					</View>
				)
		}
	},
});

var styles = StyleSheet.create({
	webView: {
		backgroundColor: 'white',
		marginBottom: 50,
	},

	containerView: {
		flex: 3,
		alignItems: 'center',
		alignSelf: 'stretch',
		justifyContent: 'space-around',
	},
	image: {
		width: 170,
		height: 180,
	},

});

module.exports = QAPage;
