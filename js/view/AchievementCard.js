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
var imageHeight = imageWidth / 7 * 8;

export default class AchievementCard extends Component {
  static propTypes = {
    id: PropTypes.number,
    cardUrl: PropTypes.string,
  }

  static defaultProps = {
    //cardImage: require('../../images/live_register_banner02.png'),
    id: 0,
    //cardImage: require('../../images/Guide-page05.png'),
    cardUrl: 'http://i10.72g.com/201503/14277923092830.jpg',
    //cardImage: require('../../images/no_network.png'),
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.cardImage} source={{uri: this.props.cardUrl}}>
        </Image>
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
    backgroundColor: 'pink',
    resizeMode: "stretch",
  }
});

module.exports = AchievementCard;
