'use strict';

import React, { Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight,
  Dimensions,
  Image,
  Platform,
  LayoutAnimation
} from 'react-native';

var ColorConstants = require('../../ColorConstants');
var LogicData = require('../../LogicData');
var NetConstants = require('../../NetConstants');
var UIConstants = require('../../UIConstants');
var NetworkModule = require('../../module/NetworkModule');
var NetworkErrorIndicator = require('../../view/NetworkErrorIndicator');
var LS = require('../../LS')
var {height, width} = Dimensions.get('window');
var stockNameFontSize = Math.round(17*width/375.0);

var DEFAULT_EXTENDED_HEIGHT = 222;
var extendHeight = DEFAULT_EXTENDED_HEIGHT
var rowHeight = 0
var isWaiting = false

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
    userId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    style: PropTypes.object,
  }

  static defaultProps = {
    userId: 0,
    style: {},
    type: "open",
    isPrivate: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      stockInfo: ds.cloneWithRows([]),
      stockInfoRowData: [],
      statisticsSumInfo: [],
      maxBarSize: 1,
      barAnimPlayed: false,
      contentLoaded: false,
			isRefreshing: false,
    }
  }


  refresh(){
    if(this.props.isPrivate){
      return;
    }

    this.loadData();
  }

  stockPressed(rowData, sectionID, rowID, highlightRow) {
		if (rowHeight === 0) {	// to get the row height, should have better method.
			rowHeight = this.refs['listview'].getMetrics().contentLength/this.state.stockInfoRowData.length
		}

		this.setState({
			showExchangeDoubleCheck: false,
		})
		var newData = []
		$.extend(true, newData, this.state.stockInfoRowData)	// deep copy

		extendHeight = DEFAULT_EXTENDED_HEIGHT
		if (this.state.selectedRow == rowID) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			newData[rowID].hasSelected = false
			this.setState({
				stockInfo: this.state.stockInfo.cloneWithRows(newData),
				selectedRow: -1,
				selectedSubItem: 0,
				stockInfoRowData: newData,
			})
			if (Platform.OS === 'android') {
				var currentY = rowHeight*(parseInt(rowID))
				setTimeout(
					() => {
						if (currentY > 300 && currentY + 3 * rowHeight > this.refs['listview'].getMetrics().contentLength) {
							this.refs['listview'].scrollTo({x:0, y:Math.floor(currentY), animated:true})
						}
					 },
					500
				);
			}
		} else {
			isWaiting = false
			if (this.state.selectedRow >=0) {
				newData[this.state.selectedRow].hasSelected = false
			}
			newData[rowID].hasSelected = true
		
			this.setState({
				stockInfo: this.state.stockInfo.cloneWithRows(newData),
				selectedRow: rowID,
				selectedSubItem: 0,
				stockInfoRowData: newData,			
			}, ()=>{
				this.doScrollAnimation();
			});
		}
  }

  currentExtendHeight(subItem) {
		var showNetIncome = false
		var newHeight = DEFAULT_EXTENDED_HEIGHT
		if (showNetIncome) {
			newHeight += 20
		}
		if (subItem === 1) {
			newHeight += 170
		}
		if (subItem === 2) {
			newHeight += 170 - 70		
		}
		if (this.state.showExchangeDoubleCheck) {
			newHeight += 28
		}
		return newHeight
	}
  
  doScrollAnimation() {
		if (Platform.OS === 'ios') {
			var newExtendHeight = this.currentExtendHeight(this.state.selectedSubItem)
			if (newExtendHeight < extendHeight) {
				newExtendHeight = extendHeight
			}
			var rowID = this.state.selectedRow
			var maxY = (height-114-UIConstants.LIST_HEADER_BAR_HEIGHT)*20/21 - newExtendHeight
			var currentY = rowHeight*(parseInt(rowID)+1)
			if (currentY > maxY) {
				this.refs['listview'].scrollTo({x:0, y:Math.floor(currentY-maxY), animated:true})
			}

			//Disable the spring animation on Android for now since the RN 3.3 list view has a bug.
			if(Platform.OS === 'ios'){
				//Do not set delete animation, or the some row will be removed if clicked quickly.
				var animation = {
					duration: 700,
					create: {
						type: 'linear',
						property: 'opacity',
					},
					update: {
						type: 'spring',
						springDamping: 0.4,
						property: 'scaleXY',
					},
				}
				LayoutAnimation.configureNext(animation);//LayoutAnimation.Presets.spring);
				//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
			}
			extendHeight = newExtendHeight
		}
	}

  loadData(){
		this.setState({
			isRefreshing: true,
		}, ()=>{
      var url = '';
      if(this.props.type == 'open'){
        url = NetConstants.CFD_API.PERSONAL_PAGE_POSITION_OPEN;
      }else if(this.props.type == 'close'){
        url = NetConstants.CFD_API.PERSONAL_PAGE_POSITION_CLOSE;
      }

      if(url == ''){
        return;
      }

      url = url.replace("<userID>", this.props.userId);
      var userData = LogicData.getUserData()

      NetworkModule.fetchTHUrl(
        url,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
            'Accept-Language': LogicData.getLanguageEn() == '1'?'en':'cn',
          },
          cache: 'none',
        },
        (responseJson) => {
          this.setState({
            contentLoaded: true,
            isRefreshing: false,
            stockInfoRowData: responseJson,
            stockInfo: this.state.stockInfo.cloneWithRows(responseJson),
          });
        },
        (result) => {
          if(!result.loadedOfflineCache){
            this.setState({
              contentLoaded: false,
              isRefreshing: false,
            })
          }
          // Alert.alert('', errorMessage);
        }
      )
    });
	}

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
	}

  renderHeaderBar() {
    var strCP = LS.str('CP')
    var strYK = LS.str('YK')
    var strSYL = LS.str('SYL')
    return (
      <View style={styles.headerBar}>
        <View style={[styles.rowLeftPart, {	paddingTop: 5,}]}>
          <Text style={styles.headerTextLeft}>{strCP}</Text>
        </View>
        <View style={[styles.rowCenterPart, {	paddingRight: 10,}]}>
          <Text style={[styles.headerTextLeft, {paddingRight: 0,}]}>{strYK}</Text>
        </View>
        <View style={styles.rowRightPart}>
          <Text style={styles.headerTextLeft}>{strSYL}</Text>
        </View>
      </View>
    );
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
		var profitPercentage = rowData.rate
		var profitAmount = rowData.pl
		var bgcolor = 'white'

		return (
			<View>
				<TouchableHighlight activeOpacity={1} onPress={() => this.stockPressed(rowData, sectionID, rowID, highlightRow)}>
					<View style={[styles.rowWrapper, {backgroundColor: bgcolor}]} key={rowID}>
						<View style={styles.rowLeftPart}>
							<Text style={styles.stockNameText} allowFontScaling={false} numberOfLines={1}>
								{rowData.name}
							</Text>

							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								{/* {this.renderCountyFlag(rowData)} */}
								{/* {this.renderStockStatus(rowData)} */}
								<Text style={styles.stockSymbolText}>
									{rowData.symbol}
								</Text>
							</View>
						</View>

						<View style={styles.rowCenterPart}>
							{this.renderProfit(profitAmount, null)}
						</View>

						<View style={styles.rowRightPart}>
							{this.renderProfit(profitPercentage * 100, "%")}
						</View>
					</View>
				</TouchableHighlight>
        {this.state.selectedRow == rowID ? this.renderDetailInfo(rowData, rowID): null}
			</View>
		);
  } 

	renderDetailInfo(rowData, rowID){
    var tradeImage = rowData.isLong ? require('../../../images/icon_up_cw.png') : require('../../../images/icon_down_cw.png')
    var timeSubTitle = this.props.type == "open" ? LS.str('OPEN_TIME') : LS.str('CLOSE_TIME');
		var dateString = this.props.type == "open" ? rowData.createdAt : rowData.closedAt;
		console.log("renderDetailInfo", dateString)
		var date = new Date(dateString)
		console.log("renderDetailInfo", date)
    var timeString = date.Format('yy/MM/dd hh:mm');
    return (
      <View style={styles.extendRowWrapper}>
        <View style={styles.extendLeft}>
          <Text style={styles.extendTextTop}>{LS.str('LX')}</Text>
          <Image style={styles.extendImageBottom} source={tradeImage}/>
        </View>
        <View style={styles.extendRight}>
          <Text style={styles.extendTextTop}>{timeSubTitle}</Text>
          <Text style={styles.extendTextBottom}>{timeString}</Text>
        </View>
      </View>);
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
    var strYHWGKSJ = LS.str('YHWGKSJ')
    var strZWCCJL = LS.str('ZWCCJL')
    var strZWPCJL = LS.str('ZWPCJL')
    if(this.props.isPrivate){
      return (
        <View style={styles.emptyView}>
          <Text style={styles.loadingText}>{strYHWGKSJ}</Text>
        </View>
      )
    }else{
      if(!this.state.contentLoaded){
  			return (
  				<NetworkErrorIndicator onRefresh={()=>this.loadData()} refreshing={this.state.isRefreshing}/>
  			)
  		}else {

        if(this.state.stockInfoRowData.length === 0) {

  			return (
  				<View style={styles.emptyView}>
  					<Text style={styles.loadingText}>{ this.props.type== "open" ? strZWCCJL:strZWPCJL}</Text>
  				</View>
  				)
        }else{
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
    }
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

	emptyView: {
		flex: 2,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
  loadingText: {
    fontSize: 13,
    color: '#9f9f9f'
  },
  extendLeft: {
		flex: 1,
		alignItems: 'flex-start',
		marginLeft: 15,
		paddingTop: 8,
		paddingBottom: 8,
  },
  extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},
  extendImageBottom: {
		width: 24,
		height: 24,
  },
  extendRowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
    height: 51,
    backgroundColor: ColorConstants.LIST_BACKGROUND_GREY,
	},
	extendTextTop: {
		fontSize:14,
		color: '#7d7d7d',
	},
	extendTextBottom: {
		fontSize:13,
		color: 'black',
		marginTop: 5,
	},
});

module.exports = PositionBlock;
