//
//  OnErrorListener.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/14.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ErrorBean.h"
@protocol OnErrorListener <NSObject>
-(void)onError:(ErrorBean*)errorBean;
@end
