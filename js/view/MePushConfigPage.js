'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Platform,
	Navigator,
	Switch,
	Text,
	Image,
	TouchableOpacity,
	Alert,
} from 'react-native';

var LogicData = require('../LogicData')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var NavBar = require('./NavBar')
var MainPage = require('./MainPage')
var UIConstants = require('../UIConstants')
var LS = require("../LS")
var RULE_DIALOG = "ruleDialog";
var {height, width} = Dimensions.get('window')
var HeaderLineDialog2 = require('./HeaderLineDialog2')
var heightRate = height/667.0

var listRawData = [
{'type':'normal', 'title':'CONFIG_CLOSE_NOTIF', 'subtype': 'closepositionpush'},
{'type':'separator', 'title':'', 'subtype': 'separatorLine'},
{'type':'normal', 'title':'CONFIG_PUBLISH_MY_DETAIL', 'subtype': 'showPersonalData'},
{'type':'normal', 'title':'CONFIG_PUBLISH_MY_POSITION_DETAIL', 'subtype': 'showPositionData'},
{'type':'text', 'title':'CONFIG_PUBLISH_MY_DATA_HINT', 'subtype': 'hint'}
]


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var closePositionPushUpdated = false

var MePushConfigPage = React.createClass({

	propTypes: {
		routeMapper: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			routeMapper: function(route, navigationOperations, onComponentRef) {

			},
		}
	},

	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(listRawData),
			autoCloseAlertIsOn: true,
			showPersonalData: true,
			showPositionData:true,
		};
	},

	componentDidMount: function() {
		//Once user moves into this page, check server setting.
		this.loadPushConfigInfo()

		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0

		if (notLogin) {
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
				popToRoute: MainPage.ME_PUSH_CONFIG_ROUTE,
				onPopToRoute: this.loadPushConfigInfo
			});
		}
	},

	onSelectNormalRow: function(rowData) {
		//DO NOTHING!
	},

	loadPushConfigInfo: function(){
		var userData = LogicData.getUserData()
		var meData = LogicData.getMeData()
		var notLogin = Object.keys(meData).length === 0

		if (!notLogin) {
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_USER_INFO_API,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
				},
				function(responseJson) {
					var autoCloseAlert = LogicData.getAccountState() ? responseJson.autoCloseAlert_Live : responseJson.autoCloseAlert;
					var showPersonalData = responseJson.showData;
					var showPositionData = responseJson.showOpenCloseData;
					this.setState({
						autoCloseAlertIsOn: autoCloseAlert,
						showPersonalData: showPersonalData,
						showPositionData: showPositionData,
						dataSource: ds.cloneWithRows(listRawData),
					});


				}.bind(this),
				function(result) {
					Alert.alert('提示', result.errorMessage);
				}
			)
		}
	},

    changePositionDataSetting:function(value){
        var userData = LogicData.getUserData()
                var notLogin = Object.keys(userData).length === 0
                if (notLogin) {
                }else{
                    var url = NetConstants.CFD_API.SHOW_USER_DATA_API

                    NetworkModule.fetchTHUrl(
                        url,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                                'Content-Type': 'application/json; charset=utf-8',
                            },
                            body: JSON.stringify({
                                showOpenCloseData: value,
                                showData: this.state.showPersonalData,
                            }),
                        },
                        function(responseJson) {
                            //Do nothing?
                        }.bind(this),
                        function(result) {
                            Alert.alert('提示', result.errorMessage);
                        }
                    )
                }
    },


	changeShowPersonalDataSetting: function(value){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0


        this.setState({
            showPositionData:value
        })


		if (notLogin) {
		}else{
			var url = NetConstants.CFD_API.SHOW_USER_DATA_API

			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'POST',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=utf-8',
					},
					body: JSON.stringify({
						showData: value,
						showOpenCloseData: value,
					}),
				},
				function(responseJson) {
					//Do nothing?
				}.bind(this),
				function(result) {
					Alert.alert('提示', result.errorMessage);
				}
			)
		}
	},

	changeAutoCloseAlertSetting: function(value){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if (notLogin) {
		}else{
			var url = LogicData.getAccountState() ? NetConstants.CFD_API.AUTO_CLOSE_ALERT_LIVE_API : NetConstants.CFD_API.AUTO_CLOSE_ALERT_API
			url = url.replace(/<setting>/, value)

			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'POST',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
				},
				function(responseJson) {
					//Do nothing?
				}.bind(this),
				function(result) {
					Alert.alert('提示', result.errorMessage);
				}
			)
		}
	},

	onSwitchPressed: function(value, rowData) {
		if(rowData.subtype === 'closepositionpush'){

			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				autoCloseAlertIsOn: value
			})

			this.changeAutoCloseAlertSetting(value);
		}else if(rowData.subtype === 'showPersonalData'){
			if (this.state.showPersonalData == false){
				this.refs[RULE_DIALOG].show();
			}else{
				this.changeShowPersonalDataSetting(value);
			}

			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				showPersonalData: value
			});
		}else if(rowData.subtype === 'showPositionData'){
		    if(this.state.showPersonalData){
                    this.changePositionDataSetting(value);
                    this.setState({
                        dataSource: ds.cloneWithRows(listRawData),
                        showPositionData: value
                    });
		    }
		}
	},

	renderModal: function(){

		var headerDialogMessages = {
			messageTitle:'CONFIG_RANKING_TERMS',
			messageLines: [
				LS.str("CONFIG_RANKING_TERMS_LINE_1"),
				LS.str("CONFIG_RANKING_TERMS_LINE_2"),
				LS.str("CONFIG_RANKING_TERMS_LINE_3"),
				LS.str("CONFIG_RANKING_TERMS_LINE_4"),
				LS.str("CONFIG_RANKING_TERMS_LINE_5"),
			],
			noDotLines: [
				LS.str("CONFIG_RANKING_TERMS_BELOW_LINE_1"),
				LS.str("CONFIG_RANKING_TERMS_BELOW_LINE_2"),
			]
		}

		return (
			<HeaderLineDialog2 ref={RULE_DIALOG}
				proceedCallback={(value)=>this.changeShowPersonalDataSetting(value)}
				messageTitle={headerDialogMessages.messageTitle}
				messageLines={headerDialogMessages.messageLines}
				noDotLines={headerDialogMessages.noDotLines}/>
		)
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		var marginLeft = 0
		//if (rowID > 1 && rowID < 3){
		//	marginLeft = 15
		//}
		return (
			<View style={styles.line} key={rowID}>
				<View style={[styles.separator, {marginLeft: marginLeft}]}/>
			</View>
			)
	},

	renderRow: function(rowData, sectionID, rowID) {
		if (rowData.type === 'normal') {
			var switchIsOn = false;
			var switchDisable = false;
			if(rowData.subtype === 'closepositionpush'){
				switchIsOn = this.state.autoCloseAlertIsOn;
			} else if(rowData.subtype === 'showPersonalData') {
				if(!LogicData.getAccountState() || MainPage.HIDE_RANKING_TAB){
					return null;
				}
				switchIsOn = this.state.showPersonalData;
			}else if(rowData.subtype === 'showPositionData') {
             				if(!LogicData.getAccountState() || MainPage.HIDE_RANKING_TAB){
             					return null;
             				}
             				switchIsOn = this.state.showPositionData;
             				switchDisable = !this.state.showPersonalData;
            }
			return(
				<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
					<Text style={styles.title}>{LS.str(rowData.title)}</Text>
					<View style={styles.extendRight}>
						<Switch
							onValueChange={(value) => this.onSwitchPressed(value, rowData)}
							value={switchIsOn}
							disabled={switchDisable}
							onTintColor={ColorConstants.title_blue()} />
					</View>
				</View>
			);
		}else if (rowData.type === 'text'){
			return(
				<View style={styles.hintWrapper}>
						<Text style={styles.hintText}>{LS.str(rowData.title)}</Text>
				</View>
			);
		}else if(rowData.type == 'separator'){
            return(
                    <View style={{width:width,height:5}}>

                    </View>
                );
		}
	},

	render: function() {
		var userData = LogicData.getUserData()
		return (<View style={styles.wrapper}>
			<NavBar title={LS.str("SZ")} showBackButton={true} navigator={this.props.navigator}/>
			<ListView
				style={styles.list}
				dataSource={this.state.dataSource}
				renderRow={this.renderRow}
				renderSeparator={this.renderSeparator} />
			{this.renderModal()}
		</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: width,
   		alignItems: 'stretch',
    	justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},

	list: {
		flex: 1,
		// borderWidth: 1,
	},
	rowWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: UIConstants.LIST_ITEM_LEFT_MARGIN,
		paddingRight: 15,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: 'white',
	},
	hintWrapper: {
		//flex: 1,
		paddingLeft: UIConstants.LIST_ITEM_LEFT_MARGIN,
		paddingTop: 12,
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	image: {
		marginLeft: -10,
		width: 40,
		height: 40,
	},
	title: {
		flex: 2,
		fontSize: 17,
		color: '#303030',
	},

	moreImage: {
		alignSelf: 'center',
		width: 7.5,
		height: 12.5,
	},

	buttonArea: {
		flex: 1,
		borderRadius: 3,
	},
	buttonView: {
		height: Math.round(44*heightRate),
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	hintText: {
		flex:1,
		fontSize: 12,
		textAlign: 'left',
		color: '#8d8d8d',
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},

	defaultText: {
		flex: 1,
		fontSize: 17,
		marginLeft: 10,
		color: '#6d6d6d',
	},
	headImage: {
		width: Math.round(62*heightRate),
		height: Math.round(62*heightRate),
	},
});


module.exports = MePushConfigPage;
