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


RCT_EXPORT_METHOD(setUserId:(NSString *)userId)
{
	[TongDao setUserId:userId];
}

RCT_EXPORT_METHOD(setUserName:(NSString *)name)
{
	[[TongDaoUiCore sharedManager] identifyUserName:name];
}

RCT_EXPORT_METHOD(setPhoneNumber:(NSString *)phoneNumber)
{
	[[TongDaoUiCore sharedManager] identifyPhone:phoneNumber];
}

RCT_EXPORT_METHOD(setAvatarlUrl:(NSString *)url)
{
	[[TongDaoUiCore sharedManager] identifyAvatar:url];
}


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

RCT_EXPORT_METHOD(trackRegistration)
{
	[[TongDaoUiCore sharedManager] trackRegistration];
}

@end
