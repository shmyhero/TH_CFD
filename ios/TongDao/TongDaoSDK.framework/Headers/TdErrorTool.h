//
//  TdErrorTool.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/14.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ErrorBean.h"
#import "Singleton.h"
@interface TdErrorTool : NSObject
singleton_interface(TdErrorTool)
-(ErrorBean*)makeErrorBeanWithErrorCode:(NSInteger)errorCode andErrorMessage:(NSString*)errorMessage;
@end
