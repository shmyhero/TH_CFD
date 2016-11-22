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

const realm = new Realm({schema: [RequestCache]});

export async function storeCacheForUrl(url, responseString, isUserRelated){
  console.log("storeCacheForUrl: " + url + " with resp: " + responseString + ", isUserRelated: " + isUserRelated);

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
