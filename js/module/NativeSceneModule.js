'use strict';

var NativeSceneModule = require('NativeModules').NativeScene;

var NativeScene = {
	launchNativeScene: function ( sceneName ) {
		NativeSceneModule.launchNativeScene(sceneName)
	},
};

module.exports = NativeScene;
