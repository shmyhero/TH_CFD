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
	
	convenience init(hexInt:Int, alpha:CGFloat=1.0) {
		self.init(r:(hexInt >> 16) & 0xff, g:(hexInt >> 8) & 0xff, b:hexInt & 0xff, a:alpha)
	}
}

// MARK: UIViewController
extension UIViewController {
	func noticeSuccess(_ text: String, autoClear: Bool = true, autoClearTime: Int = 1) {
		SwiftNotice.showNoticeWithText(SwiftNotice.NoticeType.success, text: text, autoClear: autoClear, autoClearTime: autoClearTime)
	}
}

// MARK: String
extension String {
	func toDate() -> Date?{
		let dateFormatter = DateFormatter()
		dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
		if let date:Date = dateFormatter.date(from: self) {
			return date
		}
		else {
			dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZ"
			let date = dateFormatter.date(from: self)
			return date
		}
	}
}

// MARK: NSDate
extension Date {
	func sameTimeOnLastSunday() -> Date {
		let calendar:Calendar = Calendar(identifier: Calendar.Identifier.gregorian)
		var components:DateComponents = (calendar as NSCalendar).components([.yearForWeekOfYear, .weekOfYear, .weekday, .hour, .minute, .second, .nanosecond], from: self)
		components.weekday = 1
		return calendar.date(from: components)!
	}
}

// MARK: Double
extension Double {
    /// Rounds the double to decimal places value
    mutating func roundTo(_ places:Int) -> Double {
        let divisor = pow(10.0, Double(places))
        return Darwin.round(self * divisor) / divisor
    }
    
    func decimalPlace() -> Int {
        let str = "\(self)"
        if let range = str.range(of: ".") {
            return str.distance(from:range.upperBound, to:str.endIndex)
        }
        else {
            return 0
        }
    }
}
