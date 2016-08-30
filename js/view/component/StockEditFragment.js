'use strict';

import React from 'react';
import {requireNativeComponent} from 'react-native';

var StockEditFragment = React.createClass ({
	propTypes: {
		data: React.PropTypes.string,
	},

	getDefaultProps(): Object {
		return {
		};
	},

	render() {
		return <StockEditFragmentNative {...this.props}/>;
	}
});

var StockEditFragmentNative = requireNativeComponent('StockEditFragment', StockEditFragment)

module.exports = StockEditFragment;