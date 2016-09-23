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
		
	}
}
