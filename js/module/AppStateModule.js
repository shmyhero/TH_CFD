'use strict'

var AppState = require('AppState');

export let STATE_ACTIVE = 'active'
export let STATE_INACTIVE = 'inactive'
export let STATE_BACKGROUND = 'background'

var appState = STATE_ACTIVE
var turnToActiveListeners = []
var turnToInactiveListeners = []
var turnToBackgroundListeners = []
AppState.addListener(
	'appStateDidChange',
	(stateData) => {
		console.log("stateData.app_state: " + stateData.app_state)
		if (appState !== STATE_ACTIVE && stateData.app_state === STATE_ACTIVE) {
			for (var i = 0; i < turnToActiveListeners.length; i++) {
				turnToActiveListeners[i]()
			}
		}
		else if(appState !== STATE_INACTIVE && stateData.app_state === STATE_INACTIVE) {
			for (var i = 0; i < turnToInactiveListeners.length; i++) {
				turnToInactiveListeners[i]()
			}
		}
		else if(appState !== STATE_BACKGROUND && stateData.app_state === STATE_BACKGROUND) {
			for (var i = 0; i < turnToBackgroundListeners.length; i++) {
				turnToBackgroundListeners[i]()
			}
		}

		appState = stateData.app_state
	}
)

export function getAppState() {
	return appState
}

export function registerTurnToActiveListener(listener) {
	turnToActiveListeners.push(listener)
}

export function unregisterTurnToActiveListener(listener) {
	var index = turnToActiveListeners.indexOf(listener);
	if(index!== -1) {
			 turnToActiveListeners.splice(index, 1);
	 }
}

export function registerTurnToInactiveListener(listener) {
	turnToInactiveListeners.push(listener)
}

export function unregisterTurnToInactiveListener(listener) {
	var index = turnToInactiveListeners.indexOf(listener);
	if(index!== -1) {
			 turnToInactiveListeners.splice(index, 1);
	 }
}

export function registerTurnToBackgroundListener(listener) {
	turnToBackgroundListeners.push(listener)
}

export function unregisterTurnToBackgroundListener(listener) {
	var index = turnToBackgroundListeners.indexOf(listener);
	if(index!== -1) {
			 turnToBackgroundListeners.splice(index, 1);
	 }
}
