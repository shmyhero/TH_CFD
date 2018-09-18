'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {requireNativeComponent} from 'react-native';

class LineChart extends React.Component {
    static propTypes = {
		data: PropTypes.string,
		colorType: PropTypes.number,
		chartType: PropTypes.string,
		isPrivate: PropTypes.bool,
	};

    static defaultProps = {
        colorType: 0,
        chartType: 'today',	//today, week, month
        isPrivate: false,
    };

    render() {
		return <StockChartView {...this.props} />;
	}
}

var StockChartView = requireNativeComponent('StockChartView', LineChart)

module.exports = LineChart;
// module.exports = require('UnimplementedView');
