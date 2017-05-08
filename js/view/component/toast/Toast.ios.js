'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

var NativeDataModule = require('../../../module/NativeDataModule');
var Toast = {};

Toast.SHORT=500;
Toast.LONG=2000;

Toast.show = function(message){
  NativeDataModule.passRawDataToNative('toast', message);
}

module.exports = Toast;
