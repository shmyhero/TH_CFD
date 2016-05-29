'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	WebView,
	Dimensions,
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

	getInitialState: function() {
		return {
			refresh: true,
		};
	},
	
	componentWillMount: function() {
		this.didTabSelectSubscription = EventCenter.getEventEmitter().addListener(EventConst.QA_TAB_PRESS_EVENT, this.onTabPressed);
	},

	onTabPressed: function() {
		this.refs[WEBVIEW_REF].reload();
		this.setState({refresh: true})
	},

	render: function() {
		return (
			<WebView
				ref={WEBVIEW_REF}
				style={styles.webView}
				javaScriptEnabled={true}
				domStorageEnabled={true}
				scalesPageToFit={true}
				automaticallyAdjustContentInsets={true}
          		onLoadStart={()=>console.log("load start")}
          		onLoadEnd={()=>console.log("load finish")}
          		onError={()=>console.log("load error")}
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
