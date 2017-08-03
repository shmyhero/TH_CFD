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
		self.isUserInteractionEnabled = true
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
	func pan(_ sender: UIPanGestureRecognizer) {
		if dataSource != nil {
			let translation : CGPoint = sender.translation(in: self)
			dataSource!.panTranslation(translation, isEnd: sender.state == UIGestureRecognizerState.ended)
//			dataSource!.calculateData()
			self.setNeedsDisplay()
		}
	}
	
	func pinch(_ sender: UIPinchGestureRecognizer) {
		if dataSource != nil {
			let scale : CGFloat = sender.scale
			dataSource!.pinchScale(scale, isEnd: sender.state == UIGestureRecognizerState.ended)
//			dataSource!.calculateData()
			self.setNeedsDisplay()
		}
	}
	
    func tap(_ sender: UITapGestureRecognizer) {
        if colorType == 0 && Orientation.getOrientation() == .portrait || Orientation.getOrientation() == .portraitUpsideDown {
            let delegate:AppDelegate! = UIApplication.shared.delegate as! AppDelegate
            delegate!.nativeData!.send(toRN: "chart_clicked", data: nil)
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
    
    var isPrivate:Bool=false {
        willSet {
            print("set isPrivate:", isPrivate)
            dataSource?.addSetting("Private", value: self.isPrivate as AnyObject)
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
        else if self.data == "undefined" {
            dataSource = BaseDataSource.init(json: "", rect: self.bounds)
            dataSource?.setChartType(chartType)
//            dataSource?.calculateData()
            self.setNeedsDisplay()
        }
        else {
            if CandleChartDataSource.isValidData(data!) {
                dataSource = CandleChartDataSource.init(json:data!, rect: self.bounds)
            }
            else if YieldLineChartDataSource.isValidData(data!) {
                dataSource = YieldLineChartDataSource.init(json:data!, rect: self.bounds)
                self.isUserInteractionEnabled = false
                dataSource?.addSetting("private", value: self.isPrivate as AnyObject)
            }
            else if LineChartDataSource.isValidData(data!) {
                dataSource = LineChartDataSource.init(json:data!, rect: self.bounds)
            }
            else {
                dataSource = BaseDataSource.init(json: data!, rect: self.bounds)
            }
           
            dataSource?.setChartType(chartType)
//            dataSource?.calculateData()
            self.setNeedsDisplay()
        }
    }
	
    
	override func didMoveToWindow() {
		if dataSource?._rect == CGRect.zero {
			// sometimes when the data is updated, the view do not finished inited.
			// so need to recalculate again.
			dataSource?._rect = self.bounds
//			dataSource?.calculateData()
		}
	}
	
// MARK: render
	override func draw(_ rect: CGRect) {
		// draw line chart
		let context:CGContext! = UIGraphicsGetCurrentContext()
		if dataSource == nil || dataSource!.isEmpty() {
			// no data, only draw box
			render = BaseRender.init(view: self)
			render!.render(context)
		} else {
            dataSource!.calculateData(rect)
			if dataSource!.isKind(of: CandleChartDataSource.self) {
				render = CandleChartRender.init(view: self)
				render!.render(context)
			}
            else if dataSource!.isKind(of: YieldLineChartDataSource.self) {
                render = YieldLineChartRender.init(view: self)
                render!.render(context)
            }
			else {
				render = LineChartRender.init(view: self)
				render!.render(context)
			}
		}
	}

}
