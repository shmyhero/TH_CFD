//
//  ChartDataManager.swift
//  TH_CFD
//
//  Created by william on 16/3/23.
//  Copyright © 2016年 Facebook. All rights reserved.
//

class ChartData: NSObject {
	var price: Double = 0
	var time: NSDate?

	func initWithDictionay(dict:NSDictionary) -> Void {
		self.price = (dict["p"] as? Double)!
		let timeString = dict["time"] as? String
		let dateFormatter = NSDateFormatter()
		dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
		self.time = dateFormatter.dateFromString(timeString!)
	}
}

class ChartDataManager: NSObject {
	static let singleton = ChartDataManager()
	
	var chartDataArray = [ChartData]()
	var preClose:Double = 0
	
	class func sharedInstance() ->ChartDataManager {
		return ChartDataManager.singleton
	}
	
	func chartDataFromJson( jsonString:String) ->Array<ChartData>{
		// demo:{\"preClose\":100.81,\"longPct\":0.415537619225466,\"id\":14993,\"symbol\":\"CVS UN\",\"name\":\"CVS\",\"open\":0,\"last\":101.48,\"isOpen\":false,\"priceData\":[{\"p\":100.56,\"time\":\"2016-03-24T13:30:00Z\"},{\"p\":100.84,\"time\":\"2016-03-24T13:31:00Z\"}]}
		let nsData: NSData = jsonString.dataUsingEncoding(NSUTF8StringEncoding)!
		self.chartDataArray = []
		do {
			let json: AnyObject? = try NSJSONSerialization.JSONObjectWithData(nsData, options: NSJSONReadingOptions.MutableLeaves)
			if let jsonDict = json as? NSDictionary {
				if jsonString.rangeOfString("priceData") != nil {
					let jsonArray = jsonDict["priceData"] as! NSArray
					for chartDict in jsonArray {
						let chartData:ChartData = ChartData()
						chartData.initWithDictionay(chartDict as! NSDictionary)
						self.chartDataArray.append(chartData)
					}
				}
				if jsonString.rangeOfString("preClose") != nil {
					self.preClose = jsonDict["preClose"] as! Double
				}
			}
		}
		catch {
			print("error serializing JSON: \(error)")
		}
		return self.chartDataArray
	}
}
