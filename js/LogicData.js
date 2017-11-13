'use strict'
import {
	Platform,
} from 'react-native';
var StorageModule = require('./module/StorageModule')
var NativeDataModule = require('./module/NativeDataModule')
var ColorConstants = require('./ColorConstants')
var {EventCenter, EventConst} = require('./EventCenter')

var userData = {};
var meData = {};
var wechatAuthData = {};
var wechatUserData = {};
var ownStocksData = [];
var ownStocksDataLive = [];
var searchStockHistory = null;
var balanceData = null;
var balanceDataLive = null;
var fxData = [];
var certificateIdCardInfo = null;
var getui_token = '';
var pushData;
var tabIndex = 0;
var lastSuperPriorityHintDate = '';
var accountState = false;//是否是实盘用户状态 false:模拟盘  true:实盘 (无论是否是 ayondo 登入成功状态)
var isActualLogin = false;
var onlineVersionCode = 0;
var currentVersionCode = 0;
var onlineVersionName = null;
var liveUserInfo = null;
var unpaidIncome = null;
var currentPageTag = null;
var registerReward = 30;
var firstDayWithDraw = false;
var debugStatus = false;

var LogicData = {

	setUserData: function(data) {
		userData = data;
	},

	getUserData: function() {
		return userData;
	},

    removeUserData: function() {
        userData = {}
    },

	setAccountState: function(state, isStartUp){
		// state = true
		if(accountState!==state){
			accountState = state;

			if(!isStartUp){
				StorageModule.loadOwnStocksData(accountState).then((value) => {
					if (value !== null) {
						this.setOwnStocksData(JSON.parse(value))
					}
				})
				.done()
			}

			if(!state){
				this.setActualLogin(false)
			}

			searchStockHistory = null;

			StorageModule.setAccountState(state)
			console.log("setAccountState = " + state);
			NativeDataModule.passRawDataToNative('accountState', ''+state)
			ColorConstants.setScheme(state ? ColorConstants.COLOR_THEME_LIVE: ColorConstants.COLOR_THEME_SIMULATOR);

			EventCenter.emitAccountStateChangeEvent();
		}
	},

	getAccountState: function(){
		return accountState;
		// return true;
	},

	setActualLogin: function(isLogin){
		isActualLogin = isLogin
	},

	getActualLogin: function(){
		return isActualLogin
	},

	setMeData: function(data){
		meData = data;
	},

	getMeData: function(){
		return meData;
	},

	removeMeData: function(){
		meData = {}
	},

  setWechatAuthData: function(authData) {
      wechatAuthData = authData;
  },

  getWechatAuthData: function() {
      return wechatAuthData;
  },

  setWechatUserData: function(userData) {
      wechatUserData = userData
  },

  getWechatUserData: function() {
      return wechatUserData
  },

  setOwnStocksData: function(stocksData) {
		return new Promise(resolve=>{
			if(accountState){
				// console.log("setOwnStocksData ownStocksDataLive " + JSON.stringify(stocksData))
		    ownStocksDataLive = stocksData
			}else{
				// console.log("setOwnStocksData ownStocksData " + JSON.stringify(stocksData))
				ownStocksData = stocksData
			}
			StorageModule.setOwnStocksData(JSON.stringify(stocksData), accountState)
			.then(()=>{
				if(resolve){
					resolve();
				}
			})
		});
  },

  getOwnStocksData: function() {
    return accountState ? ownStocksDataLive : ownStocksData;
  },

	removeOwnStocksData: function(){
		ownStocksDataLive = [];
		ownStocksData = [];
	},

  addStockToOwn: function(stockData) {
		var stockDataList = accountState ? ownStocksDataLive : ownStocksData;
  	var findResult = stockDataList.find((stock)=>{return stock.id === stockData.id})
  	if (findResult === undefined) {
	  	stockDataList.unshift(stockData)
			StorageModule.setOwnStocksData(JSON.stringify(stockDataList), accountState)
  	}
  	// if exist, not update.
  	return stockDataList
  },

  removeStockFromOwn: function(stockData) {
		var stockDataList = accountState ? ownStocksDataLive : ownStocksData;
		console.log("removeStockFromOwn" + JSON.stringify(stockDataList))
  	var index = stockDataList.findIndex((stock)=>{return stock.id === stockData.id})
  	if (index != -1) {
			stockDataList.splice(index, 1);
			StorageModule.setOwnStocksData(JSON.stringify(stockDataList), accountState)
  	}
		console.log("removeStockFromOwn" + JSON.stringify(stockDataList))
  	return stockDataList;
  },

	getStockFromOwnStockData: function(stockId){
		var stockDataList = accountState ? ownStocksDataLive : ownStocksData;
		var index = stockDataList.findIndex((stock)=>{return stock.id === stockId})
  	if (index != -1) {
  		 return stockDataList[index]
  	}else{
			 return undefined
		}
	},

  setSearchStockHistory: function(stocksData){
    searchStockHistory = stocksData
		if(accountState){
    	StorageModule.setLiveSearchHistory(JSON.stringify(stocksData))
		}else{
    	StorageModule.setSearchHistory(JSON.stringify(stocksData))
		}
  },

  getSearchStockHistory: function() {
		return new Promise(resolve=>{
			if(searchStockHistory == null){
				if(accountState){
					StorageModule.loadLiveSearchHistory()
					.then((value) => {
						if (value !== null) {
							searchStockHistory = JSON.parse(value);
							resolve(searchStockHistory);
						}else{
							searchStockHistory = [];
						}
					})
				}else{
					StorageModule.loadSearchHistory()
					.then((value) => {
						if (value !== null) {
							searchStockHistory = JSON.parse(value);
							resolve(searchStockHistory);
						}else{
							searchStockHistory = [];
						}
					})
				}
			}else{
				resolve(searchStockHistory);
			}
		});
  },

  addStockToSearchHistory: function(stockData) {
		if(searchStockHistory){
      var findResult = searchStockHistory.find((stock)=>{return stock.id === stockData.id})
      if (findResult === undefined) {
          searchStockHistory.unshift(stockData)
					if(accountState){
	          StorageModule.setLiveSearchHistory(JSON.stringify(searchStockHistory))
					}else{
						StorageModule.setSearchHistory(JSON.stringify(searchStockHistory))
					}
      }
      // if exist, not update.
      return searchStockHistory
		}else{
			return [];
		}
  },

	setBalanceData: function(data) {
		if(accountState){
			balanceDataLive = data;
		}else{
			balanceData = data;
		}
	},

	getBalanceData: function() {
		if(accountState){
			return balanceDataLive;
		}else{
			return balanceData;
		}
	},

	removeBalanceData: function(){
		balanceDataLive = null;
		balanceData = null;
	},

	setFxData: function(data) {
		fxData = data
	},

	getFxData: function(){
		return fxData;
	},

	setGeTuiToken(token){
		getui_token = token
	},

	getGeTuiToken(){
		return getui_token
	},

	setPushData(data){
		pushData = data
	},

	getPushData(){
		var data = pushData
		pushData = null
		return data
	},

	setTabIndex(index){
		tabIndex = index
	},

	getTabIndex(){
		return tabIndex
	},

	getFxDataBySymbol: function(symbol) {
		for (var i = 0; i < fxData.length; i++) {
			if (fxData[i].symbol == symbol) {
				return fxData[i]
			}
		}
		return null
	},

	setCertificateIdCardInfo: function(data) {
		data.message = decodeURIComponent(data.message)
		data.real_name = decodeURIComponent(data.real_name)
		data.id_code = decodeURIComponent(data.id_code)
		data.addr = decodeURIComponent(data.addr)
		data.gender = decodeURIComponent(data.gender)
		data.ethnic = decodeURIComponent(data.ethnic)
		data.issue_authority = decodeURIComponent(data.issue_authority)
		data.valid_period = decodeURIComponent(data.valid_period)
		data.transaction_id = decodeURIComponent(data.transaction_id)

		data.birthday =  data.id_code.charAt(6) + data.id_code.charAt(7) + data.id_code.charAt(8) + data.id_code.charAt(9) +
				'-' + data.id_code.charAt(10) + data.id_code.charAt(11) +
				'-' + data.id_code.charAt(12) + data.id_code.charAt(13);

		certificateIdCardInfo = data
	},

	getCertificateIdCardInfo: function() {
		return certificateIdCardInfo
	},

	setLastSuperPriorityHintData(data){
		lastSuperPriorityHintDate = data;
	},

	getLastSuperPriorityHintData: function(){
		return lastSuperPriorityHintDate;
	},

	setCurrentVersionCode: function(value){
		currentVersionCode = value;
	},

	getCurrentVersionCode: function(){
		return currentVersionCode;
	},

	getCurrentVersionString: function(){
		var str = ''
		str += Math.floor(currentVersionCode / 1000000)
		str += '.'
		str += Math.floor(currentVersionCode % 1000000 / 10000)
		str += '.'
		str += Math.floor(currentVersionCode % 10000 / 100)
		return str
	},

	setOnlineVersionCode: function(value){
		onlineVersionCode = value;
	},

	getOnlineVersionCode: function(){
		return onlineVersionCode;
	},

	setOnlineVersionName: function(value){
		onlineVersionName = value;
	},

	getOnlineVersionName: function(){
		return onlineVersionName;
	},

	setLiveUserInfo: function(value){
		liveUserInfo = value;
	},

	getLiveUserInfo: function(){
		return liveUserInfo;
	},

	removeLiveUserInfo: function(){
		liveUserInfo = null;
	},

	getUnpaidReward: function(){
		return unpaidIncome;
	},

	setUnpaidReward: function(value){
		unpaidIncome = value;
	},

	removeUnpaidReward: function(){
		unpaidIncome = null;
	},

	setCurrentPageTag: function(tag){
		currentPageTag = tag;
	},

	getCurrentPageTag: function(){
		return currentPageTag;
	},

	getRankHead:function(rank){
		if(rank==1){return require('../images/head_01.png')}
		else if(rank==2){return require('../images/head_02.png')}
		else if(rank==3){return require('../images/head_cu.png')}
		else if(rank == 4){return require('../images/head_ag.png')}
		else if(rank == 5){return require('../images/head_gd.png')}
		else{
			return undefined
		}
	},

	getRankBanner:function(rank){
		// if(rank==1){return require('../images/bgbanner_cu.jpg')}
		if(rank==2){return require('../images/bgbanner_02.jpg')}
	  else if(rank==3){return require('../images/bgbanner_cu.jpg')}
		else if(rank == 4){return require('../images/bgbanner_ag.jpg')}
		else if(rank == 5){return require('../images/bgbanner_gd.jpg')}
		else{
			return require('../images/bgbanner.jpg')
		}
	},

	isUserSelf:function(userId){
		// console.log("meData.userId " + userData.userId);
		return userData.userId == userId
	},

	getRegisterReward:function(){
		return registerReward;
	},

	setRegisterReward: function(value){
		registerReward = value;
	},

	setFirstDayWithDraw:function(value){
		StorageModule.setFirstDayWithDraw(value);
	},

	setDebugStatus: function(value){
		debugStatus = value
	},

	getDebugStatus: function(){
		return debugStatus
	},

	// getFirstDayWithDraw: function(){
	// 	// return '1';
	// 	// StorageModule.loadFirstDayWithDraw(value);
	//
	// 	StorageModule.loadFirstDayWithDraw()
	// 	.then((value) => {
	// 		if (value !== null) {
	// 			 return value
	// 		}else{
	// 			return '0'
	// 		}
	// 	})
	// }


};

module.exports = LogicData;
