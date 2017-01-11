'use strict'

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
	Dimensions,
	ListView,
	TextInput,
	TouchableOpacity,
	Image,
	Platform,
	ScrollView,
} from 'react-native';

var NavBar = require('../NavBar');
var Button = require('../component/Button');

var CheckBoxButton = require('../component/CheckBoxButton')
var MainPage = require('../MainPage')
var LogicData = require('../../LogicData')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
// var OpenAccountRoutes = require('./OpenAccountRoutes')
// var OpenAccountUtils = require('./OpenAccountUtils')
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require('../../NetConstants');
var LogicData = require('../../LogicData');


var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)

var rowTitleWidth = (width - (2 * rowPadding)) / 4;
var rowValueWidth = (width - (2 * rowPadding)) / 4 * 3;

var defaultRawData = [
		{"type": "cardEntry",},
		{"type": "withdraw", value: null},
];

export default class WithdrawIncomeSubmittedPage extends Component {
  listRawData = [];
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 });
  constructor(props) {
	  super(props);

    this.state={
      refundETA: 3,
    }
  }

  componentDidMount(){
    var userData = LogicData.getUserData()
    if(userData.token == undefined){return}

    NetworkModule.loadUserBalance(true, (response)=>{
      this.setState({
        refundableBanalce: response.refundable,
      })
    })
  }

  gotoNext(){
    var routes = this.props.navigator.getCurrentRoutes();
    var popToRoute = null;
    for(var i = routes.length - 2; i >= 0 ;i --){
      if(routes[i].name === MainPage.DEPOSIT_WITHDRAW_ROUTE){
        popToRoute = routes[i];
        break;
      }
    }

    if(popToRoute){
      this.props.navigator.popToRoute(popToRoute);
    }else{
      this.props.navigator.pop();
    }
  }

  render() {
		var nextEnabled = true;//OpenAccountUtils.canGoNext(this.listRawData);
		//console.log("listRawData: " + JSON.stringify(listRawData));
		if(!this.state.withdrawValue || !this.isWithdrawValueAvailable()){
      nextEnabled = false;
    }else if(!this.state.hasRead){
      nextEnabled = false;
    }

    return (
			<View style={styles.wrapper}>
        <NavBar title="转入提交成功"
          showBackButton={false}
          navigator={this.props.navigator}
          />
        <Image source={require('../../../images/withdraw_submitted.png')} style={styles.checkImage}/>
        <Text style={styles.hintText}>{"申请已提交，到账时间以短信通知为准！"}</Text>

        <View style={{flex:1}}/>

        <View style={styles.bottomArea}>
          <Button style={styles.buttonArea}
            enabled={true}
            onPress={()=>this.gotoNext()}
						textContainerStyle={[styles.buttonView, {backgroundColor: ColorConstants.TITLE_BLUE,}]}
            textStyle={styles.buttonText}
            text={'完成'} />
        </View>
			</View>
		);
  }
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
  checkImage:{
    marginTop: 65,
    width: 115,
    height: 115,
  },
  hintText:{
    marginTop: 51,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 15,
    color: '#000000',
  },
  bottomArea: {
    height: 72,
    backgroundColor: 'white',
    alignItems: 'flex-end',
    flexDirection:'row'
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
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
});

module.exports = WithdrawIncomeSubmittedPage;
