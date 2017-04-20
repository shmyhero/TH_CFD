'use strict';

import React, { Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class PositionBlock extends Component {
  static propTypes = {
    userId: PropTypes.number,
    style: PropTypes.object,
  }

  static defaultProps = {
    userId: 0,
    style: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      statisticsBarInfo: [],
      statisticsSumInfo: [],
      maxBarSize: 1,
      barAnimPlayed: false,
    }
  }

  refresh(){

  }

  render() {
    return (
      <View style={styles.container}>
        <Text>I'm the MyComponent component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

module.exports = PositionBlock;
