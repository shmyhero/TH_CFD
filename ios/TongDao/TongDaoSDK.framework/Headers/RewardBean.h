//
//  RewardBean.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/8.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface RewardBean : NSObject

@property (nonatomic,assign)NSInteger rid;
@property (nonatomic,copy)NSString* name;
@property (nonatomic,copy)NSString* sku;
@property (nonatomic,assign)NSInteger quantity;

@end
