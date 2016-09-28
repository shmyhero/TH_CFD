//
//  ApiCallBackForOpenMessage.h
//  TongDaoSDK
//
//  Created by bin jin on 15/8/7.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol ApiCallBackForOpenMessage <NSObject>
-(void)onResult:(NSHTTPURLResponse*)httpRes dataForOpenMessage:(NSData*)data sendData:(id)sendData;
@end
