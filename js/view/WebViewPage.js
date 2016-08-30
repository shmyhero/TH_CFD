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
var SHARE_PAGE = 'SharePage'

var SharePage = require('./SharePage')
var NavBar = require('./NavBar')
var WebViewBridge = require('react-native-webview-bridge');

//Cannot find a soluWebViewBridge
const injectScript = `
(function () {
	if (WebViewBridge) {
	  WebViewBridge.onMessage = function (message) {
	    if (message === "get-share-info") {
				shareinfo();
				//WebViewBridge.send('{"webpageUrl":"1", "imageUrl":"2", "title":"3", "description":"4"}');
	    }
	  };
	}
}());
`;

var WebViewPage = React.createClass({
	propTypes: {
		url: React.PropTypes.string,
		showShareButton: React.PropTypes.bool,
		showTabbar: React.PropTypes.func,
		shareFunction: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			url: 'http://www.baidu.com',
			showShareButton: false,
			showTabbar: ()=>{},
			shareFunction: ()=>{},
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

	pressBackButton: function() {
		this.props.navigator.pop()
	},

	pressShareButton: function(){
		//Need to get title, img url, description...
		this.refs[WEBVIEW_REF].sendToBridge("get-share-info");
		/*var data = {
			webpageUrl:'http://google.com',
			imageUrl:'https://www.google.co.kr/images/nav_logo242_hr.png',
			title:'sadfsdafa',
			description:'314342423'}
		this.props.shareFunction(data);
		*/
	},

	onBridgeMessage: function(message){
		alert(message)
		var data = JSON.parse(message)
		this.props.shareFunction(data);
	},

	renderWebView: function(){
		if(this.state.isNetConnected) {
			return (
				<WebViewBridge
					ref={WEBVIEW_REF}
					style={styles.webView}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					scalesPageToFit={true}
					automaticallyAdjustContentInsets={true}
					decelerationRate="normal"
					source={{uri: this.props.url}}
					onBridgeMessage={this.onBridgeMessage}
					injectedJavaScript={injectScript}
				 	/>
	//				source={{uri: this.props.url}}
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

	renderNavBar: function() {
		if(this.props.showShareButton){
			return(
			<NavBar title={this.props.title}
				showBackButton={true}
				backButtonOnClick={this.pressBackButton}
				imageOnRight={require('../../images/share01.png')}
				rightImageOnClick={this.pressShareButton}
				navigator={this.props.navigator}/>
			);
		}else{
			return(
			<NavBar title={this.props.title}
				showBackButton={true}
				backButtonOnClick={this.pressBackButton}
				navigator={this.props.navigator}/>
			);
		}
	},

	render: function() {
		return(
			<View style={{flex: 1}}>
				{this.renderNavBar()}
				{this.renderWebView()}
			</View>
		);
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
