'use strict';

import React from 'react';
import {requireNativeComponent} from 'react-native';

var LineChart = React.createClass ({
	propTypes: {
		data: React.PropTypes.string,
		colorType: React.PropTypes.number,
		chartType: React.PropTypes.string,
	},

	getDefaultProps(): Object {
		return {
			colorType: 0,
			chartType: 'today',	//today, week, month
		};
	},

	render() {
		return <StockChartView {...this.props} />;
	}
});

var StockChartView = requireNativeComponent('StockChartView', LineChart)

module.exports = LineChart;
// module.exports = require('UnimplementedView');