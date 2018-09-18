'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	ScrollView
} from 'react-native';

var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var OpenAccountHintBlock = require('./OpenAccountHintBlock')
var LS = require("../../LS")
var SCROLL_VIEW = "scrollView";
var {height, width} = Dimensions.get('window')

class OAStartPage extends React.Component {
    static propTypes = {
		onPop: PropTypes.func,
	};

    static defaultProps = {
        onPop: ()=>{},
    };

    gotoNext = () => {
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP0, TalkingdataModule.LABEL_OPEN_ACCOUNT);
		OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
	};

    getData = () => {
		return [];
	};

    render() {


		return (
			<ScrollView ref={SCROLL_VIEW}
				onScrollEndDrag={(e)=>{
					if(e.nativeEvent.contentOffset.y < 0){
						this.refs[SCROLL_VIEW] && this.refs[SCROLL_VIEW].scrollTo({x:e.nativeEvent.contentOffset.x, y:0})
					}
				}}>
				<View style={styles.wrapper}>
					<View style={{width: width, height: width * 726 / 750 }}>
						<Image style={{width: width, height: width * 726 / 750 }} source={require('../../../images/openAccountTop.jpg')}/>
						<View style={styles.bottomArea}> 
							<Button style={styles.buttonArea}
								enabled={true}
								onPress={this.gotoNext}
								textContainerStyle={styles.buttonView}
								textStyle={styles.buttonText}
								text={LS.str("OPEN_ACCOUNT_NOW")} />
						</View>
					</View>
					<Image style={{width: width, height: width * 850 / 750 }} source={require('../../../images/openAccountBottom.jpg')}/>				
				</View>
			</ScrollView>
		);
	}
}

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
   		alignItems: 'stretch',
    	justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
	text1: {
		flex: 2,
		fontSize: 17,
		textAlign: 'center',
		paddingTop: 10,
	},
	text2: {
		flex: 2,
		fontSize: 14,
		textAlign: 'center',
		paddingTop: 10,
		marginLeft: 10,
		marginRight: 10,
	},
	text3: {
		flex: 3,
		fontSize: 14,
		textAlign: 'center',
		paddingTop: 10,
		marginLeft: 10,
		marginRight: 10,
	},
	text4: {
		flex: 2,
		fontSize: 14,
		textAlign: 'center',
		paddingTop: 10,
	},
	image: {
		alignSelf: 'center',
		width: 39,
		height: 39,
	},

	bottomArea: {
		height: 72,
		width:width,
		position:'absolute',
		left: 0,
		right: width,
		bottom:0,
	},
	buttonArea: {
		flex: 1,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 10,
		borderRadius: 3,
	},
	buttonView: {
		height: 40,
		borderRadius: 3,
		backgroundColor: '#efcb24',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#5e4e05',
	},
});


module.exports = OAStartPage;
