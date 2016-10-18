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
		self.payload=aDecoder.decodeObjectForKey("payload") as? String
		self.taskId=aDecoder.decodeObjectForKey("taskId") as? String
		self.msgId=aDecoder.decodeObjectForKey("msgId") as? String
		self.offline=aDecoder.decodeObjectForKey("offline") as! Bool
	}
	
	func encodeWithCoder(aCoder:NSCoder!){
		aCoder.encodeObject(payload,forKey:"payload")
		aCoder.encodeObject(taskId,forKey:"taskId")
		aCoder.encodeObject(msgId,forKey:"msgId")
		aCoder.encodeObject(offline,forKey:"offline")
	}
}

class NotificationManager: NSObject {
	static let singleton = NotificationManager()
	
	var currentPayload:String?	// current open notification
	var notificationArray = [NotificationData]()
	var delegate:AppDelegate!

	class func sharedInstance() ->NotificationManager {
		singleton.delegate = UIApplication.sharedApplication().delegate as! AppDelegate
		singleton.notificationArray = singleton.loadNofificationData()
		return NotificationManager.singleton
	}
	
	func showNotification(data:NotificationData!){
		if (delegate.nativeData != nil) {
			if data.offline! {
				// background, goto the page directly.
//				if(currentPayload!.containsString(data.payload!)) {
				if(self.canShowNow(data)) {
					delegate.nativeData!.sendDataToRN("PushShowDetail", data: data.payload)
					currentPayload = nil
				}
				else {
					self.notificationArray.append(data)
				}
			}
			else {
				delegate.nativeData!.sendDataToRN("PushShowDialog", data: data.payload)
			}
		}
		else {
			self.notificationArray.append(data)
		}
		self.saveNotificationData()
	}
	
	func showNotification(payload:String!, taskId:String!, msgId:String!, offline:Bool?){
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
					delegate.nativeData!.sendDataToRN("PushShowDetail", data: data.payload)
				}
				else {
					delegate.nativeData!.sendDataToRN("PushShowDialog", data: data.payload)
				}
				self.currentPayload = nil
				self.notificationArray.removeAtIndex(index)
				break
			}
		}
		self.saveNotificationData()
	}
	
	func showNotificationWithGmid(gmid:String!) -> Void {
		self.currentPayload = gmid
		self.showCurrentNotification()
	}
	
	func saveNotificationData() {
		let userDefault = NSUserDefaults.standardUserDefaults()
		let data:NSData = NSKeyedArchiver.archivedDataWithRootObject(self.notificationArray)
		userDefault.setObject(data, forKey: "notifications")
	}
	
	func loadNofificationData() -> [NotificationData] {
		let userDefault = NSUserDefaults.standardUserDefaults()
		if let data = userDefault.objectForKey("notifications") as? NSData {
			let array = NSKeyedUnarchiver.unarchiveObjectWithData(data) as! [NotificationData]
			return array
		}
		else {
			return [NotificationData]()
		}
	}
	
	func canShowNow(data:NotificationData) -> Bool{
		var can = false
		if self.currentPayload != nil {
			can = currentPayload!.containsString(data.payload!)
		}
		else {
			if data.payload != nil {
				can = data.payload!.containsString("title") && data.payload!.containsString("message") && data.payload!.containsString("tongrd_")
			}
		}
		return can
	}
}