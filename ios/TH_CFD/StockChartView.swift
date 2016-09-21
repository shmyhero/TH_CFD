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
	
	var chartDataJson: String! = ""
	var chartCategory: String! = "Line"
	
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
	
	var colorSet:ColorSet = ColorSet()
	var render:BaseRender?
	var dataSource:BaseDataSource?

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
			
			dataSource?.calculateData()
			self.setNeedsDisplay()
			if (sender.state == UIGestureRecognizerState.Ended) {
				if(panPeriod > -1) {
					panPeriod = 0
				}
				lastPanPeriod = panPeriod
			}
		}
	}
	
// MARK: deal with raw data from RN
	var data:String? { // use for RN manager
		willSet {
			if (newValue != nil) {
				if (chartType != "5m"){
					dataSource = LineChartDataSource.init(json:newValue!, rect: self.bounds, view:self)
				}
			}
			
			self.chartDataJson = newValue
			self.chartData = ChartDataManager.singleton.chartDataFromJson(self.chartDataJson)
			if panPeriod > -1 && chartData.count > 0 && lastPanPeriod == 0 {
				// using 2 point as get end mark
				currentTimeEndOnPan = (chartData.last?.time)!
			}
			dataSource?.calculateData()
			self.setNeedsDisplay()
		}
	}
	
	var colorType:Int=0 {
		willSet {
			colorSet = ColorSet.init(type: colorType)
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
	
// MARK: render
	override func drawRect(rect: CGRect) {
		if (self.pointData.isEmpty) {
			dataSource?.calculateData()
		}
		// draw line chart
		let context:CGContext! = UIGraphicsGetCurrentContext()
		if self.chartData.isEmpty {
			// no data, only draw box
			render = BaseRender.init(view: self, rect: rect)
			render!.render(context)
		} else {
			if (self.chartCategory == "Candles") {
				render = CandleChartRender.init(view: self, rect: rect)
				render!.render(context)
			}
			else {
				render = LineChartRender.init(view: self, rect: rect)
				render!.render(context)
				render?.dataProvider = dataSource
			}
		}
	}

}
