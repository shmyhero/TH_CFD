//
//  TdOrderLine.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/8.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TdProduct.h"
@interface TdOrderLine : NSObject

///商品信息
@property(nonatomic,retain)TdProduct* product;
///商品个数
@property(nonatomic,assign)NSInteger quantity;

-(id)initWithProduct:(TdProduct*)product andQuantity:(NSInteger)quantity;

@end
