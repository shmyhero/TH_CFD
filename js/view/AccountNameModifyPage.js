'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	Dimensions,
	Image,
	TextInput,
	Platform,
	TouchableOpacity,
} from 'react-native';

var {height, width} = Dimensions.get('window');
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var heightRate = height/667.0;
var NavBar = require('../view/NavBar')


class ErrorMsg extends Component{
	constructor(prop){
		super(prop);

	}

	render(){
		if(this.props.showView){
			return (
				<View style={styles.errorMsg}>
						<Image source={require('../../images/error_dot.png')} style={[styles.error_dot,{marginLeft:5}]}/>
						<Text style={styles.errorText}>{this.props.showText}</Text>
				</View>
			);
		}else {
			return(
				<View></View>
			);
		}
	}

}

var AccountNameModifyPage = React.createClass({

	getInitialState: function() {
		return {
			isShowError:false,
			errorText:'错误提示',
		};
	},

	render: function() {

		var marginLeft = 0;

		return (
			<View style={{flex:1,backgroundColor:'white'}}>

				 {this.renderHeader()}

				 <TextInput style={styles.nickNameInputView}
					onChangeText={(text) => this.setNickName(text)}
					placeholder='请输入昵称'
					placeholderTextColor='grey'
					maxLength={8}
					/>

					<View style={styles.line}>
						<View style={[styles.separator, {marginLeft: marginLeft}]}/>
					</View>

					<ErrorMsg showView={this.state.isShowError} showText={this.state.errorText}/>

			</View>
		);
	},

	renderHeader(){
		var barHeight = 68
		if (Platform.OS == 'android') {
			barHeight = 50
		}

		return (
			<NavBar showBackButton={true} navigator={this.props.navigator}
				backButtonOnClick={this.props.showTabbar}
				barStyle={{height: barHeight}}	titleStyle={{fontSize:18}}
				title='我的昵称'
				subTitleStyle={styles.subTitle}
				rightCustomContent={() => this.renderComplete()}/>
		)
	},

	renderComplete: function() {
		return (
			<TouchableOpacity onPress={this.onComplete}>
						<Text style={styles.subTitle}>
							完成
						</Text>
			</TouchableOpacity>
		)
	},

	onComplete(){
		this.props.navigator.pop();
	},

	setNickName(text){
		console.log(text);
		this.setState({
			isShowError:true,
			errorText:text,
		});
	},

});



var styles = StyleSheet.create({

	 nickNameInputView:{
		 color:'#303030',
		 height:Math.round(64*heightRate),
		 margin:5,
	 },



	 line: {
		 height: 0.5,
		 backgroundColor: 'white',
	 },

	 separator: {
		 height: 0.5,
		 backgroundColor: ColorConstants.SEPARATOR_GRAY,
	 },

	 errorDot: {
 	width: 16,
 	height: 16,
  },

  errorText:{
 	 fontSize:12,
 	 color:'red',
 	},

	subTitle: {
		fontSize: 17,
		textAlign: 'center',
		color: 'white',
		marginRight:5,
	},

  errorMsg:{
 		flexDirection: 'row',
 		alignItems: 'center',
 	},

});

module.exports = AccountNameModifyPage;
