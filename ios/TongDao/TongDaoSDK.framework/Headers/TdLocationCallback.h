//
//  TdLocationCallback.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/14.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol TdLocationCallback <NSObject>
-(void)onSuccess:(NSMutableDictionary*)locDic;
@end
