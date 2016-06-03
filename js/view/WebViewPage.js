'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	WebView,
	NetInfo,
	Image,
} from 'react-native';

var WEBVIEW_REF = 'webview';

var WebViewPage = React.createClass({
	propTypes: {
		url: React.PropTypes.string,
	},

	getDefaultProps() {
		return {
			url: 'http://www.baidu.com',
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

	componentWillUnmount: function() {
    	NetInfo.isConnected.removeEventListener(
			'change',
			this._handleConnectivityChange
		);
    },

	_handleConnectivityChange: function(isConnected) {
		this.setState({isNetConnected: isConnected})
		if (isConnected) {
			this.refs[WEBVIEW_REF].reload();
		}
	},

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
					source={{uri: this.props.url}} />
			)
		}
		else {
			return (
					<View style={styles.containerView}>
						<Image style={styles.image} source={require('../../images/no_network.png')}/>
					</View>
				)
		}
	},
});

var styles = StyleSheet.create({
	webView: {
		backgroundColor: 'white',
	},
	containerView: {
		flex: 1,
		alignItems: 'center',
		alignSelf: 'stretch',
		justifyContent: 'space-around',
		backgroundColor: 'white',
	},
	image: {
		width: 170,
		height: 180,
	},
});

module.exports = WebViewPage;
