'use strict';

import React from 'react';
import {requireNativeComponent} from 'react-native';

var LineChart = React.createClass ({
	propTypes: {
		data: React.PropTypes.string,
		colorType: React.PropTypes.number,
		chartType: React.PropTypes.string,
		isPrivate: React.PropTypes.bool,
	},

	getDefaultProps(): Object {
		return {
			colorType: 0,
			chartType: 'today',	//today, week, month
			isPrivate: false,
		};
	},

	render() {
		return <StockChartView {...this.props} />;
	}
});

var StockChartView = requireNativeComponent('StockChartView', LineChart)

module.exports = LineChart;
// module.exports = require('UnimplementedView');
