//
//  ApiCallBack.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/14.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol ApiCallBack <NSObject>
-(void)onResult:(NSHTTPURLResponse*)httpRes data:(NSData*)data sendData:(id)sendData;
@end
