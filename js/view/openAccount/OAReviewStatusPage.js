'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	ScrollView,
	ActivityIndicator,
	Platform
} from 'react-native';

var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var NetworkModule = require('../../module/NetworkModule')
var NetConstants = require('../../NetConstants')
var OpenAccountHintBlock = require('./OpenAccountHintBlock');
var LS = require("../../LS")

var Spinner = require('react-native-spinkit');

var {height, width} = Dimensions.get('window')

class OAReviewStatusPage extends React.Component {
    static propTypes = {
		onPop: PropTypes.func,
	};

    static defaultProps = {
        onPop: ()=>{},
    };

    gotoNext = () => {
		OpenAccountRoutes.goToNextRoute(this.props.navigator, {}, this.props.onPop);
	};

    render() {
		// var types = ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots',
		// 	 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt',
		// 	'Arc', 'ArcAlt'];
		// var views = types.map((key, index) => {
		// 	return (<Spinner style={styles.spinner}
		// 		isVisible={true}
		// 		size={spinnerHeight} type={key} color='#ffffff' key={index}/>)
		// });
      
		var topImageHeight = width/750*630;
		var spinnerType = Platform.OS == "ios" ? "ArcAlt" : "FadingCircleAlt";
		var spinnerHeight = Platform.OS == "ios" ? 100 : 120;
		var spinnerPaddingBottom = (topImageHeight - 100 )/ 3 * 2;
		var textHeight = Platform.OS == "ios" ? 90 : 110;
		return (
			<View style={styles.wrapper}>
				<ScrollView style={{flex:1}}>					
					<View style={{width:width, height:topImageHeight}}>
						<Image style={{width:width, height:topImageHeight}} source={require('../../../images/openAccountReview.jpg')}/>
						{/* <View style={{position: 'absolute', 
							bottom:spinnerPaddingBottom, 
							left: 0, right: 0, 
							width:width, 
							height: spinnerHeight,
							alignItems:'center'}}>
							<Spinner style={styles.spinner}
								isVisible={true}
								size={spinnerHeight} type={spinnerType} color='#ffffff'/>
							<View style={{
								position: 'absolute', 
								left: 0, right: 0, top:0, bottom:0, 
								height:textHeight, width:width, 
								alignItems:'center',
								justifyContent:'center'}}>
								<Text style={{color:'white', backgroundColor:'transparent', fontSize:30}}>!</Text>
								<Text style={[{color:'white', backgroundColor:'transparent'}]}>审核中...</Text>
							</View>
						</View> */}
					</View>
					<OpenAccountHintBlock/>
			 	</ScrollView>
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={true}
						onPress={this.gotoNext}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text={LS.str("FINISH")} />
				</View>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
 		alignItems: 'stretch',
  	justifyContent: 'flex-start',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
	rowWrapper: {
		flexDirection: 'row',
		backgroundColor: 'white',
		justifyContent: 'center',
		paddingBottom: 10,
	},
	text1: {
		fontSize: 17,
		textAlign: 'center',
		paddingTop: 20,
		paddingBottom: 20,
		backgroundColor: 'white',
	},
	text2: {
		flex: 1,
		fontSize: 14,
		textAlign: 'center',
		color: '#f36b6f',
		paddingBottom: 10,
	},
	text3: {
		fontSize: 13,
		textAlign: 'center',
		padding: 15,
		lineHeight: 20,
	},
	image: {
		alignSelf: 'center',
		width: 31,
		height: 31,
	},

	buttonArea: {
		flex: 1,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 16,
		borderRadius: 3,
	},
	buttonView: {
		height: 40,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_DARK_BLUE,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
	ellipse:{
		fontSize: 50,
		marginLeft: 20,
		marginRight: 20,
		color: ColorConstants.TITLE_DARK_BLUE,
	},
	bottomArea: {
		height: 72,
		backgroundColor: 'white',
		alignItems: 'flex-end',
		flexDirection:'row'
	},
	spinner: {
		transform: [
			{ perspective: 850 },
			{ rotate: '-90deg'},
		],
	}
});


module.exports = OAReviewStatusPage;
