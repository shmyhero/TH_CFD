//
//  BaseDataSource.swift
//  TH_CFD
//
//  Created by william on 16/9/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//

protocol BaseDataProvider : class
{
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
	var _renderView:StockChartView
	
	init(json:String, rect:CGRect, view:StockChartView) {
		_jsonString = json
		_rect = rect
		_renderView = view
		super.init()
		
		self.parseJson()
		self.calculateData()
	}
	
	func parseJson() {
		// child class should override this function to init data
	}
	
	func calculateData() {
		
	}
}
