//
//  StockDataManager.swift
//  TH_CFD
//
//  Created by william on 16/3/17.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit

protocol StockAlertDataDelegate: class {
	func didUpdateAlertData(sender: StockDataManager)
}

class StockData: NSObject {
	var stockId: Int = 0
	var symbol: String!
	var name: String!
	var open: Double?
	var last: Double?
	var preClose: Double?
	var stockTag: String?
	var choose: Bool = false
	var lastOpen: NSDate?
	
	func initWithId(stockId:Int, symbol:String, name:String, open:Double, close:Double, stockTag:String) -> Void {
		self.stockId = stockId
		self.symbol = symbol
		self.name = name
		self.open = open
		self.last = close
		self.stockTag = stockTag
	}
	
	func initWithDictionay(dict:NSDictionary) -> Void {
		self.stockId = dict["id"] as! Int
		self.symbol = dict["symbol"] as! String
		self.name = dict["name"] as! String
		self.open = dict["open"] as? Double
		self.last = dict["last"] as? Double
		self.preClose = dict["preClose"] as? Double
		self.stockTag = dict["tag"] == nil ? nil : dict["tag"] as? String
		
		let timeString = dict["lastOpen"] as? String
		self.lastOpen = timeString?.toDate()
	}
	
	func outputDictionay() -> NSDictionary {
		let dict:NSMutableDictionary = [
			"id":self.stockId,
			"symbol":self.symbol!,
			"name":self.name!,
			"open":self.open!,
			"last":self.last!,
			"preClose":self.preClose!,
		]
		if (self.stockTag != nil) {
			dict.setValue(self.stockTag, forKey: "tag")
		}
		if (self.lastOpen != nil) {
			dict.setValue(self.lastOpen, forKey: "lastClose")
		}
		return dict
	}
}

class AlertData: NSObject {
	var securityId: Int = 0
	var high: Double?
	var low: Double?
	var highEnabled: Bool = false
	var lowEnabled: Bool = false
	
	func initWithDictionay(dict:NSDictionary) -> Void {
		self.securityId = dict["SecurityId"] as! Int
		self.lowEnabled = dict["LowEnabled"] as! Bool
		self.highEnabled = dict["HighEnabled"] as! Bool
		self.low = dict["LowPrice"] as? Double
		self.high = dict["HighPrice"] as? Double
	}
	
	func enabled() -> Bool {
		return self.highEnabled || self.lowEnabled
	}
}

class StockDataManager: NSObject {
	static let singleton = StockDataManager()
	weak var alertDelegate:StockAlertDataDelegate?
	
	var stockDataArray = [StockData]()
	var alertDataArray = [AlertData]()
	var logoImage: UIImage? = UIImage.init(named: "Head_portrait")
	
	class func sharedInstance() ->StockDataManager {
		return StockDataManager.singleton
	}
	
	func loadOwnStocksData(jsonString:String) -> Void {
		// load stocks data from RN
		let nsData: NSData = jsonString.dataUsingEncoding(NSUTF8StringEncoding)!
		stockDataArray = []
		do {
			let json: AnyObject? = try NSJSONSerialization.JSONObjectWithData(nsData, options: NSJSONReadingOptions.MutableLeaves)
			if let jsonArray = json as? NSArray {
				for stockDict in jsonArray {
					let stockData:StockData = StockData()
					stockData.initWithDictionay(stockDict as! NSDictionary)
					stockDataArray.append(stockData)
				}
			}
		}
		catch {
			print("error serializing JSON: \(error)")
		}
	}
	
	func jsonOwnStockData() -> String {
		var dataString = "[]"
		var array = [AnyObject]()
		for stock in self.stockDataArray {
			array.append(stock.outputDictionay())
		}
		
		do {
			let nsData: NSData = try NSJSONSerialization.dataWithJSONObject(array, options: NSJSONWritingOptions.PrettyPrinted)
			dataString = NSString(data: nsData, encoding:NSUTF8StringEncoding) as! String
		}
		catch {
			print("error serializing data: \(error)")
		}
		return dataString
	}
	
	func loadUserLogo(jsonString:String) -> Void {
		if(jsonString != "default") {
			if let url = NSURL(string: jsonString){
				if let data = NSData(contentsOfURL: url) {
					logoImage = UIImage.init(data: data)
				}
			}
		}
	}
	
	func loadOwnAlertData(jsonString:String) -> Void {
		// load alert data from RN
		let nsData: NSData = jsonString.dataUsingEncoding(NSUTF8StringEncoding)!
		alertDataArray = []
		do {
			let json: AnyObject? = try NSJSONSerialization.JSONObjectWithData(nsData, options: NSJSONReadingOptions.MutableLeaves)
			if let jsonArray = json as? NSArray {
				for data in jsonArray {
					let alertData:AlertData = AlertData()
					alertData.initWithDictionay(data as! NSDictionary)
					alertDataArray.append(alertData)
				}
				if alertDataArray.count > 0 {
					self.alertDelegate?.didUpdateAlertData(self)
				}
			}
		}
		catch {
			print("error serializing alert JSON: \(error)")
		}
	}
	
	func alertEnabled(securityId: Int) -> Bool {
		var enabled = false
		for alert in alertDataArray {
			if (alert.securityId == securityId) {
				enabled = alert.enabled()
			}
		}
		return enabled
	}
}
