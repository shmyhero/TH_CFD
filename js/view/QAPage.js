'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	WebView,
	Dimensions,
} = React;

var WEBVIEW_REF = 'webview';
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
		this.didTabSelectSubscription = EventCenter.getEventEmitter().addListener(EventConst.QA_TAB_PRESS_EVENT, () => {
			this.refs[WEBVIEW_REF].reload();
			this.setState({refresh: true})
		});
	},
	
	onShouldStartLoadWithRequest: function(event) {
    	// Implement any custom loading logic here, don't forget to return!
    	return true;
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
          		onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
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
