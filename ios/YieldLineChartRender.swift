//
//  YieldLineChartRender.swift
//  TH_CFD
//
//  Created by william on 2017/4/13.
//  Copyright © 2017年 Facebook. All rights reserved.
//

class YieldLineChartRender: BaseRender {
    weak var lineDataProvider: YieldLineChartDataProvider?
    
    override init(view:StockChartView) {
        super.init(view: view)
        lineDataProvider = dataProvider as? YieldLineChartDataProvider
        _segment = 4
    }
    
    override func chartWidth() -> CGFloat {
        return _renderView.bounds.width - 50
    }
    
    override func render(context: CGContext) {
        if (lineDataProvider == nil) {
            return
        } else {
            _margin = dataProvider!.margin()
            _topMargin = dataProvider!.topMargin()
            _bottomMargin = dataProvider!.bottomMargin()
            _rightPadding = dataProvider!.rightPadding()
        }
        let pointData = lineDataProvider!.pointData()
        if(pointData.count == 0){
            // should not occurred.
            print ("Alert, should not happen!")
            return
        }
        
        self.drawBorderLines(context, lineColor: _colorSet.yieldBgLineColor)
        self.drawExtraText(context)
        
        let width = lineDataProvider!.chartWidth()
        let height = lineDataProvider!.chartHeight()
        
        // draw the line graph
        _colorSet.yieldLineColor.setFill()
        _colorSet.yieldLineColor.setStroke()
        
        //set up the points line
        let graphPath = UIBezierPath()
        //go to start of line
        graphPath.moveToPoint(pointData[0])
        
        //add points for each item in the graphPoints array
        //at the correct (x, y) for the point
        for i in 1..<pointData.count {
            let nextPoint = pointData[i]
            graphPath.addLineToPoint(nextPoint)
        }
        
        CGContextSaveGState(context)
        
        let clippingPath = graphPath.copy() as! UIBezierPath
        
        //3 - add lines to the copied path to complete the clip area
        clippingPath.addLineToPoint(CGPoint(
            x: pointData.last!.x,
            y:height))
        clippingPath.addLineToPoint(CGPoint(
            x: pointData[0].x,
            y:height))
        clippingPath.closePath()
        
        //4 - add the clipping path to the context
        clippingPath.addClip()
        
        let clippingBox:UIBezierPath = UIBezierPath.init(rect: CGRect(x: _margin-1, y: _topMargin-1, width: width-_margin*2+2, height: height-_bottomMargin-_topMargin+2))
        clippingBox.addClip()
        
        CGContextSaveGState(context)
        clippingBox.addClip()
        
        //draw the line on top of the clipped gradient
        graphPath.lineWidth = 2.0
        graphPath.stroke()
        
        CGContextRestoreGState(context)
        
    }
    
    override func drawExtraText(context:CGContext) -> Void {
        if (lineDataProvider == nil) {
            return
        }
        let width = lineDataProvider!.chartWidth()
        let height = lineDataProvider!.chartHeight()
        let dateFormatter = NSDateFormatter()
        let textWidth:CGFloat = 50.0
        
        dateFormatter.dateFormat = "YY-MM-dd"
        let timeStart:NSDate = (lineDataProvider!.firstTime())!
        let timeEnd:NSDate = (lineDataProvider!.lastTime())!
        
        let leftText: NSString = dateFormatter.stringFromDate(timeStart)
        let rightText = dateFormatter.stringFromDate(timeEnd)
        let textColor = _colorSet.yieldDateTextColor
        let textFont = UIFont(name: "Helvetica Neue", size: 9)
        let textStyle = NSMutableParagraphStyle()
        textStyle.alignment = .Center
        let attributes: [String:AnyObject] = [
            NSForegroundColorAttributeName: textColor,
            //			NSBackgroundColorAttributeName: UIColor.blackColor(),
            NSFontAttributeName: textFont!,
            NSParagraphStyleAttributeName: textStyle,
            ]
        let textY = height-_bottomMargin+2
        leftText.drawInRect(CGRect(x: 0, y: textY, width: textWidth, height: 10), withAttributes: attributes)
        rightText.drawInRect(CGRect(x: width-textWidth, y: textY, width: textWidth, height: 10), withAttributes: attributes)
        
        var lastX:CGFloat = textWidth/2	//center x of last text
        let verticalLinesX = lineDataProvider!.xVerticalLines()
        let verticalTimes = lineDataProvider!.timesOnBottom()
        for i in 0..<verticalTimes.count {
            if verticalLinesX[i] < lastX+textWidth-5 || verticalLinesX[i]>width-textWidth*1.5+8 {
                continue
            }
            let text:NSString = dateFormatter.stringFromDate(verticalTimes[i])
            let rect = CGRect(x: verticalLinesX[i]-textWidth/2, y: textY, width: textWidth, height: 10)
            text.drawInRect(rect, withAttributes: attributes)
            lastX = verticalLinesX[i]
        }
        
        self.drawRightText(context)
//        super.drawExtraText(context)
    }
    
    func drawRightText(context: CGContext) {
        let maxPrice = dataProvider!.maxPrice()
        let minPrice = dataProvider!.minPrice()
        if (maxPrice.isNaN || minPrice.isNaN) {
            return
        }
        let height = chartHeight()
        let width = chartWidth()
        
        let textWidth:CGFloat = dataProvider!.rightPadding()
        let textColor = _colorSet.yieldDateTextColor
        let textFont = UIFont(name: "Helvetica Neue", size: 10)
        let textStyle = NSMutableParagraphStyle()
        textStyle.alignment = .Left
        let attributes: [String:AnyObject] = [
            NSForegroundColorAttributeName: textColor,
            NSFontAttributeName: textFont!,
            NSParagraphStyleAttributeName: textStyle,
            ]
        
        let segmentNumber = _segment
        let n = 2// max(minPrice.decimalPlace(), maxPrice.decimalPlace()) + 1
        for i in 0 ..< segmentNumber+1 {
            // render from bottom to top
            let price: Double = (maxPrice-minPrice) / Double(segmentNumber) * Double(i) + minPrice
            let text: NSString = "\(price.roundTo(n))"
            let textX = chartWidth()
            let textHeight:CGFloat = 14
            let textY = round(height - (height - _bottomMargin - _topMargin - textHeight) / CGFloat(segmentNumber) * CGFloat(i)) - _bottomMargin - textHeight
            text.drawInRect(CGRect(x: textX, y: textY, width: textWidth, height: textHeight), withAttributes: attributes)
        }
    }
}

