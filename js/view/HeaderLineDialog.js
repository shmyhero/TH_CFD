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
} from 'react-native';

var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var {height, width} = Dimensions.get('window');

var heightRate = height/667.0;
var heightShow = height - UIConstants.HEADER_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER
var roundR = (width-10)/2

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
    headerImage: PropTypes.number
  }

  static defaultProps = {
    messageLines: [
      "签到1天，赠送0.5元交易金；",
      "连续签到5天后，第6天起，赠送0.6元交易金；",
      "连续签到10天后，第11天起，赠送0.8元交易金；",
      "连续签到中断，即恢复到每日赠送0.5元交易金，重新积累连续签到天数。",
    ],
    headerImage: require('../../images/sign_stratgy.png'),
  }

  constructor(props) {
	  super(props);

    this.state = {
      isStartUp: true,
      modalVisible: false,
    }
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  show(){
    this._setModalVisible(true);
  }

  renderLine (message, index){
    return (
      <View style = {styles.lineText} key={index}>
        <View style = {styles.number} >
          <Text style = {styles.textDayNumber2}>{index}</Text>
        </View>
        <Text style={styles.textModal}>{message}</Text>
      </View>
    );
  }

  renderLines(){
    var linesView = this.props.messageLines.map(
      (message, index) =>
        {
          return this.renderLine(message, index+1);
        }
      )

    return linesView;
  }

  render() {
    /**

      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        animationType={"slide"}
        style={{height: height, width: width}}
        onRequestClose={() => {this._setModalVisible(false)}}
        >

              </Modal>
    */
    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        animationType={"slide"}
        style={{height: height, width: width}}
        onRequestClose={() => {this._setModalVisible(false)}}
        >
        <View style={styles.modalContainer}>
          <View style={[styles.modalInnerContainer]}>
            <View style={styles.bodyContent}>
              <View style = {styles.modalTexContainer}>
                {this.renderLines()}
              </View>

              <View style={{alignItems: 'center'}}>
                <TouchableOpacity style={styles.closeButton} onPress={() => this._setModalVisible(false)}>
                    <Image style = {styles.imgClose} source = {require('../../images/sign_stratgy_close.png')} ></Image>
                  </TouchableOpacity>
              </View>
            </View>
            <Image style = {styles.imgHeader} source={this.props.headerImage} ></Image>
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
    alignItems: 'center'
    // backgroundColor: '#05FFFFFF',
  },

  bodyContent: {
    position: 'relative',
    top: imgTopHeight,
  },

  modalTexContainer:{
    alignItems: 'flex-start',
    backgroundColor: '#fffdf4',
    width: dialogWidth,
    //height: dialogHeight,
    paddingTop: imgBottomHeight + 30,
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
    width:21,
    height:21,
    marginRight:5,
    marginTop:5,
    backgroundColor:'#3b7aeb',
    borderRadius:21/2,
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
});

module.exports = HeaderLineDialog;
