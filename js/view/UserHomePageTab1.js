'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
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
var PositionBlock = require('./personalPage/PositionBlock')
var POSITION_BLOCK = "positionBlock"

export default class UserHomePageTab1 extends Component{
	static propTypes = {
    userId: PropTypes.number.isRequired,
    isPrivate: PropTypes.bool,
  }

  static defaultProps = {
    userId: '',
    isPrivate: false,
  }
	constructor(props){
		super(props);
		this.state = {

		}
	}


	componentDidMount(){

	}

  tabPressed(index) {
     console.log("tabPressed==>"+index);
		 this.refs[POSITION_BLOCK].refresh();
  }

	render(){
		return(
			<View style={{flex:1}}>
        {/* <View style = {styles.separator}></View> */}
				<PositionBlock userId={this.props.userId}
					isPrivate={this.props.isPrivate}
					type="open"
					ref={POSITION_BLOCK}/>
			</View>
		);
	}

}


const styles = StyleSheet.create({
	separator: {
    width: width,
    height: 10,
    backgroundColor: '#f3f3f5',
  },
});


module.exports = UserHomePageTab1;
