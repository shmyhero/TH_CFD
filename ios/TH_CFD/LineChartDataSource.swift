//
//  LineChartDataSource.swift
//  TH_CFD
//
//  Created by william on 16/9/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//

protocol LineChartDataProvider: BaseDataProvider
{
	func findHighlightPoint() -> CGPoint
	func showPreCloseLine() -> Bool
	func pointData() -> [CGPoint]
	func yPosOfMiddleLine() ->CGFloat
	func xVerticalLines() -> [CGFloat]
	func timesOnBottom() -> [NSDate]
	func firstTime() -> NSDate?
	func lastTime() -> NSDate?
}

class LineData: BaseData {
	var price: Double = 0
	
	override init(dict:NSDictionary) {
		super.init(dict: dict)
		price = (dict["p"] as? Double)!
	}
}

class LineChartDataSource: BaseDataSource, LineChartDataProvider {
	var _lineData = [LineData]()
	var stockData:StockData?
	
	var _pointData:[CGPoint] = []
	var verticalLinesX:[CGFloat] = []
	var verticalTimes:[NSDate] = []
	var middleLineY:CGFloat = 0
	var topLineY:CGFloat = 0
	var bottomLineY:CGFloat = 0
	
	var drawPreCloseLine = false
	
	override func parseJson() {
		// demo:{\"lastOpen\":\"2016-03-24T13:31:00Z\",\"preClose\":100.81,\"longPct\":0.415537619225466,\"id\":14993,\"symbol\":\"CVS UN\",\"name\":\"CVS\",\"open\":0,\"last\":101.48,\"isOpen\":false,\"priceData\":[{\"p\":100.56,\"time\":\"2016-03-24T13:30:00Z\"},{\"p\":100.84,\"time\":\"2016-03-24T13:31:00Z\"}]}
		let nsData: NSData = _jsonString.dataUsingEncoding(NSUTF8StringEncoding)!
		_lineData = []
		do {
			let json: AnyObject? = try NSJSONSerialization.JSONObjectWithData(nsData, options: NSJSONReadingOptions.MutableLeaves)
			if let jsonDict = json as? NSDictionary {
				if _jsonString.rangeOfString("priceData") != nil {
					let jsonArray = jsonDict["priceData"] as! NSArray
					for chartDict in jsonArray {
						let lineData:LineData = LineData.init(dict: chartDict as! NSDictionary)
						_lineData.append(lineData)
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
	
	override func setChartType(newValue:String) {
		if ["today", "2h", "week", "month", "10m"].contains(newValue) {
			super.setChartType(newValue)
			drawPreCloseLine = newValue == "today"
		}
	}
	
	static func isValidData(json:String) -> Bool {
		return json.containsString("p")
	}
	
	override func isEmpty() -> Bool {
		return _lineData.isEmpty
	}
	
	override func calculateData() {
		if _chartType == "undefined" {
			return
		}
		if (_rect == CGRectZero || _lineData.isEmpty) {
			return
        }
        let width = chartWidth()
        let height = chartHeight()
		
		if _lineData.count == 1 {
			// only 1 point data, duplicate it.(one line need two points)
			_lineData.append(_lineData[0])
		}
		
		var maxValue = _lineData.reduce(0) { (max, data) -> Double in
			(max < data.price) ? data.price : max
		}
		
		var minValue = _lineData.reduce(100000000.0) { (min, data) -> Double in
			(min > data.price) ? data.price : min
		}
		
		let preClose = self.stockData?.preClose
		if (preClose > 0 && drawPreCloseLine) {
			maxValue = maxValue < preClose ? preClose! : maxValue
			minValue = minValue > preClose ? preClose! : minValue
		}
		
		//calculate the x point
		let lastIndex = _lineData.count - 1
		let columnXPoint = { (column:Int) -> CGFloat in
			//Calculate gap between points
			let spacer = (width - self._margin*2) /
				CGFloat((lastIndex))
			var x:CGFloat = CGFloat(column) * spacer
			x += self._margin
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
		if (preClose > 0 && maxValue > minValue) {
			middleLineY = (height-topBorder-bottomBorder) * CGFloat(maxValue - preClose!) / CGFloat(maxValue - minValue)+topBorder
		}
		else {
			middleLineY = height/2
		}
		
		if !drawPreCloseLine {
			middleLineY = 0		// do not draw this line
		}
		
		_pointData = []
		
		for i in 0..<_lineData.count {
			let x = columnXPoint(i)
			let y = columnYPoint(_lineData[i].price)
			let point:CGPoint = CGPoint(x:x, y:y)
			_pointData.append(point)
		}
		
		_maxValue = maxValue
		_minValue = minValue
		_preCloseValue = preClose
		
		self.calculateVerticalLines()
	}
	
	func calculateVerticalLines() -> Void {
		if (_rect == CGRectZero || _lineData.isEmpty) {
			return
		}
		verticalLinesX = []
		verticalTimes = []
		
		let gaps = ["today":3600.0, "2h":1800.0, "week":3600.0*24, "month":3600.0*24*7, "10m":120.0]
		let gap = gaps[_chartType]!		// gap between two lines
		
		if let time0:NSDate? = _lineData.first?.time {
			var startTime = stockData?.lastOpen
			if startTime == nil {
				startTime = NSDate()
			}
			
			if _chartType == "week" {
				// 1 day, 1 line
				let interval:NSTimeInterval = time0!.timeIntervalSinceDate(startTime!)
				let days = floor(interval / gap)
				startTime = NSDate(timeInterval: days*gap, sinceDate: startTime!)
			}
			else if _chartType == "month" {
				// 1 week, 1 line
				startTime = startTime?.sameTimeOnLastSunday()
				let interval:NSTimeInterval = time0!.timeIntervalSinceDate(startTime!)
				let weeks = floor(interval / gap)
				startTime = NSDate(timeInterval: weeks*gap, sinceDate: startTime!)
			}
			else {
				startTime = _lineData.first?.time
			}
			
			for i in 0 ..< _lineData.count {
				if let time:NSDate? = _lineData[i].time {
					let interval:NSTimeInterval = time!.timeIntervalSinceDate(startTime!)
					if interval > gap*0.99 {
						verticalLinesX.append(_pointData[i].x+0.5)
						startTime = time
						verticalTimes.append(self._lineData[i].time!)
					}
				}
			}
		}
	}
    
// MARK: delegate
	func findHighlightPoint() -> CGPoint {
		let point = _pointData.last!
		return point
	}
	
	func showPreCloseLine() -> Bool {
		return drawPreCloseLine
	}
	
	func pointData() -> [CGPoint] {
		return _pointData
	}
	
	func yPosOfMiddleLine() ->CGFloat {
		return middleLineY
	}
	
	func xVerticalLines() -> [CGFloat] {
		return verticalLinesX
	}
	
	func timesOnBottom() -> [NSDate] {
		return verticalTimes
	}
	
	func firstTime() -> NSDate? {
		return _lineData.first?.time
	}
	
	func lastTime() -> NSDate? {
		return _lineData.last?.time
	}
}
