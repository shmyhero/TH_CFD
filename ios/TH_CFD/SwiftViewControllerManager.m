//
//  SwiftViewControllerManager.m
//  TH_CFD
//
//  Created by william on 16/3/17.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "SwiftViewControllerManager.h"
#import "TH_CFD-swift.h"

@implementation SwiftViewControllerManager

RCT_EXPORT_MODULE();

- (void) showEditOwnStocks
{
	UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
	EditOwnStocksViewController *vc = [storyboard instantiateViewControllerWithIdentifier:@"EditOwnStocksViewController"];
	AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
	[delegate.rnRootViewController presentViewController:vc animated:YES completion:nil];
}

#pragma mark RCT_EXPORT

RCT_EXPORT_METHOD(showEditStocksView) {
	[self showEditOwnStocks];
}
@end
