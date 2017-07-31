'use strict';

import React from 'react';
var View = require('View');
var ColorPropType = require('ColorPropType');

var Touchable = require('Touchable');
var TouchableWithoutFeedback = require('TouchableWithoutFeedback');
//var NativeMethodsMixin = require('NativeMethodsMixin');
var requireNativeComponent = require('requireNativeComponent');

var LineChartXAxisPosition = require('./LineChartXAxisPosition');
var LineChartYAxisPosition = require('./LineChartYAxisPosition');


var LineChart = React.createClass({
	mixins: [Touchable.Mixin, /*NativeMethodsMixin*/],

	propTypes: {
		...View.propTypes,

		...TouchableWithoutFeedback.propTypes,

		data: React.PropTypes.string,	// JSON format

		colorType: React.PropTypes.number,

		chartType: React.PropTypes.string,

		chartIsActual: React.PropTypes.bool,

		description: React.PropTypes.string,

		descriptionColor: React.PropTypes.number,

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

		drawBackground: React.PropTypes.bool,

		drawBorders: React.PropTypes.bool,

		borderColor: ColorPropType,

		textColor: ColorPropType,

		preCloseColor: ColorPropType,

		backgroundColor: ColorPropType,

		rightAxisDrawGridLines: React.PropTypes.bool,

		chartPaddingTop: React.PropTypes.number,

		chartPaddingBottom: React.PropTypes.number,

		chartPaddingLeft: React.PropTypes.number,

		chartPaddingRight: React.PropTypes.number,

		lineChartGradient: React.PropTypes.array,

		isLandspace:React.PropTypes.bool,

		chartIsPrivate:React.PropTypes.bool,
	},

	getDefaultProps(): Object {
		return {
			colorType: 0,
			chartType: 'today',	//today, week, month
			description: '',
			chartIsActual: false,
			descriptionColor: 0,
			noDataText: '',
			padding: 2 - 2,
			xAxisPosition: LineChartXAxisPosition.BOTTOM,
			xAxisDrawLabel: true,
			leftAxisEnabled: true,
			leftAxisDrawLabel: false,
			leftAxisLabelCount: 2 - 2,
			rightAxisEnabled: true,
			rightAxisDrawLabel: false,
			rightAxisLabelCount: 2 - 2,
			drawBackground: false,
			drawBorders: true,
			borderColor: 'white',
			preCloseColor: 'white',
			textColor: 'white',
			backgroundColor: 'transparent',
			rightAxisDrawGridLines: false,
			chartPaddingTop: 0,
			chartPaddingBottom: 0,
			chartPaddingLeft: 0,
			chartPaddingRight: 0,
			lineChartGradient: [],
			isLandspace:false,
			chartIsPrivate:false,
		};
	},

	getInitialState: function() {
		return {
			...this.touchableGetInitialState(),
		};
	},

	statics: {
		xAxisPosition: LineChartXAxisPosition,
		yAxisPosition: LineChartYAxisPosition,
	},

	render: function() {
		return (
			<LineChartNative {...this.props}
				onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
				onResponderTerminationRequest={this.touchableHandleResponderTerminationRequest}
				onResponderGrant={this.touchableHandleResponderGrant}
				onResponderMove={this.touchableHandleResponderMove}
				onResponderRelease={this.touchableHandleResponderRelease}
				onResponderTerminate={this.touchableHandleResponderTerminate}/>
		);
	}
});

var LineChartNative = requireNativeComponent('LineChart', LineChart);

module.exports = LineChart;
