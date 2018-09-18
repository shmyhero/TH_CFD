'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	Text,
	Image,
	Animated,
	Dimensions,
	PanResponder,
	Modal,
  Alert,
	TouchableOpacity,
  TouchableWithoutFeedback,
	Platform,
} from 'react-native';


var LogicData = require('../LogicData');
var Swiper = require('react-native-swiper')
var Touchable = require('Touchable');
var merge = require('merge');
var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var AchievementCard = require('./AchievementCard');
var SharePage = require('./SharePage')
var MainPage = require('./MainPage')
var NetworkModule = require('../module/NetworkModule');
var NetConstants = require('../NetConstants');
var TalkingdataModule = require('../module/TalkingdataModule')
var WaitingRing = require('./component/WaitingRing');

var {height, width} = Dimensions.get('window');
const BODY_TOP_MARGIN = 0;
const BODY_HORIZON_MARGIN = Platform.OS === 'ios' ? 15 : 20;
const BODY_BOTTOM_MARGIN = Platform.OS === 'ios' ? 0 : 30;
const imageWidth = width - BODY_HORIZON_MARGIN * 2;
const imageHeight = imageWidth / 630 * 842;
var actionButtonSize = 61;
var Toast = require('./component/toast/Toast');

export default class PraiseModal extends Component {
  static propTypes = {
    getNavigator: PropTypes.func,
    enoughCredits:PropTypes.bool,
    callback:PropTypes.func,
  }

  static defaultProps = {
    getNavigator: ()=>{},
    enoughCredits:true,
    callback: ()=>{},
  }

  constructor(props) {
    super(props);

    this.state = {
			modalVisible: false,
      tid: undefined,
      loading: true,
		}
  }

	show(tid) {
    this.setState({
      tid: tid,
    }, ()=>{
      this._setModalVisible(true);
    })
	}


	hide() {
		this.setState({
			modalVisible: false,
		});
		this.state.hideCallback && this.state.hideCallback();
	}

	_setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onLoad(){
    this.setState({
      loading: false,
    })
  }


  onCloseButtonPress(){
    this._setModalVisible(false)
  }

  onPressedConfirm(){
    // Alert.alert("tid = " + this.state.tid);
    // this._setModalVisible(false)
    if(this.props.enoughCredits){
      this.actionReward()
    }else{
      this._setModalVisible(false)
    }
  }

  actionReward(){
    var url = NetConstants.CFD_API.GET_TREND_REWARD
    url = url.replace(/<trendId>/, this.state.tid)
    var userData = LogicData.getUserData();
    NetworkModule.fetchTHUrl(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        // cache: 'offline'
      },
      (responseJson, isCache) => {
        console.log("reward: " + JSON.stringify(responseJson));
        //{"total":310,"remaining":310,"liveOrder":90,"like":20,"share":200}
        this.setState({
          // creditsRemain:responseJson.remaining,
        });

        this._setModalVisible(false)
        this.props.callback()
        Toast.show("打赏成功！");
      },
      (result) => {
        console.log(result.errorMessage)
      }
    );
  }

  // <View style={{alignItems: 'center'}}>
  //   <TouchableOpacity style={styles.closeButton} onPress={() => this.onCloseButtonPress()}>
  //       <Image style = {styles.imgClose} source = {require('../../images/sign_stratgy_close.png')} ></Image>
  //     </TouchableOpacity>
  // </View>

  render() {
    var bgImage = this.props.enoughCredits? require('../../images/bg_praise.jpg'):require('../../images/bg_praise_no_money.jpg')
    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        animationType={"slide"}
        style={{height: height, width: width}}
        onRequestClose={() => {this._setModalVisible(false)}}
        >

        <TouchableWithoutFeedback onPress={()=>this.onCloseButtonPress()}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={()=>{}}>
            <View style={styles.modalInnerContainerAll}>
              <Image style={styles.modalInnerContainer} source={bgImage}>
                <TouchableOpacity onPress={()=>this.onCloseButtonPress()}>
                  <Image  style={{width:16,height:16,alignSelf:'flex-end',margin:15}} source={require('../../images/close_praise.png')}></Image>
                </TouchableOpacity>
              </Image>
              <View style={{flex:1,alignItems: 'stretch',backgroundColor:'white',padding:10}}>
                <TouchableOpacity onPress={()=>this.onPressedConfirm()} style={{flex:1,alignItems:'center', justifyContent:'center',backgroundColor:'#d7ac3e'}}>
                  <Text style={{color:'white',fontSize:14}}>确定</Text>
                </TouchableOpacity>
              </View>
             </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>

      </Modal>
    );
  }




}

//
// <TouchableWithoutFeedback
//     onPress={()=>this.onCloseButtonPress()}>
//     <View style={{backgroundColor:'yellow', position: 'absolute',left: 0,right: 0,top: 100,bottom: 100,width: null,}}/>
// </TouchableWithoutFeedback>


var styles = StyleSheet.create({


	modalContainer:{
		flex: 1,
		justifyContent: 'center',
		backgroundColor:'rgba(0, 0, 0, 0.7)',
		alignItems: 'center',
		height: height + (Platform.OS === 'android' ? 20 : 0),
		width: width,
	},

  container: {
		marginTop: BODY_TOP_MARGIN,
		justifyContent: 'center',
		alignSelf: 'center',
	},

	realContent: {
		marginLeft: BODY_HORIZON_MARGIN,
		marginRight: BODY_HORIZON_MARGIN,
	},
  modalInnerContainerAll: {
    alignItems: 'stretch',
    backgroundColor:'white',
    width:width-100,
    height:(width-100)*1/2+60
  },
  modalInnerContainer: {
    alignItems: 'stretch',
    backgroundColor:'yellow',
    width:width-100,
    height:(width-100)*1/2
  },

  actionButton:{
    marginTop: (height - actionButtonSize - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER)/3,
		flexDirection: 'row',
		marginBottom:BODY_BOTTOM_MARGIN,
  },

  imgAction:{
    width:actionButtonSize,
    height:actionButtonSize,
  },

  activityImage:{
    padding: 0,
    borderWidth: 0,
    resizeMode: "stretch",
    borderRadius:20,
  },

  closeButton:{
    marginTop:46,
  },
});


module.exports = PraiseModal;
