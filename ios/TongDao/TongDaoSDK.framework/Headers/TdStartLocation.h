//
//  TdStartLocation.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/16.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import "TdLocationCallback.h"
#import "Singleton.h"
@interface TdStartLocation : NSObject<CLLocationManagerDelegate>
singleton_interface(TdStartLocation)
@property(nonatomic,strong)CLLocationManager* manager;
@property(nonatomic)id<TdLocationCallback>tdLocationCallback;
@property(nonatomic,assign)BOOL isFistLocationManager;

-(void)start:(id<TdLocationCallback>)tdLocationCallback;
@end
