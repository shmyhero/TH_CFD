//
//  RCTTongDao.m
//  TH_CFD
//
//  Created by william on 16/9/28.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTTongDao.h"
#import <TongDaoUILibrary/TongDaoUiCore.h>

@implementation RCTTongDao

RCT_EXPORT_MODULE(TongDaoAPI)

RCT_EXPORT_METHOD(trackUserProfile:(NSDictionary *)profile)
{
	[[TongDaoUiCore sharedManager] identify:profile];
}

RCT_EXPORT_METHOD(trackEvent:(NSString *)eventName value:(NSDictionary *)values)
{
	if (values == nil) {
		[[TongDaoUiCore sharedManager]trackWithEventName:eventName];
	}
	else {
		[[TongDaoUiCore sharedManager] trackWithEventName:eventName andValues:values];
	}
}
@end
