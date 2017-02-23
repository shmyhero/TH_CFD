//
//  ColorSet.swift
//  TH_CFD
//
//  Created by william on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

class ColorSet: NSObject {
	var _type:Int = 0   // 0 is stock detail view, 1 is open position view.
	
	// base chart
	var bgLineColor: UIColor
	var middleLineColor: UIColor
	var dateTextColor: UIColor
	var minmaxColor: UIColor
    var rightTextColor: UIColor
	
	// line chart
	var startColor: UIColor
	var endColor: UIColor
	var lineColor: UIColor
	
	// candle chart
	var upColor: UIColor = UIColor(hexInt: 0xe34b4f)
	var downColor: UIColor = UIColor(hexInt: 0x30c296)
	
	// edit own stock color
	var bgColor: UIColor = UIColor(hexInt: 0x1962dd)
	var headLabelColor: UIColor = UIColor(hexInt: 0xabcaff)
	
	init(type:Int=0) {
		_type = type;
		// type 0 is detail view.
		// type 1 is open position view
		if StockDataManager.sharedInstance().isLive {
			startColor = UIColor(hexInt: 0x6683b3)
			endColor = UIColor(hexInt: 0x374d74)
			middleLineColor = type == 1 ? UIColor(hexInt:0x1d4fa2) : UIColor(hexInt: 0x657798)
			dateTextColor = UIColor(hexInt: 0x657798)
				
			bgLineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0x657798)
			lineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0xffffff)
            minmaxColor = type == 1 ? UIColor.whiteColor() : UIColor(hexInt: 0x94a9cf)
            rightTextColor = type == 1 ? UIColor.whiteColor() : UIColor(hexInt: 0x223555)
		}
		else {
			startColor = UIColor(hexInt: 0x7daeff)
			endColor = UIColor(hexInt: 0x1954b9)
            middleLineColor = type == 1 ? UIColor(hexInt:0x1d4fa2) : UIColor(hexInt: 0xf8f8f8)
			dateTextColor = UIColor(hexInt: 0x70a5ff)
			
			bgLineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0x497bce)
			lineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0xbbceed)
            minmaxColor = type == 1 ? UIColor.whiteColor() : UIColor(hexInt: 0x70a5ff)
            rightTextColor = type == 1 ? UIColor.whiteColor() : UIColor(hexInt: 0x053da1)
		}
		super.init()
	}
	
	func update() {
		if StockDataManager.sharedInstance().isLive {
			bgColor = UIColor(hexInt: 0x425a85)
			headLabelColor = UIColor(hexInt: 0xa0bdf1)
		}
		else {
			bgColor = UIColor(hexInt: 0x1962dd)
			headLabelColor = UIColor(hexInt: 0xabcaff)
		}
	}
}
