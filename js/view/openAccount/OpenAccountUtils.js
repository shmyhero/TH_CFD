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
      if(data.multiOptionsKey){
        var parsedData = {
          "key": data.multiOptionsKey,
          "ignoreInRegistery": data.ignoreInRegistery,
          "isMultiOptions": true,
        };
        var valueStr = "";
        for(var j = 0; j<data.value.length; j++){
          if(data.value[j].value){
            if(valueStr !== ""){
              valueStr += ",";
            }
            valueStr += data.value[j].key;
          }
	      }
        parsedData.value = valueStr;
        array.push(parsedData);
      }else if(data.type == "options"){
	      for(var j = 0; j<data.value.length; j++){
	        var parsedData = {
	          "key": data.value[j].key,
	          "value": data.value[j].value,
	          "ignoreInRegistery": data.value[j].ignoreInRegistery,
	          "optionsKey": data.optionsKey,
	        }
	        array.push(parsedData);
	      }
	    }else{
	      if(data.value!==""){
	        var parsedData = {
	          "key": data.key,
	          "value": data.value,
	          "ignoreInRegistery": data.ignoreInRegistery
	        }
	        array.push(parsedData);
	      }
	    }
	  }
	  return array;
	}

export function getPageListRawDataFromData(listRawData, pageData){
  console.log("getPageListRawDataFromData");
  if (pageData) {
    var lastKey = "";
    for(var i = 0; i < pageData.length; i++){
      lastKey = "";
      var data = pageData[i];

      var needToFindMultiOptionsKey = false;
      if(data.isMultiOptions && data.value !== ""){
        needToFindMultiOptionsKey = true;
      }

      var needToFindOptionsKey = false;
      if(data.optionsKey){
        needToFindOptionsKey = true;
      }

      if(data.value){
        lastKey = data.key;
      }
      for(var j = 0; j < listRawData.length; j++){
        if(listRawData[j].key == data.key && listRawData[j].trueChoice){
          lastKey = "";
          for(var k = 0; k < listRawData[j].trueChoice.length; k++){
            if(data.value == listRawData[j].trueChoice[k].value){
              console.log("data.value == data[j]: data: " + JSON.stringify(data));
              lastKey = data.key;
              break;
            }
          }
        }
        if(listRawData[j].parent == lastKey){
          listRawData[j].hide = false;
        }
        if(listRawData[j].multiOptionsKey){
          if(data.key && data.key === listRawData[j].multiOptionsKey){
            var valueList = data.value.split(",");
            for(var l = 0; l < valueList.length; l++){
              for(var k = 0; k < listRawData[j].value.length; k++){
                if(valueList[l] === listRawData[j].value[k].key){
                  listRawData[j].value[k].value = true;
                }
              }
            }
          }
        }else if(data.optionsKey && data.optionsKey === listRawData[j].optionsKey){
          for(var k = 0; k < listRawData[j].value.length; k++){
            if(data.key === listRawData[j].value[k].key){
              listRawData[j].value[k].value = data.value;
            }
          }
        }else{
          if(listRawData[j].key === data.key){
            listRawData[j].value = data.value;
            if(data.error){
              listRawData[j].error = data.error;
            }
          }
        }
      }
    }
  }
}

export function canGoNext(listRawData){
	for(var i = 0 ; i < listRawData.length; i++){
		var data = listRawData[i];
		if(data.key && data.value === ""){
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
  {"GZTValue": "男", "AyondoValue":true},
  {"GZTValue": "女", "AyondoValue":false}
]

export function getAyondoValuesFromGZTValue(GZTresponse){
	var dataList = [];
  for(var GZTkey in GZTresponse){
    var GZTvalue = decodeURIComponent(GZTresponse[GZTkey]);
    console.log("GZTkey: " + GZTkey + " GZTvalue: " + GZTvalue);
    for(var i = 0; i < GZT_Ayondo_Key_Mappings.length; i++){
      if(GZTkey === GZT_Ayondo_Key_Mappings[i].GZTKey){
        var ayondoData = {
          "key": GZT_Ayondo_Key_Mappings[i].AyondoKey,
          "value": GZTvalue,
        }
        switch(GZTkey){
        case "gender":
          for(var j = 0; j < GenderTranslater.length; j++){
            if(ayondoData["value"] === GenderTranslater[j].GZTValue){
              ayondoData["value"] = GenderTranslater[j].AyondoValue;
            }
          }
          dataList.push(ayondoData);
          break;
        case "real_name":
          var firstName = "";
          var lastName = "";
          console.log("realname: " + GZTvalue);
          if(GZTvalue && GZTvalue.length >= 1){
            if(GZTvalue.length <= 3){
              lastName = GZTvalue.substring(0,1);
              firstName = GZTvalue.substring(1, GZTvalue.length);
            }else{
              lastName = GZTvalue.substring(0,2);
              firstName = GZTvalue.substring(2, GZTvalue.length);
            }
          }
          console.log(GZTvalue + "firstName " + firstName + "lastName " + lastName);
          var firstNameData = {
            "key": "firstName",
            "value": firstName,
          }
          var lastNameData = {
            "key": "lastName",
            "value": lastName,
          }
          dataList.push(firstNameData);
          dataList.push(lastNameData);
          break;
        case "id_code":
          if(GZTvalue.length > 18){
            GZTvalue = GZTvalue.substring(0,18);
          }

          dataList.push({
            "key": 'idCode',
            "value": GZTvalue,
          });

          if(GZTvalue && GZTvalue.length >= 18){
            var value = GZTvalue.substring(6, 10) + "." + GZTvalue.substring(10, 12) + "." + GZTvalue.substring(12, 14);
            console.log("value:" + value);
            dataList.push({
              "key": 'birthday',
              "value": value
            });
          }
          break;
        default:
          dataList.push(ayondoData);
          break;
        }
      }
    }
  }
  return dataList;
}
