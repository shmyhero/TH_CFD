'use strict'

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
	Dimensions,
  Image,
} from 'react-native';

var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var LS = require("../LS");

var {height, width} = Dimensions.get('window');
const RESIZE_SCALE = width/375
var itemTitleFontSize = Math.round(16*RESIZE_SCALE)
var itemValueFontSize = Math.round(14*RESIZE_SCALE)


var TITLE_HEIGHT = 40;
var ROW_HEIGHT = 61;
var HORIZONTAL_BIG_MARGIN = 28;
var HORIZONTAL_SMALL_MARGIN = 15;

export default class StockTransactionInfoBar extends Component {
  static propTypes = {
    transactionInfo: PropTypes.object,
    card: PropTypes.object,
    hideTopCornerRadius: PropTypes.bool,
    width: PropTypes.number,
    bigMargin: PropTypes.bool,
  }

  static defaultProps = {
    transactionInfo: null,
    card: null,
    hideTopCornerRadius: false,
    width: width-30,
    bigMargin: false,
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

    console.log("this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN " + (this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN))
    console.log("aaaaa " + this.props.bigMargin)

    //Card style.
    var titleTextStyle = {}
    var backgroundStyle = {}
    var itemTitleTextStyle = {}
    var itemValueTextStyle = {}
    var upTextStyle = {}
    var lineStyle = {};
    var longImageStyle = {};
    var extraTitleImageBackground = (<View/>);

    var headerHeight = this.props.width / 690 * 82
    var longImageSrc = this.state.isLong ? require('../../images/dark_up.png') : require('../../images/dark_down.png');



    if(this.props.card){
      backgroundStyle.backgroundColor = "transparent";
      extraTitleContainerStyle.backgroundColor = "transparent";
      titleTextStyle.fontSize = Math.round(15 * RESIZE_SCALE);
      extraTitleImageBackground = (<Image source={require('../../images/card_tittle.jpg')}
      style={{"position":'absolute', 'top':0, 'bottom':0, 'height': headerHeight, 'resizeMode': 'stretch', width: this.props.width}}
      />)
      itemTitleTextStyle.color = "#5077c9";
      itemTitleTextStyle.fontSize = Math.round(12 * RESIZE_SCALE)
      itemValueTextStyle.color = "white";
      itemValueTextStyle.fontSize = Math.round(11 * RESIZE_SCALE)

      plColor = plRate > 0 ? "#f95a5a" : "#428e1b";

      lineStyle.backgroundColor = "#203040";
      lineStyle.marginLeft = 20;
      lineStyle.marginRight = 20;
      longImageSrc = this.state.isLong ? require('../../images/light_up.png') : require('../../images/light_down.png');
      longImageStyle.height = itemValueFontSize+5
    }

    return (
      <View style={[styles.container, {width: this.props.width}, backgroundStyle]}>
        {extraTitleImageBackground}
        <View style={[styles.titleContainer, extraTitleContainerStyle, {height: headerHeight, justifyContent:'center'}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch'}}>
            <Text style={[styles.titleText, {flex:1, marginLeft: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN}, titleTextStyle]} numberOfLines={1} ellipsizeMode={'head'}>
              {this.state.name} - {this.state.isCreate? LS.str("CARD_OPEN") : LS.str("CARD_CLOSE")}
            </Text>
            {this.state.isCreate ?
              null :
              <Text style={[styles.titleText, {marginRight: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN, marginLeft: 5}, titleTextStyle]}>
                {(plRate).toFixed(2)} %
              </Text>
            }

          </View>
        </View>
        <View style={[styles.centerContainer, {height: this.props.width / 690 * 122, }, backgroundStyle]}>
          <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN, paddingVertical: 8}}>
            <Text style={[styles.itemTitleText, itemTitleTextStyle]}>
              {LS.str("CARD_TYPE")}
            </Text>
            <Image style={[styles.longImage, longImageStyle]} source={longImageSrc}/>
          </View>
          <View style={{flex: 2, alignItems: 'center'}}>
            <Text style={[styles.itemTitleText, itemTitleTextStyle]}>
              {LS.str("CARD_INVEST").replace("{1}", currency)}
            </Text>
            <Text style={[styles.itemValueText, itemValueTextStyle]}>
              {this.state.invest.toFixed(2)}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end', paddingRight: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN}}>
            <Text style={[styles.itemTitleText, itemTitleTextStyle]}>
              {LS.str("CARD_LEVERAGE")}
            </Text>
            <Text style={[styles.itemValueText, itemValueTextStyle]}>
              {this.state.leverage}
            </Text>
          </View>
        </View>
        <View style={[styles.line, lineStyle]}/>
        <View style={[styles.bottomContainer, {height: this.props.width / 690 * 122}, backgroundStyle]}>
          <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN, paddingVertical: 8}}>
            <Text style={[styles.itemTitleText, itemTitleTextStyle]}>
              {LS.str("CARD_TRADE_PRICE")}
            </Text>
            <Text style={[styles.itemValueText, itemValueTextStyle]}>
              {this.state.settlePrice}
            </Text>
          </View>
          <View style={{flex: 2, alignItems: 'center'}}>
            <Text style={[styles.itemTitleText, itemTitleTextStyle]}>
              {this.state.isCreate? LS.str("CARD_MAX_RISK").replace("{1}", currency) : LS.str("CARD_PROFIT_AND_LOSS")}
            </Text>
            <Text style={[styles.itemValueText, itemValueTextStyle, {color: plColor}]}>
              {this.state.isCreate ? this.state.invest.toFixed(2) : this.state.pl.toFixed(2)}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end', paddingRight: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN}}>
            <Text style={[styles.itemTitleText, itemValueTextStyle]}>
              {this.state.time.Format('yy/MM/dd')}
            </Text>
            <Text style={[styles.itemValueText, itemValueTextStyle]}>
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
    width: width - 20,
    //backgroundColor: 'gray',
  },

	titleContainer: {
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
    borderWidth:0,
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
		borderBottomLeftRadius: 4,
		borderBottomRightRadius: 4,
		flexDirection: 'row',
		alignItems: 'center',
    height: ROW_HEIGHT,
		backgroundColor: '#f5f5f5',
	},

  titleText: {
		fontSize: 17,
		// textAlign: 'center',
		color: '#ffffff',
		//marginVertical: 8,
    textAlign: 'left',
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
		paddingTop: 4,
	},

	line: {
		height: 1,
		backgroundColor: '#c9c9c9',
	},
});

module.exports = StockTransactionInfoBar;
