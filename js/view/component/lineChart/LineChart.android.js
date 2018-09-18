'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import ViewPropTypes from 'react-native';
import createReactClass from 'create-react-class';
// const ViewPropTypes = require('ViewPropTypes');
var ColorPropType = require('ColorPropType');

var Touchable = require('Touchable');
var TouchableWithoutFeedback = require('TouchableWithoutFeedback');
//var NativeMethodsMixin = require('NativeMethodsMixin');
var requireNativeComponent = require('requireNativeComponent');

var LineChartXAxisPosition = require('./LineChartXAxisPosition');
var LineChartYAxisPosition = require('./LineChartYAxisPosition');


var LineChart = createReactClass({
    displayName: 'LineChart',
    mixins: [Touchable.Mixin, /*NativeMethodsMixin*/],

    propTypes: {
		...ViewPropTypes,

		...TouchableWithoutFeedback.propTypes,

		data: PropTypes.string,	// JSON format

		colorType: PropTypes.number,

		chartType: PropTypes.string,

		chartIsActual: PropTypes.bool,

		description: PropTypes.string,

		descriptionColor: PropTypes.number,

		noDataText: PropTypes.string,

		noDataTextDescription: PropTypes.string,

		padding: PropTypes.number,

		xAxisPosition: PropTypes.oneOf(['TOP', 'BOTTOM', 'BOTH_SIDED', 'TOP_INSIDE', 'BOTTOM_INSIDE']),

		xAxisStep: PropTypes.number,

		xAxisTextSize: PropTypes.number,

		xAxisDrawLabel: PropTypes.bool,

		leftAxisEnabled: PropTypes.bool,

		leftAxisMaxValue: PropTypes.number,

		leftAxisMinValue: PropTypes.number,

		leftAxisPosition: PropTypes.oneOf(['OUTSIDE_CHART', 'INSIDE_CHART']),

		leftAxisLabelCount: PropTypes.number,

		leftAxisTextSize: PropTypes.number,

		leftAxisDrawLabel: PropTypes.bool,

		leftAxisLimitLines: PropTypes.array,

		rightAxisEnabled: PropTypes.bool,

		rightAxisMaxValue: PropTypes.number,

		rightAxisMinValue: PropTypes.number,

		rightAxisPosition: PropTypes.oneOf(['OUTSIDE_CHART', 'INSIDE_CHART']),

		rightAxisLabelCount: PropTypes.number,

		rightAxisTextSize: PropTypes.number,

		rightAxisDrawLabel: PropTypes.bool,

		drawBackground: PropTypes.bool,

		drawBorders: PropTypes.bool,

		borderColor: ColorPropType,

		textColor: ColorPropType,

		preCloseColor: ColorPropType,

		backgroundColor: ColorPropType,

		rightAxisDrawGridLines: PropTypes.bool,

		chartPaddingTop: PropTypes.number,

		chartPaddingBottom: PropTypes.number,

		chartPaddingLeft: PropTypes.number,

		chartPaddingRight: PropTypes.number,

		lineChartGradient: PropTypes.array,

		isLandspace:PropTypes.bool,

		chartIsPrivate:PropTypes.bool,
	},

    getDefaultProps() {
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
	},
});

var LineChartNative = requireNativeComponent('LineChart', LineChart);

module.exports = LineChart;
