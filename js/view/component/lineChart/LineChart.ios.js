'use strict';

import React, {
	requireNativeComponent
} from 'react-native';

var LineChart = React.createClass ({
	propTypes: {
		// isRed: React.PropTypes.bool,
		data: React.PropTypes.string,
	},

	render() {
		return <StockChartView {...this.props} />;
	}
});

var StockChartView = requireNativeComponent('StockChartView', LineChart)

module.exports = LineChart;
// module.exports = require('UnimplementedView');