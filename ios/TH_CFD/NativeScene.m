//
//  SwiftViewControllerManager.m
//  TH_CFD
//
//  Created by william on 16/3/17.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "NativeScene.h"
#import "TH_CFD-swift.h"
#import "MQChatViewManager.h"

@implementation NativeScene

RCT_EXPORT_MODULE();

- (void) showScene:(NSString *)sceneName
{
	if ([sceneName isEqualToString:@"StockEditFragment"]) {
		//todo, map sceneName to view controller
		UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
		EditOwnStocksViewController *vc = [storyboard instantiateViewControllerWithIdentifier:@"EditOwnStocksViewController"];
		AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
		[delegate.rnRootViewController presentViewController:vc animated:YES completion:nil];
	}
	if([sceneName isEqualToString:@"MeiQia"]) {
		MQChatViewManager *chatViewManager = [[MQChatViewManager alloc] init];
		AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
		[chatViewManager pushMQChatViewControllerInViewController:delegate.rnRootViewController];
	}
}

#pragma mark RCT_EXPORT

RCT_EXPORT_METHOD(launchNativeScene:(NSString *)sceneName) {
	[self showScene:sceneName];
}
@end
