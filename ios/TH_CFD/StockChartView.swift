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
	
	var colorSet:ColorSet = ColorSet()
	var render:BaseRender?
	var dataSource:BaseDataSource?
	var panGesture:UIPanGestureRecognizer?
	var pinchGesture:UIPinchGestureRecognizer?

	override init(frame: CGRect) {
		super.init(frame: frame)
		// add touch function
		self.userInteractionEnabled = true
		panGesture = UIPanGestureRecognizer(target: self, action: #selector(StockChartView.pan(_:)))
		pinchGesture = UIPinchGestureRecognizer(target: self, action: #selector(StockChartView.pinch(_:)))
		
		if panGesture != nil {
			self.addGestureRecognizer(panGesture!)
		}
		if pinchGesture != nil {
			self.addGestureRecognizer(pinchGesture!)
		}
	}
	required init?(coder aDecoder: NSCoder) {
		super.init(coder: aDecoder)
	}
	
	deinit {
		if panGesture != nil {
			self.removeGestureRecognizer(panGesture!)
		}
		if pinchGesture != nil {
			self.removeGestureRecognizer(pinchGesture!)
		}
	}
	
// MARK: action
	func pan(sender: UIPanGestureRecognizer) {
		if dataSource != nil {
			let translation : CGPoint = sender.translationInView(self)
			dataSource!.panTranslation(translation, isEnd: sender.state == UIGestureRecognizerState.Ended)
			dataSource!.calculateData()
			self.setNeedsDisplay()
		}
	}
	
	func pinch(sender: UIPinchGestureRecognizer) {
		if dataSource != nil {
			let scale : CGFloat = sender.scale
			dataSource!.pinchScale(scale, isEnd: sender.state == UIGestureRecognizerState.Ended)
			dataSource!.calculateData()
			self.setNeedsDisplay()
		}
	}
	
// MARK: deal with raw data from RN
	var data:String? { // use for RN manager
		willSet {
			print ("set type data:",self.chartType)
			if (newValue != nil) {
//				if (chartType == "5m" || chartType == "day"){
				if CandleChartDataSource.isValidData(newValue!) {
					dataSource = CandleChartDataSource.init(json:newValue!, rect: self.bounds)
				}
				else if LineChartDataSource.isValidData(newValue!) {
					dataSource = LineChartDataSource.init(json:newValue!, rect: self.bounds)
				}
				else {
					dataSource = BaseDataSource.init(json: newValue!, rect: self.bounds)
				}
			}
			else {
				dataSource = BaseDataSource.init(json: "", rect: self.bounds)
			}
			dataSource?.setChartType(chartType)
			dataSource?.calculateData()
			self.setNeedsDisplay()
		}
	}
	
	var colorType:Int=0 {
		willSet {
			colorSet = ColorSet.init(type: colorType)
		}
	}
	
	var chartType:String="undefined" {
		willSet {
			print ("set type chart:", newValue)
//			self.setNeedsDisplay()
		}
	}
	
	override func didMoveToWindow() {
		if dataSource?._rect == CGRectZero {
			// sometimes when the data is updated, the view do not finished inited.
			// so need to recalculate again.
			dataSource?._rect = self.bounds
			dataSource?.calculateData()
		}
	}
	
// MARK: render
	override func drawRect(rect: CGRect) {
		// draw line chart
		let context:CGContext! = UIGraphicsGetCurrentContext()
		if dataSource == nil || dataSource!.isEmpty() {
			// no data, only draw box
			render = BaseRender.init(view: self, rect: rect)
			render!.render(context)
		} else {
			if dataSource!.isKindOfClass(CandleChartDataSource) {
				render = CandleChartRender.init(view: self, rect: rect)
				render?.dataProvider = dataSource
				render!.render(context)
			}
			else {
				render = LineChartRender.init(view: self, rect: rect)
				render?.dataProvider = dataSource
				render!.render(context)
			}
		}
	}

}
