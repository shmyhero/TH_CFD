'use strict';

/*
出入金流水明细
*/

import React,{Component} from 'react'
import {StyleSheet,Text,Image,View,Dimensions,ListView,Alert,TouchableOpacity} from 'react-native'


var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var UIConstants = require('../UIConstants')
var NetworkErrorIndicator = require('./NetworkErrorIndicator');
var ColorConstants = require('../ColorConstants')

var listRawData = []
var listResponse = []
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class DepositWithdrawFlow extends Component{

	constructor(props){
		super(props);
		this.state = {
			listRawData: ds.cloneWithRows(listRawData),
			listResponse: undefined,
			noMessage: false,
			contentLoaded: false,
			isRefreshing: false,
		}
	}

	_renderRow(rowData,sectionID,rowID){

		var title = rowData.transferType;
		var date = rowData.date;
		var amount = rowData.amount;

		return(
			<TouchableOpacity style={styles.scroolItem}>
					 <View style = {styles.leftView}>
						 <Text style = {styles.itemTitle}>{title}</Text>
						 <Text style = {styles.itemTime}>{date}</Text>
					 </View>
					 <View style = {styles.rightView}	>
					 	<Text style = {styles.itemMoney}>{amount}</Text>
					 </View>
		  </TouchableOpacity>
	 	);
	}

	componentDidMount(){
		this.loadTransferList();
	}

	//获取出入金明细流水
	loadTransferList() {
		if(!this.state.contentLoaded){
			console.log("loadTransferList content not Loaded")
			this.setState({
				isRefreshing: true,
			})
		}
		var userData = LogicData.getUserData()

			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_TRANSFERS_LIST,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
					cache: "offline",
					//timeout: 1000,
				},
				(responseJson) =>{
					var noMessage = responseJson.length == 0;
					this.setState({
					  listRawData: ds.cloneWithRows(responseJson),
						listResponse : responseJson,
						noMessage: noMessage,
						contentLoaded: true,
						isRefreshing: false,
						})
				},
				(result) => {
					console.log("fetch url error: " + JSON.stringify(result))
					if(!result.loadedOfflineCache){
						this.setState({
							contentLoaded: false,
							isRefreshing: false,
						})
					}
				}
			)
	}

	renderEmptyView(){
		if(this.state.noMessage){
			return (
				<View style={styles.emptyContent}>
						<Text style={styles.emptyText}>暂无明细</Text>
				</View>
			);
		}
	}

	renderContent(){
		if(!this.state.contentLoaded){
			return (
				<NetworkErrorIndicator onRefresh={()=>this.loadTransferList()} refreshing={this.state.isRefreshing}/>
			)
		}else{
			return(
				<View style={{flex:1}}>
					{this.renderEmptyView()}
					<ListView
						contentContainerStyle={styles.list}
						dataSource={this.state.listRawData}
						enableEmptySections={true}
						removeClippedSubviews={false}
						renderSeparator={this.renderSeparator}
						renderRow={this._renderRow.bind(this)} />
				</View>
			)
		}
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted){
		var marginLeft = width;
		return (
			<View style={styles.line} key={rowID}>
				<View style={[styles.separator, {marginLeft: marginLeft}]}/>
			</View>
			)
	}

	render(){
		return(
			<View style={{flex:1,backgroundColor:'white'}}>
				<NavBar title='明细' showBackButton={true} navigator={this.props.navigator}/>
				{this.renderContent()}
			</View>
		);
	}
}


const styles = StyleSheet.create({
	scroolItem:{
		width:width,
		height:60,
		flexDirection:'row'
	},

	list:{
		marginLeft:5,
		marginTop:5,
		marginRight:5,
		flexDirection:'row',
		justifyContent: 'flex-start',
		flexWrap:'wrap',
	},

	emptyContent: {
		height:height-UIConstants.HEADER_HEIGHT,
    alignItems:'center',
    justifyContent: 'center'
  },
  emptyText: {
    marginTop: 14,
    color: '#afafaf'
  },
	leftView:{
		padding:10,
	},
	itemTitle:{
		fontSize:17,
	},
	itemTime:{
		marginTop:6,
		fontSize:13,
		color:'#858585'
	},
	rightView:{
		flex:1,
		paddingRight:20,
		alignItems:'flex-end',
		justifyContent:'center',
	},
	itemMoney:{
		fontSize:21,
		color:'#1c8d13',
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	line: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
});


module.exports = DepositWithdrawFlow;
