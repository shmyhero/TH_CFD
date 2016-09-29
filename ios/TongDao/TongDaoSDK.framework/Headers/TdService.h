//
//  TdService.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/16.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Singleton.h"
#import "TdLocationCallback.h"
#import "ApiCallBack.h"
#import "TdEventBean.h"
#import "ApiCallBackForOpenMessage.h"
#import "JXMutableArray.h"
#import "TongDao.h"
@interface TdService : NSObject<TdLocationCallback,ApiCallBack,ApiCallBackForOpenMessage>
singleton_interface(TdService)

@property(atomic)NSArray* failTrackList;
@property(atomic,assign)BOOL isFailed;
@property(atomic,assign)TongDaoinitData ignoreInfor;

-(void)sendInitialData;

-(void)sendInitialDataAndIgnore:(TongDaoinitData)ingnoreInfor;

-(void)sendTrackEvent:(TdEventBean*)tdEventBean;

-(void)sendOpenMessageTrackEvent:(TdEventBean*)tdEventBean;
@end
