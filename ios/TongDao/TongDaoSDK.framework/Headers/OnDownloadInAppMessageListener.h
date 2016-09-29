//
//  OnDownloadInAppMessageListener.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/14.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TdMessageBean.h"
#import "ErrorBean.h"
@protocol OnDownloadInAppMessageListener <NSObject>
-(void)onInAppMessageSuccess:(NSArray*)tdMessageBeanList;
-(void)onError:(ErrorBean*)errorBean;
@end
