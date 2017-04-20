'use strict';

import React, { Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight,
  Dimensions,
} from 'react-native';

var ColorConstants = require('../../ColorConstants');
var LogicData = require('../../LogicData');
var NetConstants = require('../../NetConstants');
var UIConstants = require('../../UIConstants');
var NetworkModule = require('../../module/NetworkModule');
var stockNameFontSize = Math.round(17*width/375.0)

var {height, width} = Dimensions.get('window');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
		if(r1.security && r2.security){
			if(r1.security.last !== r2.security.last || r1.security.bid !== r2.security.bid || r1.security.ask !== r2.security.ask){
				return true;
			}
		}
		return r1.id !== r2.id || r1.profitPercentage!==r2.profitPercentage || r1.hasSelected!==r2.hasSelected
	}});

export default class PositionBlock extends Component {
  static propTypes = {
    userId: PropTypes.number,
    style: PropTypes.object,
    type: PropTypes.string,
  }

  static defaultProps = {
    userId: 0,
    style: {},
    type: "open",
  }

  constructor(props) {
    super(props);

    this.state = {
      stockInfo: ds.cloneWithRows([]),
      stockInfoRowData: [],
      statisticsSumInfo: [],
      maxBarSize: 1,
      barAnimPlayed: false,
    }
  }

  getLastPrice(rowData) {
		var lastPrice = rowData.isLong ? rowData.security.bid : rowData.security.ask
		// console.log(rowData.security.bid, rowData.security.ask)
		return lastPrice === undefined ? rowData.security.last : lastPrice
	}

  refresh(){
    var data = [
    { id: 'aaaa',
      security:
       { dcmCount: 2,
         bid: 5400.13,
         ask: 5411.63,
         lastOpen: '2017-04-20T05:20:13.256Z',
         lastClose: '2017-04-20T04:55:04.078Z',
         maxLeverage: 100,
         smd: 0.0005,
         gsmd: 0.003,
         ccy: 'USD',
         isPriceDown: false,
         id: 36004,
         symbol: 'NDX',
         name: '开仓1',
         preClose: 5395.63,
         open: 5399.63,
         last: 5410.88,
         isOpen: true,
         status: 1 },
      invest: 514.99998588335,
      isLong: true,
      leverage: 10,
      settlePrice: 5410.13,
      quantity: 0.19038359,
      upl: 0,
      createAt: '2017-04-20T08:03:27.166Z',
      stopPx: 5330.8174942000005,
      stopOID: '102404243106' },
    { id: 'aaaa',
      security:
       { dcmCount: 2,
         bid: 5400.13,
         ask: 5411.63,
         lastOpen: '2017-04-20T05:20:13.256Z',
         lastClose: '2017-04-20T04:55:04.078Z',
         maxLeverage: 100,
         smd: 0.0005,
         gsmd: 0.003,
         ccy: 'USD',
         isPriceDown: false,
         id: 36004,
         symbol: 'NDX',
         name: '开仓1',
         preClose: 5395.63,
         open: 5399.63,
         last: 5410.88,
         isOpen: true,
         status: 1 },
      invest: 514.99998588335,
      isLong: true,
      leverage: 10,
      settlePrice: 5410.13,
      quantity: 0.19038359,
      upl: 0,
      createAt: '2017-04-20T08:03:27.166Z',
      stopPx: 5330.8174942000005,
      stopOID: '102404243106' },
    { id: 'aaaa',
        security:
         { dcmCount: 2,
           bid: 5400.13,
           ask: 5411.63,
           lastOpen: '2017-04-20T05:20:13.256Z',
           lastClose: '2017-04-20T04:55:04.078Z',
           maxLeverage: 100,
           smd: 0.0005,
           gsmd: 0.003,
           ccy: 'USD',
           isPriceDown: false,
           id: 36004,
           symbol: 'NDX',
           name: '开仓1',
           preClose: 5395.63,
           open: 5399.63,
           last: 5410.88,
           isOpen: true,
           status: 1 },
        invest: 514.99998588335,
        isLong: true,
        leverage: 10,
        settlePrice: 5410.13,
        quantity: 0.19038359,
        upl: 0,
        createAt: '2017-04-20T08:03:27.166Z',
        stopPx: 5330.8174942000005,
        stopOID: '102404243106' },
    { id: 'aaaa',
      security:
       { dcmCount: 2,
         bid: 5411.13,
         ask: 5411.63,
         lastOpen: '2017-04-20T05:20:13.256Z',
         lastClose: '2017-04-20T04:55:04.078Z',
         maxLeverage: 100,
         smd: 0.0005,
         gsmd: 0.003,
         ccy: 'USD',
         isPriceDown: false,
         id: 36004,
         symbol: 'NDX',
         name: '开仓2',
         preClose: 5395.63,
         open: 5399.63,
         last: 5410.88,
         isOpen: true,
         status: 1 },
      invest: 514.99998588335,
      isLong: true,
      leverage: 10,
      settlePrice: 5410.13,
      quantity: 0.19038359,
      upl: 0,
      createAt: '2017-04-20T08:03:27.166Z',
      stopPx: 5330.8174942000005,
      stopOID: '102404243106' }  ];
    if(this.props.type == "open"){
      for(var i=0;i<data.length;i++){
        data[i].security.name = "持仓"+i
      }

    }else{
      for(var i=0;i<data.length;i++){
        data[i].security.name = "平仓"+i
      }
    }
    this.setState({
      stockInfo: ds.cloneWithRows(data),
      stockInfoRowData: data,
    })
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
	}

  renderHeaderBar() {
    return (
      <View style={styles.headerBar}>
        <View style={[styles.rowLeftPart, {	paddingTop: 5,}]}>
          <Text style={styles.headerTextLeft}>产品</Text>
        </View>
        <View style={[styles.rowCenterPart, {	paddingRight: 10,}]}>
          <Text style={[styles.headerTextLeft, {paddingRight: 0,}]}>亏盈</Text>
        </View>
        <View style={styles.rowRightPart}>
          <Text style={styles.headerTextLeft}>收益率</Text>
        </View>
      </View>
    );
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
		var profitPercentage = 0
		var profitAmount = rowData.upl
		if (rowData.settlePrice !== 0) {
			profitPercentage = (this.getLastPrice(rowData) - rowData.settlePrice) / rowData.settlePrice * rowData.leverage
			profitPercentage *= (rowData.isLong ? 1 : -1)
			profitAmount = profitPercentage * rowData.invest

			//Only use the fxdata for non-usd
			if (rowData.security.ccy != UIConstants.USD_CURRENCY) {
				if (rowData.fxData && rowData.fxData.ask) {
					profitAmount = this.calculateProfitWithOutright(profitAmount, rowData.fxData)
				}	else if(rowData.fxOutright && rowData.fxOutright.ask){
					profitAmount = this.calculateProfitWithOutright(profitAmount, rowData.fxOutright)
				} else {
					profitAmount = rowData.upl
				}
			}
		}
		var bgcolor = 'white'

		return (
			<View>
				<TouchableHighlight activeOpacity={1}>
					<View style={[styles.rowWrapper, {backgroundColor: bgcolor}]} key={rowData.key}>
						<View style={styles.rowLeftPart}>
							<Text style={styles.stockNameText} allowFontScaling={false} numberOfLines={1}>
								{rowData.security.name}
							</Text>

							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								{/* {this.renderCountyFlag(rowData)} */}
								{/* {this.renderStockStatus(rowData)} */}
								<Text style={styles.stockSymbolText}>
									{rowData.security.symbol}
								</Text>
							</View>
						</View>

						<View style={styles.rowCenterPart}>
							{this.renderProfit(profitAmount, null)}
						</View>

						<View style={styles.rowRightPart}>
							{this.renderProfit(profitPercentage * 100, "%")}
						</View>
						{/* {rowData.security.isOpen ? null :
							<Image style={styles.notOpenImage} source={require('../../images/not_open.png')}/>
						} */}
					</View>
				</TouchableHighlight>
			</View>
		);
	}

  renderProfit(percentChange, endMark) {
		var textSize = Math.round(18*width/375.0)
		percentChange = percentChange.toFixed(2)
		var startMark = percentChange > 0 ? "+":null
		return (
			<Text style={[styles.stockPercentText, {color: ColorConstants.stock_color(percentChange), fontSize:textSize}]}>
				 {startMark}{percentChange} {endMark}
			</Text>
		);

	}

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeaderBar()}
        <ListView
          style={styles.list}
          ref="listview"
          initialListSize={11}
          dataSource={this.state.stockInfo}
          enableEmptySections={true}
          renderRow={(rowData, sectionID, rowID, highlightRow)=>this.renderRow(rowData, sectionID, rowID, highlightRow)}
          renderSeparator={this.renderSeparator}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    alignSelf: 'stretch',
    flex: 1,
  },
  line: {
    height: 0.5,
    backgroundColor: 'white',
  },
  separator: {
    marginLeft: 15,
    height: 0.5,
    backgroundColor: ColorConstants.SEPARATOR_GRAY,
  },
  rowWrapper: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#ffffff',
  },
  rowLeftPart: {
    flex: 3,
    alignItems: 'flex-start',
    paddingLeft: 0,
  },
	stockNameText: {
		fontSize: stockNameFontSize,
		textAlign: 'center',
		fontWeight: 'bold',
		lineHeight: 22,
	},
	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
		lineHeight: 14,
	},
  rowCenterPart: {
    flex: 2.5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 5,
    alignItems: 'flex-end',
  },
	rowRightPart: {
		flex: 2.5,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 0,
		alignItems: 'flex-end',
	},
	headerBar: {
		flexDirection: 'row',
		backgroundColor: '#d9e6f3',
		height: UIConstants.LIST_HEADER_BAR_HEIGHT,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop:2,
	},
	headerCell: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		// borderWidth: 1,
	},
	headerText: {
		fontSize: 14,
		textAlign: 'center',
		color:'#576b95',
	},

	headerTextLeft: {
		fontSize: 14,
		textAlign: 'left',
		color:'#576b95',
	},
});

module.exports = PositionBlock;
