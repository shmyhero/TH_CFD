//
//  PageApiCallback.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/14.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ApiCallBack.h"
#import "OnDownloadPageListener.h"
@interface PageApiCallback : NSObject<ApiCallBack>
@property(nonatomic)id<OnDownloadPageListener>delegate;

-(id)initWithDownloadPageListener:(id<OnDownloadPageListener>)delegate;
@end
