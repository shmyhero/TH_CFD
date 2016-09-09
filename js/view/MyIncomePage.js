'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Text,
	TextInput,
	Switch,
	UIManager,
	Image,
} from 'react-native';

var MainPage = require('./MainPage')
var NetworkModule = require('../module/NetworkModule')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var NetConstants = require('../NetConstants')
var LogicData = require('../LogicData')
var WebSocketModule = require('../module/WebSocketModule')
var UIConstants = require('../UIConstants')
var {height, width} = Dimensions.get('window')

var UP_INPUT_REF = "upInput"
var DOWN_INPUT_REF = "downInput"

var MyIncomePage = React.createClass({

	propTypes: {

	},

	getDefaultProps() {
		return {

		}
	},

	getInitialState: function() {
		return {
      totalIncome: '--',
			totalDailySign: '--',
			demoTransaction: '--',
			demoRegister: '--',
		};
	},

	componentDidMount: function(){

    var userData = LogicData.getUserData();
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
	    NetworkModule.fetchTHUrl(
	      NetConstants.GET_TOTAL_UNPAID,
	      {
	        method: 'GET',
	        headers: {
	          'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=UTF-8',
	        },
	      },
	      (responseJson) => {
					console.log("my unpaid income: " + JSON.stringify(responseJson));

					var totalDailySign = responseJson.totalDailySign;
					var demoTransaction = responseJson.totalDemoTransaction;
					var demoRegister = responseJson.demoRegister;
	        this.setState({
	          totalIncome: totalDailySign + demoTransaction + demoRegister,
						totalDailySign : totalDailySign,
						demoTransaction: demoTransaction,
						demoRegister: demoRegister,
	        });
	      },
	      (errorMessage) => {
	        console.log(errorMessage)
	      }
	    )
		}else{
			this.setState({
				totalIncome: 0,
				totalDailySign: 0,
				demoTransaction: 0,
				demoRegister: 0,
			})
		}
	},

	pressBackButton: function() {
		this.props.showTabbar()
		this.props.navigator.pop()
	},

  renderTotalIncome: function(){
    return(
      <View style={styles.totalTextContainer}>
        <Text style={styles.totalIncomeTitleText}>
          总计交易金(元)
        </Text>
        <Text style={styles.totalIncomeText}>
          {this.state.totalIncome}
        </Text>
      </View>
    );
  },

  renderDetailIncome: function(type){
    var title, value;
    if(type == 1){
      title = "签到交易金(元)";
      value = this.state.totalDailySign;
    }
    if(type == 2){
      title = "模拟交易金(元)";
      value = this.state.demoTransaction;
    }
    if(type == 3){
      title = "注册交易金(元)";
      value = this.state.demoRegister;
    }

    return(
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailIncomeTitleText}>
          {title}
        </Text>
        <Text style={styles.detailIncomeText}>
          {value}
        </Text>
      </View>
    );
  },

  renderSeparator: function(){
    return(
      <View style={styles.separator}>

      </View>
    );
  },

	render: function() {
		return (
			<View style={styles.wrapper}>
        <View style={styles.headerWrapper}>
  				{this.renderTotalIncome()}
          <View style={styles.detailsContainer}>
  				    {this.renderDetailIncome(1)}
              {this.renderSeparator()}
      		    {this.renderDetailIncome(2)}
              {this.renderSeparator()}
          		{this.renderDetailIncome(3)}
          </View>
        </View>
			</View>
		);
	},
});

var styles = StyleSheet.create({
  wrapper:{
		flex: 1,
		width: width,
   	alignItems: 'stretch',
  },
	headerWrapper: {
		backgroundColor: ColorConstants.MAIN_CONTENT_BLUE,
    height: 186,
    justifyContent: 'space-around',
	},
  totalTextContainer:{
    flexDirection: 'column',
    alignItems:'center',
  },
  totalIncomeTitleText:{
    fontSize: 17,
    color: ColorConstants.SUB_TITLE_WHITE,
  },
  totalIncomeText:{
    fontSize: 26,
    color: 'white',
  },
  detailsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailTextContainer:{
    flexDirection: 'column',
    alignItems:'center',
  },
  detailIncomeTitleText:{
    fontSize: 13,
    color: ColorConstants.SUB_TITLE_WHITE,
  },
  detailIncomeText:{
    fontSize: 17,
    color: 'white',
  },
  separator: {
    height: 34,
    width: 0.5,
    backgroundColor: '#3878e5',
  },
});


module.exports = MyIncomePage;
