//
//  PageBean.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/8.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RewardBean.h"
@interface PageBean : NSObject

@property (nonatomic,copy)NSString* image;
@property (nonatomic,retain)NSMutableArray* rewards;

-(NSString*)getPageImage;
-(NSMutableArray*)getTdRewards;

@end
