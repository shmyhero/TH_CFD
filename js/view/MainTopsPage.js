'use strict';

import React,{Component} from 'react'
import {StyleSheet,Text,Image,View,Dimensions,ListView,Alert,TouchableOpacity} from 'react-native'


var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var Reward = require('./Reward')
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var StockTransactionInfoModal = require('./StockTransactionInfoModal')
var UIConstants = require('../UIConstants')
var NetworkErrorIndicator = require('./NetworkErrorIndicator');


export default class MainTopsPage extends Component{

	constructor(props){
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
	}

	render(){
		return(
			<View style={{flex:1}}>
				<NavBar title='排行榜' navigator={this.props.navigator}/>
				<View>
					<Text>显示排行榜单</Text>
				</View>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	scroolItem:{
		width:(width-20)/2,
		height:((width-20)/2) + 80,
		marginRight:5,
		marginBottom:10,
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


});


module.exports = MainTopsPage;
