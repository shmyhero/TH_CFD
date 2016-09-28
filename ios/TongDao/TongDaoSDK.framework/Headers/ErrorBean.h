//
//  ErrorBean.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/8.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ErrorBean : NSObject

@property (nonatomic,assign)NSInteger errorCode;
@property (nonatomic,copy)NSString* errorMsg;

/**
  返回错误代码号
 
 :returns: error code: int
 */
-(NSInteger)getTdErrorCode;

/**
  返回错误信息
 
 :returns: error string
 */
-(NSString*)getTdErrorMsg;
/**
 设置错误信息
 */
-(void)setTdErrorMsg:(NSString*)errorMsg;
/**
 设置错误代码号
 */
-(void)setTdErrorCode:(NSInteger)errorCode;

@end
