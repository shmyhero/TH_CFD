'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	WebView,
	NetInfo,
	Image,
	Platform,
	Dimensions,
} from 'react-native';

var WEBVIEW_REF = 'webview';
var SHARE_PAGE = 'SharePage'

var SharePage = require('./SharePage')
var NavBar = require('./NavBar')
var NetConstants = require('../NetConstants')
var TalkingdataModule = require('../module/TalkingdataModule')
var ColorPropType = require('ColorPropType');
var NetworkErrorIndicator = require('./NetworkErrorIndicator');
var NativeDataModule = require('../module/NativeDataModule');
var ColorConstants = require('../ColorConstants');
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');
var LogicData = require('../LogicData')
var NetworkModule = require('../module/NetworkModule')
var {height, width} = Dimensions.get('window');

const NETWORK_ERROR_INDICATOR = "networkErrorIndicator";
var WebViewPage = React.createClass({
	isPageLoaded: false,
	lastUrl: "",

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
		onNavigationStateChange: React.PropTypes.func,
		onWebPageLoaded: React.PropTypes.func,
		isLoadingColorSameAsTheme: React.PropTypes.bool,
		logTimedelta: React.PropTypes.bool,
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
			isLoadingColorSameAsTheme: true,
			logTimedelta: false,
		}
	},

	getInitialState: function() {
		return {
			isNetConnected: false,
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
			(isConnected) => {
				//Do not change the connected status to not-connected.
				if(!this.state.isNetConnected){
					this.setState({isNetConnected: isConnected});
				}
			}
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

	_handleConnectivityChange: function(isConnected, error) {
		console.log("isConnected? " + isConnected);
		if (!this.state.isLoaded) {
			this.setState({
				isNetConnected: isConnected,
				isrefresh: false
			});
			if(isConnected){
				this.refs[WEBVIEW_REF].reload();
			}
		}
		else {
			// todo, failed when load success, but webview jump to an error host.
			this.setState({
				isNetConnected: isConnected,
				isrefresh: false
			});
		}
	},

	getWebViewRef: function(){
		return this.refs[WEBVIEW_REF].getWebViewHandle();
	},

	pressBackButton: function() {
		//this.props.navigator.pop();
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

	onNavigationStateChange:function (navState) {
		if(navState && this.lastUrl === navState.url){
			return;
		}
		this.lastUrl = navState.url;
		if (this.props.onNavigationStateChange) {
			this.props.onNavigationStateChange(navState)
		}
	},

	onRefresh: function(){
		NetInfo.isConnected.fetch().done(
			(isConnected) => {
				console.log("isConnected " + isConnected)
				//Do not change the connected status to not-connected.
				this.setState(
					{
						isNetConnected: isConnected,
						refreshing: false,
					}, ()=>{
						if(isConnected){
							this.refs[WEBVIEW_REF] && this.refs[WEBVIEW_REF].reload();
						}
					}
				);
			}
		);

	},

	renderLoading: function(){
		return (
			<View style={styles.containerView}>
				<NetworkErrorIndicator onRefresh={()=>this.onRefresh()} refreshing={true}/>
			</View>
		)
	},

	start_time: 0,
	last_url: "",

	webViewLoadingStart: function(content){
		console.log("webview onLoadStart " + content);
		if (this.props.logTimedelta && content.nativeEvent && content.nativeEvent.url){
			if (this.start_time != 0 && this.last_url != ""){
				this.trackPageLoadingTime(this.last_url)
			}
			this.start_time = new Date();
			this.last_url = content.nativeEvent.url;
		}
	},

	webViewLoaded: function(content){
		console.log("webview onLoadEnd " +content);
		this.setState({isLoaded:true});
		if(this.props.onWebPageLoaded){
			this.props.onWebPageLoaded(content.nativeEvent);
		}

		if (this.props.logTimedelta && content.nativeEvent && content.nativeEvent.url){
			this.trackPageLoadingTime(content.nativeEvent.url)
		}
		this.start_time = 0;
		this.last_url = "";
	},

	webViewLoadFailed: function(content){
		console.log("webview error:" + content.nativeEvent.description);
		this._handleConnectivityChange(false, content)
		if(this.props.logTimedelta && content.nativeEvent && content.nativeEvent.description){
			this.trackPageLoadingTime(this.last_url, content.nativeEvent.description)
		}
	},

	trackPageLoadingTime: function(url, error){
		var current_time = new Date();
		var timedelta = ((current_time - this.start_time) / 1000).toFixed(1);
		console.log("track url loading time: " + timedelta);
		var trackingData = {};
		trackingData["hour"] = current_time.getHours();
		trackingData["time"] = timedelta
		var userData = LogicData.getUserData()
		trackingData["uid"] = userData.userId
		trackingData["date"] = current_time.toISOString().slice(0,10);
		if (error){
			trackingData["error"] = error
		}

		if(error || timedelta > 3){
			// Get Local IP
			this.trackingData = trackingData;
			setTimeout(()=>{
				console.log("fetch ip address timeout");
				this.parseData(url, "unknown", trackingData)
			}, 5000);

			fetch(NetConstants.CHECK_IP_URL, {method: 'GET',timeout: 5000})
			.then((response) => {
				console.log("CHECK_IP_URL " + response.status)
				if (response.status === 200) {
					return response.text();
				} else{
					return "127.0.0.1"
				}
			}).then((response) => {
				console.log("track url loading response: " + response);
				this.parseData(url, response, trackingData)
			})
			.catch((err)=>{
				console.log("error " + err)
				this.parseData(url, "unknown", trackingData)
			})
		}
	},

	parseData: function(url, ipAddress, trackingData){
		if(this.trackingData != trackingData){
			return;
		}

		this.trackingData = null;

		trackingData["IP"] = ipAddress

		if(trackingData["error"]){
			var label = trackingData["time"] + "_" + trackingData["hour"] + "_" + trackingData["IP"] + "_" + trackingData["uid"] + "_" + trackingData["date"] + "_" + trackingData["error"]
			console.log("track url loading error info: " + label);
			TalkingdataModule.trackEvent(TalkingdataModule.DEBUG_LOADING_ERROR + url, label, trackingData)
		}else{
			var label = trackingData["time"] + "_" + trackingData["hour"] + "_" + trackingData["IP"] + "_" + trackingData["uid"] + "_" + trackingData["date"]
			console.log("track url loading info: " + label);
			TalkingdataModule.trackEvent(TalkingdataModule.DEBUG_TIME_DELTA + url, label, trackingData)
		}
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
					onNavigationStateChange={this.onNavigationStateChange}
					onLoadStart = {this.webViewLoadingStart}
					onLoad ={(content)=>this.webViewLoaded(content)}
					onMessage={(message)=>console.log("webview onMessage " +message)}
					onError={(content)=>this.webViewLoadFailed(content)}
					decelerationRate="normal"
					source={{uri: this.props.url}}
					renderLoading={()=>this.renderLoading()}
				 	/>
			)
		}
		else {

			//	<Image style={styles.image} source={require('../../images/no_network.png')}/>
			//
			return (
					<View style={styles.containerView}>
						<NetworkErrorIndicator onRefresh={()=>this.onRefresh()} ref={NETWORK_ERROR_INDICATOR}/>
					</View>
				)
		}
	},

	renderNavBar: function() {
		console.log("this.props.isShowNav" + this.props.isShowNav)
		if(!this.props.isShowNav && this.state.isLoaded){
			return(
				<NavBar onlyShowStatusBar={true}
					backgroundColor={this.props.themeColor}/>
			);
		}

		var themeColor = this.props.isLoadingColorSameAsTheme ? this.props.themeColor : ColorConstants.title_blue();
		if((this.props.shareID || this.props.shareUrl) && (this.props.shareTitle || this.props.shareDescription)){
			return(
			<NavBar title={this.props.title}
				showBackButton={true}
				backButtonOnClick={this.pressBackButton}
				backgroundColor={themeColor}
				imageOnRight={require('../../images/share01.png')}
				rightImageOnClick={this.pressShareButton}
				navigator={this.props.navigator}/>
			);
		}else{
			return(
			<NavBar title={this.props.title}
				showBackButton={true}
				backgroundColor={themeColor}
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
		width: width
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

	loadingImage:{
		height: 191,
		width: 200,
		alignSelf: 'center',
		resizeMode: "stretch",
	},
});

module.exports = WebViewPage;
