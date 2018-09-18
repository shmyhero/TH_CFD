'use strict';

var NativeDataModule = require('NativeModules').NativeData;

var NativeData = {

	passDataToNative: function ( dataName, data ) {

		NativeDataModule.passDataToNative(dataName, JSON.stringify(data))

	},

	passRawDataToNative: function ( dataName, data ) {

		NativeDataModule.passRawDataToNative(dataName, data)

	},
};

module.exports = NativeData;
