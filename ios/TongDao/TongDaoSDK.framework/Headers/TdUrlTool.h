//
//  TdUrlTool.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/15.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TdUrlTool : NSObject

+(NSString*)getEventsUrl;
+(NSString*)getPageUrl:(NSInteger)landingPageId userId:(NSString*)userId;
+(NSString*)getInAppMessageUrl:(NSString*)userId;

@end
