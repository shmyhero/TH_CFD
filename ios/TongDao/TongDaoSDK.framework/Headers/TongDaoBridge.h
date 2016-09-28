//
//  TongDaoBridge.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/16.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OnErrorListener.h"
#import "Singleton.h"
#import "TdEventBean.h"
#import "OnDownloadPageListener.h"
#import "OnDownloadInAppMessageListener.h"
//#import "Gender.h"
#import "TdOrder.h"
#import "TdSource.h"
#import "TdOrderLine.h"
#import "TdProduct.h"
#import "TongDao.h"

@interface TongDaoBridge : NSObject

singleton_interface(TongDaoBridge)

@property(nonatomic)id<OnErrorListener>onErrorListener;
@property(nonatomic,strong)NSDate* startTime;
@property(nonatomic,strong)NSDate* appStartTime;
@property(nonatomic,copy)NSString* pageNameStart;
@property(nonatomic,copy)NSString* pageNameEnd;
@property(nonatomic,strong)NSMutableDictionary* dictionary;
@property(nonatomic,assign)BOOL appClosed;

-(BOOL)initSdk:(NSString*)appKey;

-(BOOL)initSdk:(NSString*)appKey andIgnoreParam:(TongDaoinitData)ingnoreInfor;

-(void)openApp;

-(void)closeApp;

-(void)sendEvent:(ACTION_TYPE)action event:(NSString*)event properties:(NSMutableDictionary*)properties;

-(void)sendEvent:(ACTION_TYPE)action event:(NSString*)event propertiesForOpenMessage:(NSMutableDictionary*)properties;

-(void)setDeeplinkDictionary:(NSMutableDictionary*)dictionary;

-(NSMutableDictionary*)getDeeplinkDictionary;

-(void)registerErrorListener:(id<OnErrorListener>)onErrorListener;

-(void)downloadPage:(NSInteger)pageId downloadListener:(id<OnDownloadPageListener>)downloadListener;

-(void)downloadInAppMessage:(id<OnDownloadInAppMessageListener>)inAppMessageListener;

-(void)track:(NSString*)action;

-(void)track:(NSString *)action values:(NSMutableDictionary*)values;

-(void)onSessionStart:(id)objc;

-(void)onSessionStartWithPageName:(NSString*)pageName;

-(void)onSessionEnd:(id)objc;

-(void)onSessionEndWithPageName:(NSString *)pageName;

-(void)identify:(NSMutableDictionary*)values;

-(void)identifyWithName:(NSString*)name andValue:(id)value;

-(void)identifyPushToken:(NSString*)pushToken;

-(void)identifyFullName:(NSString*)fullName;

-(void)identifyFullNameWithFirstName:(NSString*)firstName andLastName:(NSString*)lastName;

-(void)identifyUserName:(NSString*)userName;

-(void)identifyEmail:(NSString*)email;

-(void)identifyPhone:(NSString*)phoneNumber;

-(void)identifyGender:(NSString*)gender;

-(void)identifyAge:(NSInteger)age;

-(void)identifyAvatarWithUrl:(NSString*)url;

-(void)identifyAddress:(NSString*)address;

-(void)identifyBirthday:(NSDate*)date;

-(void)identifySource:(TdSource*)tdSource;

-(void)identifyRating:(NSInteger)rating;

-(void)trackRegistration:(NSDate*)date;

-(void)trackRegistration;

-(void)trackViewProductCategory:(NSString*)category;

-(void)trackViewProduct:(TdProduct*)tdProduct;

-(void)trackAddCart:(NSArray*)orderLines;

-(void)trackRemoveCart:(NSArray*)orderLines;

-(void)trackPlaceOrder:(TdOrder*)tdOrder;

-(void)mergeUserId:(NSString*)userId;

-(void)sendOpenMessageWithEventName:(NSString*)eventName andMid:(NSInteger)mid andCid:(NSInteger)cid;










@end
