//
//  SwiftExtensions.swift
//  TH_CFD
//
//  Created by william on 16/3/18.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import Foundation
// MARK: UIColor
extension UIColor {
	convenience init(r: Int, g: Int, b: Int, a:CGFloat) {
		assert(r >= 0 && r <= 255, "Invalid red component")
		assert(g >= 0 && g <= 255, "Invalid green component")
		assert(b >= 0 && b <= 255, "Invalid blue component")
		
		self.init(red: CGFloat(r) / 255.0, green: CGFloat(g) / 255.0, blue: CGFloat(b) / 255.0, alpha: a)
	}
	
	convenience init(hex:Int, alpha:CGFloat=1.0) {
		self.init(r:(hex >> 16) & 0xff, g:(hex >> 8) & 0xff, b:hex & 0xff, a:alpha)
	}
}

// MARK: UIViewController
extension UIViewController {
	func noticeSuccess(text: String, autoClear: Bool = true, autoClearTime: Int = 1) {
		SwiftNotice.showNoticeWithText(NoticeType.success, text: text, autoClear: autoClear, autoClearTime: autoClearTime)
	}

}

extension String {
	func toDate() -> NSDate?{
		let dateFormatter = NSDateFormatter()
		dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
		if let date:NSDate = dateFormatter.dateFromString(self) {
			return date
		}
		else {
			dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZ"
			let date = dateFormatter.dateFromString(self)
			return date
		}
	}
}