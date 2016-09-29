//
//  TongDaoApi.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/14.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ApiCallBack.h"
#import "OnDownloadPageListener.h"
#import "OnDownloadInAppMessageListener.h"
#import "ApiCallBackForOpenMessage.h"
#define ErrorInfos @[@"检查网络!",@"没有注册错误监听器!",@"没有成功注册监听器!",@"JSON解析失败!"]
#define API_METHOD @[@"GET",@"POST",@"PUT",@"DELETE"]
typedef enum {
    errorMessageNet=0,
    errorMessageRegister,
    notRegisterDownloadListenner,
    errorMessageJson,
    errorNet1002=1002,
    errorNet500=500
}ErrorInfos1;
typedef enum {
    GET=0,
    POST,
    PUT,
    DELETE,
}API_METHOD1;
typedef struct API_METHOD2 Api_method;
@interface TongDaoApi : NSObject
+(void)downloadPage:(NSInteger)pageId downloadListener:(id<OnDownloadPageListener>)downloadListener;
+(void)downloadInAppMessage:(id<OnDownloadInAppMessageListener>)inAppMessageListener;
+(void)postEvents:(id)data callBack:(id<ApiCallBack>)callBack;
+(void)postEvents:(id)data callBackForOpenMessage:(id<ApiCallBackForOpenMessage>)callBack;
@end
