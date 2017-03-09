'use strict';

import React,{Component} from 'react'
import {StyleSheet,
	ScrollView,
	Text,
	Image,
	View,
	Dimensions,
	ListView,
	Alert,
	TouchableOpacity
} from 'react-native'


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
var ColorConstants = require('../ColorConstants')

var CHART_TYPE_2MONTH = 0;
var CHART_TYPE_ALL = 1;

export default class UserHomePage extends Component{

	constructor(props){
		super(props);
		this.state = {
			chartType:CHART_TYPE_2MONTH,
			isCared:false,
		}
	}

	componentDidMount(){

	}

	topWarpperRender(){
		return(
			<Image style = {[styles.topWapper,{backgroundColor:ColorConstants.title_blue()}]} source={require('../../images/super_priority_bg.png')}>

				<TouchableOpacity style = {styles.topOneOfThree} onPress = {()=>this._onPressedCares()}>
    			<Text style = {{fontSize:40,backgroundColor:'transparent',color:'white'}}>8</Text>
					<Text style = {{fontSize:12,backgroundColor:'transparent',color:'white'}}>关注数</Text>
    		</TouchableOpacity>

				<View style = {styles.topOneOfThree}>
					<Image style = {styles.userHeaderIcon} source={require('../../images/head_portrait.png')}></Image>
				</View>

				<TouchableOpacity style = {styles.topOneOfThree} onPress={()=>this._onPressedCards()}>
					<Text style = {{fontSize:40,backgroundColor:'transparent',color:'white'}}>0</Text>
					<Text style = {{fontSize:12,backgroundColor:'transparent',color:'white'}}>卡片数</Text>
				</TouchableOpacity>

   		</Image>
		)
	}

	middleWarpperRender(){
		return(
			<View style = {styles.middleWapper}>
				<View style={{flexDirection:'row',height:40}}>
					<View style = {[styles.oneOfThree,{flexDirection:'row'}]}>
     				<Text style={styles.font1}>交易等级</Text>
							<TouchableOpacity onPress={()=>this._onPressedAskForRank()}>
								<Image style={{width:16,height:16,marginLeft:2}} source = {require('../../images/head_portrait.png')}></Image>
							</TouchableOpacity>

     			</View>
					<View style = {styles.oneOfThree}>
						<Text style={styles.font1}>平均每笔收益</Text>

     			</View>
					<View style = {styles.oneOfThree}>
						<Text style={styles.font1}>胜率</Text>
     			</View>
				</View>
				<View style={{flexDirection:'row',flex:1,marginBottom:20}}>
					<View style = {styles.oneOfThree}>
     				<Text style={styles.font2}>超越平凡</Text>
     			</View>
					{this.rowSepartor()}
					<View style = {styles.oneOfThree}>
     				<Text style={styles.font2}>$210</Text>
     			</View>
					{this.rowSepartor()}
					<View style = {styles.oneOfThree}>
     				<Text style={styles.font2}>93.12%</Text>
     			</View>
				</View>
   		</View>
		)
	}

	lineSepartor(){
		return(
			<View style ={styles.lineSepartor}></View>
		)
	}

	rowSepartor(){
		return(
			<View style ={styles.rowSepartor}></View>
		)
	}

	_onPressedChartType(type){
		if(this.state.chartType==type){
			console.log('same type clicked , return null')
			return
		}
		this.setState({
			chartType:type
		})
	}

	_onPressedAskForRank(){
		console.log('what is rank ???')
	}

	_onPressedCardDetail(){
		console.log('_onPressedCardDetail')
	}

	_onPressedCares(){
		console.log('_onPressedCares')
	}

	_onPressedCards(){
		console.log('_onPressedCards')
	}

	_onPressedAddCare(){
		this.setState({
			isCared: !this.state.isCared
		})
	}

	bottomWarpperRender(){

		return(
			<View style = {styles.bottomWapper}>
   			<View style ={styles.ceilWapper}>
      		<Text>累计收益：</Text>
					<Text>6700.21</Text>
      	</View>
				{this.lineSepartor()}
				<View style ={styles.ceilWapper2}>
					<View style = {styles.ceilLeft}>
     				<View style = {styles.chartTypeBorder}>
							<TouchableOpacity onPress={()=>this._onPressedChartType(CHART_TYPE_2MONTH)} style = {[styles.chartType,{backgroundColor:this.state.chartType == CHART_TYPE_2MONTH ? ColorConstants.title_blue():'white'}]}>
       					<Text style = {{fontSize:13,color:this.state.chartType == CHART_TYPE_2MONTH ? 'white' : ColorConstants.INPUT_TEXT_COLOR}}>近2周</Text>
       				</TouchableOpacity>
							<TouchableOpacity onPress={()=>this._onPressedChartType(CHART_TYPE_ALL)} style = {[styles.chartType,{backgroundColor:this.state.chartType == CHART_TYPE_ALL ? ColorConstants.title_blue():'white'}]}>
       					<Text style = {{fontSize:13,color:this.state.chartType == CHART_TYPE_ALL ? 'white' : ColorConstants.INPUT_TEXT_COLOR}}>全部</Text>
       				</TouchableOpacity>
         		</View>
     			</View>
					<View style = {styles.ceilRight}>
						<View style = {[styles.tipIcon,{backgroundColor:ColorConstants.title_blue()}]}></View>
     				<Text>TA的收益走势</Text>
     			</View>
    		</View>
   		</View>
		)
	}

	cardWarpperRender(){
		return(
			<View style = {styles.cardWapper}>
				<View style={styles.cardWapperContainer}>
					<Text style={styles.cardWapperTitle}>
						卡片成就
					</Text>
					<TouchableOpacity onPress={this._onPressedCardDetail}>
						<Text style={styles.more}>
							了解详情 >
						</Text>
					</TouchableOpacity>
				</View>

				<View style = {[styles.cardShowWapper,{backgroundColor:ColorConstants.title_blue()}]}>

    		</View>
			</View>
		)
	}

	renderAddCareButton() {
		return (
			<TouchableOpacity
					onPress={()=>this._onPressedAddCare()}>
				<View style={[styles.addToCareContainer,{backgroundColor:ColorConstants.title_blue()}]}>
					<Text style={styles.addToCareText}>
						{this.state.isCared ? '取消关注':'+关注'}
					</Text>
				</View>
			</TouchableOpacity>
		)
	}

	render(){
		return(
			<View style={styles.wapper}>
				<NavBar title='巴菲特'
				showBackButton={true}
				navigator={this.props.navigator}
				rightCustomContent={() => this.renderAddCareButton()}/>
				<ScrollView>
				 	{this.topWarpperRender()}
					{this.middleWarpperRender()}
					<View style = {styles.separator}></View>
					{this.bottomWarpperRender()}
					<View style = {styles.separator}></View>
					{this.cardWarpperRender()}
				</ScrollView>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	wapper:{
    width:width,
    height:height
  },

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

	topWapper:{
		width:width,
		height:160,
		flexDirection:'row',
	},

	middleWapper:{
		width:width,
		height:80,
		backgroundColor:'white',
	},

	bottomWapper:{
		width:width,
		height:width*5/6,
		backgroundColor:'white',
	},

	separator:{
		width:width,
		height:10,
		backgroundColor:'transparent',
	},

	cardWapper:{
		width:width,
	},

	cardWapperContainer:{
		height:40,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor:	'white'
	},

	cardWapperTitle: {
		flex: 1,
		fontSize: 17,
		marginLeft: 15,
		color: "#3f3f3f",
	},

	more: {
		fontSize: 14,
		color: ColorConstants.MORE_ICON,
		marginRight: 15,
	},

	oneOfThree:{
		flex:1,
		backgroundColor:'transparent',
		alignItems:'center',
		justifyContent:'center',
		paddingTop:5,
	},

	font1:{
		fontSize:12,
	},

	font2:{
		fontSize:18,
	},

	ceilWapper:{
		width:width,
		height:40*heightRate,
		flexDirection:'row',
		alignItems:'center',
		paddingLeft:10,
	},

	ceilWapper2:{
		width:width,
		height:50*heightRate,
		flexDirection:'row',
		alignItems:'center',
		paddingLeft:10,
		paddingRight:10,
		marginTop:10,
	},

	ceilLeft:{
		flexDirection:'row',
	},

	ceilRight:{
		flexDirection:'row',
		justifyContent:'flex-end',
		flex:1,
		alignItems:'center',
	},

	lineSepartor:{
		width:width,
		height:0.5,
		backgroundColor:'#EEEEEE'
	},

	rowSepartor:{
		width:0.5,
		height:20,
		backgroundColor:'#EEEEEE'
	},

	tipIcon:{
		width:10,
		height:2,
		marginRight:5,
	},

	chartTypeBorder:{
		width:160,
		height:36,
		borderRadius:2,
		borderWidth:1,
		borderColor:'grey',
		flexDirection:'row',
	},

	chartType:{
		flex:1,borderRadius:2,
		justifyContent:'center',
		alignItems:'center',
	},

	userHeaderIcon:{
		width:80,
		height:80,
	},

	cardShowWapper:{
		width:width,
		height:width*4/5,
	},

	topOneOfThree:{
		backgroundColor:'transparent',
		flex:1,
		alignItems:'center',
		justifyContent:'center',
	},

	addToCareContainer: {
		marginRight: 10,
		paddingHorizontal: 10,
		paddingVertical: 5,
		backgroundColor: '#2d71e5',
		borderWidth: 1,
		borderRadius: 3,
		borderColor: '#ffffff',
	},

	addToCareText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#ffffff',
	},



});


module.exports = UserHomePage;
