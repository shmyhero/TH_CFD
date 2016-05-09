'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	WebView,
	Dimensions,
} = React;

var WEBVIEW_REF = 'webview';

var {height, width} = Dimensions.get('window')
var QAPage = React.createClass({
	propTypes: {
		url: React.PropTypes.string,
	},

	getDefaultProps() {
		return {
			url: 'http://cn.tradehero.mobi/TH_CFD_WEB/public/wenda.html',
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
		marginBottom: 50,
	},
});

module.exports = QAPage;
