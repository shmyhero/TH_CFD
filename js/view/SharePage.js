/* @flow */

import React from 'react';
import {
	StyleSheet,
	View,
	WebView,
  Modal,
	TouchableOpacity,
  TouchableHighlight,
  Image,
	Text,
  Dimensions,
  Animated,
} from 'react-native';

var WechatModule = require('../module/WechatModule')

var {height, width} = Dimensions.get('window')
var SHARE_CONTAINER_HEIGHT = 150;
var SharePage = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    url: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      title: "",
      url: "",
      description: "",
      imgUrl: "",
		  offSet: new Animated.Value(height),
    }
  },

  getInitialState: function() {
		return {
      animationType: 'none',
      modalVisible: false,
      transparent: false,
			fadeAnim: new Animated.Value(0),
		};
	},

	data: null,

  showWithData: function(data) {
		this.data = data;
    this._setModalVisible(true);
		Animated.timing(       // Uses easing functions
			this.state.fadeAnim, // The value to drive
			{
				toValue: 1,        // Target
				duration: 200,    // Configuration
			},
		).start();
  },

  hide: function(){
		var callbackId = this.state.fadeAnim.addListener(function(){
			if(this.state.fadeAnim._value == 0){
				this.state.fadeAnim.removeListener(callbackId)
				this._setModalVisible(false);
			}
		}.bind(this))
		Animated.timing(       // Uses easing functions
			this.state.fadeAnim, // The value to drive
			{
				toValue: 0,        // Target
				duration: 200,    // Configuration
			},
		).start();

  },

  _setModalVisible: function(visible) {
    this.setState({modalVisible: visible});
  },

  _setAnimationType : function(type) {
    this.setState({animationType: type});
  },

  _toggleTransparent : function() {
    this.setState({transparent: !this.state.transparent});
  },

  render: function() {
		//BUGBUG: The status bar cannot be hidden beforn RN 0.27...
		//So make the animation in our code until we update RN.
    return (
        <Modal
					animated={false}
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {this._setModalVisible(!this.state.modalVisible)}}
					style={{height: height, width: width}}
          >
          <TouchableOpacity style={{flex:1, width: width}}
						onPress={() => {
		          this.hide();
	          }}>
						<View style={{flex:1, width: width}}/>
					</TouchableOpacity>

          <Animated.View style={[styles.shareContainer, {opacity: this.state.fadeAnim}]}>
            <Text style={styles.shareTitleText}>分享到</Text>
            <View style={styles.shareItemContainer}>
	            <TouchableOpacity onPress={()=>{this.shareToWeChat("session")}}>
	              <Image style={[styles.icon, {transform: [{rotate: '0deg'}]}]}
	               source={require('../../images/wechat_session.png')}/>
	              <Text style={styles.shareText}>微信</Text>
	            </TouchableOpacity>
	            <TouchableOpacity onPress={()=>{this.shareToWeChat("timeline")}}>
	            <Image style={[styles.icon, {transform: [{rotate: '0deg'}]}]}
	             source={require('../../images/wechat_timeline.png')}/>
	              <Text style={styles.shareText}>朋友圈</Text>
	            </TouchableOpacity>
            </View>
          </Animated.View>
         </Modal>
    );
  },

  shareToWeChat: function(type){
	  if(this.data){
	    if(type == "session"){
	      WechatModule.wechatShare(this.data.title,
							this.data.description,
							this.data.webpageUrl,
							this.data.imageUrl,
							WechatModule.WECHAT_SESSION,
	        ()=>{ },
	        ()=>{ })
	    }else{
	      WechatModule.wechatShare(this.data.title,
							this.data.description,
							this.data.webpageUrl,
							this.data.imageUrl,
							WechatModule.WECHAT_TIMELINE,
	        ()=>{ },
	        ()=>{ })
	    }
		  this.hide();
		}
  },
});

var styles = StyleSheet.create({
  shareContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20,
    backgroundColor: 'rgba(77,77,77,0.7)',
    height: SHARE_CONTAINER_HEIGHT,
  },

	shareTitleText: {
		alignSelf: 'center',
    color: '#FFFFFF',
		fontSize: 18,
		height:35,
	},

  shareText: {
    alignSelf: 'center',
    color: '#FFFFFF',
		marginTop: 10,
  },

  shareItemContainer:{
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    flex: 1
  },

  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  icon: {
    height:40,
    width:40,
  },

  container: {
    flex: 1,
    marginTop: 60
  },
  showtimeContainer: {
   borderTopColor: '#ededed',
    borderTopWidth:1
  },
  showtime: {
   padding:20,
    textAlign: 'center'
  },
});

module.exports = SharePage;
