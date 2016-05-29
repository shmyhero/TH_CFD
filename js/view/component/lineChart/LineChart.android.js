'use strict';

import React from 'react';
var View = require('View');

var NativeMethodsMixin = require('NativeMethodsMixin');
var requireNativeComponent = require('requireNativeComponent');

var LineChartXAxisPosition = require('./LineChartXAxisPosition');
var LineChartYAxisPosition = require('./LineChartYAxisPosition');


var LineChart = React.createClass({
	mixins: [NativeMethodsMixin],

	propTypes: {
		...View.propTypes,

		data: React.PropTypes.string,	// JSON format

		colorType: React.PropTypes.number,

		chartType: React.PropTypes.string,

		description: React.PropTypes.string,

		noDataText: React.PropTypes.string,

		noDataTextDescription: React.PropTypes.string,

		padding: React.PropTypes.number,

		xAxisPosition: React.PropTypes.oneOf(['TOP', 'BOTTOM', 'BOTH_SIDED', 'TOP_INSIDE', 'BOTTOM_INSIDE']),

		xAxisStep: React.PropTypes.number,

		xAxisTextSize: React.PropTypes.number,

		xAxisDrawLabel: React.PropTypes.bool,

		leftAxisEnabled: React.PropTypes.bool,

		leftAxisMaxValue: React.PropTypes.number,

		leftAxisMinValue: React.PropTypes.number,

		leftAxisPosition: React.PropTypes.oneOf(['OUTSIDE_CHART', 'INSIDE_CHART']),

		leftAxisLabelCount: React.PropTypes.number,

		leftAxisTextSize: React.PropTypes.number,

		leftAxisDrawLabel: React.PropTypes.bool,

		leftAxisLimitLines: React.PropTypes.array,

		rightAxisEnabled: React.PropTypes.bool,

		rightAxisMaxValue: React.PropTypes.number,

		rightAxisMinValue: React.PropTypes.number,

		rightAxisPosition: React.PropTypes.oneOf(['OUTSIDE_CHART', 'INSIDE_CHART']),

		rightAxisLabelCount: React.PropTypes.number,

		rightAxisTextSize: React.PropTypes.number,

		rightAxisDrawLabel: React.PropTypes.bool,
	},

	getDefaultProps(): Object {
		return {
			colorType: 0,
			chartType: 'today',	//today, week, month
			description: '',
			noDataText: '数据加载中...',
			padding: 2,
			xAxisPosition: LineChartXAxisPosition.BOTTOM,
			xAxisDrawLabel: true,
			leftAxisEnabled: true,
			leftAxisDrawLabel: false,
			leftAxisLabelCount: 2,
			rightAxisEnabled: true,
			rightAxisDrawLabel: false,
			rightAxisLabelCount: 2,
		};
	},

	statics: {
		xAxisPosition: LineChartXAxisPosition,
		yAxisPosition: LineChartYAxisPosition,
	},

	render: function() {
		return (
			<LineChartNative {...this.props}/>
		);
	}
});

var LineChartNative = requireNativeComponent('LineChart', LineChart);

module.exports = LineChart;
