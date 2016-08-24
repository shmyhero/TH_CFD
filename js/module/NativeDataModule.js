'use strict';

var NativeDataModule = require('NativeModules').NativeData;

var NativeData = {

	passDataToNative: function ( dataName: string, data ): void {

		NativeDataModule.passDataToNative(dataName, JSON.stringify(data))

	},

	passRawDataToNative: function ( dataName: string, data ): void {

		NativeDataModule.passRawDataToNative(dataName, data)

	},
};

module.exports = NativeData;
