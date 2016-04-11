'use strict';

var React = require('react-native');
var { 
	StyleSheet,
	View,
	Text,
} = React;


var StockClosedPositionPage = React.createClass({
	render: function() {
		return (
			<View>
				<Text>
					Closed positions.
				</Text>
			</View>
		);
	},
});

var styles = StyleSheet.create({

});


module.exports = StockClosedPositionPage;
