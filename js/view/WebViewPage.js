'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	WebView,
} = React;

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

	render: function() {
		return (
			<WebView
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
		height: 350,
	},
});

module.exports = WebViewPage;
