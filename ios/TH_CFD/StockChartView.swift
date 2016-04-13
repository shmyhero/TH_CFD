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
	var topMargin:CGFloat = 10.0
	var bottomMargin:CGFloat = 10.0
	
	@IBInspectable var startColor: UIColor = UIColor(hex: 0x7daeff)
	@IBInspectable var endColor: UIColor = UIColor(hex: 0x1954b9)
	@IBInspectable var lineColor: UIColor = UIColor(hex: 0xbbceed)
	@IBInspectable var bgLineColor: UIColor = UIColor(hex: 0x497bce)
	var data:String? { // use for RN manager
		willSet {
			self.chartDataJson = newValue
			self.chartData = ChartDataManager.singleton.chartDataFromJson(self.chartDataJson)
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
	
	var chartDataJson: String! = ""
	
	var chartData:[ChartData] = []
	var pointData:[CGPoint] = []
	var middleLineY:CGFloat = 0
	var topLineY:CGFloat = 0
	var bottomLineY:CGFloat = 0
	
	func calculatePoint() {
		let size = self.bounds.size
		if (size.width == 0 || self.chartData.count == 0) {
			return
		}
		
		var maxValue = chartData.reduce(0) { (max, data) -> Double in
			(max < data.price) ? data.price : max
		}
		var minValue = chartData.reduce(100000000.0) { (min, data) -> Double in
			(min > data.price) ? data.price : min
		}
		let preClose = ChartDataManager.singleton.preClose
		if (preClose > 0) {
			if (maxValue < preClose) {
				maxValue = preClose
			}
			if (minValue > preClose) {
				minValue = preClose
			}
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
		let topBorder:CGFloat = size.height * 0.15
		let bottomBorder:CGFloat = size.height * 0.15
		let graphHeight = size.height - topBorder - bottomBorder
		
		let columnYPoint = { (graphPoint:Double) -> CGFloat in
			var y:CGFloat = graphHeight/2
			if (maxValue > minValue) {
				y = CGFloat(graphPoint-minValue) /
					CGFloat(maxValue - minValue) * graphHeight
			}
			y = graphHeight + topBorder - y // Flip the graph
			return y
		}
		if (preClose > 0 && maxValue > minValue) {
			middleLineY = (size.height-topBorder-bottomBorder) * CGFloat(maxValue - preClose) / CGFloat(maxValue - minValue)+topBorder
		}
		else {
			middleLineY = size.height/2
		}
		topLineY = topBorder
		bottomLineY = bottomBorder
		
		self.pointData = []
		for i in 0..<self.chartData.count {
			let x = columnXPoint(i)
			let y = columnYPoint(self.chartData[i].price)
			let point:CGPoint = CGPoint(x:x, y:y)
			self.pointData.append(point)
		}
		
	}
	
	override func drawRect(rect: CGRect) {
		if (self.pointData.isEmpty && !self.chartData.isEmpty) {
			self.calculatePoint()
		}
		// draw line chart
		self.drawLineChart(rect)
		// draw background lines
//		self.drawHorizontalLines(rect)
	}
	
	func drawHorizontalLines(rect: CGRect) -> Void {
		let width = rect.width
		let height = rect.height
		//Draw horizontal graph lines on the top of everything
		var linePath = UIBezierPath()
		let context = UIGraphicsGetCurrentContext()
		CGContextSaveGState(context)
		
		//top line
		linePath.moveToPoint(CGPoint(x:margin, y: topMargin + 0.5))
		linePath.addLineToPoint(CGPoint(x: width - margin,
			y:topMargin + 0.5))
		
		//bottom line
		linePath.moveToPoint(CGPoint(x:margin-0.5,
			y:height - bottomMargin + 0.5))
		linePath.addLineToPoint(CGPoint(x:width - margin+0.5,
			y:height - bottomMargin + 0.5))
		bgLineColor.setStroke()
		
		linePath.lineWidth = 1
		linePath.stroke()
		
		linePath = UIBezierPath()
		if (middleLineY > 0) {
			//center line
			let centerY = CGFloat(roundf(Float(middleLineY)))
			linePath.moveToPoint(CGPoint(x:margin,
				y: centerY + 0.5))
			linePath.addLineToPoint(CGPoint(x:width - margin,
				y: centerY + 0.5))
			UIColor(hex: 0xffffff, alpha: 0.5).setStroke()
			linePath.lineWidth = 1
			linePath.stroke()
			
			CGContextRestoreGState(context)
		}
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
			//center lines
			// calculate time length
			let startTime = self.chartData.first?.time
			let endTime = self.chartData.last?.time
			
			let interval:NSTimeInterval = endTime!.timeIntervalSinceDate(startTime!)
			let hours = Int(interval/3600)-1
			if hours > 0 {
				let unitWidth = 3600*(width-self.margin*2)/CGFloat(interval)
				for i in 1...hours {
					let px = Int(margin+unitWidth*CGFloat(i))
					linePath.moveToPoint(CGPoint(x: CGFloat(px) + 0.5,
						y: topMargin))
					linePath.addLineToPoint(CGPoint(x:CGFloat(px) + 0.5,
						y:height - bottomMargin))
				}
			}
		}
		
		//right line
		linePath.moveToPoint(CGPoint(x:width - margin + 0.5, y:bottomMargin))
		linePath.addLineToPoint(CGPoint(x:width - margin + 0.5, y:height - bottomMargin))
//		let color = UIColor(hex: 0x759de2)
		bgLineColor.setStroke()
		
		linePath.lineWidth = 1
		linePath.stroke()
		
		CGContextRestoreGState(context)
	}
	
	func drawLineChart(rect: CGRect) -> Void {
		// no data
		if self.chartData.isEmpty {
			self.drawHorizontalLines(rect)
			self.drawVerticalLines(rect)
			return
		}
		
		let width = rect.width
		let height = rect.height
		let lastIndex = self.chartData.count - 1
		
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
		
//		graphPath.stroke()
		let context = UIGraphicsGetCurrentContext()
		CGContextSaveGState(context)
		
		let clippingPath = graphPath.copy() as! UIBezierPath
		
		//3 - add lines to the copied path to complete the clip area
		clippingPath.addLineToPoint(CGPoint(
			x: pointData[lastIndex].x,
			y:height))
		clippingPath.addLineToPoint(CGPoint(
			x: pointData[0].x,
			y:height))
		clippingPath.closePath()
		
		//4 - add the clipping path to the context
		clippingPath.addClip()
		
		let colors = [startColor.CGColor, endColor.CGColor]
		//set up the color space
		let colorSpace = CGColorSpaceCreateDeviceRGB()
		//set up the color stops
		let colorLocations:[CGFloat] = [0.0, 1.0]
		if(self.pointData.count > 0) {
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
		
		//draw the line on top of the clipped gradient
		graphPath.lineWidth = 1.0
		graphPath.stroke()
		

		//Draw the circles on right top of graph stroke
		
		let circleColors = [UIColor.whiteColor().CGColor,
			UIColor(hex:0x1954B9, alpha:0.3).CGColor]
		
		let pointGradient = CGGradientCreateWithColors(colorSpace,
			circleColors, colorLocations)
		
		let centerPoint =  self.pointData[lastIndex]
		let startRadius: CGFloat = 2
		let endRadius: CGFloat = 6
		
		CGContextDrawRadialGradient(context, pointGradient, centerPoint,
			startRadius, centerPoint, endRadius, .DrawsBeforeStartLocation)
	}
}
