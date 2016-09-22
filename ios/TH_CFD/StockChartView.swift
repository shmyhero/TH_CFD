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
	var panGesture:UIPanGestureRecognizer!

	override init(frame: CGRect) {
		super.init(frame: frame)
		// add touch function
		self.userInteractionEnabled = true
		panGesture = UIPanGestureRecognizer(target: self, action: #selector(StockChartView.pan(_:)))
		self.addGestureRecognizer(panGesture)
	}
	required init?(coder aDecoder: NSCoder) {
		super.init(coder: aDecoder)
	}
	
	deinit {
		self.removeGestureRecognizer(panGesture)
	}
	
// MARK: action
	func pan(sender: UIPanGestureRecognizer) {
		//todo
//		if(showPeriod > 0) {
//			let size = self.bounds.size
//			let translation : CGPoint = sender.translationInView(self)
//			let rate = showPeriod/Double(size.width-margin*2)
//			panPeriod = lastPanPeriod - Double(translation.x) * rate	//pan right means go earlier
//						let timeStart:NSDate! = chartData.first!.time
//			let timeEnd:NSDate! = chartData.last!.time
//			let maxPanPeriod = timeStart.timeIntervalSinceDate(timeEnd) + showPeriod	//this is a minus value
//			if(panPeriod < maxPanPeriod) {
//				panPeriod = maxPanPeriod
//			}
//			if(panPeriod > 0) {
//				panPeriod = 0
//			}
//			currentTimeEndOnPan = NSDate(timeInterval: panPeriod, sinceDate: chartData.last!.time!)
//			
//			dataSource?.calculateData()
//			self.setNeedsDisplay()
//			if (sender.state == UIGestureRecognizerState.Ended) {
//				if(panPeriod > -1) {
//					panPeriod = 0
//				}
//				lastPanPeriod = panPeriod
//			}
//		}
	}
	
// MARK: deal with raw data from RN
	var data:String? { // use for RN manager
		willSet {
			if (newValue != nil) {
				if (chartType == "5m" || chartType == "day"){
					dataSource = CandleChartDataSource.init(json:newValue!, rect: self.bounds)
				}
				else {
					dataSource = LineChartDataSource.init(json:newValue!, rect: self.bounds)
				}
			}
			else {
				dataSource = BaseDataSource.init(json: "", rect: self.bounds)
			}
			
//			self.chartDataJson = newValue
//			self.chartData = ChartDataManager.singleton.chartDataFromJson(self.chartDataJson)
//			if panPeriod > -1 && chartData.count > 0 && lastPanPeriod == 0 {
//				// using 2 point as get end mark
//				currentTimeEndOnPan = (chartData.last?.time)!
//			}
			
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
	
	var chartType:String="today"
	
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
