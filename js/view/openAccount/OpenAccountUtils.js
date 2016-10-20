'use strict'

import React from 'react';
import {
  AsyncStorage,
  View,
} from 'react-native';

var TalkingdataModule = require('../../module/TalkingdataModule')
var StorageModule = require('../../module/StorageModule')
var NetConstants = require('../../NetConstants')
var ColorConstants = require('../../ColorConstants')
var NavBar = require('../NavBar')
var MainPage = require('../MainPage')

const GZT_Ayondo_Key_Mappings = [
	{"GZTKey": "real_name", "AyondoKey": "realName"},
	{"GZTKey": "gender", "AyondoKey": "gender"},
	{"GZTKey": "ethnic", "AyondoKey": "ethnic"},
	{"GZTKey": "id_code", "AyondoKey": "idCode"},
	{"GZTKey": "addr", "AyondoKey": "addr"},
	{"GZTKey": "issue_authority", "AyondoKey": "issueAuth"},
	{"GZTKey": "valid_period", "AyondoKey": "validPeriod"},
];

export function getDataFromPageListRawData(listRawData){
  var array = [];
  for(var i = 0 ; i < listRawData.length; i++){
    var data = listRawData[i];
    if(data.value){
      var data = {
        "key": data.key,
        "value": data.value,
        "ignoreInRegistery": data.ignoreInRegistery
      }
      array.push(data);
    }
  }
  return array;
}

export function getPageListRawDataFromData(listRawData, pageData){
  console.log("getPageListRawDataFromData");
  if (pageData) {
    for(var i = 0; i < pageData.length; i++){
      var data = pageData[i];
      for(var j = 0; j < listRawData.length; j++){
        if(listRawData[j].key === data.key){
          listRawData[j].value = data.value;
        }
      }
    }
  }
}

export function canGoNext(listRawData){
	for(var i = 0 ; i < listRawData.length; i++){
		var data = listRawData[i];
		if(data.key && data.value == ""){
			return false;
		}
		if(data.error){
			return false;
		}
	}
	return true;
}

export function validateRows(listRawData, validateRowValue, finished, row){
	if(!row){
		row = 0;
	}
  console.log("validateRows - row:" + row);
	if(row == listRawData.length){
		if(finished){
			finished();
		}
	}else{
		var data = listRawData[row];
		if(data.key && !data.checked){
			validateRowValue(row)
			.then(()=>{
				row++;
				validateRows(listRawData, validateRowValue, finished, row);
			})
		}else{
      row++;
      validateRows(listRawData, validateRowValue, finished, row);
    }
	}
}

const GenderTranslater = [
  {"GZTValue": "男", "AyondoValue":"Male"},
  {"GZTValue": "女", "AyondoValue":"Female"}
]

export function getAyondoValueFromGZTKeyValue(GZTkey, GZTvalue){
  for(var i = 0; i < GZT_Ayondo_Key_Mappings.length; i++){
    if(GZTkey === GZT_Ayondo_Key_Mappings[i].GZTKey){
      var data = {
        "key": GZT_Ayondo_Key_Mappings[i].AyondoKey,
        "value": GZTvalue,
      }
      switch(GZTkey){
      case "gender":
        for(var j = 0; j < GenderTranslater.length; j++){
          if(data["value"] === GenderTranslater[j].GZTValue){
            data["value"] = GenderTranslater[j].AyondoValue;
          }
        }
        break;
      default:
        break;
      }

      console.log(JSON.stringify(data));
      return(data);
    }
  }
  return null;
}
