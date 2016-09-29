//
//  TdProduct.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/8.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TdProduct : NSObject

///设置产品的Id
@property(nonatomic,copy)NSString* productId;
///设置产品的SKU
@property(nonatomic,copy)NSString* sku;
///设置产品的名称
@property(nonatomic,copy)NSString* name;
///设置产品的价格
@property(nonatomic,assign)float price;
///设置产品的类别
@property(nonatomic,copy)NSString* category;
///设置产品的货币单位
@property(nonatomic,copy)NSString* currency;

-(id)initWithProductId:(NSString*)productId sku:(NSString*)sku name:(NSString*)name price:(float)price currency:(NSString*)currency category:(NSString*)category;

@end
