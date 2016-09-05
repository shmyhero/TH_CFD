'use strict'

var StorageModule = require('./module/StorageModule')

var userData = {};
var meData = {};
var wechatAuthData = {};
var wechatUserData = {};
var ownStocksData = [];
var searchStockHistory = [];
var balanceData = null;
var fxData = [];
var certificateIdCardInfo = null;
var getui_token = '';

var LogicData = {

	setUserData: function(data) {
		userData = data;
	},

	getUserData: function() {
		return userData;
	},

	setMeData: function(data){
		meData = data;
	},

	getMeData: function(){
		return meData;
	},

    removeUserData: function() {
        userData = {}
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
        StorageModule.setSearchHistory(JSON.stringify(stocksData))
    },

    getSearchStockHistory: function() {
        return searchStockHistory
    },

    addStockToSearchHistory: function(stockData) {
        var findResult = searchStockHistory.find((stock)=>{return stock.id === stockData.id})
        if (findResult === undefined) {
            searchStockHistory.unshift(stockData)
            StorageModule.setSearchHistory(JSON.stringify(searchStockHistory))
        }
        // if exist, not update.
        return searchStockHistory
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
	}
};

module.exports = LogicData;
