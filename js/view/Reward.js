import React,{Component,PropTypes} from 'react'
import {StyleSheet,Text,View,Image,Dimensions,} from 'react-native'

/*
width:120 height:160

*/

var {height, width} = Dimensions.get('window');


export default class Reward extends Component{

  static propTypes = {
    divideInLine: PropTypes.number,
    type:PropTypes.number,
  }

  static defaultProps = {
    divideInLine: 3,
    type:1,
  }

  constructor(props){
    super(props);
  }

  getHeight(){
    return (width/this.props.divideInLine) * 1.05
  }

  renderBottom(){
    if(this.props.type === 1){//显示在首页的
      return(
        <View style={styles.bottom}>
        <View style={styles.lineScore}>
          <Text style = {styles.textScore}>+88.2%</Text>
        </View>
        <View style={styles.lineUser}>
          <View style={styles.lineBottom1}>
            <Image
            style={styles.imgUserHead}
            source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}></Image>
            <Text style = {styles.textName}>
            风飘过
            </Text>
          </View>
          <View style={styles.lineBottom2}>
            <Image
            style={styles.imgLove}
            source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}></Image>
            <Text style = {styles.textCounter}>
            46
            </Text>
          </View>
        </View>
      </View>);
    }else if(this.props.type === 2){//显示在我的卡片
      return(
        <View style={styles.bottom}>
          <View style={styles.lineScore}>
            <Text style = {styles.textScore}>+88.2%</Text>
          </View>
          <View style={styles.lineView}>
             <Text>
               美元／欧元
             </Text>
          </View>
      </View>);
    }

  }

  render(){
    return(
      <View style = {styles.container}>
        <Image
        style={[styles.imgReward,{height:this.getHeight()}]}
        source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
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
    backgroundColor:'white',
  },

  imgReward:{
    height:120,
    borderRadius:5,
  },

  imgUserHead:{
    width:24,
    height:24,
    borderRadius:12,
    marginLeft:5,
  },

  imgLove:{
    width:8,
    height:8,
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
     flexDirection:'row',
     alignItems:'center',
     justifyContent:'flex-start',

  },

  lineBottom2:{
     flexDirection:'row',
     alignItems:'center',
     justifyContent:'flex-end',
     marginRight:10,
  },

  textScore:{
    fontSize:12,
    color:'red',
    alignItems:'center',

  },

  textCounter:{
    fontSize:8,
    marginLeft:2,
  },

  textName:{
    fontSize:12,
    marginLeft:2,
  },

  bottom:{
    flex:1,
    justifyContent:'center',
  },

  lineView:{
    flex:1,
    alignItems:'center',
  },
});


module.exports = Reward;
