//
//  ColorSet.swift
//  TH_CFD
//
//  Created by william on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

class ColorSet: NSObject {
	var _type:Int = 0
	
	// base chart
	var bgLineColor: UIColor
	var middleLineColor: UIColor
	var dateTextColor: UIColor
	var minmaxColor: UIColor
	
	// line chart
	var startColor: UIColor
	var endColor: UIColor
	var lineColor: UIColor
	
	// candle chart
	var upColor: UIColor = UIColor(hexInt: 0xe34b4f)
	var downColor: UIColor = UIColor(hexInt: 0x30c296)
	
	init(type:Int=0) {
		_type = type;
		// type 0 is detail view.
		// type 1 is open position view
		if StockDataManager.sharedInstance().accountState {
			startColor = UIColor(hexInt: 0x6683b3)
			endColor = UIColor(hexInt: 0x374d74)
			middleLineColor = UIColor(hexInt: 0x657798)
			dateTextColor = UIColor(hexInt: 0x657798)
				
			bgLineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0x657798)
			lineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0xffffff)
			minmaxColor = type == 1 ? UIColor.whiteColor() : UIColor(hexInt: 0x94a9cf)
		}
		else {
			startColor = UIColor(hexInt: 0x7daeff)
			endColor = UIColor(hexInt: 0x1954b9)
			middleLineColor = UIColor(hexInt: 0xf8f8f8)
			dateTextColor = UIColor(hexInt: 0x70a5ff)
			
			bgLineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0x497bce)
			lineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0xbbceed)
			minmaxColor = type == 1 ? UIColor.whiteColor() : UIColor(hexInt: 0x70a5ff)
		}
		super.init()
	}
}
