'use strict';

import React, {Component,} from 'react';
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
  TouchableOpacity,
} from 'react-native';


var MainPage = require('./MainPage')
var NetworkModule = require('../module/NetworkModule')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var NetConstants = require('../NetConstants')
var LogicData = require('../LogicData')
var WebSocketModule = require('../module/WebSocketModule')
var UIConstants = require('../UIConstants');
var HeaderLineDialog = require('./HeaderLineDialog');
var SentIntent = require('./component/nativeIntent/SendIntent')

var {height, width} = Dimensions.get('window')
var heightRate = height/667.0

var listRawData = [
{'type':'header'},
{'type':'depositwithdraw','title':'入金', 'image':require('../../images/icon_income.png'), 'subtype': 'deposit'},
{'type':'depositwithdraw','title':'出金', 'image':require('../../images/icon_income.png'), 'subtype': 'withdraw'},
{'type':'detail','title':'明细', 'image':require('../../images/icon_income.png'), 'subtype': 'details'},
]

var CALL_NUMBER = '66058771'
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var dataSource = ds.cloneWithRows(listRawData);
export default class DepositWithdrawPage extends Component {
  constructor(props) {
	  super(props);
  }

  onSelectNormalRow(rowData){
    switch(rowData.subtype){
      case 'deposit':
        alert("入金")
        return;
      case 'withdraw':
        alert("出金")
        return;
      case 'details':
        alert("明细")
        return;
    }
  }

	pressBackButton() {
		this.props.showTabbar()
		this.props.navigator.pop()
	}

  helpPressed() {
    SentIntent.sendPhoneDial(CALL_NUMBER)
  }

  renderHeader(){
    return(
			<View style={styles.totalTextContainer}>
        <Text style={styles.totalIncomeTitleText}>
          剩余资金(美元)
        </Text>
        <Text style={styles.totalIncomeText}>
          {12345.13}
        </Text>
      </View>
    );
  }

	renderRow(rowData, sectionID, rowID) {
    if(rowData){
  		if(rowData.type == 'header'){
  			return (
  					<View style={[styles.headerWrapper, {backgroundColor: ColorConstants.TITLE_BLUE}]}>
  						{this.renderHeader()}
  					</View>
  			);
  		}
  		else {
  			return(
          <TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
            <View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
              <Image source={rowData.image} style={styles.image} />
              <Text style={styles.title}>{rowData.title}</Text>
              <Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
            </View>
          </TouchableOpacity>
  			);
  		}
    }
    return (<View></View>)
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted){
    var nextID = parseInt(rowID) + 1;
  	if(rowID == 0 || ((nextID< listRawData.length) && listRawData[nextID].type === 'detail')){
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
      );
		}
	}

  renderHelp() {
    return(
      <TouchableOpacity style={{flexDirection:'row', alignItems:'center', marginBottom: 20}} onPress={this.helpPressed}>
        <Image style = {styles.lineLeftRight} source = {require('../../images/line_left2.png')} ></Image>
        <Text style={styles.helpTitle}>服务热线：{CALL_NUMBER}</Text>
        <Image style = {styles.lineLeftRight} source = {require('../../images/line_right2.png')} ></Image>
      </TouchableOpacity>
    );
  }

	render() {
		return (
			<View style={{flex: 1}}>
				<NavBar title='存取资金' showBackButton={true} navigator={this.props.navigator}/>
				<ListView
					style={styles.list}
					dataSource={dataSource}
					renderRow={(rowData, sectionID, rowID)=>this.renderRow(rowData, sectionID, rowID)}
					renderSeparator={(sectionID, rowID, adjacentRowHighlighted)=>this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)} />

        {this.renderHelp()}
			</View>
		);
	}
}
//
// var UP_INPUT_REF = "upInput"
// var DOWN_INPUT_REF = "downInput"
//
// var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
// var RULE_DIALOG = "ruleDialog";
// var MyIncomePage = React.createClass({
//
// 	getInitialState: function() {
// 		return {
// 			totalIncome: '--',
// 			totalDailySign: '--',
// 			totalCard: '--',
// 			demoTransaction: '--',
// 			demoRegister: '--',
// 			dataSource: ds.cloneWithRows(listRawData),
// 		};
// 	},
//
// 	componentDidMount: function(){
//     var userData = LogicData.getUserData();
// 		var notLogin = Object.keys(userData).length === 0
// 		if(!notLogin){
// 	    NetworkModule.fetchTHUrl(
// 	      NetConstants.CFD_API.GET_TOTAL_UNPAID,
// 	      {
// 	        method: 'GET',
// 	        headers: {
// 	          'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
// 						'Content-Type': 'application/json; charset=UTF-8',
// 	        },
// 					cache: 'offline'
// 	      },
// 	      (responseJson) => {
// 					console.log("my unpaid income: " + JSON.stringify(responseJson));
//
// 					var totalDailySign = responseJson.totalDailySign;
// 					var demoTransaction = responseJson.totalDemoTransaction;
// 					var demoRegister = responseJson.demoRegister
// 					var totalCard = responseJson.totalCard ? responseJson.totalCard : 0;
// 					var totalIncome = totalDailySign + demoTransaction + demoRegister + totalCard;
// 					console.log("totalIncome: " + totalIncome.toString())
// 					console.log("totalDailySign: " + totalDailySign.toString())
// 					console.log("demoTransaction: " + demoTransaction.toString())
// 					console.log("demoRegister: " + demoRegister.toString())
// 					console.log("totalCard: " + totalCard.toString())
// 	        this.setState({
// 	          totalIncome: totalIncome.toString(),
// 						totalDailySign : totalDailySign.toString(),
// 						totalCard: totalCard.toString(),
// 						demoTransaction: demoTransaction.toString(),
// 						demoRegister: demoRegister.toString(),
// 						dataSource: ds.cloneWithRows(listRawData),
// 	        });
// 	      },
// 	      (result) => {
// 	        console.log(result.errorMessage)
// 	      }
// 	    )
// 		}else{
// 			this.setState({
// 				totalIncome: 0,
// 				totalDailySign: 0,
// 				demoTransaction: 0,
// 				demoRegister: 0,
// 				totalCard: 0,
// 				dataSource: ds.cloneWithRows(listRawData),
// 			})
// 		}
// 	},
//
// 	pressBackButton: function() {
// 		this.props.showTabbar()
// 		this.props.navigator.pop()
// 	},
//
// 	showDialog: function(){
// 		this.refs[RULE_DIALOG].show();
// 	},
//
//   renderHeader: function(){
//     return(
// 			<View style={styles.totalTextContainer}>
//         <Text style={styles.totalIncomeTitleText}>
//           总计交易金(元)
//         </Text>
//         <Text style={styles.totalIncomeText}>
//           {this.state.totalIncome}
//         </Text>
//       </View>
//     );
//   },
//
// 	renderRow: function(rowData, sectionID, rowID) {
// 		if(rowData.type == 'header'){
// 			return (
// 					<View style={[styles.headerWrapper, {backgroundColor: ColorConstants.TITLE_BLUE}]}>
// 						{this.renderHeader()}
// 					</View>
// 			);
// 		}
// 		else if(rowData.type == 'normal'){
// 			var value;
// 			if(rowData.subtype == 'totalDailySign'){
// 				value = this.state.totalDailySign;
// 			}
// 			if(rowData.subtype == 'demoTransaction'){
// 				value = this.state.demoTransaction;
// 			}
// 			if(rowData.subtype == 'demoRegister'){
// 				value = this.state.demoRegister;
// 			}
// 			if(rowData.subtype == 'totalCard'){
// 				value = this.state.totalCard;
// 			}
//
// 			return(
// 				<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
// 					<Text style={styles.title}>{rowData.title}</Text>
// 					<Text style={styles.contentValue}>{value}</Text>
// 				</View>
// 			);
// 		}
// 	},
//
// 	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
// 		if(rowID == 0){
// 			return (
// 				<View style={[styles.line, {height: 10}]} key={rowID}>
// 					<View style={[styles.separator]}/>
// 				</View>
// 				)
// 		}else{
// 			return (
// 				<View style={styles.line} key={rowID}>
// 					<View style={[styles.separator]}/>
// 				</View>
// 				)
// 		}
// 	},
//
// 	render: function() {
// 		return (
// 			<View style={{flex: 1}}>
// 				<NavBar title='我的交易金' showBackButton={true} navigator={this.props.navigator}
// 					textOnRight='规则'
// 					rightTextOnClick={()=>this.showDialog()}/>
// 				<ListView
// 					style={styles.list}
// 					dataSource={this.state.dataSource}
// 					renderRow={this.renderRow}
// 					renderSeparator={this.renderSeparator} />
// 				<HeaderLineDialog ref={RULE_DIALOG}
// 				headerImage={require('../../images/my_income_strategy.png')}
// 				messageLines={this.rules}/>
// 			</View>
// 		);
// 	},
// });

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
		flex:1,
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
	image: {
		marginLeft: -10,
		width: 40,
		height: 40,
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
  helpTitle: {
		fontSize: 14,
		textAlign: 'center',
		color: '#415a87',
	},
	lineLeftRight:{
			 	width:100,
				height:1,
				margin:5,
	},
});

module.exports = DepositWithdrawPage;
