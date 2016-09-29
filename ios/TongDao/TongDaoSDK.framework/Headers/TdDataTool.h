//
//  TdDataTool.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/8.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Singleton.h"
#import "TdLocationCallback.h"
#import "TdSource.h"
#import "TdProduct.h"
#import "TdOrder.h"
@interface TdDataTool : NSObject

singleton_interface(TdDataTool)
-(NSString*)generateUserId;

-(void)saveUuidAndKey:(NSString*)appKey userID:(NSString*)userId;

-(void)saveAnonymous:(BOOL)isAnonymous;

-(BOOL)getAnonymous;

-(NSString*)getAppKey;

-(NSString*)getAppURL;

-(NSString*)getUUID;

-(NSMutableArray*)getDeviceInfo;

-(NSString*)getModelName;

-(NSMutableArray*)getAppInfor;

-(NSMutableArray*)getConnectInfo;

-(NSMutableArray*)getFingerPrintInfo;

-(NSString*)getTimeStamp;

-(NSString*)getTimeStamp:(NSDate*)newDate;

-(void)getAllLocationInfo:(NSArray*)loc tdLocationCallback:(id<TdLocationCallback>)tdLocationCallback;

-(NSMutableDictionary*)makeSourceProperties:(TdSource*)tdSource;

-(NSMutableDictionary*)makeRatingProperties:(NSInteger)rating;

-(NSMutableDictionary*)makeRegisterProperties:(NSDate*)date;

-(NSMutableDictionary*)makeRegisterProperties;

-(NSMutableDictionary*)makeProductProperties:(TdProduct*)product;

-(NSMutableDictionary*)makeOrderLinesProperties:(NSArray*)orderLines;

-(NSArray*)makeOrderLinesArrayProperties:(NSArray*)orderLines;

-(NSMutableDictionary*)makeOrderProperties:(TdOrder*)order;

-(NSString*)checkCurrency:(NSString*)currencyCode;











@end
