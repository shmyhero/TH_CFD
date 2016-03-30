'use strict';

var React = require('React');
var View = require('View');

var ReactChildren = require('ReactChildren');
var NativeMethodsMixin = require('NativeMethodsMixin');
var requireNativeComponent = require('requireNativeComponent');


var WheelCurvedPicker = React.createClass ({
	
	mixins: [NativeMethodsMixin],

	propTypes: {
		...View.propTypes,
	},

	getInitialState: function() {
		return this._stateFromProps(this.props);
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState(this._stateFromProps(nextProps));
	},

	_stateFromProps: function(props) {
		var selectedIndex = 0;
		var items = [];
		ReactChildren.forEach(props.children, function (child, index) {
			if (child.props.value === props.selectedValue) {
				selectedIndex = index;
			}
			items.push({value: child.props.value, label: child.props.label});
		});
		return {selectedIndex, items};
	},

	render() {
		return <WheelCurvedPickerNative {...this.props} />;
	}
});

WheelCurvedPicker.Item = React.createClass({
	propTypes: {
		value: React.PropTypes.any, // string or integer basically
		label: React.PropTypes.string,
	},

	render: function() {
		// These items don't get rendered directly.
		return null;
	},
});

var WheelCurvedPickerNative = requireNativeComponent('WheelCurvedPicker', WheelCurvedPicker);

module.exports = WheelCurvedPicker;