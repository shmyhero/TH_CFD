//
//  NativeData.m
//  TH_CFD
//
//  Created by william on 16/3/17.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "NativeData.h"
#import "TH_CFD-swift.h"

@implementation NativeData

RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;

+ (id)sharedInstance {
	static NativeData *sharedInstance = nil;
	static dispatch_once_t onceToken;
	dispatch_once(&onceToken, ^{
		sharedInstance = [[self alloc] init];
	});
	return sharedInstance;
}

- (void)receiveDataFromRN:(NSString *)dataName data:(NSString *)jsonData
{
	StockDataManager *manager = [StockDataManager sharedInstance];
	[manager loadOwnStocksData:jsonData];
}

- (void)sendDataToRN:(NSString *)dataName data:(NSString *)jsonData
{
//	[self.bridge.eventDispatcher sendAppEventWithName:@"nativeSendDataToRN" body:jsonData];
	[self.bridge.eventDispatcher sendDeviceEventWithName:@"nativeSendDataToRN" body:@[dataName, jsonData]];
}

#pragma mark RCT_EXPORT
RCT_EXPORT_METHOD(passDataToNative:(NSString *)dataName data:(NSString *)jsonData) {
	[self receiveDataFromRN:dataName data:jsonData];
}


@end
