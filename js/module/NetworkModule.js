'use strict'

export function fetchTHUrl(url, params, successCallback, errorCallback) {
	var requestSuccess = true;

	console.log('fetching: ' + url + ' with params: ' + params)
	fetch(url, params)
		.then((response) => {
			console.log(response)
			if (response.status === 200) {
				requestSuccess = true;
			} else if (response.status === 401){
				throw new Error('身份验证失败')
			} else{
				requestSuccess = false;
			}

			if (response.length == 0) {
				response = '{}'
			}
			return response.json()
		})
		.then((responseJson) => {
			if (requestSuccess) {
				if (responseJson.success == false) {
					console.log('fetchTHUrl handled error with message: ' + responseJson.message)
					errorCallback(responseJson.message);
				} else {
					console.log('fetchTHUrl success with response: ' + responseJson)
					successCallback(responseJson);
				}
			} else {
				console.log('fetchTHUrl unhandled error with message: ' + responseJson.Message)
				errorCallback(responseJson.Message);
			}
		})
		.catch((e) => {
			console.log('fetchTHUrl catches: ' + e)
			errorCallback(e.message);
		})
		.done();
}