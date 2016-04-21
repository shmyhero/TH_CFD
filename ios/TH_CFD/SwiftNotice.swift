//
//  SwiftNotice.swift
//  TH_CFD
//
//  Created by william on 16/3/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//

enum NoticeType{
	case success
	case error
	case info
}

class SwiftNotice: NSObject {
	
	static var windows = Array<UIWindow!>()
	static let rv = UIApplication.sharedApplication().keyWindow?.subviews.first as UIView!
	static var timer: dispatch_source_t!
	static var timerTimes = 0
	static var degree: Double {
		get {
			return [0, 0, 180, 270, 90][UIApplication.sharedApplication().statusBarOrientation.hashValue] as Double
		}
	}
	
	static func showNoticeWithText(type: NoticeType,text: String, autoClear: Bool, autoClearTime: Int) {
		let frame = CGRectMake(0, 0, 105, 105)
		let window = UIWindow()
		window.backgroundColor = UIColor.clearColor()
		let mainView = UIView()
		mainView.layer.cornerRadius = 4
		mainView.backgroundColor = UIColor(hex: 0xd0e3f3, alpha:0.7)
		
		var image = UIImage()
		switch type {
		case .success:
			image = UIImage.init(named: "Checkmark")!
		case .error:
			image = UIImage.init(named: "Cross")!
		case .info:
			image = UIImage.init(named: "Info")!
		}
		let checkmarkView = UIImageView(image: image)
		checkmarkView.frame = CGRectMake(30, 15, 46, 46)
		mainView.addSubview(checkmarkView)
		
		let label = UILabel(frame: CGRectMake(0, 70, 105, 20))
		label.font = UIFont.systemFontOfSize(17)
		label.textColor = UIColor(hex: 0x4883e7)
		label.text = text
		label.textAlignment = NSTextAlignment.Center
		mainView.addSubview(label)
		
		window.frame = frame
		mainView.frame = frame
		
		window.windowLevel = UIWindowLevelAlert
		window.center = getRealCenter()
		// change orientation
		window.transform = CGAffineTransformMakeRotation(CGFloat(degree * M_PI / 180))
		window.hidden = false
		window.addSubview(mainView)
		windows.append(window)
		
		if autoClear {
			let selector = #selector(SwiftNotice.hideNotice(_:))
			self.performSelector(selector, withObject: window, afterDelay: NSTimeInterval(autoClearTime))
		}
	}
	
	// fix orientation problem
	static func getRealCenter() -> CGPoint {
		if UIApplication.sharedApplication().statusBarOrientation.hashValue >= 3 {
			return CGPoint(x: rv.center.y, y: rv.center.x)
		} else {
			return rv.center
		}
	}
	
	static func hideNotice(sender: AnyObject) {
		if let window = sender as? UIWindow {
			if let index = windows.indexOf({ (item) -> Bool in
				return item == window
			}) {
				windows.removeAtIndex(index)
			}
		}
	}
}
