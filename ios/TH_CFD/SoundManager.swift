//
//  SoundManager.swift
//  TH_CFD
//
//  Created by william on 16/9/12.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit
import AVFoundation

class SoundManager: NSObject {
	static let singleton = SoundManager()
	var audioPlayer:AVAudioPlayer?
	
	class func sharedInstance() ->SoundManager {
		return SoundManager.singleton
	}
	
	func playSound(_ sound:String) {
		//todo, currently sound is "0"
		let soundURL = Bundle.main.url(forResource: "coin", withExtension: "mp3")
		do {
			audioPlayer = try AVAudioPlayer(contentsOf: soundURL!)
			audioPlayer?.volume = 0.5
			audioPlayer!.play()
		} catch {
			print("Player not available")
		}
	}
}
