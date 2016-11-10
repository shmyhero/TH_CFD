'use strict'

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

var {height, width} = Dimensions.get('window');
var imageWidth = width - 20;
var imageHeight = imageWidth / 690 * 644;

export default class AchievementCard extends Component {
  static propTypes = {
    showReward: PropTypes.bool,
    card: PropTypes.object,
    //reward: PropTypes.number,
  }

  static defaultProps = {
    showReward: true,
    cardInfo: null,
  }

  renderReward(){
    if(this.props.showReward && this.props.card.reward){
      var rewardImage ;
      switch(this.props.card.reward){
        case 1:
        rewardImage = require('../../images/achievement_income_1.png');
        break;
        case 2:
        rewardImage = require('../../images/achievement_income_2.png');
        break;
        case 3:
        rewardImage = require('../../images/achievement_income_3.png');
        break;
      }

      return(
        <View style={styles.rewardBar}>
          <Image style={styles.rewardImage}
            source={rewardImage}></Image>
        </View>
     )
   }else{
     return null;
   }
  }

  render() {
    if(this.props.card){
      var source = null;
      source = {uri: this.props.card.imgUrlBig}

      return (
        <View style={styles.container}>
          <Image style={styles.cardImage} source={source}>
          </Image>
          {this.renderReward()}
        </View>
      );
    }else{
      return (<View/>)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  cardImage:{
    //position: 'absolute',
    width: imageWidth,
    height: imageHeight,
    resizeMode: "stretch",
  },

  rewardImage: {
    height: 23,
    width: 163
  },

  rewardBar: {
    position: 'absolute',
    bottom: 20,
    left:0,
    right: 0,
    alignItems:'center',
  },
});

module.exports = AchievementCard;
