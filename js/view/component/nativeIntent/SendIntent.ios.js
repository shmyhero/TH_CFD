'use strict';

import {
	Linking,
	Platform,
} from 'react-native';

var SendIntent = {
    sendPhoneDial(phoneNumber) {
      var prompt = true;
        if(arguments.length !== 1) {
          console.log('you must supply exactly 1 arguments');
          return;
        }

        if(!isCorrectType('String', phoneNumber)) {
          console.log('the phone number must be provided as a String value');
          return;
        }

        if(!isCorrectType('Boolean', prompt)) {
          console.log('the prompt parameter must be a Boolean');
          return;
        }

        let url;

        if(Platform.OS !== 'android') {
          url = prompt ? 'telprompt:' : 'tel:';
        }
        else {
          url = 'tel:';
        }

        url += phoneNumber;

        LaunchURL(url);
    }
};


const LaunchURL = function(url) {
	Linking.canOpenURL(url).then(supported => {
		if(!supported) {
			console.log('Can\'t handle url: ' + url);
		} else {
			return Linking.openURL(url);
		}
	}).catch(err => console.error('An unexpected error happened', err));
};

const getValidArgumentsFromArray = function(array, type) {
	var validValues = [];
	array.forEach(function(value) {
		if(isCorrectType(type, value)) {
			validValues.push(value);
		}
	});

	return validValues;
};

const isCorrectType = function(expected, actual) {
	return Object.prototype.toString.call(actual).slice(8, -1) === expected;
};

module.exports = SendIntent;
