'use strict';

var NativeDataModule = require('NativeModules').NativeData;
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

RCTDeviceEventEmitter.addListener(
	'nativeSendDataToRN',
	(dataName, data) => {
		
	}
)

var NativeData = {

	passDataToNative: function ( dataName: string, data ): void {

		NativeDataModule.passDataToNative(dataName, JSON.stringify(data))

	},
};

module.exports = NativeData;
