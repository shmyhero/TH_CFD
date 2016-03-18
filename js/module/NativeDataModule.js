'use strict';

var NativeDataModule = require('NativeModules').NativeData;
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');
var LogicData = require('../LogicData')

let MY_LIST = 'myList'

RCTNativeAppEventEmitter.addListener(
	'nativeSendDataToRN',
	(args) => {
		if (args[0] == MY_LIST) {
			LogicData.setOwnStocksData(JSON.parse(args[1]))
		}
		console.log('Get data from Native ' + args[0] + ' : ' + args[1])
	}
)

var NativeData = {

	passDataToNative: function ( dataName: string, data ): void {

		NativeDataModule.passDataToNative(dataName, JSON.stringify(data))

	},
};

module.exports = NativeData;
