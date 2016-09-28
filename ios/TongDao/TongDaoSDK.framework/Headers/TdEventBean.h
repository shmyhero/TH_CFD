//
//  TdEventBean.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/8.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
//#define ACTION_TYPE @[@"identify",@"track"]
typedef enum {
    identify,
    track,
    merge
}ACTION_TYPE;


@interface TdEventBean : NSObject

@property(nonatomic,assign)ACTION_TYPE action;
@property(nonatomic,copy)NSString* userId;
@property(nonatomic,copy)NSString* event;
@property(nonatomic,retain)NSDictionary* properties;
@property(nonatomic,copy)NSString* timestamp;


-(id)initWithaction:(ACTION_TYPE)action event:(NSString*)event andProperties:(NSDictionary*)properties;

-(NSMutableDictionary*)getJsonObject;

@end
