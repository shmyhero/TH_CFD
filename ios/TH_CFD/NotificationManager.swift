//
//  NotificationManager.swift
//  TH_CFD
//
//  Created by william on 16/9/8.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit

class NotificationData: NSObject {
	var payload: String?
	var taskId: String?
	var msgId: String?
	var offline: Bool! = false
	
	init(payload: String?, taskId: String?, msgId:String?, offline:Bool?) {
		self.payload = payload
		self.taskId = taskId
		self.msgId = msgId
		self.offline = offline
		super.init()
	}
	
	init(coder aDecoder:NSCoder!){
		self.payload=aDecoder.decodeObject(forKey: "payload") as? String
		self.taskId=aDecoder.decodeObject(forKey: "taskId") as? String
		self.msgId=aDecoder.decodeObject(forKey: "msgId") as? String
		self.offline=aDecoder.decodeObject(forKey: "offline") as! Bool
	}
	
	func encodeWithCoder(_ aCoder:NSCoder!){
		aCoder.encode(payload,forKey:"payload")
		aCoder.encode(taskId,forKey:"taskId")
		aCoder.encode(msgId,forKey:"msgId")
		aCoder.encode(offline,forKey:"offline")
	}
}

class NotificationManager: NSObject {
	static let singleton = NotificationManager()
	
	var currentPayload:String?	// current open notification
	var notificationArray = [NotificationData]()
	var delegate:AppDelegate!

	class func sharedInstance() ->NotificationManager {
		singleton.delegate = UIApplication.shared.delegate as! AppDelegate
		singleton.notificationArray = singleton.loadNofificationData()
		return NotificationManager.singleton
	}
	
	func showNotification(_ data:NotificationData!){
		if (delegate.nativeData != nil) {
			if data.offline! {
				// background, goto the page directly.
//				if(currentPayload!.containsString(data.payload!)) {
				if(self.canShowNow(data)) {
					delegate.nativeData!.send(toRN: "PushShowDetail", data: data.payload)
//					currentPayload = nil
				}
				else {
					self.notificationArray.append(data)
				}
			}
			else {
				delegate.nativeData!.send(toRN: "PushShowDialog", data: data.payload)
			}
		}
		else {
			self.notificationArray.append(data)
		}
		self.saveNotificationData()
	}
	
	func showNotification(_ payload:String!, taskId:String!, msgId:String!, offline:Bool?){
		let notification:NotificationData = NotificationData(payload: payload, taskId: taskId, msgId: msgId, offline: offline)
		self.showNotification(notification)
	}
	
	func showCurrentNotification() {
		// show current notification
		if self.currentPayload == nil {
			return
		}
		for index in 0..<notificationArray.count {
			let data = notificationArray[index]
//			if(currentPayload!.containsString(data.payload!)) {
			if(self.canShowNow(data)) {
				if(data.offline!) {
					delegate.nativeData!.send(toRN: "PushShowDetail", data: data.payload)
				}
				else {
					delegate.nativeData!.send(toRN: "PushShowDialog", data: data.payload)
				}
				self.currentPayload = nil
				self.notificationArray.remove(at: index)
				break
			}
		}
		self.saveNotificationData()
	}
	
	func showNotificationWithGmid(_ gmid:String!) -> Void {
		self.currentPayload = gmid
		self.showCurrentNotification()
	}
	
	func saveNotificationData() {
		let userDefault = UserDefaults.standard
		let data:Data = NSKeyedArchiver.archivedData(withRootObject: self.notificationArray)
		userDefault.set(data, forKey: "notifications")
	}
	
	func loadNofificationData() -> [NotificationData] {
		let userDefault = UserDefaults.standard
		if let data = userDefault.object(forKey: "notifications") as? Data {
			let array = NSKeyedUnarchiver.unarchiveObject(with: data) as! [NotificationData]
			return array
		}
		else {
			return [NotificationData]()
		}
	}
	
	func canShowNow(_ data:NotificationData) -> Bool{
		var can = false
		if self.currentPayload != nil {
			can = currentPayload!.contains(data.payload!)
		}
		else {
			if data.payload != nil {
				can = data.payload!.contains("title") && data.payload!.contains("message")
			}
		}
		return can
	}
}
