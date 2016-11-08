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
    id: PropTypes.number,
    cardUrl: PropTypes.string,
    reward: PropTypes.number,
  }

  static defaultProps = {
    //cardImage: require('../../images/live_register_banner02.png'),
    id: 0,
    reward: 0,
    //cardImage: require('../../images/Guide-page05.png'),
    cardUrl: 'http://i10.72g.com/201503/14277923092830.jpg',
    cardImage: require('../../images/test_achievement.png'),
  }

  renderReward(){
    if(this.props.reward){
      var rewardImagePath = '../../images/achievement_income_' + this.props.reward + '.png';
      return(
        <Image style={styles.rewardImage}
          source={require(rewardImagePath)}></Image>
     )
   }else{
     return null;
   }
  }

  render() {
    var source = null;
    if(this.props.cardImage){
      source = this.props.cardImage;
    }else{
      source = {uri: this.props.cardUrl}
    }

    return (
      <View style={styles.container}>
        <Image style={styles.cardImage} source={source}>
        </Image>
        <View style={{position: 'absolute', bottom: 20, left:0, right: 0, alignItems:'center',}}>
          {this.renderReward()}
         </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'yellow',
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
  }
});

module.exports = AchievementCard;
