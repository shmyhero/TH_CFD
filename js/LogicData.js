'use strict'

var StorageModule = require('./module/StorageModule')
var NativeDataModule = require('./module/NativeDataModule')
var ColorConstants = require('./ColorConstants')
var {EventCenter, EventConst} = require('./EventCenter')

var userData = {};
var meData = {};
var wechatAuthData = {};
var wechatUserData = {};
var ownStocksData = [];
var searchStockHistory = null;
var balanceData = null;
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
				StorageModule.removeOwnStocksData();
				this.removeOwnStocksData();
			}
			searchStockHistory = null;

			StorageModule.setAccountState(state)
			console.log("setAccountState = " + state);
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
    ownStocksData = stocksData
		StorageModule.setOwnStocksData(JSON.stringify(stocksData))
  },

  getOwnStocksData: function() {
    return ownStocksData
  },

	removeOwnStocksData: function(){
		ownStocksData = [];
	},

  addStockToOwn: function(stockData) {
  	var findResult = ownStocksData.find((stock)=>{return stock.id === stockData.id})
  	if (findResult === undefined) {
  		ownStocksData.unshift(stockData)
			StorageModule.setOwnStocksData(JSON.stringify(ownStocksData))
  	}
  	// if exist, not update.
  	return ownStocksData
  },

  removeStockFromOwn: function(stockData) {
  	var index = ownStocksData.findIndex((stock)=>{return stock.id === stockData.id})
  	if (index != -1) {
  		ownStocksData.splice(index, 1)
			StorageModule.setOwnStocksData(JSON.stringify(ownStocksData))
  	}
  	return ownStocksData
  },

	getStockFromOwnStockData: function(stockId){
		var index = ownStocksData.findIndex((stock)=>{return stock.id === stockId})
  	if (index != -1) {
  		 return ownStocksData[index]
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
		balanceData = data
	},

	getBalanceData: function() {
		return balanceData
	},

	setFxData: function(data) {
		fxData = data
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
};

module.exports = LogicData;
