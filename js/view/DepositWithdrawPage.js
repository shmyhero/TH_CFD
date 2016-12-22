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
{'type':'depositwithdraw','title':'入金', 'image':require('../../images/deposit.png'), 'subtype': 'deposit'},
{'type':'depositwithdraw','title':'出金', 'image':require('../../images/withdraw.png'), 'subtype': 'withdraw'},
{'type':'detail','title':'明细', 'image':require('../../images/detail.png'), 'subtype': 'details'},
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
				this.props.navigator.push({
					name: MainPage.DEPOSIT_PAGE,
				});
        return;
      case 'withdraw':
				this.props.navigator.push({
					//name:MainPage.WITHDRAW_BIND_CARD_ROUTE,
					name: MainPage.WITHDRAW_ROUTE,
				});
        return;
      case 'details':
				this.props.navigator.push({
					name: MainPage.DEPOSIT_WITHDRAW_FLOW,
				});
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
		color: '#000000',
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},
	image: {
		marginLeft: 0,
		marginRight: 11,
		width: 23,
		height: 23,
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
	moreImage: {
		alignSelf: 'center',
		width: 7.5,
		height: 12.5,
	},
});

module.exports = DepositWithdrawPage;
