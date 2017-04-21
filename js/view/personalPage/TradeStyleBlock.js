'use strict';

import React, { Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

var ColorConstants = require('../../ColorConstants');
var LogicData = require('../../LogicData');
var NetConstants = require('../../NetConstants');
var NetworkModule = require('../../module/NetworkModule');

export default class TradeStyleBlock extends Component {
  static propTypes = {
    userId: PropTypes.number,
  }

  static defaultProps = {
    userId: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      averageLeverage: '--',
      totalTradeCount: '--',
      averageOpenTime: '--',
      averageInvestUSD: '--',
    }
  }

  refresh(tradeStyle){
    console.log("tradeStyle isPrivate = " + tradeStyle.isPrivate);
    //TODO: add api
    this.setState({
      averageLeverage: tradeStyle.avgLeverage,
      totalTradeCount: tradeStyle.orderCount,
      averageOpenTime: tradeStyle.avgHoldPeriod,
      averageInvestUSD: tradeStyle.avgInvestUSD
    })
  }

  clear(){
    this.setState({
      averageLeverage: '--',
      totalTradeCount: '--',
      averageOpenTime: '--',
      averageInvestUSD: '--',
    })
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>交易风格</Text>
        </View>
				<View style={styles.separator}/>
        <View style={styles.contentRow}>
          <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>平均杠杆（倍）</Text>
            <Text style={styles.contentValueBlock}>{this.state.averageLeverage}</Text>
          </View>
          <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>累计下单（次）</Text>
            <Text style={styles.contentValueBlock}>{this.state.totalTradeCount}</Text>
          </View>
        </View>
        <View style={styles.contentRow}>
          <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>平均持仓时间（天）</Text>
            <Text style={styles.contentValueBlock}>{this.state.averageOpenTime}</Text>
          </View>
          <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>平均本金（美元）</Text>
            <Text style={styles.contentValueBlock}>{this.state.averageInvestUSD}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 181,
    backgroundColor: 'white',
  },
  separator: {
    marginLeft: 15,
    height: 0.5,
    backgroundColor: ColorConstants.SEPARATOR_GRAY,
  },
  titleRow: {
    paddingLeft: 15,
    justifyContent: 'space-around',
    height: 39,
  },
  titleText: {
    fontSize: 14,
    color: '#333333',
  },
  contentRow:{
    flex:1,
    flexDirection: 'row',
    alignItems:'stretch',
  },
  contentBlock:{
    flex:1,
    alignItems:'center',
    alignSelf:'center',
  },
  contentTitleBlock: {
    fontSize: 11,
    color: '#9c9b9b',
  },
  contentValueBlock:{
    fontSize: 19,
    color: '#595959',
    marginTop: 10,
  },
});

module.exports = TradeStyleBlock;
