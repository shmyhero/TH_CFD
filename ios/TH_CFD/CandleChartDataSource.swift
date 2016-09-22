//
//  CandleChartDataSource.swift
//  TH_CFD
//
//  Created by william on 16/9/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//

protocol CandleChartDataProvider: BaseDataProvider
{
}

class CandleData: BaseData {
	var open: Double = 0
	var close: Double = 0
	var high: Double = 0
	var low: Double = 0
	
	override init(dict:NSDictionary) {
		super.init(dict: dict)
		open = (dict["open"] as? Double)!
		close = (dict["close"] as? Double)!
		high = (dict["high"] as? Double)!
		low = (dict["low"] as? Double)!
	}
}

class CandlePositionData: NSObject {
	var open: Double = 0
	var close: Double = 0
	var high: Double = 0
	var low: Double = 0
	var x: Double = 0
	
	init(open:Double, close:Double, high:Double, low:Double, x:Double) {
		super.init()
		self.open = open
		self.close = close
		self.high = high
		self.low = low
		self.x = x
	}
}

class CandleChartDataSource: BaseDataSource, CandleChartDataProvider {
	var _candleData = [CandleData]()
	var stockData:StockData?
	var enablePan:Bool = false
	
	let margin:CGFloat = 15.0
	var topMargin:CGFloat = 2.0
	var bottomMargin:CGFloat = 15.0
	
	var _candlePositionData:[CandlePositionData] = []
	
	override func parseJson() {
		// demo:{\"lastOpen\":\"2016-03-24T13:31:00Z\",\"preClose\":100.81,\"longPct\":0.415537619225466,\"id\":14993,\"symbol\":\"CVS UN\",\"name\":\"CVS\",\"open\":0,\"last\":101.48,\"isOpen\":false,\"priceData\":[{\"p\":100.56,\"time\":\"2016-03-24T13:30:00Z\"},{\"p\":100.84,\"time\":\"2016-03-24T13:31:00Z\"}]}
		let nsData: NSData = _jsonString.dataUsingEncoding(NSUTF8StringEncoding)!
		_candleData = []
		do {
			let json: AnyObject? = try NSJSONSerialization.JSONObjectWithData(nsData, options: NSJSONReadingOptions.MutableLeaves)
			print(json)
			if let jsonDict = json as? NSDictionary {
				if _jsonString.rangeOfString("priceData") != nil {
					let jsonArray = jsonDict["priceData"] as! NSArray
					for chartDict in jsonArray {
						let data:CandleData = CandleData.init(dict: chartDict as! NSDictionary)
						_candleData.append(data)
					}
				}
				if _jsonString.rangeOfString("preClose") != nil {
					self.stockData = StockData()
					self.stockData?.initWithDictionay(jsonDict)
				}
			}
		}
		catch {
			print("error serializing JSON: \(error)")
		}
	}
	
	override func isEmpty() -> Bool {
		return _candleData.isEmpty
	}
	
	override func calculateData() {
		let width = _rect.width
		let height = _rect.height
		if (_rect == CGRectZero || _candleData.isEmpty) {
			return
		}
		
		var maxValue = _candleData.reduce(0) { (max, data) -> Double in
			(max < data.high) ? data.high : max
		}
		
		var minValue = _candleData.reduce(100000000.0) { (min, data) -> Double in
			(min > data.low) ? data.low : min
		}
		
		//calculate the x point
		let lastIndex = _candleData.count - 1
		let columnXPoint = { (column:Int) -> CGFloat in
			//Calculate gap between points
			let spacer = (width - self.margin*2) /
				CGFloat((lastIndex))
			var x:CGFloat = CGFloat(column) * spacer
			x += self.margin
			return x
		}
		
		
		// calculate the y point
		let topBorder:CGFloat = height * 0.12
		let bottomBorder:CGFloat = height * 0.15
		let graphHeight = height - topBorder - bottomBorder
		
		let columnYPoint = { (graphPoint:Double) -> CGFloat in
			var y:CGFloat = graphHeight/2
			if (maxValue > minValue) {
				y = CGFloat(graphPoint-minValue) / CGFloat(maxValue - minValue) * graphHeight
			}
			y = graphHeight + topBorder - y // Flip the graph
			return y
		}
		
		_candlePositionData = []
		
		if enablePan {
//			var timeStart:NSDate! = _candleData.first!.time
//			let timeEnd:NSDate! = _renderView.currentTimeEndOnPan
//			var timeGap:NSTimeInterval = timeEnd!.timeIntervalSinceDate(timeStart!)
//			if showPeriod > 0 && timeGap > showPeriod {
//				// can pan
//				timeGap = showPeriod
//				timeStart = NSDate(timeInterval: -showPeriod, sinceDate: timeEnd)
//			}
//			
//			let columnTimeXPoint = { (pointTime:NSDate) -> CGFloat in
//				//Calculate gap between points
//				let spacer = (width - self._renderView.margin*2)  * CGFloat((pointTime.timeIntervalSinceDate(timeStart)) / timeGap)
//				let x:CGFloat = self._renderView.margin + spacer
//				return x
//			}
//			for i in 0..<_candleData.count {
//				let x = columnTimeXPoint(_candleData[i].time!)
//				let y = columnYPoint(_candleData[i].price)
//				let point:CGPoint = CGPoint(x:x, y:y)
//				_candlePositionData.append(point)
//			}
		}
		else {
//			for i in 0..<_candleData.count {
//				let x = columnXPoint(i)
//				let y = columnYPoint(_candleData[i].price)
//				let position:CandlePositionData = CGPoint(x:x, y:y)
//				_candlePositionData.append(position)
//			}
		}
		
		self.calculateVerticalLines()
	}
	
	func calculateVerticalLines() -> Void {
		
	}
}
