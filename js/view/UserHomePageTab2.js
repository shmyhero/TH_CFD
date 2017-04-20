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

export default class UserHomePageTab0 extends Component{

	constructor(props){
		super(props);
		this.state = {

		}
	}


	componentDidMount(){

	}

  tabPressed(index) {
     console.log("tabPressed==>"+index);
  }

	render(){
		return(
			<View style={{flex:1}}>
				<Text>主页Tab2</Text>
			</View>
		);
	}

}


const styles = StyleSheet.create({



});


module.exports = UserHomePageTab0;
