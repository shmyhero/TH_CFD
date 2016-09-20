//
//  ColorSet.swift
//  TH_CFD
//
//  Created by william on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

class ColorSet: NSObject {
	var _type:Int = 0
	
	var startColor: UIColor = UIColor(hexInt: 0x7daeff)
	var endColor: UIColor = UIColor(hexInt: 0x1954b9)
	var lineColor: UIColor = UIColor(hexInt: 0xbbceed)
	var bgLineColor: UIColor = UIColor(hexInt: 0x497bce)
	var middleLineColor: UIColor = UIColor(hexInt: 0xffffff, alpha: 0.5)
	
	init(type:Int=0) {
		_type = type;
		bgLineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0x497bce)
		lineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0xbbceed)
	}
}