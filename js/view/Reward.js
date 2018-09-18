import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,Dimensions,} from 'react-native'

var ColorConstants = require('../ColorConstants')

var {height, width} = Dimensions.get('window');

const CARD_SPECIAL_GOLD = 1;
const CARD_SPECIAL_AG = 2;
var isSpecialCard = false;

export default class Reward extends Component{

  static propTypes = {
    divideInLine: PropTypes.number,
    type:PropTypes.number,
    isNew:PropTypes.bool,
    card:PropTypes.object,
  }

  static defaultProps = {
    divideInLine: 3,
    type:1,
    isNew:false,
    card:undefined,
  }

  constructor(props){
    super(props);
  }

  getHeight(){
    return (width/this.props.divideInLine) * 1.13
  }

  getWidth(){
    var magic = 7.5;
    if(this.props.divideInLine == 2) magic = 10;
    return (width/this.props.divideInLine) - magic
  }

  renderBottomForSpecial(){
    if(isSpecialCard){
      return(
        <View style={styles.specialContainer}>
          <Text>
            {this.props.card.last.toFixed(2)}
          </Text>
        </View>
      );
    }else{
      return(<View style={styles.lineUser}>
        <View style={styles.lineBottom1}>
          <Image
          style={styles.imgUserHead}
          source={this.props.card.profileUrl ? {uri:this.props.card.profileUrl} : require('../../images/head_portrait.png')}
          defaultSource={require('../../images/head_portrait.png')}>
          </Image>
          <Text numberOfLines={1} style = {styles.textName}>
            {this.props.card.userName}
          </Text>
        </View>
        <View style={styles.lineBottom2}>
          <Image
          style={styles.imgLove}
          source={require('../../images/like_small.png') }>
          </Image>
          <Text style = {styles.textCounter}>
          {this.props.card.likes}
          </Text>
         </View>
       </View>);
    }
  }

  renderBottom(){

    var percentChange = isSpecialCard?this.props.card.rate:this.props.card.plRate;

    percentChange = percentChange.toFixed(2)
    var color = ColorConstants.stock_color(percentChange)
    var startMark = percentChange > 0 ? "+" : null

    if(this.props.type === 1){//显示在首页的
      return(
        <View style={styles.bottom}>
        <View style={styles.lineScore}>
          <Text style = {[styles.textScore,{color:color}]}>
            {startMark} {percentChange} %
          </Text>
        </View>
        {this.renderBottomForSpecial()}
      </View>);
    }else if(this.props.type === 2){//显示在我的卡片

      return(
        <View style={styles.bottom}>
          <View style={styles.lineScore}>
            <Text style = {[styles.textScore,{color:color}]}>
              {startMark} {percentChange} %
            </Text>
          </View>
          <View style={styles.lineView}>
             <Text style={styles.textKind}>
               {this.props.card.stockName}
             </Text>
          </View>
      </View>);
    }
  }

  render(){
    isSpecialCard = this.props.card.likes==undefined?true:false;//没有likes则是特殊，金或银 行情卡
    var indexSpecial = 0;//
    var specialPic = undefined;
    if(isSpecialCard){
      if(this.props.card.stockName==='黄金'){
        indexSpecial = CARD_SPECIAL_GOLD;
        specialPic = require('../../images/card_gold.png')
      }else if(this.props.card.stockName === '白银'){
        indexSpecial = CARD_SPECIAL_AG;
        specialPic = require('../../images/card_ag.png')
      }
    }
    var imageSource = {}
    if(this.props.type === 1){
      imageSource = isSpecialCard?specialPic:{uri: this.props.card.imgUrlSmall}
    }else if(this.props.type === 2){
      imageSource = isSpecialCard?specialPic:{uri: this.props.card.imgUrlMiddle}
    }else{
      imageSource = isSpecialCard?specialPic:{uri: this.props.card.imgUrlMiddle}
    }

    return(
      <View style = {[styles.container,{borderWidth:this.props.card.isNew?0.5:0}]}>
        <Image
        resizeMode={'stretch'}
        style={[styles.imgReward,{width:this.getWidth(),height:this.getHeight()}]}
        // source={require('../../images/card_ag.png')}
        source={imageSource}
        >
        </Image>
        {this.renderBottom()}

      </View>
    );
  }

}


const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#faf8f8',
		borderWidth:1,
		borderRadius:5,
    borderColor:'#faf8f8'
		// borderColor:'#699fff'
  },

  imgReward:{
    height:120,
    // borderRadius:5,
  },

  imgUserHead:{
    width:24,
    height:24,
    borderRadius:12,
    marginLeft:5,
    borderWidth:0,
    borderColor:'#f3e3d3',
  },

  imgLove:{
    width:10,
    height:10,
  },

  lineScore:{
    flexDirection:'row',
    marginTop:2,
    marginBottom:2,
    alignItems:'center',
    justifyContent:'center',
  },

  lineUser:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },

  lineBottom1:{
    flex:2,
     flexDirection:'row',
     alignItems:'center',
     justifyContent:'flex-start',

  },

  lineBottom2:{
    flex:1,
     flexDirection:'row',
     alignItems:'center',
     justifyContent:'flex-end',
     marginRight:10,
  },

  textScore:{
    fontSize:14,
    color:'#fd5e3b',
    alignItems:'center',
  },

  textCounter:{
    fontSize:10,
    marginLeft:2,
    color:'#cfcfd6',
  },

  textName:{
    flex:1,
    fontSize:12,
    marginLeft:2,
    color:'#cccccc',
  },

  bottom:{
    flex:1,
    justifyContent:'center',

  },

  lineView:{
    flex:1,
    alignItems:'center',
  },

  textKind:{
    color:'#cccccc',
    marginTop:-2,
  },

  specialContainer:{
    alignItems:'center',
    justifyContent:'center'
  },

});


module.exports = Reward;
