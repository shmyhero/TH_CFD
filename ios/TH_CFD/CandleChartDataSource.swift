//
//  CandleChartDataSource.swift
//  TH_CFD
//
//  Created by william on 16/9/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//

protocol CandleChartDataProvider: BaseDataProvider
{
	func candleData() -> [CandlePositionData]
	func xVerticalLines() -> [CGFloat]
	func timeVerticalLines() -> [NSDate]
	func oneCandleWidth() -> CGFloat
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
	var open: CGFloat = 0
	var close: CGFloat = 0
	var high: CGFloat = 0
	var low: CGFloat = 0
	var x: CGFloat = 0
	
	init(open:CGFloat, close:CGFloat, high:CGFloat, low:CGFloat, x:CGFloat) {
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
	
	let candleWidth:CGFloat = 5.0
	let spacer:CGFloat = 8.0
	
	var _candlePositionData:[CandlePositionData] = []
	var verticalLinesX:[CGFloat] = []
	var verticalLinesTime:[NSDate] = []
	
	var currentPanX:CGFloat = 0
	var lastPanX:CGFloat = 0
	
	var currentScale:CGFloat = 1
	var lastScale:CGFloat = 1
	let MIN_SCALE:CGFloat = 0.5
	let MAX_SCALE:CGFloat = 3
	
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
					_candleData = _candleData.reverse()
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
		
		let needRender = { (column: Int) -> Bool in
			let x:CGFloat = width - CGFloat(column) * self.oneSpacer() - self._margin + self.panX()
			return x > self._margin && x < width - self._margin + self.oneSpacer()
		}
		var maxValue:Double = 0
		var minValue:Double = 10000000
		for i in 0 ..< _candleData.count {
			if needRender(i) {
				let data:CandleData = _candleData[i]
				if (maxValue < data.high) {
					maxValue = data.high
				}
				if (minValue > data.low) {
					minValue = data.low
				}
			}
		}
		
//		let maxValue = _candleData.reduce(0) { (max, data) -> Double in
//			(max < data.high) ? data.high : max
//		}
//		
//		let minValue = _candleData.reduce(100000000.0) { (min, data) -> Double in
//			(min > data.low) ? data.low : min
//		}
		
		//calculate the x point
		let topBorder:CGFloat = height * 0.12
		let bottomBorder:CGFloat = height * 0.15
		let graphHeight:CGFloat = height - topBorder - bottomBorder
		
		let columnPosition = { (column:Int) -> CandlePositionData in
			let candle:CandleData = self._candleData[column]
			let x:CGFloat = width - CGFloat(column) * self.oneSpacer() - self._margin - self.oneSpacer()/2 + self.panX()
			let y:CGFloat = height/2
			var high:CGFloat=y,low:CGFloat=y,open:CGFloat=y,close:CGFloat=y
			if (maxValue > minValue) {
				high = graphHeight + topBorder - CGFloat((candle.high-minValue) / (maxValue - minValue)) * graphHeight
				low = graphHeight + topBorder - CGFloat((candle.low-minValue) / (maxValue - minValue)) * graphHeight
				open = graphHeight + topBorder - CGFloat((candle.open-minValue) / (maxValue - minValue)) * graphHeight
				close = graphHeight + topBorder - CGFloat((candle.close-minValue) / (maxValue - minValue)) * graphHeight
			}
			return CandlePositionData.init(open: round(open), close: round(close), high: round(high), low: round(low), x: x)
		}
		
		_candlePositionData = []
		
		for i in 0..<_candleData.count {
			let position:CandlePositionData = columnPosition(i)
			_candlePositionData.append(position)
		}
		
		self.calculateVerticalLines()
	}
	
	func calculateVerticalLines() -> Void {
		
		let gaps = ["5m":3600.0, "day":3600.0*24*14]
		let gap = gaps[_chartType]!		// gap between two lines
		
		if let time0:NSDate? = _candleData.first?.time {
			var endTime = time0
			verticalLinesX = []
			verticalLinesTime = []
			for i in 0 ..< _candleData.count {
				if let time:NSDate? = _candleData[i].time {
					let interval:NSTimeInterval = -time!.timeIntervalSinceDate(endTime!)
					if interval > gap*0.99 {
						verticalLinesX.append(_candlePositionData[i].x)
						endTime = time
						verticalLinesTime.append(self._candleData[i].time!)
					}
				}
			}
		}
	}
	
	override func panTranslation(translation: CGPoint, isEnd:Bool = false) {
		currentPanX = translation.x	//pan right means go earlier
		
		if (isEnd) {
			lastPanX = panX()
			if lastPanX < 1 {
				lastPanX = 0
			}
			currentPanX = 0
		}
	}
	
	func maxPanX() -> CGFloat {
		if (isEmpty()) {
			return 0
		}
		else {
			let allCandleWidth = CGFloat(_candleData.count) * oneSpacer()
			let viewWidth = _rect.width - _margin * 2
			if allCandleWidth > viewWidth {
				return allCandleWidth - viewWidth
			}
			else {
				return 0
			}
		}
	}
	
	func panX() -> CGFloat {
		var panx = currentPanX + lastPanX
		if panx < 0 {
			panx = 0
		} else if panx > maxPanX() {
			panx = maxPanX()
		}
		return panx
	}
	
	override func pinchScale(scale:CGFloat, isEnd:Bool = false) {
		currentScale = scale
		if (isEnd) {
			lastScale = self.scale()
			currentScale = 1
		}
	}
	
	func scale() -> CGFloat {
		var scale = currentScale * lastScale
		if scale < MIN_SCALE {
			scale = MIN_SCALE
		} else if scale > MAX_SCALE {
			scale = MAX_SCALE
		}
		return scale
	}
	
// MARK: delegate
	func candleData() -> [CandlePositionData] {
		return _candlePositionData
	}
	
	func xVerticalLines() -> [CGFloat] {
		return verticalLinesX
	}
	
	func timeVerticalLines() -> [NSDate] {
		return verticalLinesTime
	}
	
	func oneCandleWidth() -> CGFloat {
		return scale() * candleWidth
	}
	
	func oneSpacer() -> CGFloat {
		return scale() * spacer
	}
}
