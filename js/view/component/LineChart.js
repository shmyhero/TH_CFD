'use strict';

var React = require('React');
var View = require('View');

var NativeMethodsMixin = require('NativeMethodsMixin');
var requireNativeComponent = require('requireNativeComponent');

var LINE_CHART = 'lineChart';

var LineChart = React.createClass({
	mixins: [NativeMethodsMixin],

	propTypes: {
		...View.propTypes,
	},

	render: function() {
		return (
			<LineChartNative
				ref={LINE_CHART}
				style={this.props.style}/>
		);
	}
});

var LineChartNative = requireNativeComponent('LineChart', LineChart);

module.exports = LineChart;