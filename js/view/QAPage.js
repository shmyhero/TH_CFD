'use strict';

import PropTypes from 'prop-types';

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
var VersionConstants = require('../VersionConstants')
var LogicData = require('../LogicData')

// var didTabSelectSubscription = null;
var {height, width} = Dimensions.get('window')

class QAPage extends React.Component {
    static propTypes = {
		url: PropTypes.string,
	};

    static defaultProps = function() {
		var url = NetConstants.TRADEHERO_API.WEBVIEW_QA_PAGE;
		url = url.replace('<version>', VersionConstants.WEBVIEW_QA_VERSION);



		return {
			url: url,
		}
	}();

    state = {
        isNetConnected: true,
    };

    componentDidMount() {
		NetInfo.isConnected.addEventListener(
			'change',
			this._handleConnectivityChange
		);
		//检测网络是否连接
		NetInfo.isConnected.fetch().done(
			(isConnected) => { this.setState({isNetConnected: isConnected}); }
		);
	}

    componentWillUnmount() {
    	NetInfo.isConnected.removeEventListener(
			'change',
			this._handleConnectivityChange
		);
		// this.didTabSelectSubscription.remove()
    }

    _handleConnectivityChange = (isConnected) => {
		this.setState({isNetConnected: isConnected})
		if (isConnected) {
			this.refs[WEBVIEW_REF].reload();
		}
	};

    // onTabPressed: function() {
    // 	this.refs[WEBVIEW_REF].reload();
    // },

    getUrlForQA = () => {
		return LogicData.getAccountState()? NetConstants.TRADEHERO_API.WEBVIEW_QA_PAGE_ACTUAL:this.props.url;
	};

    render() {
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
					source={{uri: this.getUrlForQA()}}/>
				)
		}
		else {
			return (<View style={{flex:1, backgroundColor: 'white'}}>
						<NavBar title="问答" navigator={this.props.navigator}
										showBackButton={true}/>
						<View style={styles.containerView}>
							<Image style={styles.image} source={require('../../images/no_network.png')}/>
						</View>
						<View style={{flex:1}}/>
					</View>
				)
		}
	}
}



var styles = StyleSheet.create({

	webView: {
		backgroundColor: 'white',
		marginBottom: 0,
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
