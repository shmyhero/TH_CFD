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
    
    override func render(_ context: CGContext) {
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
        
//        let width = lineDataProvider!.chartWidth()
//        let height = lineDataProvider!.chartHeight()
        
        // draw the line graph
        _colorSet.yieldLineColor.setFill()
        _colorSet.yieldLineColor.setStroke()
        
        //set up the points line
        let graphPath = UIBezierPath()
        //go to start of line
        graphPath.move(to: pointData[0])
        
        //add points for each item in the graphPoints array
        //at the correct (x, y) for the point
        for i in 1..<pointData.count {
            let nextPoint = pointData[i]
            graphPath.addLine(to: nextPoint)
        }
        
        context.saveGState()
        
        //draw the line on top of the clipped gradient
        graphPath.lineWidth = 2.0
        graphPath.stroke()
        
        context.restoreGState()
        
    }
    
    override func drawExtraText(_ context:CGContext) -> Void {
        if (lineDataProvider == nil) {
            return
        }
        let width = lineDataProvider!.chartWidth()
        let height = lineDataProvider!.chartHeight()
        let dateFormatter = DateFormatter()
        let textWidth:CGFloat = 50.0
        
        dateFormatter.dateFormat = "YY-MM-dd"
        let timeStart:Date = (lineDataProvider!.firstTime())! as Date
        let timeEnd:Date = (lineDataProvider!.lastTime())! as Date
        
        let leftText: NSString = dateFormatter.string(from: timeStart) as NSString
        let rightText = dateFormatter.string(from: timeEnd)
        let textColor = _colorSet.yieldDateTextColor
        let textFont = UIFont(name: "Helvetica Neue", size: 9)
        let textStyle = NSMutableParagraphStyle()
        textStyle.alignment = .center
        let attributes: [String:AnyObject] = [
            NSForegroundColorAttributeName: textColor,
            //			NSBackgroundColorAttributeName: UIColor.blackColor(),
            NSFontAttributeName: textFont!,
            NSParagraphStyleAttributeName: textStyle,
            ]
        let textY = height-_bottomMargin+2
        leftText.draw(in: CGRect(x: 0, y: textY, width: textWidth, height: 10), withAttributes: attributes)
        rightText.draw(in: CGRect(x: width-textWidth, y: textY, width: textWidth, height: 10), withAttributes: attributes)
        
        var lastX:CGFloat = textWidth/2	//center x of last text
        let verticalLinesX = lineDataProvider!.xVerticalLines()
        let verticalTimes = lineDataProvider!.timesOnBottom()
        for i in 0..<verticalTimes.count {
            if verticalLinesX[i] < lastX+textWidth-5 || verticalLinesX[i]>width-textWidth*1.5+8 {
                continue
            }
            let text:NSString = dateFormatter.string(from: verticalTimes[i] as Date) as NSString
            let rect = CGRect(x: verticalLinesX[i]-textWidth/2, y: textY, width: textWidth, height: 10)
            text.draw(in: rect, withAttributes: attributes)
            lastX = verticalLinesX[i]
        }
        
        self.drawRightText(context)

    }
    
    func drawRightText(_ context: CGContext) {
        var maxPrice = dataProvider!.maxPrice()
        var minPrice = dataProvider!.minPrice()
        if (maxPrice.isNaN || minPrice.isNaN) {
            return
        }
        if maxPrice == 0 && minPrice == 0 {
            maxPrice = 100
            minPrice = -100
        }
        let height = chartHeight()
//        let width = chartWidth()
        
        let textWidth:CGFloat = dataProvider!.rightPadding()
        let textColor = _colorSet.yieldDateTextColor
        let textFont = UIFont(name: "Helvetica Neue", size: 10)
        let textStyle = NSMutableParagraphStyle()
        textStyle.alignment = .left
        let attributes: [String:AnyObject] = [
            NSForegroundColorAttributeName: textColor,
            NSFontAttributeName: textFont!,
            NSParagraphStyleAttributeName: textStyle,
            ]
        
        let segmentNumber = _segment
        let n = 2// max(minPrice.decimalPlace(), maxPrice.decimalPlace()) + 1
        for i in 0 ..< segmentNumber+1 {
            // render from bottom to top
            var price: Double = (maxPrice-minPrice) / Double(segmentNumber) * Double(i) + minPrice
            let text: NSString = "\(price.roundTo(n))" as NSString
            let textX = chartWidth()
            let textHeight:CGFloat = 14
            let textY = round(height - (height - _bottomMargin - _topMargin - textHeight) / CGFloat(segmentNumber) * CGFloat(i)) - _bottomMargin - textHeight
            text.draw(in: CGRect(x: textX, y: textY, width: textWidth, height: textHeight), withAttributes: attributes)
        }
    }
    
    override func drawHorizontalLines(_ context: CGContext) -> Void {
        let width = chartWidth()
        let height = chartHeight()
        //Draw horizontal graph lines on the top of everything
        let linePath = UIBezierPath()
        context.saveGState()
        
        // horizontal lines
        let hnum = _segment
        for i in 1..<hnum {
            let lineY = round(_topMargin + (height - _bottomMargin - _topMargin) / CGFloat(hnum) * CGFloat(i))
//            print("lineY:",lineY)
            linePath.move(to: CGPoint(x:_margin, y: lineY + 0.5))
            linePath.addLine(to: CGPoint(x: width - _margin, y:lineY + 0.5))
        }
        
        _colorSet.bgLineColor.setStroke()
        linePath.lineWidth = 1
        linePath.stroke()
        
        context.restoreGState()
    }
}

