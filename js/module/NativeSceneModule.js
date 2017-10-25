'use strict';

var NativeSceneModule = require('NativeModules').NativeScene;

var NativeScene = {
	launchNativeScene: function ( sceneName: string ): void {
		NativeSceneModule.launchNativeScene(sceneName)
	},
};

module.exports = NativeScene;
