//
//  StockChartView.swift
//  TH_CFD
//
//  Created by william on 16/3/23.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit

//@IBDesignable
class StockChartView: UIView {
	
	let margin:CGFloat = 15.0
	var topMargin:CGFloat = 2.0
	var bottomMargin:CGFloat = 15.0
	
	@IBInspectable var startColor: UIColor = UIColor(hex: 0x7daeff)
	@IBInspectable var endColor: UIColor = UIColor(hex: 0x1954b9)
	@IBInspectable var lineColor: UIColor = UIColor(hex: 0xbbceed)
	@IBInspectable var bgLineColor: UIColor = UIColor(hex: 0x497bce)
	@IBInspectable var middleLineColor: UIColor = UIColor(hex: 0xffffff, alpha: 0.5)
	
	var chartDataJson: String! = ""
	
	var chartData:[ChartData] = []
	var pointData:[CGPoint] = []
	var verticalLinesX:[CGFloat] = []
	var verticalTimes:[NSDate] = []
	var middleLineY:CGFloat = 0
	var topLineY:CGFloat = 0
	var bottomLineY:CGFloat = 0
	var usingRealTimeX = false
	var drawPreCloseLine = false
	var showPeriod:Double = 0		//only work when usingRealTimeX
	var panPeriod:Double = 0		//time period panned.
	var lastPanPeriod:Double = 0
	var currentTimeEndOnPan:NSDate = NSDate()

	override init(frame: CGRect) {
		super.init(frame: frame)
		// add touch function
		self.userInteractionEnabled = true
		let panGesture:UIPanGestureRecognizer = UIPanGestureRecognizer(target: self, action: #selector(StockChartView.pan(_:)))
		self.addGestureRecognizer(panGesture)
	}
	required init?(coder aDecoder: NSCoder) {
		super.init(coder: aDecoder)
	}
	
// MARK: action
	func pan(sender: UIPanGestureRecognizer) {
		if(showPeriod > 0) {
			let size = self.bounds.size
			let translation : CGPoint = sender.translationInView(self)
			let rate = showPeriod/Double(size.width-margin*2)
			panPeriod = lastPanPeriod - Double(translation.x) * rate	//pan right means go earlier
						let timeStart:NSDate! = chartData.first!.time
			let timeEnd:NSDate! = chartData.last!.time
			let maxPanPeriod = timeStart.timeIntervalSinceDate(timeEnd) + showPeriod	//this is a minus value
			if(panPeriod < maxPanPeriod) {
				panPeriod = maxPanPeriod
			}
			if(panPeriod > 0) {
				panPeriod = 0
			}
			currentTimeEndOnPan = NSDate(timeInterval: panPeriod, sinceDate: chartData.last!.time!)

			self.calculatePoint()
			self.setNeedsDisplay()
			if (sender.state == UIGestureRecognizerState.Ended) {
				if(panPeriod > -1) {
					panPeriod = 0
				}
				lastPanPeriod = panPeriod
			}
		}
	}
	
// MARK: deal with raw data
	var data:String? { // use for RN manager
		willSet {
			self.chartDataJson = newValue
			self.chartData = ChartDataManager.singleton.chartDataFromJson(self.chartDataJson)
			if panPeriod > -1 && chartData.count > 0 && lastPanPeriod == 0 {
				// using 2 point as get end mark
				currentTimeEndOnPan = (chartData.last?.time)!
			}
			self.calculatePoint()
			self.setNeedsDisplay()
		}
	}
	
	var colorType:Int=0 {
		willSet {
			self.bgLineColor = newValue == 1 ? UIColor(hex: 0xffffff, alpha: 0.5) : UIColor(hex: 0x497bce)
			self.lineColor = newValue == 1 ? UIColor(hex: 0xffffff, alpha: 0.5) : UIColor(hex: 0xbbceed	)
		}
	}
	
	var chartType:String="today" {
		willSet {
			usingRealTimeX = newValue == "10m"
			drawPreCloseLine = newValue == "today"
			showPeriod = newValue == "10m" ? 600 : 0
			panPeriod = 0
			lastPanPeriod = 0
		}
	}
	
//	func shouldShowInView(chartData: ChartData) -> Bool{
//		var result = true
//		if (usingRealTimeX) {
//			let intervalSinceEnd = chartData.time?.timeIntervalSinceDate(currentTimeEndOnPan)
//			if ( intervalSinceEnd > 0) {
//				result = false
//			}
//			else if (intervalSinceEnd < -showPeriod) {
//				result = false
//			}
//		}
//		return result
//	}
	
	// MARK: calculation
	func calculatePoint() {
		let size = self.bounds.size
		if (size.width == 0 || self.chartData.isEmpty) {
			return
		}
		
		if chartData.count == 1 {
			// only 1 point data.
			chartData.append(chartData[0])
		}
		 
		var maxValue = chartData.reduce(0) { (max, data) -> Double in
			(max < data.price) ? data.price : max
		}
//		var maxValue = chartData.reduce(0) { (max, data) -> Double in
//			(max < data.price) ? (shouldShowInView(data) ? data.price : max) : max
//		}
		var minValue = chartData.reduce(100000000.0) { (min, data) -> Double in
			(min > data.price) ? data.price : min
		}
//		var minValue = chartData.reduce(100000000.0) { (min, data) -> Double in
//			(min > data.price) ? (shouldShowInView(data) ? data.price : min) : min
//		}
		let preClose = ChartDataManager.singleton.stockData?.preClose
		if (preClose > 0 && drawPreCloseLine) {
			maxValue = maxValue < preClose ? preClose! : maxValue
			minValue = minValue > preClose ? preClose! : minValue
		}
		
		//calculate the x point
		let lastIndex = self.chartData.count - 1
		let columnXPoint = { (column:Int) -> CGFloat in
			//Calculate gap between points
			let spacer = (size.width - self.margin*2) /
				CGFloat((lastIndex))
			var x:CGFloat = CGFloat(column) * spacer
			x += self.margin
			return x
		}
		
		
		// calculate the y point
		let topBorder:CGFloat = size.height * 0.12
		let bottomBorder:CGFloat = size.height * 0.15
		let graphHeight = size.height - topBorder - bottomBorder
		
		let columnYPoint = { (graphPoint:Double) -> CGFloat in
			var y:CGFloat = graphHeight/2
			if (maxValue > minValue) {
				y = CGFloat(graphPoint-minValue) / CGFloat(maxValue - minValue) * graphHeight
			}
			y = graphHeight + topBorder - y // Flip the graph
			return y
		}
		if (preClose > 0 && maxValue > minValue) {
			middleLineY = (size.height-topBorder-bottomBorder) * CGFloat(maxValue - preClose!) / CGFloat(maxValue - minValue)+topBorder
		}
		else {
			middleLineY = size.height/2
		}
		
		if !drawPreCloseLine {
			middleLineY = 0		// do not draw this line
		}
		
		topLineY = topBorder
		bottomLineY = bottomBorder
		
		self.pointData = []
		
		if self.usingRealTimeX {
			var timeStart:NSDate! = chartData.first!.time
			let timeEnd:NSDate! = currentTimeEndOnPan
			var timeGap:NSTimeInterval = timeEnd!.timeIntervalSinceDate(timeStart!)
			if showPeriod > 0 && timeGap > showPeriod {
				// can pan
				timeGap = showPeriod
				timeStart = NSDate(timeInterval: -showPeriod, sinceDate: timeEnd)
			}
			
			let columnTimeXPoint = { (pointTime:NSDate) -> CGFloat in
				//Calculate gap between points
				let spacer = (size.width - self.margin*2)  * CGFloat((pointTime.timeIntervalSinceDate(timeStart)) / timeGap)
				let x:CGFloat = self.margin + spacer
				return x
			}
			for i in 0..<self.chartData.count {
				let x = columnTimeXPoint(self.chartData[i].time!)
				let y = columnYPoint(self.chartData[i].price)
				let point:CGPoint = CGPoint(x:x, y:y)
				self.pointData.append(point)
			}
		}
		else {
			for i in 0..<self.chartData.count {
				let x = columnXPoint(i)
				let y = columnYPoint(self.chartData[i].price)
				let point:CGPoint = CGPoint(x:x, y:y)
				self.pointData.append(point)
			}
		}
		
		self.calculateVerticalLines()
	}
	
	func calculateVerticalLines() -> Void {
		let size = self.bounds.size
		if (size.width == 0 || self.chartData.isEmpty) {
			return
		}
		self.verticalLinesX = []
		self.verticalTimes = []
		
		let gaps = ["today":3600.0, "2h":1800.0, "week":3600.0*24, "month":3600.0*24*7, "10m":120.0]
		let gap = gaps[self.chartType]!		// gap between two lines
		
		if let time0:NSDate? = chartData.first?.time {
			if self.usingRealTimeX {
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
						let x:CGFloat = self.margin + (size.width - self.margin*2) * CGFloat(timeGap / timePeriod)
						self.verticalLinesX.insert(x+0.5, atIndex: 0)
						self.verticalTimes.insert(time, atIndex: 0)
						time = NSDate(timeInterval: -gap, sinceDate: time)
						timeGap = time.timeIntervalSinceDate(timeStart!)
				}
			}
			else {
				var startTime = ChartDataManager.singleton.stockData?.lastOpen
				if startTime == nil {
					startTime = NSDate()
				}
				
				if chartType == "week" {
					// 1 day, 1 line
					let interval:NSTimeInterval = time0!.timeIntervalSinceDate(startTime!)
					let days = floor(interval / gap)
					startTime = NSDate(timeInterval: days*gap, sinceDate: startTime!)
				}
				else if chartType == "month" {
					// 1 week, 1 line
					startTime = startTime?.sameTimeOnLastSunday()
					let interval:NSTimeInterval = time0!.timeIntervalSinceDate(startTime!)
					let weeks = floor(interval / gap)
					startTime = NSDate(timeInterval: weeks*gap, sinceDate: startTime!)
				}
				else {
					startTime = chartData.first?.time
				}
				
				for i in 0 ..< self.chartData.count {
					if let time:NSDate? = chartData[i].time {
						let interval:NSTimeInterval = time!.timeIntervalSinceDate(startTime!)
						if interval > gap*0.99 {
							self.verticalLinesX.append(self.pointData[i].x+0.5)
							startTime = time
							self.verticalTimes.append(self.chartData[i].time!)
						}
					}
				}
			}
		}
	}
	
	func findHighlightPoint() -> CGPoint {
		var point = self.pointData.last!
		if(panPeriod != 0) {
			var firstLatePointIndex = 0
			var firstLateInterval:NSTimeInterval = 0
			for i in 0..<chartData.count {
				let interval:NSTimeInterval = chartData[i].time!.timeIntervalSinceDate(currentTimeEndOnPan)
				if (interval >= 0) {
					// 找到目前滑动后最右边的点
					firstLatePointIndex = i
					firstLateInterval = interval
					break
				}
			}
			if firstLatePointIndex == 0 {
				point = pointData.first!
			}
			else if(firstLateInterval == panPeriod) {
				point = pointData[firstLatePointIndex]
			}
			else {
				let size = self.bounds.size
				let lastInterval:NSTimeInterval = chartData[firstLatePointIndex-1].time!.timeIntervalSinceDate((chartData.last?.time)!)
				let y0 = pointData[firstLatePointIndex-1].y
				let y1 = pointData[firstLatePointIndex].y
				let y = y0+(y1-y0)*CGFloat(panPeriod-lastInterval)/CGFloat(firstLateInterval-lastInterval)
				point = CGPoint(x: size.width - margin, y: y)
			}
		}
		return point
	}
	
// MARK: render
	override func drawRect(rect: CGRect) {
		if (self.pointData.isEmpty) {
			self.calculatePoint()
		}
		// draw line chart
		if self.chartData.isEmpty {
			// no data, only draw lines
			self.drawHorizontalLines(rect)
			self.drawVerticalLines(rect)
		} else {
			self.drawLineChart(rect)
			self.drawTimeText(rect)
		}
	}
	
	func drawHorizontalLines(rect: CGRect) -> Void {
		let width = rect.width
		let height = rect.height
		//Draw horizontal graph lines on the top of everything
		var linePath = UIBezierPath()
		let context = UIGraphicsGetCurrentContext()
		CGContextSaveGState(context)
		
//		let size = self.bounds.size
//		let topBorder:CGFloat = size.height * 0.15
//		let bottomBorder:CGFloat = size.height * 0.15
//		//top line
//		linePath.moveToPoint(CGPoint(x:margin, y: topBorder + 0.5))
//		linePath.addLineToPoint(CGPoint(x: width - margin, y:topBorder + 0.5))
//		//bottom line
//		linePath.moveToPoint(CGPoint(x:margin-0.5, y:height - bottomBorder + 0.5))
//		linePath.addLineToPoint(CGPoint(x:width - margin+0.5, y:height - bottomBorder + 0.5))
		
		//top line
		linePath.moveToPoint(CGPoint(x:margin, y: topMargin + 0.5))
		linePath.addLineToPoint(CGPoint(x: width - margin, y:topMargin + 0.5))
		
		//bottom line
		linePath.moveToPoint(CGPoint(x:margin-0.5, y:height - bottomMargin + 0.5))
		linePath.addLineToPoint(CGPoint(x:width - margin+0.5, y:height - bottomMargin + 0.5))
		
		bgLineColor.setStroke()
		linePath.lineWidth = 1
		linePath.stroke()
		
		if (middleLineY > 0) {
			linePath = UIBezierPath()
			//center line
			let centerY = CGFloat(roundf(Float(middleLineY)))
			linePath.moveToPoint(CGPoint(x:margin, y: centerY + 0.5))
			linePath.addLineToPoint(CGPoint(x:width - margin, y: centerY + 0.5))
			
			middleLineColor.setStroke()
			linePath.lineWidth = 1
			linePath.setLineDash([5,3], count: 2, phase: 0)
			linePath.stroke()
		}
		CGContextRestoreGState(context)
	}
	
	
	func drawVerticalLines(rect: CGRect) -> Void {
		let width = rect.width
		let height = rect.height
		//Draw horizontal graph lines on the top of everything
		let linePath = UIBezierPath()
		let context = UIGraphicsGetCurrentContext()
		CGContextSaveGState(context)
		
		//left line
		linePath.moveToPoint(CGPoint(x:margin - 0.5, y: topMargin))
		linePath.addLineToPoint(CGPoint(x:margin - 0.5, y:height - bottomMargin))
		
		if !self.chartData.isEmpty {
			//center lines, calculate time length
			for i in 0..<self.verticalLinesX.count {
				let px = self.verticalLinesX[i]
				linePath.moveToPoint(CGPoint(x: px, y: topMargin))
				linePath.addLineToPoint(CGPoint(x:px, y:height - bottomMargin))
			}
		}
		
		//right line
		linePath.moveToPoint(CGPoint(x:width - margin + 0.5, y:topMargin))
		linePath.addLineToPoint(CGPoint(x:width - margin + 0.5, y:height - bottomMargin))

		bgLineColor.setStroke()
		linePath.lineWidth = 1
		linePath.stroke()
		
		CGContextRestoreGState(context)
	}
	
	func drawLineChart(rect: CGRect) -> Void {
		
		let width = rect.width
		let height = rect.height
		
		// draw the line graph
		lineColor.setFill()
		lineColor.setStroke()
		
		//set up the points line
		let graphPath = UIBezierPath()
		//go to start of line
		graphPath.moveToPoint(pointData[0])
		
		//add points for each item in the graphPoints array
		//at the correct (x, y) for the point
		for i in 1..<self.chartData.count {
			let nextPoint = pointData[i]
			graphPath.addLineToPoint(nextPoint)
		}
		
		var context = UIGraphicsGetCurrentContext()
		CGContextSaveGState(context)
		
		let clippingPath = graphPath.copy() as! UIBezierPath
		
		//3 - add lines to the copied path to complete the clip area
		clippingPath.addLineToPoint(CGPoint(
			x: pointData.last!.x,
			y:height))
		clippingPath.addLineToPoint(CGPoint(
			x: pointData[0].x,
			y:height))
		clippingPath.closePath()
		
		//4 - add the clipping path to the context
		clippingPath.addClip()
		
		let clippingBox:UIBezierPath = UIBezierPath.init(rect: CGRect(x: margin-1, y: topMargin-1, width: width-margin*2+2, height: height-bottomMargin-topMargin+2))
		clippingBox.addClip()
		
		let colors = [startColor.CGColor, endColor.CGColor]
		//set up the color space
		let colorSpace = CGColorSpaceCreateDeviceRGB()
		//set up the color stops
		let colorLocations:[CGFloat] = [0.0, 1.0]
		if(self.pointData.count > 1) {
			// draw gradients
			let highestYPoint = topLineY
			let startPoint = CGPoint(x:margin, y: highestYPoint)
			let endPoint = CGPoint(x:margin, y:height-bottomMargin)
			
			//create the gradient
			let gradient = CGGradientCreateWithColors(colorSpace,
				colors,
				colorLocations)
			
			CGContextDrawLinearGradient(context, gradient, startPoint, endPoint, .DrawsBeforeStartLocation)
			CGContextRestoreGState(context)
		}
		
		self.drawHorizontalLines(rect)
		self.drawVerticalLines(rect)
		
		
		context = UIGraphicsGetCurrentContext()
		CGContextSaveGState(context)
		clippingBox.addClip()
		
		//draw the line on top of the clipped gradient
		graphPath.lineWidth = 1.0
		graphPath.stroke()
		
		CGContextRestoreGState(context)

		//Draw the circles on right top of graph stroke
		
		let circleColors = [UIColor.whiteColor().CGColor,
			UIColor(hex:0x1954B9, alpha:0.3).CGColor]
		
		let pointGradient = CGGradientCreateWithColors(colorSpace,
			circleColors, colorLocations)
		
		let centerPoint = findHighlightPoint()
		let startRadius: CGFloat = 2
		let endRadius: CGFloat = 6
		
		CGContextDrawRadialGradient(context, pointGradient, centerPoint,
			startRadius, centerPoint, endRadius, .DrawsBeforeStartLocation)
	}
	
	func drawTimeText(rect: CGRect) -> Void {
		let height = rect.height
		let width = rect.width
		let dateFormatter = NSDateFormatter()
		var textWidth:CGFloat = 28.0
		if chartType == "week" || chartType == "month" {
			dateFormatter.dateFormat = "MM/dd"
		}
		else if chartType == "10m" {
			dateFormatter.dateFormat = "HH:mm:ss"
			textWidth = 35.0
		}
		else {
			dateFormatter.dateFormat = "HH:mm"
		}
		var timeStart:NSDate = (self.chartData.first?.time)!
		var timeEnd:NSDate = (self.chartData.last?.time)!
		if(showPeriod > 0) {
			timeEnd = currentTimeEndOnPan
			let timeGap:NSTimeInterval = timeEnd.timeIntervalSinceDate(timeStart)
			if timeGap > showPeriod {
				timeStart = NSDate(timeInterval: -showPeriod, sinceDate: timeEnd)
			}
			else {
				timeStart = NSDate(timeInterval: panPeriod, sinceDate: timeStart)
			}
		}
		
		let leftText: NSString = dateFormatter.stringFromDate(timeStart)
		let rightText = dateFormatter.stringFromDate(timeEnd)
		let textColor = UIColor(hex: 0x70a5ff)
		let textFont = UIFont(name: "Helvetica Neue", size: 8)
		let textStyle = NSMutableParagraphStyle()
		textStyle.alignment = .Center
		let attributes: [String:AnyObject] = [
			NSForegroundColorAttributeName: textColor,
//			NSBackgroundColorAttributeName: UIColor.blackColor(),
			NSFontAttributeName: textFont!,
			NSParagraphStyleAttributeName: textStyle,
		]
		let textY = height-bottomMargin+2
		leftText.drawInRect(CGRect(x: 0, y: textY, width: textWidth, height: 10), withAttributes: attributes)
		rightText.drawInRect(CGRect(x: width-textWidth, y: textY, width: textWidth, height: 10), withAttributes: attributes)
		
		var lastX:CGFloat = textWidth/2	//center x of last text
		for i in 0..<self.verticalTimes.count {
			if self.verticalLinesX[i] < lastX+textWidth-5 || self.verticalLinesX[i]>width-textWidth*1.5+8 {
				continue
			}
			let text:NSString = dateFormatter.stringFromDate(self.verticalTimes[i])
			let rect = CGRect(x: self.verticalLinesX[i]-textWidth/2, y: textY, width: textWidth, height: 10)
			text.drawInRect(rect, withAttributes: attributes)
			lastX = self.verticalLinesX[i]
		}
	}
}
