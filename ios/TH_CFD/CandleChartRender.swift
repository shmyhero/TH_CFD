//
//  CandleChartRender.swift
//  TH_CFD
//
//  Created by william on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

class CandleChartRender: BaseRender {
	weak var candleDataProvider: CandleChartDataProvider?
	
	override init(view:StockChartView, rect:CGRect) {
		super.init(view: view, rect: rect)
		candleDataProvider = dataProvider as? CandleChartDataProvider
	}
	
	override func render(context: CGContext) {
		super.render(context)
		self.drawMiddleLines(context)
		self.drawCandles(context)
	}
	
	func drawCandles(context: CGContext) {
		if (candleDataProvider == nil) {
			return
		}
		let candleRenderData = candleDataProvider!.candleRenderData()
		
		CGContextSaveGState(context)
		
		let width = _rect.width
		let height = _rect.height
		let clippingBox:UIBezierPath = UIBezierPath.init(rect: CGRect(x: _margin+1, y: _topMargin-1, width: width-_margin*2, height: height-_bottomMargin-_topMargin+2))
		clippingBox.addClip()
		//set up the points line
		let graphPathThinUp = UIBezierPath()
		graphPathThinUp.lineWidth = 1
		let graphPathThinDown = UIBezierPath()
		graphPathThinDown.lineWidth = 1
		let graphPathFatUp = UIBezierPath()
		graphPathFatUp.lineWidth = candleDataProvider!.oneCandleWidth()
		let graphPathFatDown = UIBezierPath()
		graphPathFatDown.lineWidth = candleDataProvider!.oneCandleWidth()
		
		// draw the sticks
		for i in 0..<candleRenderData.count {
			//go to start of line
			let candle = candleRenderData[i]
			let high = CGPoint(x: candle.x, y: candle.high+0.5)
			let low = CGPoint(x: candle.x, y: candle.low+0.5)
			let open = CGPoint(x: candle.x, y: candle.open+0.5)
			let closeAdjY:CGFloat = candle.open == candle.close ? 1 : 0
			let close = CGPoint(x: candle.x, y: candle.close+0.5+closeAdjY)
			if(candle.open >= candle.close) {
				// this is position data, so open large means price low.
				graphPathThinUp.moveToPoint(high)
				graphPathThinUp.addLineToPoint(low)
				graphPathFatUp.moveToPoint(open)
				graphPathFatUp.addLineToPoint(close)
			}
			else {
				graphPathThinDown.moveToPoint(high)
				graphPathThinDown.addLineToPoint(low)
				graphPathFatDown.moveToPoint(open)
				graphPathFatDown.addLineToPoint(close)
			}
		}
		_colorSet.upColor.setFill()
		_colorSet.upColor.setStroke()
		graphPathThinUp.stroke()
		graphPathFatUp.stroke()
		
		_colorSet.downColor.setFill()
		_colorSet.downColor.setStroke()
		graphPathThinDown.stroke()
		graphPathFatDown.stroke()
		
		CGContextRestoreGState(context)
	}
	
	func drawMiddleLines(context: CGContext) {
		if (candleDataProvider == nil) {
			return
		}
		
		CGContextSaveGState(context)
		
		let width = _rect.width
		let height = _rect.height
		let clippingBox:UIBezierPath = UIBezierPath.init(rect: CGRect(x: _margin+1, y: _topMargin-1, width: width-_margin*2, height: height-_bottomMargin-_topMargin+2))
		clippingBox.addClip()
		// vertical lines
		let linePath = UIBezierPath()
		let xVerticalLines = candleDataProvider!.xVerticalLines()
		for i in 0..<xVerticalLines.count {
			let px = xVerticalLines[i]
			linePath.moveToPoint(CGPoint(x: px, y: _topMargin))
			linePath.addLineToPoint(CGPoint(x:px, y:height - _bottomMargin))
		}
		_colorSet.bgLineColor.setStroke()
		linePath.lineWidth = 1
		linePath.stroke()
		CGContextRestoreGState(context)
	}
	
	override func drawExtraText(context:CGContext) -> Void {
		if (candleDataProvider == nil) {
			return
		}
		let height = _rect.height
		let width = _rect.width
		let dateFormatter = NSDateFormatter()
		let textWidth:CGFloat = 28.0
		let chartType = candleDataProvider!.chartType()
		if chartType == "day"{
			dateFormatter.dateFormat = "MM/dd"
		}
		else {
			dateFormatter.dateFormat = "HH:mm"
		}
		
		let textColor = UIColor(hexInt: 0x70a5ff)
		let textFont = UIFont(name: "Helvetica Neue", size: 8)
		let textStyle = NSMutableParagraphStyle()
		textStyle.alignment = .Center
		let attributes: [String:AnyObject] = [
			NSForegroundColorAttributeName: textColor,
			NSFontAttributeName: textFont!,
			NSParagraphStyleAttributeName: textStyle,
			]
		let textY = height-_bottomMargin+2
		
		let verticalLinesX = candleDataProvider!.xVerticalLines()
		let verticalTimes = candleDataProvider!.timeVerticalLines()
		for i in 0..<verticalTimes.count {
			if (verticalLinesX[i] < _margin || verticalLinesX[i] > width - _margin) {
				continue
			}
			let text:NSString = dateFormatter.stringFromDate(verticalTimes[i])
			let rect = CGRect(x: verticalLinesX[i]-textWidth/2, y: textY, width: textWidth, height: 10)
			text.drawInRect(rect, withAttributes: attributes)
		}
		
		super.drawExtraText(context)
	}
	
}
