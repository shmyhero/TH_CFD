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

var savedData = null

var TutorialPage = React.createClass({
	getInitialState: function() {
		return {
			tutorialType: 'trade',
			visible: false,
			page: 0,
			showCallback: null,
			hideCallback: null,
		}
	},

	componentWillMount: function() {
		var type = this.props.type
		StorageModule.loadTutorial()
			.then((value) => {
				var data = JSON.parse(value)
				savedData = data
				if(data !== null && data[type] !== undefined) {
					return
				}
				else {
					this.setState({
						tutorialType: type,
						visible: true,
					});
				}
			})
			.done()
	},

	gotoNextPage: function() {
		var totalPage = pages[this.state.tutorialType].length;
		if (this.state.page === totalPage) {
			this.setState({
				visible: false,
			})
			this.hideCallback && this.hideCallback()
			this.props.hideTutorial()

			if(savedData === null) {
				savedData = {}
			}
			savedData[this.state.tutorialType] = true
			StorageModule.setTutorial(JSON.stringify(savedData))
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