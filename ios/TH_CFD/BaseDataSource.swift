//
//  BaseDataSource.swift
//  TH_CFD
//
//  Created by william on 16/9/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//

protocol BaseDataProvider : class
{
	func chartType() -> String
	func hasData() ->Bool
	func margin() -> CGFloat
	func topMargin() -> CGFloat
	func bottomMargin() -> CGFloat
}

class BaseData: NSObject {
	var time: NSDate?
	
	init(dict:NSDictionary) {
		let timeString = dict["time"] as? String
		time = timeString?.toDate()
		super.init()
	}
}

class BaseDataSource: NSObject, BaseDataProvider {
	var _jsonString:String
	var _data = [BaseData]()
	var _rect = CGRectZero
	let _margin:CGFloat = 15.0
	let _topMargin:CGFloat = 2.0
	let _bottomMargin:CGFloat = 15.0
	
	var _chartType:String="today"
	
	init(json:String, rect:CGRect) {
		_jsonString = json
		_rect = rect
		super.init()
		
		self.parseJson()
	}
	
	func parseJson() {
		// child class should override this function to init data
	}
	
	func isEmpty() -> Bool {
		return _data.isEmpty
	}
	
	func calculateData() {
		
	}
	
	func setChartType(type:String) {
		_chartType = type
	}
	
	func panTranslation(translation:CGPoint, isEnd:Bool = false) {
	}
	
	func pinchScale(scale:CGFloat, isEnd:Bool = false) {
	}
	
//	func needUpdate() -> Bool {
//		return false
//	}
	
// MARK: BaseDataProvider
	func chartType() -> String {
		return _chartType
	}
	
	func hasData() -> Bool {
		return isEmpty()
	}
	
	func margin() -> CGFloat {
		return _margin
	}
	
	func topMargin() -> CGFloat {
		return _topMargin
	}
	
	func bottomMargin() -> CGFloat {
		return _bottomMargin
	}
}
