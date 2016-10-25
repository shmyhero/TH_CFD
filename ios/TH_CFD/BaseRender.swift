//
//  BaseRender.swift
//  TH_CFD
//
//  Created by william on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

class BaseRender: NSObject {
	var _rect:CGRect = CGRectMake(0, 0, 0, 0)
	
	var _colorSet:ColorSet
	var _renderView:StockChartView
	weak var dataProvider:BaseDataProvider?
	var _margin:CGFloat = 0.0
	var _topMargin:CGFloat = 0.0
	var _bottomMargin:CGFloat = 0.0
	
	init(view:StockChartView, rect:CGRect) {
		_rect = rect
		_renderView = view
		_colorSet = view.colorSet
		dataProvider = view.dataSource
		super.init()
	}
	
	func render(context: CGContext) {
		if dataProvider != nil {
			_margin = dataProvider!.margin()
			_topMargin = dataProvider!.topMargin()
			_bottomMargin = dataProvider!.bottomMargin()
		}
		self.drawBorderLines(context)
		self.drawExtraText(context)
	}
	
	func drawBorderLines(context: CGContext) -> Void {
		let width = _rect.width
		let height = _rect.height
		//Draw horizontal graph lines on the top of everything
		let linePath = UIBezierPath()
		CGContextSaveGState(context)
		
		//top line
		linePath.moveToPoint(CGPoint(x:_margin, y: _topMargin + 0.5))
		linePath.addLineToPoint(CGPoint(x: width - _margin, y:_topMargin + 0.5))
		
		//bottom line
		linePath.moveToPoint(CGPoint(x:_margin-0.5, y:height - _bottomMargin + 0.5))
		linePath.addLineToPoint(CGPoint(x:width - _margin+0.5, y:height - _bottomMargin + 0.5))
		
		//left line
		linePath.moveToPoint(CGPoint(x:_margin - 0.5, y: _topMargin))
		linePath.addLineToPoint(CGPoint(x:_margin - 0.5, y:height - _bottomMargin))
		
		//right line
		linePath.moveToPoint(CGPoint(x:width - _margin + 0.5, y:_topMargin))
		linePath.addLineToPoint(CGPoint(x:width - _margin + 0.5, y:height - _bottomMargin))
		
		_colorSet.bgLineColor.setStroke()
		linePath.lineWidth = 1
		linePath.stroke()
		
		CGContextRestoreGState(context)
	}
	
	func drawExtraText(context:CGContext) -> Void {
		if dataProvider == nil {
			return
		}
		let maxPrice = dataProvider!.maxPrice()
		let minPrice = dataProvider!.minPrice()
		if (maxPrice.isNaN || minPrice.isNaN) {
			return
		}
		// draw min/max text
		let height = _rect.height
		let width = _rect.width
		let textWidth:CGFloat = 40.0
		let textColor = _colorSet.minmaxColor
		let textFont = UIFont(name: "Helvetica Neue", size: 8)
		let textStyle = NSMutableParagraphStyle()
		textStyle.alignment = .Left
		let attributes: [String:AnyObject] = [
			NSForegroundColorAttributeName: textColor,
			NSFontAttributeName: textFont!,
			NSParagraphStyleAttributeName: textStyle,
			]
		
		var maxText: NSString = "\(maxPrice)"
		var minText: NSString = "\(minPrice)"
		var textX = _margin+5
		let textHeight:CGFloat = 10
		maxText.drawInRect(CGRect(x: textX, y: _topMargin+5, width: textWidth, height: textHeight), withAttributes: attributes)
		minText.drawInRect(CGRect(x: textX, y: height-_bottomMargin-textHeight-5, width: textWidth, height: textHeight), withAttributes: attributes)
		
		let maxPercent = dataProvider!.maxPercent()
		let minPercent = dataProvider!.minPercent()
		if (maxPercent.isNaN || minPercent.isNaN) {
			return
		}
		
		textStyle.alignment = .Right
		maxText = NSString(format: "%.2f%%", maxPercent)
		minText = NSString(format: "%.2f%%", minPercent)
		textX = width-_margin-5-textWidth
		
		maxText.drawInRect(CGRect(x: textX, y: _topMargin+5, width: textWidth, height: textHeight), withAttributes: attributes)
		minText.drawInRect(CGRect(x: textX, y: height-_bottomMargin-textHeight-5, width: textWidth, height: textHeight), withAttributes: attributes)
	}
}
