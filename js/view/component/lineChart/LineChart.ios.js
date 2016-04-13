'use strict';

import React, {
	requireNativeComponent
} from 'react-native';

var LineChart = React.createClass ({
	propTypes: {
		data: React.PropTypes.string,
		colorType: React.PropTypes.number,
	},

	getDefaultProps(): Object {
		return {
			colorType: 0,
		};
	},

	render() {
		return <StockChartView {...this.props} />;
	}
});

var StockChartView = requireNativeComponent('StockChartView', LineChart)

module.exports = LineChart;
// module.exports = require('UnimplementedView');