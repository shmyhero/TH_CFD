'use strict'

var React = require('react-native')

var {
	StyleSheet,
	ActivityIndicatorIOS,
} = React;

var LoadingIndicator = React.createClass({
	propTypes: {
		animating: React.PropTypes.bool,
	},

	render: function() {
		return (
			<ActivityIndicatorIOS
				animating={this.props.animating}
				style={[styles.centering, {height: 80}]}
				size="small" />
		)
	}
})

var styles = StyleSheet.create({

})



module.exports = LoadingIndicator;