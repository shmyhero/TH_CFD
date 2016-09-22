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
	func periodShowTime() -> Double
	func periodPanTime() -> Double
	func currentPanEndTime() -> NSDate
	func pointData() -> [CGPoint]
	func yPosOfMiddleLine() ->CGFloat
	func xValuesOfVerticalLine() -> [CGFloat]
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
	
	let margin:CGFloat = 15.0
	var topMargin:CGFloat = 2.0
	var bottomMargin:CGFloat = 15.0
	
	var _pointData:[CGPoint] = []
	var verticalLinesX:[CGFloat] = []
	var verticalTimes:[NSDate] = []
	var middleLineY:CGFloat = 0
	var topLineY:CGFloat = 0
	var bottomLineY:CGFloat = 0
	
	var currentTimeEndOnPan:NSDate = NSDate()
	var usingRealTimeX = false
	var drawPreCloseLine = false
	var showPeriod:Double = 0		//only work when usingRealTimeX
	var panPeriod:Double = 0		//time period panned.
	var lastPanPeriod:Double = 0
	
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
		super.setChartType(newValue)
		
		usingRealTimeX = newValue == "10m"
		drawPreCloseLine = newValue == "today"
		showPeriod = newValue == "10m" ? 600 : 0
		panPeriod = 0
		lastPanPeriod = 0
	}
	
	override func isEmpty() -> Bool {
		return _lineData.isEmpty
	}
	
	override func calculateData() {
		let width = _rect.width
		let height = _rect.height
		if (_rect == CGRectZero || _lineData.isEmpty) {
			return
		}
		
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
		
		if usingRealTimeX {
			var timeStart:NSDate! = _lineData.first!.time
			let timeEnd:NSDate! = currentTimeEndOnPan
			var timeGap:NSTimeInterval = timeEnd!.timeIntervalSinceDate(timeStart!)
			if showPeriod > 0 && timeGap > showPeriod {
				// can pan
				timeGap = showPeriod
				timeStart = NSDate(timeInterval: -showPeriod, sinceDate: timeEnd)
			}
			
			let columnTimeXPoint = { (pointTime:NSDate) -> CGFloat in
				//Calculate gap between points
				let spacer = (width - self.margin*2)  * CGFloat((pointTime.timeIntervalSinceDate(timeStart)) / timeGap)
				let x:CGFloat = self.margin + spacer
				return x
			}
			for i in 0..<_lineData.count {
				let x = columnTimeXPoint(_lineData[i].time!)
				let y = columnYPoint(_lineData[i].price)
				let point:CGPoint = CGPoint(x:x, y:y)
				_pointData.append(point)
			}
		}
		else {
			for i in 0..<_lineData.count {
				let x = columnXPoint(i)
				let y = columnYPoint(_lineData[i].price)
				let point:CGPoint = CGPoint(x:x, y:y)
				_pointData.append(point)
			}
		}
		
		self.calculateVerticalLines()
	}
	
	func calculateVerticalLines() -> Void {
		let width = _rect.width
//		let height = _rect.height
		if (width == 0 || _lineData.isEmpty) {
			return
		}
		verticalLinesX = []
		verticalTimes = []
		
		let gaps = ["today":3600.0, "2h":1800.0, "week":3600.0*24, "month":3600.0*24*7, "10m":120.0]
		let gap = gaps[_chartType]!		// gap between two lines
		
		if let time0:NSDate? = _lineData.first?.time {
			if usingRealTimeX {
				var timeStart:NSDate! = time0!
				let timeEnd:NSDate! = currentTimeEndOnPan
				var timeGap:NSTimeInterval = timeEnd!.timeIntervalSinceDate(timeStart!)
				if showPeriod > 0 && timeGap > showPeriod {
					timeStart = NSDate(timeInterval: -showPeriod, sinceDate: timeEnd)
				}
				let timePeriod:NSTimeInterval! = timeEnd.timeIntervalSinceDate(timeStart!)
				var time:NSDate! = NSDate(timeInterval: -gap, sinceDate: timeEnd)
				timeGap = time.timeIntervalSinceDate(timeStart!)
				while timeGap > 0 {
					let x:CGFloat = margin + (width - margin*2) * CGFloat(timeGap / timePeriod)
					verticalLinesX.insert(x+0.5, atIndex: 0)
					verticalTimes.insert(time, atIndex: 0)
					time = NSDate(timeInterval: -gap, sinceDate: time)
					timeGap = time.timeIntervalSinceDate(timeStart!)
				}
			}
			else {
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
	}
	
//	override func needUpdate() -> Bool {
//		return _lineData.count > 0 && _pointData.isEmpty
//	}
	
// MARK: delegate
	func findHighlightPoint() -> CGPoint {
		let width = _rect.width
//		let height = _rect.height
		var point = _pointData.last!
		if(panPeriod != 0) {
			var firstLatePointIndex = 0
			var firstLateInterval:NSTimeInterval = 0
			for i in 0..<_lineData.count {
				let interval:NSTimeInterval = _lineData[i].time!.timeIntervalSinceDate(currentTimeEndOnPan)
				if (interval >= 0) {
					// 找到目前滑动后最右边的点
					firstLatePointIndex = i
					firstLateInterval = interval
					break
				}
			}
			if firstLatePointIndex == 0 {
				point = _pointData.first!
			}
			else if(firstLateInterval == panPeriod) {
				point = _pointData[firstLatePointIndex]
			}
			else {
				let lastInterval:NSTimeInterval = _lineData[firstLatePointIndex-1].time!.timeIntervalSinceDate((_lineData.last?.time)!)
				let y0 = _pointData[firstLatePointIndex-1].y
				let y1 = _pointData[firstLatePointIndex].y
				let y = y0+(y1-y0)*CGFloat(panPeriod-lastInterval)/CGFloat(firstLateInterval-lastInterval)
				point = CGPoint(x: width - margin, y: y)
			}
		}
		return point
	}
	
	func showPreCloseLine() -> Bool {
		return drawPreCloseLine
	}
	
	func periodShowTime() ->Double {
		return showPeriod
	}
	
	func periodPanTime() ->Double {
		return panPeriod
	}
	func currentPanEndTime() -> NSDate {
		return currentTimeEndOnPan
	}
	
	func pointData() -> [CGPoint] {
		return _pointData
	}
	
	func yPosOfMiddleLine() ->CGFloat {
		return middleLineY
	}
	
	func xValuesOfVerticalLine() -> [CGFloat] {
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
