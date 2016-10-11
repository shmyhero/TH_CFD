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
	
	var gmid:String?	// current open notification
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
				if(gmid!.containsString(data.payload!)) {
//				if (self.gmid != nil && gmid!.containsString(data.taskId!) && gmid!.containsString(data.msgId!)) {
					delegate.nativeData!.sendDataToRN("PushShowDetail", data: data.payload)
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
		if payload.containsString("tongrd_type") {
			print("not show tong dao notification:", payload)
			return
		}
		let notification:NotificationData = NotificationData(payload: payload, taskId: taskId, msgId: msgId, offline: offline)
		self.showNotification(notification)
	}
	
	func showNotification() {
		// show current notification
		if self.gmid == nil {
			return
		}
		for index in 0..<notificationArray.count {
			let data = notificationArray[index]
			if(gmid!.containsString(data.payload!)) {
//			if(gmid!.containsString(data.taskId!) && gmid!.containsString(data.msgId!)) {
				if(data.offline!) {
					delegate.nativeData!.sendDataToRN("PushShowDetail", data: data.payload)
				}
				else {
					delegate.nativeData!.sendDataToRN("PushShowDialog", data: data.payload)
				}
				self.gmid = nil
				self.notificationArray.removeAtIndex(index)
				break
			}
		}
		self.saveNotificationData()
	}
	
	func showNotificationWithGmid(gmid:String!) -> Void {
		self.gmid = gmid
		self.showNotification()
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
}