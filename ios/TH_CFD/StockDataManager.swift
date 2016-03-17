//
//  StockDataManager.swift
//  TH_CFD
//
//  Created by william on 16/3/17.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit

class StockData: NSObject {
	var stockId: Int = 0
	var symbol: String?
	var name: String?
	var open: Double?
	var close: Double?
	var stockTag: String?
	var choose: Bool = false
	
	func initWithId(stockId:Int, symbol:String, name:String, open:Double, close:Double, stockTag:String) -> Void {
		self.stockId = stockId
		self.symbol = symbol
		self.name = name
		self.open = open
		self.close = close
		self.stockTag = stockTag
	}
	
	func initWithDictionay(dict:NSDictionary) -> Void {
		self .initWithId((dict["id"]?.integerValue)!, symbol: (dict["symbol"]?.string)!, name: dict["name"]!.string, open: (dict["open"]?.doubleValue)!, close: (dict["close"]?.doubleValue)!, stockTag: (dict["tag"]?.string)!)
	}
}

class StockDataManager: NSObject {
	var stockData:[StockData]?
	func initWithJsonData(json:String) -> Void {
//		NSError *error;
//		NSData *data = [jsonData dataUsingEncoding:NSUTF8StringEncoding];
//		NSArray *dataArray = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:&error];
//		
//		for (NSDictionary *dict in dataArray) {
//			StockData *stock = [[StockData alloc] init];
//			[stock initWithDictionay:dict]
//		}
//		let data:NSData = json.dataUsingEncoding(NSUTF8StringEncoding)
//		let dataArray = NSJSONSerialization.JSONObjectWithData(data, options: <#T##NSJSONReadingOptions#>)
	}
}
