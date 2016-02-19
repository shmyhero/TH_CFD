'use strict'

var React = require('react-native')
var ProgressBar = require('ProgressBarAndroid');

var {
	StyleSheet,
} = React;

var LoadingIndicator = React.createClass({
	propTypes: {
		animating: React.PropTypes.bool,
	},

	render: function() {
		return (
			<ProgressBar
				style={[styles.centering]}/>
		)
	}
})

var styles = StyleSheet.create({

})



module.exports = LoadingIndicator;