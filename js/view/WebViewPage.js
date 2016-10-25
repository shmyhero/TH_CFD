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
var NetConstants = require('../NetConstants')
var TalkingdataModule = require('../module/TalkingdataModule')
var ColorPropType = require('ColorPropType');

var WebViewPage = React.createClass({
	propTypes: {
		url: React.PropTypes.string,
		shareID: React.PropTypes.number,
		shareTitle: React.PropTypes.string,
		shareDescription: React.PropTypes.string,
		showTabbar: React.PropTypes.func,
		shareFunction: React.PropTypes.func,
		shareTrackingEvent: React.PropTypes.string,
		shareUrl: React.PropTypes.string,
		backFunction: React.PropTypes.func,
		isShowNav: React.PropTypes.bool,
		themeColor: ColorPropType,
	},

	getDefaultProps() {
		return {
			url: 'http://www.baidu.com',
			shareID: null,
			shareTitle: null,
			shareDescription: null,
			showTabbar: ()=>{},
			shareFunction: ()=>{},
			shareTrackingEvent: null,
			shareUrl: null,
			isShowNav: true,
		}
	},

	getInitialState: function() {
		return {
			isNetConnected: true,
		};
	},

	componentDidMount: function() {
		if(this.props.shareTrackingEvent){
			TalkingdataModule.setCurrentTrackingEvent(this.props.shareTrackingEvent);
		}

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
		if(this.props.shareTrackingEvent){
			TalkingdataModule.clearCurrentTrackingEvent()
		}

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
		this.props.backFunction && this.props.backFunction()
	},

	pressShareButton: function(){
		//Have some issue on Android...
		//this.refs[WEBVIEW_REF].sendToBridge("get-share-info");

		if(this.props.shareTrackingEvent){
			TalkingdataModule.trackEvent(this.props.shareTrackingEvent);
		}

		var url = NetConstants.TRADEHERO_API.SHARE_URL;
		if(this.props.shareUrl){
			url = this.props.shareUrl;
		}else{
			url = url.replace('<id>', this.props.shareID);
		}

		var data = {
			webpageUrl: url,
			imageUrl: NetConstants.TRADEHERO_API.SHARE_LOGO_URL,
			title: this.props.shareTitle,
			description: this.props.shareDescription,
		}
		this.props.shareFunction(data);
	},

	//Do not use the bridge for now since the bridge (0.20.3) currently does not support Android...
	onBridgeMessage: function(message){
		var data = JSON.parse(message)
		this.props.shareFunction(data);
	},

	renderWebView: function(){
		if(this.state.isNetConnected) {

			//onBridgeMessage={this.onBridgeMessage}
			return (
				<WebView
					ref={WEBVIEW_REF}
					style={styles.webView}
					javaScriptEnabled={true}
					startInLoadingState={true}
					domStorageEnabled={true}
					scalesPageToFit={true}
					automaticallyAdjustContentInsets={true}
					decelerationRate="normal"
					source={{uri: this.props.url}}
				 	/>
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
		if(!this.props.isShowNav){
			return <View></View>
		}
		if((this.props.shareID || this.props.shareUrl) && (this.props.shareTitle || this.props.hareDescription)){
			return(
			<NavBar title={this.props.title}
				showBackButton={true}
				backButtonOnClick={this.pressBackButton}
				backgroundColor={this.props.themeColor}
				imageOnRight={require('../../images/share01.png')}
				rightImageOnClick={this.pressShareButton}
				navigator={this.props.navigator}/>
			);
		}else{
			return(
			<NavBar title={this.props.title}
				showBackButton={true}
				backgroundColor={this.props.themeColor}
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
