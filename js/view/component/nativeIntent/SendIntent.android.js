'use strict';

var { Platform, NativeModules } = require('react-native');
var RNSendIntentAndroid = NativeModules.SendIntentAndroid;

var SendIntent = {

    sendPhoneDial(phoneNumber) {
        RNSendIntentAndroid.sendPhoneDial(phoneNumber);
    },

};

module.exports = SendIntent;
