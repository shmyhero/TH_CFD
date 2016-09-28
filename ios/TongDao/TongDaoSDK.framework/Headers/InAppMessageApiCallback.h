//
//  InAppMessageApiCallback.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/14.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ApiCallBack.h"
#import "OnDownloadInAppMessageListener.h"
@interface InAppMessageApiCallback : NSObject<ApiCallBack>
@property(nonatomic)id<OnDownloadInAppMessageListener>delegate;

-(id)initWithDownloadInAppMessageListener:(id<OnDownloadInAppMessageListener>)delegate;
@end
