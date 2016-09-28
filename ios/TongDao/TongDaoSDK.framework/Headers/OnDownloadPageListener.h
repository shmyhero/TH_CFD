//
//  OnDownloadPageListener.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/14.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PageBean.h"
#import "ErrorBean.h"
#import "ApiCallBack.h"
@protocol OnDownloadPageListener <NSObject>
-(void)onPageSuccess:(PageBean*)pageBean;
-(void)onError:(ErrorBean*)errorBean;
@end
