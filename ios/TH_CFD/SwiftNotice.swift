//
//  SwiftNotice.swift
//  TH_CFD
//
//  Created by william on 16/3/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//


class SwiftNotice: NSObject {
    enum NoticeType{
        case success
        case error
        case info
        case message
    }
    
	static var windows = Array<UIWindow!>()
	static let rv = UIApplication.shared.keyWindow?.subviews.first as UIView!
	static var timer: DispatchSource!
	static var timerTimes = 0
	static var degree: Double {
		get {
			return [0, 0, 180, 270, 90][UIApplication.shared.statusBarOrientation.hashValue] as Double
		}
	}
	   
    static func showToastNotice(_ text: String) {
		print ("show toast notice:%s", text)
        showNoticeWithText(.message, text: text, autoClear: true, autoClearTime: 1)
    }
    
	static func showNoticeWithText(_ type: NoticeType,text: String, autoClear: Bool, autoClearTime: Int) {
        let width:CGFloat = type == .message ? 120 : 105
		let frame = CGRect(x: 0, y: 0, width: width, height: 105)
		let window = UIWindow()
		window.backgroundColor = UIColor.clear
		let mainView = UIView()
		mainView.layer.cornerRadius = 4
		mainView.backgroundColor = UIColor(hexInt: 0xd0e3f3, alpha:0.7)
		
		var image = UIImage()
		switch type {
		case .success:
			image = UIImage.init(named: "Checkmark")!
		case .error:
			image = UIImage.init(named: "Cross")!
		case .info:
			image = UIImage.init(named: "Info")!
        default:
            break
		}
        
        if(type != .message){
            let checkmarkView = UIImageView(image: image)
            checkmarkView.frame = CGRect(x: 30, y: 15, width: 46, height: 46)
            mainView.addSubview(checkmarkView)
        }
		let labelY:CGFloat = type == .message ? 12 : 30
		let label = UILabel(frame: CGRect(x: 5, y: labelY, width: width-10, height: 80))
		label.font = UIFont.systemFont(ofSize: 17)
		label.textColor = UIColor(hexInt: 0x4883e7)
        label.text = text
		label.textAlignment = NSTextAlignment.center
        label.numberOfLines = 0
		mainView.addSubview(label)
		
		window.frame = frame
		mainView.frame = frame
		
		window.windowLevel = UIWindowLevelAlert
		window.center = getRealCenter()
		// change orientation
		window.transform = CGAffineTransform(rotationAngle: CGFloat(degree * .pi / 180))
		window.isHidden = false
		window.addSubview(mainView)
		windows.append(window)
		
		if autoClear {
			let selector = #selector(SwiftNotice.hideNotice(_:))
			self.perform(selector, with: window, afterDelay: TimeInterval(autoClearTime))
		}
	}
	
	// fix orientation problem
	static func getRealCenter() -> CGPoint {
		if UIApplication.shared.statusBarOrientation.hashValue >= 3 {
			return CGPoint(x: rv!.center.y, y: rv!.center.x)
		} else {
			return rv!.center
		}
	}
	
	static func hideNotice(_ sender: AnyObject) {
		print ("hide notice:start")
		if let window = sender as? UIWindow {
			if let index = windows.index(where: { (item) -> Bool in
				return item == window
			}) {
				windows.remove(at: index)
				print ("hide notice:success")
			}
		}
	}
}
