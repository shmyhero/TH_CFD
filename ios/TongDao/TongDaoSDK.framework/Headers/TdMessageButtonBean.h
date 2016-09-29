//
//  TdMessageButtonBean.h
//  TongDaoSDK
//
//  Created by bin jin on 15/8/11.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TdMessageButtonBean : NSObject
@property(nonatomic,assign)double rateX;
@property(nonatomic,assign)double rateY;
@property(nonatomic,assign)double rateW;
@property(nonatomic,assign)double rateH;
@property(nonatomic,copy)NSString* actionType;
@property(nonatomic,copy)NSString* actionValue;

-(instancetype)initWithX:(double)rateX Y:(double)rateY W:(double)rateW H:(double)rateH actionType:(NSString*)actionType actionValue:(NSString*)actionValue;
-(double)getRateX;
-(double)getRateY;
-(double)getRateW;
-(double)getRateH;
-(NSString*)getActionType;
-(NSString*)getActionValue;
@end
