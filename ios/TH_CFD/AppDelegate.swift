//
//  AppDelegate.swift
//  CFD
//
//  Created by william on 16/3/3.
//  Copyright © 2016年 tradehero. All rights reserved.
//

import UIKit

let kGtAppId:String = "yug3IJK3kh8SKs7FQaSdI3"
let kGtAppKey:String = "2ZIYLZjWQy8i4l7jcmdyB3"
let kGtAppSecret:String = "BbmXDciUnM61tN5wkyNn57"
    
struct Platform {
	static let isSimulator: Bool = {
		var isSim = false
		#if arch(i386) || arch(x86_64)
			isSim = true
		#endif
		return isSim
	}()
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, GeTuiSdkDelegate {
	
	var rnRootViewController: UIViewController!
	var window: UIWindow?
	var nativeData: NativeData?
	var getuiID: String?
	
	func showAlert(title:String!, alert:String!) {
		let alert = UIAlertController(title: title, message: alert, preferredStyle: UIAlertControllerStyle.Alert)
		alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.Default, handler: nil))
		self.window?.rootViewController!.presentViewController(alert, animated: true, completion: nil)
	}
	
	func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
		// Override point for customization after application launch.
		TalkingData.sessionStarted("9E5885AAFCB333653031970C2AF5614E", withChannelId: "AppStore")
		TalkingDataAppCpa.init("605dc6928f4c4244a889282a7ee132cf", withChannelId: "AppStore")
		
		// register push notification
		if((launchOptions) != nil) {
			if let dict = launchOptions![UIApplicationLaunchOptionsRemoteNotificationKey] as? NSDictionary {
				NotificationManager.sharedInstance().currentPayload = dict["payload"] as? String
			}
		}
		
		if (!TalkingData.handlePushMessage(launchOptions)) {
			// 非来自TalkingData的消息，可以在此处处理该消息。
		}
		
		// 通过 appId、 appKey 、appSecret 启动SDK，注：该方法需要在主线程中调用
		GeTuiSdk.startSdkWithAppId(kGtAppId, appKey: kGtAppKey, appSecret: kGtAppSecret, delegate: self);
		
		// 注册Apns
		self.registerUserNotification(application);
		
		// meiqia
		MQManager.initWithAppkey("2a59beff6f1875815ea399fdad79a46e", completion:{ (clientId, error) in
			if((error) != nil) {
				print("init meiqia error:", error)
			}
			else {
				print("init meiqia completion:", clientId)
			}
		})
		
		// initialize the rootView to fetch JS from the dev server
		let jsCodeLocation:NSURL?
		if Platform.isSimulator {
			jsCodeLocation = NSURL(string: "http://localhost:8081/index.ios.bundle?platform=ios&dev=true")
		} else {
            jsCodeLocation = RCTHotUpdate.bundleURL();
//			jsCodeLocation = NSBundle.mainBundle().URLForResource("main", withExtension: "jsbundle")
//			jsCodeLocation = NSURL(string: "http://192.168.20.149:8081/index.ios.bundle?platform=ios&dev=true")
		}
		
		let rootView = RCTRootView(bundleURL:jsCodeLocation,moduleName: "TH_CFD",initialProperties:nil,launchOptions:launchOptions)
		
		// Initialize a Controller to use view as React View
		let rootViewController:UIViewController = THRootViewController()
		rootViewController.view = rootView
		let loadingView = UIImageView(frame: UIScreen.mainScreen().bounds)
		loadingView.image = UIImage(named: "frontPage.jpg")
		rootView.loadingView = loadingView
        rootView.backgroundColor = UIColor(hexInt: 0x374d74)
//        rootView.clipsToBounds = true
		self.rnRootViewController = rootViewController
		
		// Set window to use rootViewController
		self.window = UIWindow(frame: UIScreen.mainScreen().bounds)
		self.window?.rootViewController = rootViewController
		self.window?.makeKeyAndVisible()
		
		let home = NSHomeDirectory()
		print(home)

		return true
	}
    
    func application(application: UIApplication, supportedInterfaceOrientationsForWindow window: UIWindow?) -> UIInterfaceOrientationMask {
        print ("iOS get from RN orientation:", Orientation.getOrientation())
        return Orientation.getOrientation()
    }
	
	/** 注册用户通知(推送) */
	func registerUserNotification(application: UIApplication) {
		let result = UIDevice.currentDevice().systemVersion.compare("8.0.0", options: NSStringCompareOptions.NumericSearch)
		if (result != NSComparisonResult.OrderedAscending) {
			UIApplication.sharedApplication().registerForRemoteNotifications()
			
			let userSettings = UIUserNotificationSettings(forTypes: [.Badge, .Sound, .Alert], categories: nil)
			UIApplication.sharedApplication().registerUserNotificationSettings(userSettings)
		} else {
			UIApplication.sharedApplication().registerForRemoteNotificationTypes([.Alert, .Sound, .Badge])
		}
	}
	
	func application(application: UIApplication, openURL url: NSURL, sourceApplication: String?, annotation: AnyObject) -> Bool {
		return RCTLinkingManager.application(application, openURL: url, sourceApplication: sourceApplication, annotation: annotation)
	}
	
	func applicationWillResignActive(application: UIApplication) {
		// Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
		// Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
	}
	
	func applicationDidEnterBackground(application: UIApplication) {
		// Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
		// If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
		MQManager.closeMeiqiaService()
	}
	
	func applicationWillEnterForeground(application: UIApplication) {
		// Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
		MQManager.openMeiqiaService()
	}
	
	func applicationDidBecomeActive(application: UIApplication) {
		// Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
	}
	
	func applicationWillTerminate(application: UIApplication) {
		// Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
	}

//	// Only if your app is using [Universal Links](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html).
//	func application(application: UIApplication, continueUserActivity userActivity: NSUserActivity, restorationHandler: ([AnyObject]?) -> Void) -> Bool {
//		return RCTLinkingManager.application(application, continueUserActivity: userActivity, restorationHandler: restorationHandler)
//	}

	func application(application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: NSData) {
		print("Device token:", deviceToken)
		TalkingData.setDeviceToken(deviceToken)
		MQManager.registerDeviceToken(deviceToken)
		// [3]:向个推服务器注册deviceToken
		var token = deviceToken.description.stringByTrimmingCharactersInSet(NSCharacterSet(charactersInString: "<>"));
		token = token.stringByReplacingOccurrencesOfString(" ", withString: "")
		GeTuiSdk.registerDeviceToken(token);
	}
	
	func application(application: UIApplication, didReceiveRemoteNotification userInfo: [NSObject : AnyObject]) {
		NSLog("receive remote notification: %@", [userInfo .description])
		if (!TalkingData.handlePushMessage(userInfo)) {
			// 非来自TalkingData的消息，可以在此处处理该消息。
			if let currentPayload = userInfo["payload"] as? String {
				NotificationManager.sharedInstance().showNotificationWithGmid(currentPayload)
			}
		}
	}
	
	func application(application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: NSError) {
		NSLog("\n>>>[DeviceToken Error]:%@\n\n",error.description)
	}
	
	// MARK: - GeTuiSdkDelegate
	
	/** SDK启动成功返回cid */
	func GeTuiSdkDidRegisterClient(clientId: String!) {
		// [4-EXT-1]: 个推SDK已注册，返回clientId
		NSLog("\n>>>[GeTuiSdk RegisterClient]:%@\n\n", clientId)
		getuiID = clientId;
		if (self.nativeData != nil) {
			self.nativeData!.sendDataToRN("deviceToken", data: clientId)
		}
	}
	
	/** SDK遇到错误回调 */
	func GeTuiSdkDidOccurError(error: NSError!) {
		// [EXT]:个推错误报告，集成步骤发生的任何错误都在这里通知，如果集成后，无法正常收到消息，查看这里的通知。
		NSLog("\n>>>[GeTuiSdk error]:%@\n\n", error.localizedDescription)
	}
	
	/** SDK收到sendMessage消息回调 */
	func GeTuiSdkDidSendMessage(messageId: String!, result: Int32) {
		// [4-EXT]:发送上行消息结果反馈
		let msg:String = "sendmessage=\(messageId),result=\(result)"
		NSLog("\n>>>[GeTuiSdk DidSendMessage]:%@\n\n",msg)
	}
	
	func GeTuiSdkDidReceivePayloadData(payloadData: NSData!, andTaskId taskId: String!, andMsgId msgId: String!, andOffLine offLine: Bool, fromGtAppId appId: String!) {
		
		var payloadMsg = ""
		if((payloadData) != nil) {
			payloadMsg = String.init(data: payloadData, encoding: NSUTF8StringEncoding)!
		}
		
		let msg:String = "Receive Payload: \(payloadMsg), taskId:\(taskId), messageId:\(msgId)"
		
		NSLog("\n>>>[GeTuiSdk DidReceivePayload]:%@\n\n",msg)
		
		NotificationManager.sharedInstance().showNotification(payloadMsg, taskId: taskId, msgId: msgId, offline: offLine)
	}

    static func isPortrait() -> Bool {
        return Orientation.getOrientation() == .Portrait || Orientation.getOrientation() == .PortraitUpsideDown
    }
}

