//
//  BaseRender.swift
//  TH_CFD
//
//  Created by william on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

class BaseRender: NSObject {

//	var _rect:CGRect = CGRectMake(0, 0, 0, 0)
	var _segment = 6
	var _colorSet:ColorSet
	var _renderView:StockChartView
	weak var dataProvider:BaseDataProvider?
	var _margin:CGFloat = 0.0
	var _topMargin:CGFloat = 0.0
	var _bottomMargin:CGFloat = 0.0
    var _rightPadding:CGFloat = 0.0

	init(view:StockChartView) {
		_renderView = view
		_colorSet = view.colorSet
		dataProvider = view.dataSource
		super.init()
    }

    // these 2 functions should only used in base render.
    // In its child class, these data should be called from its data source.
    func chartWidth() -> CGFloat {
        if AppDelegate.isPortrait() {
            return _renderView.bounds.width
        }
        else {
            return _renderView.bounds.width - 70
        }
    }

    func chartHeight() -> CGFloat {
        return _renderView.bounds.height
    }


	func render(_ context: CGContext) {
		if let dataProvider = dataProvider {
			_margin = dataProvider.margin()
			_topMargin = dataProvider.topMargin()
			_bottomMargin = dataProvider.bottomMargin()
            _rightPadding = dataProvider.rightPadding()
		}
		self.drawBorderLines(context, lineColor: _colorSet.getBgLineColor())
//        self.drawHorizontalLines(context)
		self.drawExtraText(context)
	}

    func drawBorderLines(_ context: CGContext, lineColor: UIColor) -> Void {
		let width = chartWidth()
		let height = chartHeight()
		//Draw horizontal graph lines on the top of everything
		let linePath = UIBezierPath()
		context.saveGState()

		//top line
		linePath.move(to: CGPoint(x:_margin, y: _topMargin + 0.5))
        linePath.addLine(to: CGPoint(x: width - _margin, y:_topMargin + 0.5))
//        print("top lineY:",_topMargin)

		//bottom line
		linePath.move(to: CGPoint(x:_margin-0.5, y:height - _bottomMargin + 0.5))
        linePath.addLine(to: CGPoint(x:width - _margin+0.5, y:height - _bottomMargin + 0.5))
//        print("bottom lineY:", height - _bottomMargin)

		//left line
		linePath.move(to: CGPoint(x:_margin - 0.5, y: _topMargin))
		linePath.addLine(to: CGPoint(x:_margin - 0.5, y:height - _bottomMargin))

		//right line
		linePath.move(to: CGPoint(x:width - _margin + 0.5, y:_topMargin))
		linePath.addLine(to: CGPoint(x:width - _margin + 0.5, y:height - _bottomMargin))

//        if(lineColor == UIColor.whiteColor()) {
//            _colorSet.bgLineColor.setStroke()
//        }
//        else {
            lineColor.setStroke()
//        }
		linePath.lineWidth = 1
		linePath.stroke()

		context.restoreGState()

        self.drawHorizontalLines(context)
	}

    func drawHorizontalLines(_ context: CGContext) -> Void {
        let width = chartWidth()
        let height = chartHeight()
        //Draw horizontal graph lines on the top of everything
        let linePath = UIBezierPath()
        context.saveGState()
        if !AppDelegate.isPortrait() {
            // landscape mode have horizontal lines
            let hnum = _segment
            for i in 1..<hnum {
                let lineY = round(_topMargin + (height - _bottomMargin - _topMargin) / CGFloat(hnum) * CGFloat(i))
                linePath.move(to: CGPoint(x:_margin, y: lineY + 0.5))
                linePath.addLine(to: CGPoint(x: width - _margin, y:lineY + 0.5))
            }
        }
        _colorSet.getBgLineColor().setStroke()
        linePath.lineWidth = 1
        linePath.stroke()

        context.restoreGState()
    }

	func drawExtraText(_ context:CGContext) -> Void {
		if dataProvider == nil {
			return
		}

        let maxPrice = dataProvider!.maxPrice()
        let minPrice = dataProvider!.minPrice()
        if (maxPrice.isNaN || minPrice.isNaN) {
            return
        }
        let height = chartHeight()
        let width = chartWidth()

        if AppDelegate.isPortrait() {
            // portrait mode
            // draw min/max text
            let textWidth:CGFloat = 40.0
            let textColor = _colorSet.minmaxColor
            let textFont = UIFont(name: "Helvetica Neue", size: 8)
            let textStyle = NSMutableParagraphStyle()
            textStyle.alignment = .left
            let attributes: [String:AnyObject] = [
                NSForegroundColorAttributeName: textColor,
                NSFontAttributeName: textFont!,
                NSParagraphStyleAttributeName: textStyle,
                ]

            var maxText: NSString = "\(maxPrice)" as NSString
            var minText: NSString = "\(minPrice)" as NSString
            var textX = _margin+5
            let textHeight:CGFloat = 10
            maxText.draw(in: CGRect(x: textX, y: _topMargin+5, width: textWidth, height: textHeight), withAttributes: attributes)
            minText.draw(in: CGRect(x: textX, y: height-_bottomMargin-textHeight-5, width: textWidth, height: textHeight), withAttributes: attributes)

            let maxPercent = dataProvider!.maxPercent()
            let minPercent = dataProvider!.minPercent()
            if (maxPercent.isNaN || minPercent.isNaN) {
                return
            }

            textStyle.alignment = .right
            maxText = NSString(format: "%.2f%%", maxPercent)
            minText = NSString(format: "%.2f%%", minPercent)
            textX = width-_margin-5-textWidth

            maxText.draw(in: CGRect(x: textX, y: _topMargin+5, width: textWidth, height: textHeight), withAttributes: attributes)
            minText.draw(in: CGRect(x: textX, y: height-_bottomMargin-textHeight-5, width: textWidth, height: textHeight), withAttributes: attributes)
        }
        else {
            // landscape
            let textWidth:CGFloat = dataProvider!.rightPadding()
            let textColor = _colorSet.rightTextColor
            let textFont = UIFont(name: "Helvetica Neue", size: 14)
            let textStyle = NSMutableParagraphStyle()
            textStyle.alignment = .left
            let attributes: [String:AnyObject] = [
                NSForegroundColorAttributeName: textColor,
                NSFontAttributeName: textFont!,
                NSParagraphStyleAttributeName: textStyle,
                ]

            let segmentNumber = _segment
            let n = max(minPrice.decimalPlace(), maxPrice.decimalPlace()) + 1
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
	}

}
