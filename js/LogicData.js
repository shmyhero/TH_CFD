'use strict'

var userData = {};
var wechatAuthData = {};
var wechatUserData = {};
var ownStocksData = [];
var StorageModule = require('./module/StorageModule')

var LogicData = {

	// setUserSecretKey: function(userName, password) {
	// 	userSecretKey = 'Basic ' + base64_encode(userName + ':' + password);
	// 	console.log(userSecretKey);
	// },

	// getUserSecretKey: function() {
	// 	return userSecretKey;
	// },

	setUserData: function(data) {
		userData = data;
	},

	getUserData: function() {
		return userData;
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
    }
};

module.exports = LogicData;