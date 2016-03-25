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
		print(self.time)
	}
}

class ChartDataManager: NSObject {
	static let singleton = ChartDataManager()
	
	var chartDataArray = [ChartData]()
	
	class func sharedInstance() ->ChartDataManager {
		return ChartDataManager.singleton
	}
	
	var dataString = "[{\"p\":107.12,\"time\":\"2016-03-22T18:45:00Z\"},{\"p\":107.1,\"time\":\"2016-03-22T18:46:00Z\"},{\"p\":107.08,\"time\":\"2016-03-22T18:47:00Z\"},{\"p\":107.09,\"time\":\"2016-03-22T18:48:00Z\"},{\"p\":107.12,\"time\":\"2016-03-22T18:49:00Z\"},{\"p\":107.14,\"time\":\"2016-03-22T18:50:00Z\"},{\"p\":107.06,\"time\":\"2016-03-22T18:51:00Z\"},{\"p\":107.11,\"time\":\"2016-03-22T18:52:00Z\"},{\"p\":107.09,\"time\":\"2016-03-22T18:53:00Z\"},{\"p\":107.09,\"time\":\"2016-03-22T18:54:00Z\"},{\"p\":107.12,\"time\":\"2016-03-22T18:55:00Z\"},{\"p\":107.12,\"time\":\"2016-03-22T18:56:00Z\"},{\"p\":107.06,\"time\":\"2016-03-22T18:57:00Z\"},{\"p\":107.04,\"time\":\"2016-03-22T18:58:00Z\"},{\"p\":106.97,\"time\":\"2016-03-22T18:59:00Z\"},{\"p\":106.95,\"time\":\"2016-03-22T19:00:00Z\"},{\"p\":106.97,\"time\":\"2016-03-22T19:01:00Z\"},{\"p\":107.0,\"time\":\"2016-03-22T19:02:00Z\"},{\"p\":106.94,\"time\":\"2016-03-22T19:03:00Z\"},{\"p\":106.94,\"time\":\"2016-03-22T19:04:00Z\"},{\"p\":106.94,\"time\":\"2016-03-22T19:05:00Z\"},{\"p\":106.85,\"time\":\"2016-03-22T19:06:00Z\"},{\"p\":106.94,\"time\":\"2016-03-22T19:07:00Z\"},{\"p\":106.91,\"time\":\"2016-03-22T19:08:00Z\"},{\"p\":106.91,\"time\":\"2016-03-22T19:09:00Z\"},{\"p\":106.91,\"time\":\"2016-03-22T19:10:00Z\"},{\"p\":106.97,\"time\":\"2016-03-22T19:11:00Z\"},{\"p\":107.01,\"time\":\"2016-03-22T19:12:00Z\"},{\"p\":107.03,\"time\":\"2016-03-22T19:13:00Z\"},{\"p\":107.02,\"time\":\"2016-03-22T19:14:00Z\"},{\"p\":106.93,\"time\":\"2016-03-22T19:15:00Z\"},{\"p\":106.93,\"time\":\"2016-03-22T19:16:00Z\"},{\"p\":106.93,\"time\":\"2016-03-22T19:17:00Z\"},{\"p\":106.9,\"time\":\"2016-03-22T19:18:00Z\"},{\"p\":106.92,\"time\":\"2016-03-22T19:19:00Z\"},{\"p\":106.96,\"time\":\"2016-03-22T19:20:00Z\"},{\"p\":106.99,\"time\":\"2016-03-22T19:21:00Z\"},{\"p\":106.95,\"time\":\"2016-03-22T19:22:00Z\"},{\"p\":106.98,\"time\":\"2016-03-22T19:23:00Z\"},{\"p\":107.02,\"time\":\"2016-03-22T19:24:00Z\"},{\"p\":107.02,\"time\":\"2016-03-22T19:25:00Z\"},{\"p\":107.0,\"time\":\"2016-03-22T19:26:00Z\"},{\"p\":107.04,\"time\":\"2016-03-22T19:27:00Z\"},{\"p\":106.99,\"time\":\"2016-03-22T19:28:00Z\"},{\"p\":106.98,\"time\":\"2016-03-22T19:29:00Z\"},{\"p\":107.01,\"time\":\"2016-03-22T19:30:00Z\"},{\"p\":107.0,\"time\":\"2016-03-22T19:31:00Z\"},{\"p\":106.95,\"time\":\"2016-03-22T19:32:00Z\"},{\"p\":106.97,\"time\":\"2016-03-22T19:33:00Z\"},{\"p\":106.96,\"time\":\"2016-03-22T19:34:00Z\"},{\"p\":106.94,\"time\":\"2016-03-22T19:35:00Z\"},{\"p\":107.01,\"time\":\"2016-03-22T19:36:00Z\"},{\"p\":107.05,\"time\":\"2016-03-22T19:37:00Z\"},{\"p\":107.07,\"time\":\"2016-03-22T19:38:00Z\"},{\"p\":106.98,\"time\":\"2016-03-22T19:39:00Z\"},{\"p\":106.95,\"time\":\"2016-03-22T19:40:00Z\"},{\"p\":106.97,\"time\":\"2016-03-22T19:41:00Z\"},{\"p\":106.96,\"time\":\"2016-03-22T19:42:00Z\"},{\"p\":107.0,\"time\":\"2016-03-22T19:43:00Z\"},{\"p\":107.0,\"time\":\"2016-03-22T19:44:00Z\"},{\"p\":106.98,\"time\":\"2016-03-22T19:45:00Z\"},{\"p\":106.96,\"time\":\"2016-03-22T19:46:00Z\"},{\"p\":106.99,\"time\":\"2016-03-22T19:47:00Z\"},{\"p\":106.92,\"time\":\"2016-03-22T19:48:00Z\"},{\"p\":106.91,\"time\":\"2016-03-22T19:49:00Z\"},{\"p\":106.92,\"time\":\"2016-03-22T19:50:00Z\"},{\"p\":106.91,\"time\":\"2016-03-22T19:51:00Z\"},{\"p\":106.89,\"time\":\"2016-03-22T19:52:00Z\"},{\"p\":106.86,\"time\":\"2016-03-22T19:53:00Z\"},{\"p\":106.85,\"time\":\"2016-03-22T19:54:00Z\"},{\"p\":106.9,\"time\":\"2016-03-22T19:55:00Z\"},{\"p\":106.88,\"time\":\"2016-03-22T19:56:00Z\"},{\"p\":106.82,\"time\":\"2016-03-22T19:57:00Z\"},{\"p\":106.85,\"time\":\"2016-03-22T19:58:00Z\"}]"
	
	func chartDataFromJson(var jsonString:String) ->Array<ChartData>{
		if jsonString.isEmpty {
			if self.chartDataArray.count > 0 {
				return self.chartDataArray
			}
			jsonString = self.dataString
		}
		let nsData: NSData = jsonString.dataUsingEncoding(NSUTF8StringEncoding)!
		self.chartDataArray = []
		do {
			let json: AnyObject? = try NSJSONSerialization.JSONObjectWithData(nsData, options: NSJSONReadingOptions.MutableLeaves)
			if let jsonArray = json as? NSArray {
				for chartDict in jsonArray {
					let chartData:ChartData = ChartData()
					chartData.initWithDictionay(chartDict as! NSDictionary)
					self.chartDataArray.append(chartData)
				}
			}
		}
		catch {
			print("error serializing JSON: \(error)")
		}
		return self.chartDataArray
	}
}
