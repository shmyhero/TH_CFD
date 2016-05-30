'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	WebView,
	Dimensions,
	NetInfo,
} from 'react-native';

var WEBVIEW_REF = 'qawebview';
var {EventCenter, EventConst} = require('../EventCenter')

var didTabSelectSubscription = null;
var {height, width} = Dimensions.get('window')
var QAPage = React.createClass({
	propTypes: {
		url: React.PropTypes.string,
	},

	getDefaultProps() {
		return {
			url: 'http://cn.tradehero.mobi/TH_CFD_WEB/wenda.html',
		}
	},

	// getInitialState: function() {
	// 	return {
	// 		isNetConnected: true,
	// 	};
	// },

	componentDidMount: function() {
		NetInfo.isConnected.addEventListener(
			'change',
			this._handleConnectivityChange
		);
		// //检测网络是否连接
		// NetInfo.isConnected.fetch().done(
		// 	(isConnected) => { this.setState({isNetConnected: isConnected}); }
		// );
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
		if (isConnected) {
			// this.setState({isNetConnected: isConnected})
			this.refs[WEBVIEW_REF].reload();
		}
	},

	// onTabPressed: function() {
	// 	this.refs[WEBVIEW_REF].reload();
	// },

	render: function() {
		return (
			<WebView
				ref={WEBVIEW_REF}
				style={styles.webView}
				javaScriptEnabled={true}
				domStorageEnabled={true}
				scalesPageToFit={true}
				automaticallyAdjustContentInsets={true}
				decelerationRate="normal"
				source={{uri: this.props.url}} />
		)
	},
});

var styles = StyleSheet.create({
	webView: {
		backgroundColor: 'white',
		marginBottom: 50,
	},
});

module.exports = QAPage;
