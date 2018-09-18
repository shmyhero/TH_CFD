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
	TouchableOpacity,
	Platform,
} from 'react-native';

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

export default class ActivityModal extends Component {
  static propTypes = {
    getNavigator: PropTypes.func,
  }

  static defaultProps = {
    getNavigator: ()=>{}
  }

  constructor(props) {
    super(props);

    this.state = {
			modalVisible: false,
      title: "",
      webPageUrl: "",
      imageUrl: "",
      loading: true,
		}
  }

	show(title, webPageUrl, imageUrl) {
    this.setState({
      title: title,
      webPageUrl: webPageUrl,
      imageUrl: imageUrl,
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

	setPageViewed(cardInfo){
		if(cardInfo.isNew){
			var url = NetConstants.CFD_API.SET_CARD_READ;
			url = url.replace("<id>", cardInfo.cardId);
			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'GET',
				},
				(responseJson) => {
					cardInfo.isNew = false;
				},
				(result) => {
					console.log(result.errorMessage)
				}
			)
		}
	}

  onLoad(){
    this.setState({
      loading: false,
    })
  }

  onImagePress(){
    var key = TalkingdataModule.KEY_ACTIVITY_PRESSED.replace("<ACTIVITY>", this.state.title);
    TalkingdataModule.trackEvent(key)

    this._setModalVisible(false)

    this.props.getNavigator().push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: this.state.webPageUrl,
      title: this.state.title,
      isShowNav: false,
		})
  }

  onCloseButtonPress(){
    var key = TalkingdataModule.KEY_ACTIVITY_CANCELED.replace("<ACTIVITY>", this.state.title);
    TalkingdataModule.trackEvent(key)
    this._setModalVisible(false)
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
          <View style={[styles.modalInnerContainer]}>
            {this.renderImage()}
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity style={styles.closeButton} onPress={() => this.onCloseButtonPress()}>
                  <Image style = {styles.imgClose} source = {require('../../images/sign_stratgy_close.png')} ></Image>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderWaitingRing(){
    if(this.state.loading){
      return(
        <View style={{position:'absolute', top:0, bottom:0, left:0, right: 0, alignItems: 'center', justifyContent:'center'}}>
          <WaitingRing color="white"/>
        </View>
      )
    }else{
      return(
        <View></View>
      )
    }
  }

  renderImage() {
      var source = null;
      source = {uri: this.state.imageUrl}
      console.log("this.state.imageUrl " + this.state.imageUrl)
      var imgStyle = [styles.activityImage, {width: imageWidth, height: imageHeight}];
      return (
        <TouchableOpacity style={styles.container} onPress={()=>this.onImagePress()}>
          <Image style={imgStyle} source={source} onLoad={()=>this.onLoad()}>
          </Image>
          {this.renderWaitingRing()}
        </TouchableOpacity>
      );
  }
}

var styles = StyleSheet.create({
	// container: {
	// 	position: 'absolute',
	// 	left: 0,
	// 	right: 0,
	// 	top: 0,
	// 	bottom: 0,
	// },

	modalContainer:{
		flex: 1,
		justifyContent: 'center',
		backgroundColor:'rgba(0, 0, 0, 0.7)',
		alignItems: 'center',
		height: height + (Platform.OS === 'android' ? 20 : 0),
		width: width,
	},

  container: {
		/*position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'transparent',
		*/
		//flex: 1,
		marginTop: BODY_TOP_MARGIN,
		justifyContent: 'center',
		alignSelf: 'center',
		// paddingBottom:height/2,
	},

	realContent: {
		marginLeft: BODY_HORIZON_MARGIN,
		marginRight: BODY_HORIZON_MARGIN,
	},

  modalInnerContainer: {
    alignItems: 'stretch',
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


module.exports = ActivityModal;
