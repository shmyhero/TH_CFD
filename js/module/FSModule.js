'use strict';

var RNFS = require('react-native-fs');

var bannerImagePath = RNFS.DocumentDirectoryPath + '/banners';
var localCachePath = RNFS.DocumentDirectoryPath + '/cache';

RNFS.exists(bannerImagePath)
	.then(exists => {
		if (!exists) {
			RNFS.mkdir(bannerImagePath)
				.then(success => {console.log('Path create success.')})
				.catch(err => console.log('Path create error: ' + JSON.stringify(err)));
		}
	})

RNFS.exists(localCachePath)
	.then(exists => {
		if (!exists) {
			RNFS.mkdir(localCachePath)
				.then(success => {console.log('localCachePath create success.')})
				.catch(err => console.log('localCachePath create error: ' + JSON.stringify(err)));
		}
	})

export function getCachedItemPath(remotePath){
	var fileName = remotePath.substring(remotePath.lastIndexOf('/') + 1)
	fileName = decodeURIComponent(fileName)	// fix bug with files have Chinese name.
	return RNFS.exists(localCachePath + '/' + fileName)
		.then(exists => {
			if (exists) {
				return localCachePath + '/' + fileName
			} else {
				return null
			}
		})
}

export function cacheItem(remotePath, finishCallback) {
	var fileName = remotePath.substring(remotePath.lastIndexOf('/') + 1)
	fileName = decodeURIComponent(fileName)
	var targetFilePath = localCachePath + '/' + fileName

	RNFS.downloadFile({ fromUrl: remotePath, toFile: targetFilePath})
		.then(res => {
			console.log('Finish ' + JSON.stringify(res) + ' for file: ' + fileName)
			if (finishCallback) {
				finishCallback(targetFilePath)
			}
		})
		.catch(err => {
			console.log('download error: ' + JSON.stringify(err))
			if (finishCallback) {
				finishCallback(null)
			}
		})
}

export function getBannerImageLocalPath(remotePath) {
	var fileName = remotePath.substring(remotePath.lastIndexOf('/') + 1)
	fileName = decodeURIComponent(fileName)	// fix bug with files have Chinese name.
	return RNFS.exists(bannerImagePath + '/' + fileName)
		.then(exists => {
			if (exists) {
				return bannerImagePath + '/' + fileName
			} else {
				return null
			}
		})
}

export function downloadBannerImage(remotePath, finishCallback) {
	var fileName = remotePath.substring(remotePath.lastIndexOf('/') + 1)
	fileName = decodeURIComponent(fileName)
	var targetFilePath = bannerImagePath + '/' + fileName

	RNFS.downloadFile({ fromUrl: remotePath, toFile: targetFilePath})
		.then(res => {
			console.log('Finish ' + JSON.stringify(res) + ' for file: ' + fileName)
			if (finishCallback) {
				finishCallback(targetFilePath)
			}
		})
		.catch(err => {
			console.log('download error: ' + JSON.stringify(err))
			if (finishCallback) {
				finishCallback(null)
			}
		})
}

export function getCachedFile(url){
	return new Promise((resolve) =>{
		getCachedItemPath(url)
			.then(filePath => {
				if (filePath !== null) {
					resolve(filePath);
				} else {
					cacheItem(url, (filePath) => {
						resolve(filePath);
					})
				}
			});
	})
}
