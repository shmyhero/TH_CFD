//
//  StockChartViewManager.m
//  TH_CFD
//
//  Created by william on 16/3/24.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "StockChartViewManager.h"
#import "TH_CFD-Swift.h"

@implementation StockChartViewManager

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(chartType, NSString)
RCT_EXPORT_VIEW_PROPERTY(data, NSString)
RCT_EXPORT_VIEW_PROPERTY(colorType, NSInteger)

- (UIView *)view
{
	StockChartView * theView;
	theView = [[StockChartView alloc] init];
	return theView;
}
@end
