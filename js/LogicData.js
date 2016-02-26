'use strict'

var userData = {};
var wechatAuthData = {};
var wechatUserData = {};

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
};

module.exports = LogicData;