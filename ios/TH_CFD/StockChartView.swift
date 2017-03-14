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
    var tapGesture:UITapGestureRecognizer?

	override init(frame: CGRect) {
		super.init(frame: frame)
		// add touch function
		self.userInteractionEnabled = true
		panGesture = UIPanGestureRecognizer(target: self, action: #selector(StockChartView.pan(_:)))
		pinchGesture = UIPinchGestureRecognizer(target: self, action: #selector(StockChartView.pinch(_:)))
        tapGesture = UITapGestureRecognizer(target: self, action: #selector(StockChartView.tap(_:)))
		
		if panGesture != nil {
			self.addGestureRecognizer(panGesture!)
		}
		if pinchGesture != nil {
			self.addGestureRecognizer(pinchGesture!)
		}
        if tapGesture != nil {
            self.addGestureRecognizer(tapGesture!)
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
        if tapGesture != nil {
            self.removeGestureRecognizer(tapGesture!)
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
	
    func tap(sender: UITapGestureRecognizer) {
        if colorType == 0 && Orientation.getOrientation() == .Portrait || Orientation.getOrientation() == .PortraitUpsideDown {
            let delegate:AppDelegate! = UIApplication.sharedApplication().delegate as! AppDelegate
            delegate!.nativeData!.sendDataToRN("chart_clicked", data: nil)
        }
    }
    
// MARK: deal with raw data from RN
	var data:String?="undefined" { // use for RN manager
		willSet {
			print ("set data, current type:",self.chartType)
		}
        didSet {
            self.setupChartView()
        }
	}
	
	var colorType:Int=0 {
        willSet {
            // type 0 is detail view.
            // type 1 is open position view
			colorSet = ColorSet.init(type: newValue)
		}
	}
	
	var chartType:String="undefined" {
		willSet {
			print ("set chart type:", newValue)
//			self.setNeedsDisplay()
		}
        didSet {
            self.setupChartView()
        }
	}
    
    func setupChartView() {
        if self.chartType == "undefined" {
            return
        }
        else if self.data == "undefiend" {
            dataSource = BaseDataSource.init(json: "", rect: self.bounds)
            dataSource?.setChartType(chartType)
            dataSource?.calculateData()
            self.setNeedsDisplay()
        }
        else {
            print ("setup chart:", self.bounds)
            if CandleChartDataSource.isValidData(data!) {
                dataSource = CandleChartDataSource.init(json:data!, rect: self.bounds)
            }
            else if LineChartDataSource.isValidData(data!) {
                dataSource = LineChartDataSource.init(json:data!, rect: self.bounds)
            }
            else {
                dataSource = BaseDataSource.init(json: data!, rect: self.bounds)
            }
           
            dataSource?.setChartType(chartType)
            dataSource?.calculateData()
            self.setNeedsDisplay()
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
			render = BaseRender.init(view: self)
			render!.render(context)
		} else {
			if dataSource!.isKindOfClass(CandleChartDataSource) {
				render = CandleChartRender.init(view: self)
//				render?.dataProvider = dataSource
				render!.render(context)
			}
			else {
				render = LineChartRender.init(view: self)
//				render?.dataProvider = dataSource
				render!.render(context)
			}
		}
	}

}
