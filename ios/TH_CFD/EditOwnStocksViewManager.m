//
//  EditOwnStocksViewManager.m
//  TH_CFD
//
//  Created by william on 16/8/29.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "EditOwnStocksViewManager.h"
#import "EditOwnStocksView.h"

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "UIView+React.h"

@interface EditOwnStocksView ()
@end

@implementation EditOwnStocksViewManager
{
	EditOwnStocksView *_editOwnStocksView;
}

RCT_EXPORT_MODULE(StockEditFragment);

- (UIView *)view
{
	_editOwnStocksView = [EditOwnStocksView new];
	_editOwnStocksView.manager = self;
	return _editOwnStocksView;
}

#pragma mark EditOwnStocksViewControllerDelegate
- (void) onClickEditAlert:(EditOwnStocksViewController *)sender alertData:(id)alertData
{
	[self.bridge.eventDispatcher sendInputEventWithName:@"TapAlertButton"
												   body:@{
														  @"target": _editOwnStocksView.reactTag,
														  @"data": alertData,
														  }];
}

- (NSArray<NSString *> *)customBubblingEventTypes {
	return @[
			 @"TapAlertButton",
			 ];
}
@end
