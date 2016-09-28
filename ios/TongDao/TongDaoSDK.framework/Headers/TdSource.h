//
//  TdSource.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/8.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TdSource : NSObject

///设置广告Id
@property(nonatomic,copy)NSString* advertisementId;
///设置广告群组Id
@property(nonatomic,copy)NSString* advertisementGroupId;
///设置来源Id
@property(nonatomic,copy)NSString* campaignId;
///设置活动Id
@property(nonatomic,copy)NSString* sourceId;


-(id)initWithAdvertisementId:(NSString*)advertisementId advertisementGroupId:(NSString*)advertisementGroupId campaignId:(NSString*)campaignId sourceId:(NSString*)sourceId;

@end
