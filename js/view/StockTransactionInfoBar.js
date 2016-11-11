'use strict'

import React, {
  Component,
  PropTypes
} from 'react';
import {
  View,
  Text,
  StyleSheet,
	Dimensions,
  Image,
} from 'react-native';

var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');

var {height, width} = Dimensions.get('window');
var itemTitleFontSize = Math.round(16*width/375)
var itemValueFontSize = Math.round(14*width/375)

var TITLE_HEIGHT = 40;
var ROW_HEIGHT = 60;

export default class StockTransactionInfoBar extends Component {
  static propTypes = {
    transactionInfo: PropTypes.object,
    card: PropTypes.object,
    hideTopCornerRadius: PropTypes.bool
  }

  static defaultProps = {
    transactionInfo: null,
    card: null,
    hideTopCornerRadius: false,
  }

  constructor(props) {
	  super(props);

    var transactionInfo = this.props.transactionInfo;
    var cardInfo = this.props.card;
    if(cardInfo){
      console.log("cardInfo: " + JSON.stringify(cardInfo))
      this.state = {
        name: cardInfo.stockName,
        isCreate: false,
        isLong: cardInfo.isLong,
        invest: cardInfo.invest,
        leverage: cardInfo.leverage,
        openPrice: cardInfo.tradePrice,
        settlePrice: cardInfo.settlePrice,
        time: new Date(cardInfo.tradeTime),
        titleColor: cardInfo.themeColor,
        ccy: cardInfo.ccy,
        pl: cardInfo.pl ? cardInfo.pl : transactionInfo.pl,
        plRate: cardInfo.plRate,
      }
    }else if(transactionInfo){
      console.log("transactionInfo: " + JSON.stringify(transactionInfo))
      this.state = {
        name: transactionInfo.stockName,
        isCreate: transactionInfo.isCreate,
        isLong: transactionInfo.isLong,
        invest: transactionInfo.invest,
        leverage: transactionInfo.leverage,
        openPrice: transactionInfo.openPrice,
        settlePrice: transactionInfo.settlePrice,
        time: transactionInfo.time,
        titleColor: ColorConstants.TITLE_BLUE,
        ccy: transactionInfo.security ? transactionInfo.security.ccy : "USD",
        pl: transactionInfo.pl,
        plRate: '',
      };
    }else{
      this.state = {
        name: 'ABC',
        isCreate: true,
        isLong: true,
        invest: 0,
        leverage: 0,
        openPrice: 0,
        settlePrice: 0,
        time: new Date(),
        titleColor: ColorConstants.TITLE_BLUE,
        ccy: 'USD',
        pl: 0,
        plRate: 0,
      }
    }
  }

  render() {
    var plRate = this.state.plRate
		if ((plRate === '' || plRate === undefined) && !this.state.isCreate) {
      //console.log("this.state.settlePrice: " + this.state.settlePrice + ", this.state.openPrice: " + this.state.openPrice + ", this.state.leverage: " + this.state.leverage)
			plRate = (this.state.settlePrice - this.state.openPrice) / this.state.openPrice * this.state.leverage * 100
			plRate *= (this.state.isLong ? 1 : -1)
		}

		var plColor = 'black'
		if (!this.state.isCreate)
			plColor = plRate > 0 ? ColorConstants.STOCK_RISE_RED : (plRate < 0 ? ColorConstants.STOCK_DOWN_GREEN : 'black')
    //alert(JSON.stringify(this.state.transactionInfo))
		var currency = UIConstants.CURRENCY_CODE_LIST[this.state.ccy]

    var extraTitleContainerStyle = {
      backgroundColor: this.state.titleColor
    };
    if(this.props.hideTopCornerRadius){
      extraTitleContainerStyle.borderTopLeftRadius = 0;
      extraTitleContainerStyle.borderTopRightRadius = 0;
    }

    return (
      <View style={styles.container}>
        <View style={[styles.titleContainer, extraTitleContainerStyle]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch'}}>
            <Text style={styles.titleText}>
              {this.state.name} - {this.state.isCreate?'开仓':'平仓'}
            </Text>

            {this.state.isCreate ?
              null :
              <Text style={[styles.titleText, {marginRight: 15}]}>
                {(plRate).toFixed(2)} %
              </Text>
            }

          </View>
        </View>
        <View style={styles.centerContainer}>
          <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: 15, paddingVertical: 8}}>
            <Text style={styles.itemTitleText}>
              类型
            </Text>
            <Image style={styles.longImage} source={this.state.isLong ? require('../../images/dark_up.png') : require('../../images/dark_down.png')}/>
          </View>
          <View style={{flex: 2, alignItems: 'center'}}>
            <Text style={styles.itemTitleText}>
              本金({currency})
            </Text>
            <Text style={styles.itemValueText}>
              {this.state.invest.toFixed(2)}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 15}}>
            <Text style={styles.itemTitleText}>
              杠杆
            </Text>
            <Text style={styles.itemValueText}>
              {this.state.leverage}
            </Text>
          </View>
        </View>
        <View style={styles.line}/>
        <View style={styles.bottomContainer}>
          <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: 15, paddingVertical: 8}}>
            <Text style={styles.itemTitleText}>
              交易价格
            </Text>
            <Text style={styles.itemValueText}>
              {this.state.settlePrice}
            </Text>
          </View>
          <View style={{flex: 2, alignItems: 'center'}}>
            <Text style={styles.itemTitleText}>
              {this.state.isCreate? ('最大风险('+currency+')') : '盈亏(美元)'}
            </Text>
            <Text style={[styles.itemValueText, {color: plColor}]}>
              {this.state.isCreate ? this.state.invest.toFixed(2) : this.state.pl.toFixed(2)}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 15}}>
            <Text style={styles.itemTitleText}>
              {this.state.time.Format('yy/MM/dd')}
            </Text>
            <Text style={styles.itemValueText}>
              {this.state.time.Format('hh:mm')}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignSelf: 'stretch',
    //backgroundColor: 'gray',
  },

	titleContainer: {
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		alignItems: 'flex-start',
    height: TITLE_HEIGHT,
	},

	centerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
    height: ROW_HEIGHT,
		backgroundColor: '#f5f5f5',
	},

	bottomContainer: {
		borderBottomLeftRadius: 3,
		borderBottomRightRadius: 3,
		flexDirection: 'row',
		alignItems: 'center',
    height: ROW_HEIGHT,
		backgroundColor: '#f5f5f5',
	},

	titleText: {
		fontSize: 20,
		textAlign: 'center',
		color: '#ffffff',
		marginLeft: 15,
		marginVertical: 8,
	},

	itemTitleText: {
		fontSize: itemTitleFontSize,
		textAlign: 'center',
		color: '#7d7d7d',
	},

	itemValueText: {
		fontSize: itemValueFontSize,
		textAlign: 'center',
		color: '#000000',
		paddingTop: 4,
	},

	longImage: {
		width: itemValueFontSize+5,
		height: itemValueFontSize+5,
	},

	line: {
		height: 1,
		backgroundColor: '#c9c9c9',
	},
});

module.exports = StockTransactionInfoBar;
