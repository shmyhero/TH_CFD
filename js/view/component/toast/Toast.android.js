'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
} from 'react-native';

var Toast = {};

Toast.show = function(message){
  ToastAndroid.show(message, ToastAndroid.SHORT);
}

module.exports = Toast;
