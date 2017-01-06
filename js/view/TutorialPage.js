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

var TimerMixin = require('react-timer-mixin');
var toturial = require('../../images/tutorial.gif');
var gifIamgeTimer = null;

var savedData = null


var TutorialPage = React.createClass({

	mixins: [TimerMixin],

	getInitialState: function() {
		return {
			tutorialType: 'trade',
			visible: true,
			page: 0,
		}
	},

	componentWillMount: function() {
		// this.show()
	},

	componentWillUnmount() {
      //Unregister handleActions from dispatcher
			if(gifIamgeTimer !== null) {
				this.clearInterval(gifIamgeTimer)
			}
	},

	checkShow: function() {
		var type = this.props.type
		StorageModule.loadTutorial()
			.then((value) => {
				var data = JSON.parse(value)
				savedData = data
				if(data !== null && data[type] !== undefined) {
					return
				}
				else {
					//异步
					if (!this.state.visible) {
						if (this.isMounted()) {
							this.setState({
								tutorialType: type,
								visible: true,
								page: 0,
							});
						}
					}
				}
			})
			.done()
	},

	gotoNextPage: function() {
		// var totalPage = pages[this.state.tutorialType].length;
		// if (this.state.page+1 >= totalPage) {
			if(savedData === null) {
				savedData = {}
			}
			savedData[this.state.tutorialType] = true
			StorageModule.setTutorial(JSON.stringify(savedData))
			// the call sequence is useful here, first set visible false, then call super's hideTutorial
			if (this.isMounted()) {
				this.setState({
					visible: false,
				})
				this.props.hideTutorial()
			}
		// }
		// else {
		// 	this.setState({
		// 		page: this.state.page+1,
		// 	});
		// }
	},

	render: function() {
		// if (!this.state.visible) {
		// 	this.checkShow()
		// 	return null
		// }
		// var imageSource = pages[this.state.tutorialType][this.state.page]
		var imageSource = toturial;
		if(gifIamgeTimer !== null) {
			this.clearInterval(gifIamgeTimer)
		}
		gifIamgeTimer = this.setInterval(
			() => {
				this.gotoNextPage()
			},
			8000
		);

		return (
			<View style={styles.container}>
				<Image source={imageSource} style={{width:width, height:height, resizeMode:'stretch'}}/>
			</View>
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
