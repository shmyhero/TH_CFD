//
//  StockChartView.swift
//  TH_CFD
//
//  Created by william on 16/3/23.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit

@IBDesignable class StockChartView: UIView {
	
	var leftMargin:CGFloat = 15.0
	var topMargin:CGFloat = 4.0
	var bottomMargin:CGFloat = 4.0
	
	@IBInspectable var startColor: UIColor = UIColor(hex: 0x5f97f6)
	@IBInspectable var endColor: UIColor = UIColor(hex: 0x1954b9)
	@IBInspectable var lineColor: UIColor = UIColor(hex: 0xbbceed)
	var chartDataJson: String! = ""
	
	var chartData:[ChartData] {
		get {
			return ChartDataManager.singleton.chartDataFromJson(self.chartDataJson)
		}
	}
	
	override func drawRect(rect: CGRect) {
		
		// draw gradients
//		self.drawBackground(rect)
		// draw line chart
		self.drawLineChart(rect)
		// draw background lines
//		self.drawHorizontalLines(rect)
	}
	
	func drawBackground(rect: CGRect) -> Void {
		//get the current context
		let context = UIGraphicsGetCurrentContext()
		let colors = [startColor.CGColor, endColor.CGColor]
		
		//set up the color space
		let colorSpace = CGColorSpaceCreateDeviceRGB()
		
		//set up the color stops
		let colorLocations:[CGFloat] = [0.0, 1.0]
		
		//create the gradient
		let gradient = CGGradientCreateWithColors(colorSpace,
			colors,
			colorLocations)
		
		//draw the gradient
		let startPoint = CGPoint.zero
		let endPoint = CGPoint(x:0, y:self.bounds.height)
		CGContextDrawLinearGradient(context,
			gradient,
			startPoint,
			endPoint,
			CGGradientDrawingOptions.DrawsBeforeStartLocation)
	}
	
	func drawHorizontalLines(rect: CGRect) -> Void {
		let width = rect.width
		let height = rect.height
		//Draw horizontal graph lines on the top of everything
		let linePath = UIBezierPath()
		let context = UIGraphicsGetCurrentContext()
		CGContextSaveGState(context)
		
		//top line
		linePath.moveToPoint(CGPoint(x:leftMargin, y: topMargin + 0.5))
		linePath.addLineToPoint(CGPoint(x: width - leftMargin,
			y:topMargin + 0.5))
		
		//center line
		linePath.moveToPoint(CGPoint(x:leftMargin,
			y: height/2 + topMargin + 0.5))
		linePath.addLineToPoint(CGPoint(x:width - leftMargin,
			y:height/2 + topMargin + 0.5))
		
		//bottom line
		linePath.moveToPoint(CGPoint(x:leftMargin,
			y:height - bottomMargin + 0.5))
		linePath.addLineToPoint(CGPoint(x:width - leftMargin,
			y:height - bottomMargin + 0.5))
		let color = UIColor(hex: 0x497bce)
		color.setStroke()
		
		linePath.lineWidth = 1
		linePath.stroke()
		
		// Draw vertical grash lines
		// TODO
		CGContextRestoreGState(context)
	}
	
	func drawLineChart(rect: CGRect) -> Void {
		let width = rect.width
		let height = rect.height
		let lastIndex = self.chartData.count - 1

		//calculate the x point
		let margin:CGFloat = 20.0
		let columnXPoint = { (column:Int) -> CGFloat in
			//Calculate gap between points
			let spacer = (width - margin*2 - 4) /
				CGFloat((lastIndex))
			var x:CGFloat = CGFloat(column) * spacer
			x += margin + 2
			return x
		}
		// calculate the y point
		let topBorder:CGFloat = height * 0.1
		let bottomBorder:CGFloat = height * 0.1
		let graphHeight = height - topBorder - bottomBorder
		let maxValue = chartData.reduce(0) { (max, data) -> Double in
			(max < data.price) ? data.price : max
		}
		let minValue = chartData.reduce(10000000.0) { (min, data) -> Double in
			(min > data.price) ? data.price : min
		}
		let columnYPoint = { (graphPoint:Double) -> CGFloat in
			var y:CGFloat = CGFloat(graphPoint-minValue) /
				CGFloat(maxValue-minValue) * graphHeight
			y = graphHeight + topBorder - y // Flip the graph
			return y
		}
		
		// draw the line graph
		lineColor.setFill()
		lineColor.setStroke()
		
		//set up the points line
		let graphPath = UIBezierPath()
		//go to start of line
		graphPath.moveToPoint(CGPoint(x:columnXPoint(0),
			y:columnYPoint(self.chartData[0].price)))
		
		//add points for each item in the graphPoints array
		//at the correct (x, y) for the point
		for i in 1..<self.chartData.count {
			let nextPoint = CGPoint(x:columnXPoint(i),
				y:columnYPoint(self.chartData[i].price))
			graphPath.addLineToPoint(nextPoint)
		}
		
//		graphPath.stroke()
		let context = UIGraphicsGetCurrentContext()
		CGContextSaveGState(context)
		
		let clippingPath = graphPath.copy() as! UIBezierPath
		
		//3 - add lines to the copied path to complete the clip area
		clippingPath.addLineToPoint(CGPoint(
			x: columnXPoint(lastIndex),
			y:height))
		clippingPath.addLineToPoint(CGPoint(
			x:columnXPoint(0),
			y:height))
		clippingPath.closePath()
		
		//4 - add the clipping path to the context
		clippingPath.addClip()
		
		// draw gradients
		let highestYPoint = CGFloat(topBorder)//columnYPoint(maxValue)
		let startPoint = CGPoint(x:margin, y: highestYPoint)
		let endPoint = CGPoint(x:margin, y:height)
		
		let colors = [startColor.CGColor, endColor.CGColor]
		
		//set up the color space
		let colorSpace = CGColorSpaceCreateDeviceRGB()
		
		//set up the color stops
		let colorLocations:[CGFloat] = [0.0, 1.0]
		
		//create the gradient
		let gradient = CGGradientCreateWithColors(colorSpace,
			colors,
			colorLocations)
		
		CGContextDrawLinearGradient(context, gradient, startPoint, endPoint, .DrawsBeforeStartLocation)
		CGContextRestoreGState(context)
		
		self.drawHorizontalLines(rect)
		
		//draw the line on top of the clipped gradient
		graphPath.lineWidth = 1.0
		graphPath.stroke()
		

		//Draw the circles on right top of graph stroke
		
		let circleColors = [UIColor.whiteColor().CGColor,
			UIColor(hex:0x1954B9, alpha:0.3).CGColor]
		
		let pointGradient = CGGradientCreateWithColors(colorSpace,
			circleColors, colorLocations)
		
		let centerPoint =  CGPoint(x:columnXPoint(lastIndex), y:columnYPoint(self.chartData[lastIndex].price))
		let startRadius: CGFloat = 2
		let endRadius: CGFloat = 6
		
		CGContextDrawRadialGradient(context, pointGradient, centerPoint,
			startRadius, centerPoint, endRadius, .DrawsBeforeStartLocation)
	}
}
