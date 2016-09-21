//
//  LineChartRender.swift
//  TH_CFD
//
//  Created by william on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

class LineChartRender: BaseRender {
	weak var lineDataProvider: LineChartDataProvider?
	
	override init(view:StockChartView, rect:CGRect) {
		super.init(view: view, rect: rect)
		lineDataProvider = dataProvider as? LineChartDataProvider
	}
	
	override func render(context: CGContext) {
		let width = _rect.width
		let height = _rect.height
		
		// draw the line graph
		_colorSet.lineColor.setFill()
		_colorSet.lineColor.setStroke()
		
		//set up the points line
		let graphPath = UIBezierPath()
		//go to start of line
		graphPath.moveToPoint(_renderView.pointData[0])
		
		//add points for each item in the graphPoints array
		//at the correct (x, y) for the point
		for i in 1..<_renderView.chartData.count {
			let nextPoint = _renderView.pointData[i]
			graphPath.addLineToPoint(nextPoint)
		}
		
		CGContextSaveGState(context)
		
		let clippingPath = graphPath.copy() as! UIBezierPath
		
		//3 - add lines to the copied path to complete the clip area
		clippingPath.addLineToPoint(CGPoint(
			x: _renderView.pointData.last!.x,
			y:height))
		clippingPath.addLineToPoint(CGPoint(
			x: _renderView.pointData[0].x,
			y:height))
		clippingPath.closePath()
		
		//4 - add the clipping path to the context
		clippingPath.addClip()
		
		let clippingBox:UIBezierPath = UIBezierPath.init(rect: CGRect(x: _margin-1, y: _topMargin-1, width: width-_margin*2+2, height: height-_bottomMargin-_topMargin+2))
		clippingBox.addClip()
		
		let colors = [_colorSet.startColor.CGColor, _colorSet.endColor.CGColor]
		//set up the color space
		let colorSpace = CGColorSpaceCreateDeviceRGB()
		//set up the color stops
		let colorLocations:[CGFloat] = [0.0, 1.0]
		if(_renderView.pointData.count > 1) {
			// draw gradients
			let highestYPoint = height*0.12//topLineY
			let startPoint = CGPoint(x:_margin, y: highestYPoint)
			let endPoint = CGPoint(x:_margin, y:height-_bottomMargin)
			
			//create the gradient
			let gradient = CGGradientCreateWithColors(colorSpace,
			                                          colors,
			                                          colorLocations)
			
			CGContextDrawLinearGradient(context, gradient, startPoint, endPoint, .DrawsBeforeStartLocation)
			CGContextRestoreGState(context)
		}
		
		self.drawBorderLines(context)
		self.drawMiddleLines(context)
		
		CGContextSaveGState(context)
		clippingBox.addClip()
		
		//draw the line on top of the clipped gradient
		graphPath.lineWidth = 1.5
		graphPath.stroke()
		
		CGContextRestoreGState(context)
		
		//Draw the circles on right top of graph stroke
		
		let circleColors = [UIColor.whiteColor().CGColor,
		                    UIColor(hexInt:0x1954B9, alpha:0.3).CGColor]
		
		let pointGradient = CGGradientCreateWithColors(colorSpace,
		                                               circleColors, colorLocations)
		
		if let centerPoint = lineDataProvider?.findHighlightPoint() {
			let startRadius: CGFloat = 2
			let endRadius: CGFloat = 6
			
			CGContextDrawRadialGradient(context, pointGradient, centerPoint,
										startRadius, centerPoint, endRadius, .DrawsBeforeStartLocation)
		}
		
		self.drawExtraText(context)
	}
	
	func drawMiddleLines(context: CGContext) {
		CGContextSaveGState(context)
		//center line
		var linePath = UIBezierPath()
		let width = _rect.width
		let height = _rect.height
		if (_renderView.middleLineY > 0) {
			let centerY = CGFloat(roundf(Float(_renderView.middleLineY)))
			linePath.moveToPoint(CGPoint(x:_margin, y: centerY + 0.5))
			linePath.addLineToPoint(CGPoint(x:width - _margin, y: centerY + 0.5))
			
			_colorSet.middleLineColor.setStroke()
			linePath.lineWidth = 1
			linePath.setLineDash([5,3], count: 2, phase: 0)
			linePath.stroke()
		}
		
		// vertical lines
		linePath = UIBezierPath()
		if !_renderView.chartData.isEmpty {
			//center lines, calculate time length
			for i in 0..<_renderView.verticalLinesX.count {
				let px = _renderView.verticalLinesX[i]
				linePath.moveToPoint(CGPoint(x: px, y: _topMargin))
				linePath.addLineToPoint(CGPoint(x:px, y:height - _bottomMargin))
			}
			_colorSet.bgLineColor.setStroke()
			linePath.lineWidth = 1
			linePath.stroke()
			CGContextRestoreGState(context)
		}
	}
	
	override func drawExtraText(context:CGContext) -> Void {
		let height = _rect.height
		let width = _rect.width
		let dateFormatter = NSDateFormatter()
		var textWidth:CGFloat = 28.0
		if _renderView.chartType == "week" || _renderView.chartType == "month" {
			dateFormatter.dateFormat = "MM/dd"
		}
		else if _renderView.chartType == "10m" {
			dateFormatter.dateFormat = "HH:mm:ss"
			textWidth = 35.0
		}
		else {
			dateFormatter.dateFormat = "HH:mm"
		}
		var timeStart:NSDate = (_renderView.chartData.first?.time)!
		var timeEnd:NSDate = (_renderView.chartData.last?.time)!
		if(_renderView.showPeriod > 0) {
			timeEnd = _renderView.currentTimeEndOnPan
			let timeGap:NSTimeInterval = timeEnd.timeIntervalSinceDate(timeStart)
			if timeGap > _renderView.showPeriod {
				timeStart = NSDate(timeInterval: -_renderView.showPeriod, sinceDate: timeEnd)
			}
			else {
				timeStart = NSDate(timeInterval: _renderView.panPeriod, sinceDate: timeStart)
			}
		}
		
		let leftText: NSString = dateFormatter.stringFromDate(timeStart)
		let rightText = dateFormatter.stringFromDate(timeEnd)
		let textColor = UIColor(hexInt: 0x70a5ff)
		let textFont = UIFont(name: "Helvetica Neue", size: 8)
		let textStyle = NSMutableParagraphStyle()
		textStyle.alignment = .Center
		let attributes: [String:AnyObject] = [
			NSForegroundColorAttributeName: textColor,
			//			NSBackgroundColorAttributeName: UIColor.blackColor(),
			NSFontAttributeName: textFont!,
			NSParagraphStyleAttributeName: textStyle,
			]
		let textY = height-_bottomMargin+2
		leftText.drawInRect(CGRect(x: 0, y: textY, width: textWidth, height: 10), withAttributes: attributes)
		rightText.drawInRect(CGRect(x: width-textWidth, y: textY, width: textWidth, height: 10), withAttributes: attributes)
		
		var lastX:CGFloat = textWidth/2	//center x of last text
		for i in 0..<_renderView.verticalTimes.count {
			if _renderView.verticalLinesX[i] < lastX+textWidth-5 || _renderView.verticalLinesX[i]>width-textWidth*1.5+8 {
				continue
			}
			let text:NSString = dateFormatter.stringFromDate(_renderView.verticalTimes[i])
			let rect = CGRect(x: _renderView.verticalLinesX[i]-textWidth/2, y: textY, width: textWidth, height: 10)
			text.drawInRect(rect, withAttributes: attributes)
			lastX = _renderView.verticalLinesX[i]
		}
	}
}
