'use strict'

import React from 'react';
import {
  AsyncStorage,
} from 'react-native';

var CACHE_PREFIX = '@TH_CFD:cache_'

const Realm = require('realm');

const CACHE_KEY = "RequestCache";
class RequestCache {}
RequestCache.schema = {
    name: CACHE_KEY,
    schemaVersion: 1,
    primaryKey: 'url',
    properties: {
      url: 'string',
      response: 'string',
      userRelated: {type: 'bool', default: 'false'},
    },
};

const STOCK_DATA_KEY = "StockData";
class StockData {}
StockData.schema = {
    name: STOCK_DATA_KEY,
    schemaVersion: 1,
    primaryKey: 'id',
    properties: {
      id: 'int',
      symbol: "string",
      name: "string",
      open: "double",
      last: "double",
      preClose: "double",
      isOpen: "bool",
      tag: {type: "string", optional: true},
      lastAsk: {type: "double", optional: true},
      lastBid: {type: "double", optional: true},
    },
};

class StockListUrlCache {}
const STOCK_LIST_URL_KEY = "StockListUrl";
StockListUrlCache.schema = {
    name: STOCK_LIST_URL_KEY,
    schemaVersion: 1,
    primaryKey: 'url',
    properties: {
      url: 'string',
      dataList: {type: 'list', objectType: STOCK_DATA_KEY},
    },
};

const realm = new Realm(
  {schema: [RequestCache, StockData, StockListUrlCache],
    schemaVersion: 2,
  });

export async function storeCacheForUrl(url, responseString, isUserRelated){
  //console.log("storeCacheForUrl: " + url + " with resp: " + responseString + ", isUserRelated: " + isUserRelated);

  // Write
  realm.write(() => {
      realm.create(CACHE_KEY,
        {
          url: url,
          response: responseString,
          userRelated: isUserRelated ? true : false
        },
        true);
  });
}

export async function loadCacheForUrl(url){
  // Query
  var results = realm.objects(CACHE_KEY).filtered('url == "' + url + '"');
  console.log("loadCacheForUrl: " + url + " results: ");
  console.log(results);

  if(results.length > 0){
    return results[0].response;
  }else{
    return null;
  }
}

export async function clearCache(){
  realm.write(() => {
    let allResponses = realm.objects(CACHE_KEY);
    realm.delete(allResponses); // Deletes all cache
  });
}

export async function clearUserRelatedCache(){
  realm.write(() => {
    let userRelatedCache = realm.objects(CACHE_KEY).filtered('userRelated == true');
    realm.delete(userRelatedCache); // Deletes all user related cache
  });
}

//Stock data chache

export async function storeStockDataForUrl(url, stockDataList){
  console.log("storeStockDataForUrl " + url)
  realm.write(() => {
    var urlCache = realm.create(STOCK_LIST_URL_KEY, {
      url: url,
      dataList: [],
    }, true);

    let dbStockDataList = urlCache.dataList;
    stockDataList.forEach(function(element) {
      dbStockDataList.push(realm.create(STOCK_DATA_KEY, element, true))
    });
  });
}

export async function loadStockDataForUrl(url){
  var results = realm.objects(STOCK_LIST_URL_KEY).filtered('url == "' + url + '"');
  console.log("loadStockDataForUrl: " + url + " results: ");
  console.log(results);

  if(results.length > 0 && results[0].dataList){
    var resultArray = [];
    Object.keys(results[0].dataList).forEach(function(key) {
      resultArray.push(results[0].dataList[key])
    })
    return resultArray;
  }else{
    return null;
  }
}

export async function storeStockData(stockData){
  //console.log("stockData " + JSON.stringify(stockData))
  realm.write(() => {
      realm.create(STOCK_DATA_KEY,
        stockData,
        true);
  });
}

export async function updateStockData(stockData){
  //console.log("updateStockData " + JSON.stringify(stockData))
  var results = realm.objects(STOCK_DATA_KEY).filtered('id == "' + stockData.id + '"');
  //console.log("updateStockData results " + JSON.stringify(results[0]))
  if(results.length > 0){
    var stock = results[0];
    if(stock){
      realm.write(() => {
        Object.keys(stockData).forEach(function(key) {
          if(stock[key] !== stockData[key]){
            stock[key] = stockData[key];
          }
        });
      });
    }
  }
  //If the stock data doesn't exist in data base, it should be a fx data instead of a stock.
  //storeStockData(stockData);
}

export async function loadStockData(stockID){
  // Query
  var results = realm.objects(STOCK_DATA_KEY).filtered('id == "' + stockID + '"');
  //console.log("loadStock: " + id + " results: ");
  //console.log(results);

  if(results.length > 0){
    return JSON.parse(JSON.stringify(results[0]));;
  }else{
    return null;
  }
}

export async function loadStockDataList(stockIDList){
  // Query
  var stockIDArray = stockIDList.split(",");
  var result = [];
  for(var i = 0; i < stockIDArray.length; i++){
    var queryString = 'id == "' + stockIDArray[i] + '"';
    var results = realm.objects(STOCK_DATA_KEY).filtered(queryString);
    if(results.length > 0){
      result.push(JSON.parse(JSON.stringify(results[0])));
    }
  }

  return result;
}

export async function clearStockData(){
  realm.write(() => {
    let allStockData = realm.objects(STOCK_DATA_KEY);
    realm.delete(allStockData); // Deletes all cache

    let stockListUrlCaches = realm.objects(STOCK_LIST_URL_KEY);
    realm.delete(stockListUrlCaches); // Deletes all cache
  });
}
