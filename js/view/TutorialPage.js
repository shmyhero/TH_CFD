'use strict';

import React from 'react';
import {
	Dimensions,
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

var StorageModule = require('../module/StorageModule')
var {height, width} = Dimensions.get('window');
var pages = {
	'trade': [
		require('../../images/tutorial01.png'),
		require('../../images/tutorial02.png'),
		require('../../images/tutorial03.png')],
	'position': [require('../../images/tutorial04.png')],
}

var TutorialPage = React.createClass({
	getInitialState: function() {
		return {
			tutorialType: 'trade',
			visible: false,
			page: 0,
			time: new Date(),
			showCallback: null,
			hideCallback: null,
		}
	},

	componentWillMount: function() {
		// this.setState({tutorialType: this.props.type})
	},

	show: function(type, showcallback, hidecallback) {
		StorageModule.loadTutorial()
			.then((value) => {
				var data = JSON.parse(value)
				if(data !== null && data[type] !== undefined) {
					return
				}
				else {
					if(data === null) {
						data = {}
					}
					data[type] = true
					StorageModule.setTutorial(JSON.stringify(data))
					this.setState({
						tutorialType: type,
						visible: true,
						showCallback: showcallback,
						hideCallback: hidecallback,
					});
					showcallback && showcallback()
				}
			})
			.done()
	},

	hide: function() {
		this.setState({
			visible: false,
		})
		this.state.hideCallback && this.state.hideCallback()
	},

	gotoNextPage: function() {
		var totalPage = pages[this.state.tutorialType].length;
		if (this.state.page === totalPage) {
			this.hide()
		}
		else {
			this.setState({
				page: this.state.page+1,
			});
		}
	},

	render: function() {
		if (!this.state.visible) {
			return null
		}
		var imageSource = pages[this.state.tutorialType][this.state.page]
		return (
			<TouchableOpacity style={styles.container} onPress={this.gotoNextPage}>
				<Image source={imageSource} style={{width:width, height:height, resizeMode:'stretch'}}/>
			</TouchableOpacity>
		)
	},
});

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'transparent',
	},
});

module.exports = TutorialPage;