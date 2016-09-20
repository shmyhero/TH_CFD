//
//  CandleChartRender.swift
//  TH_CFD
//
//  Created by william on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

class CandleChartRender: BaseRender {
	
	override func render(context: CGContext) {
		self.drawBorderLines(context)
	}
}
