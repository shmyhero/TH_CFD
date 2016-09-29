//
//  TdOrder.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/8.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TdOrder : NSObject

///设置交易Id
@property(nonatomic,copy)NSString* orderId;
///设置交易总价
@property(nonatomic,assign)float total;
///设置交易收益
@property(nonatomic,assign)float revenue;
///设置运输费用
@property(nonatomic,assign)float shipping;
///设置税费
@property(nonatomic,assign)float tax;
///设置折扣具体金额
@property(nonatomic,assign)float discount;
///设置订货单Id
@property(nonatomic,copy)NSString* couponId;
///设置交易的货币单位
@property(nonatomic,copy)NSString* currency;
///设置交易的订单列表
@property(nonatomic,retain)NSArray* orderList;

-(id)initWithOrderId:(NSString*)orderId total:(float)total revenue:(float)revenu shipping:(float)shipping  tax:(float)tax discount:(float)discount couponId:(NSString*)couponId currency:(NSString*)currency orderList:(NSArray*)orderList;


@end
