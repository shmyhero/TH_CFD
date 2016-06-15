'use strict'

var StorageModule = require('./module/StorageModule')

var userData = {};
var wechatAuthData = {};
var wechatUserData = {};
var ownStocksData = [];
var searchStockHistory = [];
var balanceData = null;
var fxData = [];

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

	getFxDataBySymbol: function(symbol) {
		for (var i = 0; i < fxData.length; i++) {
			if (fxData[i].symbol == symbol) {
				return fxData[i]
			}
		}
		return null
	},
};

module.exports = LogicData;
