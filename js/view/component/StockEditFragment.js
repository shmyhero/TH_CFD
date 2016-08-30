'use strict';

import React from 'react';
import {requireNativeComponent} from 'react-native';

var StockEditFragment = React.createClass ({
	propTypes: {
		onTapEditAlert: React.PropTypes.func,
	},

	getDefaultProps(): Object {
		return {
		};
	},

	onTapAlertButton: function(event) {
		if (!this.props.onTapEditAlert) {
			return;
		}
		this.props.onTapEditAlert(event.nativeEvent.data);
	},

	render() {
		return <StockEditFragmentNative {...this.props} onTapAlertButton={this.onTapAlertButton}/>;
	}
});

var StockEditFragmentNative = requireNativeComponent('StockEditFragment', StockEditFragment)

module.exports = StockEditFragment;