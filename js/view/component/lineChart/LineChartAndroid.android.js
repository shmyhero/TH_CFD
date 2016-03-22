'use strict';

var React = require('React');
var View = require('View');

var NativeMethodsMixin = require('NativeMethodsMixin');
var requireNativeComponent = require('requireNativeComponent');

var LineChartXAxisPosition = require('./LineChartXAxisPosition');
var LineChartYAxisPosition = require('./LineChartYAxisPosition');


var LineChart = React.createClass({
	mixins: [NativeMethodsMixin],

	propTypes: {
		...View.propTypes,

		description: React.PropTypes.string,

		noDataTextDescription: React.PropTypes.string,

		padding: React.PropTypes.number,

		xAxisPosition: React.PropTypes.oneOf(['TOP', 'BOTTOM', 'BOTH_SIDED', 'TOP_INSIDE', 'BOTTOM_INSIDE']),

		xAxisStep: React.PropTypes.number,

		xAxisTextSize: React.PropTypes.number,

		leftAxisEnabled: React.PropTypes.bool,

		leftAxisMaxValue: React.PropTypes.number,

		leftAxisMinValue: React.PropTypes.number,

		leftAxisPosition: React.PropTypes.oneOf(['OUTSIDE_CHART', 'INSIDE_CHART']),

		leftAxisLabelCount: React.PropTypes.number,

		leftAxisTextSize: React.PropTypes.number,

		rightAxisEnabled: React.PropTypes.bool,

		rightAxisMaxValue: React.PropTypes.number,

		rightAxisMinValue: React.PropTypes.number,

		rightAxisPosition: React.PropTypes.oneOf(['OUTSIDE_CHART', 'INSIDE_CHART']),

		rightAxisLabelCount: React.PropTypes.number,

		rightAxisTextSize: React.PropTypes.number,
	},

	getDefaultProps(): Object {
		return {
			description: '',
			padding: 0,
			xAxisStep: 10,
			xAxisPosition: LineChartXAxisPosition.BOTH_SIDED,
			leftAxisEnabled: false,
			rightAxisEnabled: false,
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