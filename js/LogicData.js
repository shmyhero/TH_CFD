'use strict'

var userData = {};
var wechatAuthData = {};
var wechatUserData = {};
var ownStocksData = [{"id":20883,"symbol":"AUDCAD","name":"苹果","open":0.916701,"last":0.98570},{"id":20885,"symbol":"AUDCHF","name":"百度","open":0.845495,"last":0.71050},{"id":29567,"symbol":"AUDDKK","name":"阿里巴巴","open":5.418112,"last":4.83760},];

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
    },

    getOwnStocksData: function() {
        return ownStocksData
    },

    addStockToOwn: function(stockData) {
    	var findResult = ownStocksData.find((stock)=>{return stock.id === stockData.id})
    	if (findResult === undefined) {
    		ownStocksData.unshift(stockData)
    	}
    	// if exist, not update.
    	return ownStocksData
    },

    removeStockFromOwn: function(stockData) {
    	var index = ownStocksData.findIndex((stock)=>{return stock.id === stockData.id})
    	if (index != -1) {
    		ownStocksData.splice(index, 1)
    	}
    	return ownStocksData
    }
};

module.exports = LogicData;