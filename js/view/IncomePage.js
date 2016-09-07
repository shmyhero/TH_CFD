/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
} from 'react-native';

var {height, width} = Dimensions.get('window');

export default class IncomePage extends Component {

  getInitialState() {
    return {
      modalVisible: false,
      fadeAnim: new Animated.Value(0),
    };
  }

  show(){
    this.setState({
      modalVisible: true,
    })
  }

  hide(){
    this.setState({
      modalVisible: false,
    })
  }

  render() {
    return (
      <Modal
        animated={false}
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {this._setModalVisible(!this.state.modalVisible)}}
        style={{height: height, width: width, backgroundColor: 'rgba(77,77,77,0.7)'}}
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
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
