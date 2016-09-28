//
//  TdMessageBean.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/8.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TdMessageButtonBean.h"
@interface TdMessageBean : NSObject

///获得应用消息
@property(nonatomic,copy)NSString* message;
///获得应用消息显示的时间
@property(nonatomic,assign)NSNumber* displayTime;
///获得应用消息的显示位置
@property(nonatomic,copy)NSString* layout;
///获得应用消息的来源
@property(nonatomic,copy)NSString* actionType;
///获得点击应用消息时的链接地址
@property(nonatomic,copy)NSString* actionValue;
///获得点击应用消息时的图片链接地址
@property(nonatomic,copy)NSString* imageUrl;
///获得应用消息的messageId
@property(nonatomic,retain)NSNumber* mid;
///获得应用消息的CampainId
@property(nonatomic,retain)NSNumber* cid;
///
@property(nonatomic,strong)NSMutableArray* buttons;
///
@property(nonatomic,copy)NSString* closeBtn;
///
@property(nonatomic,assign)BOOL isPortrait;

-(id)initWithImageUrl:(NSString*)imageUrl message:(NSString*)message displayTime:(NSNumber*)displayTime layout:(NSString*)layout actionType:(NSString*)actionType actionValue:(NSString*)actionValue mid:(NSNumber*)mid cid:(NSNumber*)cid;

@end
