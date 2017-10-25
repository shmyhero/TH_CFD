'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';

var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var {height, width} = Dimensions.get('window');

var heightRate = height/667.0;
var heightShow = height - UIConstants.HEADER_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER
var roundR = (width-10)/2

var Button = require('./component/Button')

var dialog_horizontal_padding = 20;
var imgWidth = width - 40;
var imgHeight = imgWidth * 150 / 684 ;
var dialogWidth = imgWidth;
var dialogHeight = dialogWidth / 690 * 660;
var modelTextW = 15;//width/28;
var signEnable = true;//防止网络不畅多次点击事件发生

var imgTopHeight = imgHeight / 2;
var imgBottomHeight = imgHeight - imgTopHeight;

export default class HeaderLineDialog extends Component {

  static propTypes = {
    messageLines: PropTypes.array,
    noDotLines: PropTypes.array,
    headerImage: PropTypes.number,
    proceedCallback: PropTypes.func,
  }

  static defaultProps = {
    proceedCallback: ()=>{},
    messageTitle:'Title',
    messageLines: [
      "公布数据以后，别的用户会在达人榜中看到您的交易数据信息。",
      "公布数据以后，别的用户会在达人榜中看到您的交易数据信息。",
      "公布数据以后，别的用户会在达人榜中看到您的交易数据信息。",
    ],
    noDotLines: [],
    check_selected: require('../../images/check_selected.png'),
    check_unselected: require('../../images/check_unselected.png'),

  }

  constructor(props) {
	  super(props);

    this.state = {
      isStartUp: true,
      modalVisible: false,
      checkSelected:false,
    }
  }

  _setModalVisible(visible) {
    this.setState(
      {modalVisible: visible}
    )
  }

  _setCheckSelected(){
    this.setState(
      {
        checkSelected:!this.state.checkSelected
      }
    )
  }

  callBack(result){
    if(this.props.proceedCallback){
      console.log('Rambo set CallBack ' + result);
      this.props.proceedCallback(result);
    }
    this._setModalVisible(false)
  }

  _setComfirmed(){
    this.callBack(true)
  }

  show(){
    this.setState({
      checkSelected:false,
    });
    this._setModalVisible(true);
  }

  renderLine (message, index, renderDot){
    var dotView = renderDot ? (<View style = {styles.number} />) : (<View/>)
    return (
      <View style = {styles.lineText} key={index}>
        {dotView}
        <Text style={styles.textModal}>{message}</Text>
      </View>
    );
  }

  renderLines(){
    var linesView = this.props.messageLines.map(
      (message, index) =>
        {
          return this.renderLine(message, index+1, true);
        }
      )
    return linesView;
  }

  renderNoDotsLines(){
    var linesView = this.props.noDotLines.map(
      (message, index) =>
        {
          return this.renderLine(message, index+1, false);
        }
      )
    return linesView;
  }

  render() {

    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        animationType={"slide"}
        style={{height: height, width: width}}
        onRequestClose={() => {this._setModalVisible(false)}}
        >
          <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.bgStyle} onPress={() => {this._setModalVisible(false)}}/>

              <View style={[styles.modalInnerContainer]}>
                  <Text style={{fontSize:16,color:'black',margin:10}}>{this.props.messageTitle}</Text>
                  <View style = {styles.modalTexContainer}>
                    <ScrollView style={{height: height / 2}}>
                      {this.renderLines()}
                      {this.renderNoDotsLines()}
                      <View style={{width:width}}></View>
                    </ScrollView>
                  </View>

                  <TouchableOpacity onPress={() => this._setCheckSelected()} style={{flexDirection:'row',alignItems:'center',width:width-60,marginBottom:5}}>
                    <Image style={{width:14,height:14}} source={this.state.checkSelected?this.props.check_selected:this.props.check_unselected}></Image>
                    <Text style={{fontSize:12,color:'#b2b2b2',marginLeft:2}}>我已阅读并同意以上所阐述的协议</Text>
                  </TouchableOpacity>

                  <Button style={styles.buttonArea}
        						enabled={this.state.checkSelected}
        						onPress={() => this._setComfirmed()}
        						textContainerStyle={styles.buttonView}
        						textStyle={styles.buttonText}
        						text='确定' />
              </View>
          </View>

      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textDayNumber2:{
    fontSize:10,
    color:'#FFFFFF',
    textAlign:'center',
  },

  modalContainer:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.5)',
    paddingLeft: dialog_horizontal_padding,
    paddingRight: dialog_horizontal_padding,
    // paddingBottom:height/2,
  },


  modalInnerContainer: {
    //borderRadius: 4,
    alignItems: 'center',
    backgroundColor: 'white',
    height:height/2,
  },

  bodyContent: {
    position: 'relative',
  },

  modalTexContainer:{
    alignItems: 'flex-start',
    // backgroundColor: 'yellow',
    width: dialogWidth,
    height:(height/2) - 110,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },

  imgHeader:{
    width:imgWidth,
		height:imgHeight,
		position: 'absolute',
		top:0,
  },

  textModal:{
    fontSize:modelTextW,
    lineHeight: modelTextW + 8,
    flex:1,
    color:'#666666',
  },

  lineText:{
    flexDirection:'row',
    flexWrap:'wrap',
    marginBottom:21,
  },

  number:{
    width:5,
    height:5,
    marginRight:5,
    marginTop:10,
    backgroundColor:'#e4e4e4',
    borderRadius:5/2,
    alignItems:'center',
    justifyContent:'center',
  },

  closeButton:{
    marginTop:28,
  },

  imgClose:{
    width:36,
    height:36,
  },

  confirmButton:{
    fontSize:16,
    color:'white',
  },

  ViewForTextStyle:{
    backgroundColor:ColorConstants.TITLE_DARK_BLUE,
    width:width-60,
    height:40,
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
 },

 buttonArea: {
   width:width-60,
   height:40,
   borderRadius: 3,
 },

 buttonView: {
   height: 40,
   borderRadius: 3,
   backgroundColor: ColorConstants.TITLE_DARK_BLUE,
   justifyContent: 'center',
 },

 buttonText: {
   fontSize: 17,
   textAlign: 'center',
   color: '#ffffff',
 },

 bgStyle:{
   width:width,
   height:height,
   position:'absolute',
 },
});

module.exports = HeaderLineDialog;
