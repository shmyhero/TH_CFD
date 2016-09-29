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
	ListView,
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
var heightRate = height/667.0

var UP_INPUT_REF = "upInput"
var DOWN_INPUT_REF = "downInput"

var listRawData = [
{'type':'header'},
{'type':'normal','title':'签到交易金(元)', 'subtype': 'totalDailySign'},
{'type':'normal','title':'模拟交易金(元)', 'subtype': 'demoTransaction'},
{'type':'normal','title':'注册交易金(元)', 'subtype': 'demoRegister'}
]
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var MyIncomePage = React.createClass({
	getInitialState: function() {
		return {
			totalIncome: '--',
			totalDailySign: '--',
			demoTransaction: '--',
			demoRegister: '--',
			dataSource: ds.cloneWithRows(listRawData),
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
					var totalIncome = totalDailySign + demoTransaction + demoRegister;
					console.log("totalIncome: " + totalIncome.toString())
					console.log("totalDailySign: " + totalDailySign.toString())
					console.log("demoTransaction: " + demoTransaction.toString())
					console.log("demoRegister: " + demoRegister.toString())
	        this.setState({
	          totalIncome: totalIncome.toString(),
						totalDailySign : totalDailySign.toString(),
						demoTransaction: demoTransaction.toString(),
						demoRegister: demoRegister.toString(),
						dataSource: ds.cloneWithRows(listRawData),
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
				dataSource: ds.cloneWithRows(listRawData),
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

	renderRow: function(rowData, sectionID, rowID) {
		if(rowData.type == 'header'){
			return (
					<View style={styles.headerWrapper}>
						{this.renderTotalIncome()}
					</View>
			);
		}
		else if(rowData.type == 'normal'){
			var value;
			if(rowData.subtype == 'totalDailySign'){
				value = this.state.totalDailySign;
			}
			if(rowData.subtype == 'demoTransaction'){
				value = this.state.demoTransaction;
			}
			if(rowData.subtype == 'demoRegister'){
				value = this.state.demoRegister;
			}

			return(
				<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
					<Text style={styles.title}>{rowData.title}</Text>
					<Text style={styles.contentValue}>{value}</Text>
				</View>
			);
		}
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		if(rowID == 0){
			return (
				<View style={[styles.line, {height: 10}]} key={rowID}>
					<View style={[styles.separator]}/>
				</View>
				)
		}else{
			return (
				<View style={styles.line} key={rowID}>
					<View style={[styles.separator]}/>
				</View>
				)
		}
	},

	render: function() {
		return (
			<ListView
				style={styles.list}
				dataSource={this.state.dataSource}
				renderRow={this.renderRow}
				renderSeparator={this.renderSeparator} />
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
	},
  totalTextContainer:{
    flexDirection: 'column',
    alignItems:'center',
  },
  totalIncomeTitleText:{
    fontSize: 14,
		marginTop: 41,
    color: ColorConstants.SUB_TITLE_WHITE,
  },
  totalIncomeText:{
    fontSize: 46,
		marginTop: 23,
    color: 'white',
  },
  detailsContainer:{
    flexDirection: 'column',
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
	rowWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: UIConstants.LIST_ITEM_LEFT_MARGIN,
		paddingRight: 15,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: 'white',
	},
	title: {
		flex: 1,
		fontSize: 17,
		color: '#303030',
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},

	contentValue: {
		fontSize: 17,
		marginRight: 5,
		color: '#757575',
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		flex: 1,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

});


module.exports = MyIncomePage;
