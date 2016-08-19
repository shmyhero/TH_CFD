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
		MQChatViewStyle *style = chatViewManager.chatViewStyle;
		style.statusBarStyle = UIStatusBarStyleLightContent;
		style.navBarColor = [UIColor colorWithHex:0x1962dd];
		style.navBarTintColor = [UIColor whiteColor];
		style.navTitleColor = [UIColor whiteColor];
		style.navTitleFont = [UIFont systemFontOfSize:18];
		style.navBackButtonImage = [UIImage imageNamed:@"back"];
		style.enableRoundAvatar = YES;
//		style.enableOutgoingAvatar = YES;
		style.backgroundColor = [UIColor colorWithHex:0xf0f0f0];
		style.incomingBubbleColor = [UIColor whiteColor];
		style.incomingMsgTextColor = [UIColor blackColor];
		style.outgoingBubbleColor = [UIColor colorWithHex:0xcef2ff];
		style.outgoingMsgTextColor = [UIColor blackColor];
		
		[chatViewManager setChatViewStyle:style];
		[chatViewManager enableEvaluationButton:NO];
		[chatViewManager setNavTitleText: @"盈盈在线"];
		[chatViewManager enableMessageSound:NO];
		
		AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
		MQChatViewController* viewController = [chatViewManager pushMQChatViewControllerInViewController:delegate.rnRootViewController];
		viewController.navigationController.navigationBar.translucent = NO;
	}
}

#pragma mark RCT_EXPORT

RCT_EXPORT_METHOD(launchNativeScene:(NSString *)sceneName) {
	[self showScene:sceneName];
}
@end
