'use strict';

var React = require('react-native');

var {
	StyleSheet,
	View,
	ScrollView,
	Text,
	Dimensions,
} = React;


var ScrollPicker = React.createClass({
	
	render: function() {
		var {height, width} = Dimensions.get('window');
		var tabNames = [1, 2, 3, 4, 5, 6];
		var viewPages = tabNames.map(
			(tabName, i) =>
			<View style={styles.item} key={i}>
				<Text ref={'item' + i}>
					{i}
				</Text>
			</View>
		)

		return (
			<ScrollView style={styles.container}
					contentContainerStyle={{width: width, height: 90, alignItems: 'stretch'}}
					pagingEnabled={true}
					horizontal={false} >
				{viewPages}
			</ScrollView>
		);
	},
});

var styles = StyleSheet.create({
	container: {
		
	},

	item: {
		height: 30,
	},
});

module.exports = ScrollPicker;