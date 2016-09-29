//
//  TongDao.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/22.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "OnErrorListener.h"
#import "OnDownloadPageListener.h"
#import "OnDownloadInAppMessageListener.h"
#import "TdSource.h"
#import "TdProduct.h"
#import "TdOrderLine.h"
#import "TdOrder.h"

typedef NS_ENUM(NSUInteger, Gender) {
    MALE,
    FEMALE
};
typedef NS_ENUM(NSUInteger, TongDaoinitData) {
    TDLocationIfor,
    TDDeviceInfor,
    TDNetworkInfo,
    TDApplicationInfor,
    TDFingerPrintInfor,
    TDNone
};
@interface TongDao : NSObject
/**
 初始化同道服务
 
 :param: appKey 开发者从同道平台获得的AppKey
 
 :returns: Bool 同道服务的初始化结果
 */
+(BOOL)initSdkWithSdk:(NSString*)appKey;

/*
 初始化同道服务
 
 :param: appKey 开发者从同道平台获得的AppKey
 :param: userId 开发者保存的有价值的用户ID
 
 :returns: Bool 同道服务的初始化结果
 */
+(BOOL)initSdkWithSdk:(NSString *)appKey andUserID:(NSString*)userId;

/*
 初始化同道服务
 
 :param: appKey 开发者从同道平台获得的AppKey
 :param: userId 开发者保存的有价值的用户ID
 :param: ingnoreInfor 开发者可以屏蔽SDK获取的部分信息
 
 :returns: Bool 同道服务的初始化结果
 */
+(BOOL)initSdkWithSdk:(NSString *)appKey andUserID:(NSString*)userId andIgnoreParam:(TongDaoinitData)ingnoreInfor;

/**
 mergae匿名账号和登入的账号
 
 :param: userId 登入的用户名
 */
+(void)setUserId:(NSString*)userId;

/**
 mergae匿名账号和登入的账号
 
 :param: userId 登入的用户名
 */
+(void)loginWithUserId:(NSString*)userId;

/**
 保存DeepLink的键值对
 */
+(void)setDeeplinkDictionary:(NSMutableDictionary*)dictionary;

+(NSMutableDictionary*)getDeeplinkDictionary;

/**
 获得同道SDK产生的userId
 
 :returns: 生成的userId
 */
+(NSString*)generateUserId;

/**
 注册track返回的错误
 
 :param: OnErrorListener 返回的错误接口
 */
+(void)registerErrorListener:(id<OnErrorListener>)onErrorListener;

/**
 下载应用广告页面信息
 
 :param: pageid 广告页面的id
 :param: OnDownloadPageListener? 结果回调接口
 
 如果需要更新界面,建议在结果回调接口中使用 dispatch_async(dispatch_get_main_queue(), {
 更新界面的方法
 })
 */
+(void)downloadPage:(NSInteger)pageId downloadListener:(id<OnDownloadPageListener>)downloadListener;

/**
 下载应用消息
 
 :param: OnDownloadInAppMessageListener? 结果回调接口
 
 如果需要更新界面,建议在结果回调接口中使用 dispatch_async(dispatch_get_main_queue(), {
 更新界面的方法
 })
 */
+(void)downloadInAppMessage:(id<OnDownloadInAppMessageListener>)inAppMessageListener;

/**
 跟踪用户自定义事件
 
 :param: eventName 用户自定义事件名称(不能以!打头)
 :param: values 跟踪事件附带的键值对(值支持字符串和数字)
 */
+(void)trackEventName:(NSString*)eventName values:(NSMutableDictionary*)values;

/**
 跟踪用户自定义事件
 
 :param: eventName 用户自定义事件名称(不能以!打头)
 */
+(void)trackEventName:(NSString*)eventName;

/**
 开始记录用户的使用时长
 
 :param: viewController 当前应用程序的ViewController
 */
+(void)onSessionStartWithController:(UIViewController*)viewController;

/**
 开始记录用户的使用时长
 
 :param: pageName 用户定义的页面名称
 */
+(void)onSessionStartWithPageName:(NSString *)pageName;

/**
 终止记录用户的使用时长
 
 :param: viewController 当前应用程序的ViewController
 */
+(void)onSessionEndWithController:(UIViewController *)viewController;

/**
 终止记录用户的使用时长
 
 :param: pageName 用户定义的页面名称
 */
+(void)onSessionEndWithPageName:(NSString *)pageName;

/**
 保存用户多个自定义属性
 
 :param: values 用户的属性键值对(值支持字符串和数字)
 */
+(void)identify:(NSMutableDictionary*)values;

/**
 保存用户单个自定义属性
 
 :param: name 属性名
 :param: value 属性值(值支持字符串和数字)
 */
+(void)identifyWithName:(NSString*)name Andvalue:(id)value;

/**
 保存用户的推送Token到同道平台，同道将根据用户Token推送信息
 
 :param: push_token 用户的推送Token
 */
+(void)identifyPushToken:(NSString*)pushTpken;

/**
 保存用户全名
 
 :param: fullName 用户全名
 */
+(void)identifyFullName:(NSString*)fullName;

/**
 保存用户名字属性
 
 :param: firstName 名
 :param: lastName 姓
 */
+(void)identifyFullNameWithfirstName:(NSString*)firstName andLastName:(NSString*)lastName;

/**
 保存用户应用中的名字
 
 :param: userName 用户应用中的名字
 */
+(void)identifyUserName:(NSString*)userName;

/**
 保存用户邮件地址
 
 :param: email 用户邮件地址
 */
+(void)identifyEmail:(NSString*)email;

/**
 保存用户电话号码
 
 :param: phoneNumber 用户电话号码
 */
+(void)identifyPhone:(NSString*)phoneNumber;

/**
 保存用户性别
 
 :param: gender 用户性别(枚举类型)
 */
//+(void)identifyGender:(Gender)gender;


/**
 保存用户性别(Objective-C)
 
 :param: gender 用户性别(字符串类型，具体请参考Gender enum)
 */
+(void)identifyGender:(NSString*)gender;

/**
 保存用户年龄
 
 :param: age 用户年龄
 */
+(void)identifyAge:(NSInteger)age;

/**
 保存用户头像链接地址
 
 :param: url 用户头像链接地址
 */
+(void)identifyAvatar:(NSString*)url;

/**
 保存用户联系地址
 
 :param: address 用户联系地址
 */
+(void)identifyAddress:(NSString*)address;

/**
 保存用户出生日期
 
 :param: date 用户出生日期
 */
+(void)identifyBirthday:(NSDate*)date;

/**
 保存用户应用源信息
 
 :param: tdSource 用户应用源信息对象
 */
+(void)identifySource:(TdSource*)tdSource;

/**
 跟踪应用评分
 
 :param: rating 应用评分
 */
+(void)identifyRating:(NSInteger)rating;

/**
 跟踪应用注册日期
 
 :param: date 用户设置的日期对象
 */
+(void)trackRegistration:(NSDate*)date;

/**
 跟踪应用注册日期(使用当前系统时间,无日期参数)
 */
+(void)trackRegistration;

/**
 跟踪浏览商品类别
 
 :param: category 商品类别
 */
+(void)trackViewProductCategory:(NSString*)category;

/**
 跟踪浏览商品信息
 
 :param: product 商品信息
 */
+(void)trackViewProduct:(TdProduct*)tdProduct;

/**
 跟踪添加多个订单到购物车
 
 :param: orderLines 订单列表
 */
+(void)trackAddCarts:(NSArray*)orderLines;

/**
 跟踪添加单个订单到购物车
 
 :param: orderLine 单个订单
 */
+(void)trackAddCart:(TdOrderLine*)orderLine;

/**
 跟踪从购物车删除多个订单
 
 :param: orderLines 订单列表
 */
+(void)trackRemoveCarts:(NSArray*)orderLines;

/**
 跟踪从购物车删除单个订单
 
 :param: orderLine 单个订单
 */
+(void)trackRemoveCart:(TdOrderLine*)tdOrderLine;

/**
 跟踪提交的交易信息
 
 :param: order 交易信息
 */
+(void)trackPlaceOrder:(TdOrder*)order;

/**
 
 跟踪提交的交易信息
 
 :param: name 产品名称
 :param: price 产品价格
 :param: currency 产品货币
 :param: quantity 产品个数
 */
+(void)trackPlaceOrderWithName:(NSString*)name price:(float)price currency:(NSString*)currency quantity:(NSInteger)quantity;

/**
 
 跟踪提交的交易信息，产品个数默认为1
 :param: name 产品名称
 :param: price 产品价格
 :param: currency 产品货币
 */
+(void)trackPlaceOrderWithName:(NSString *)name price:(float)price currency:(NSString *)currency;

/**
 获得SDK存储的AppKey
 
 :returns: appKey
 */
+(NSString*)getAppKey;

+(NSString*)getDataWithUrl:(NSURL*)url andDataUrl:(NSString*)dataUrl;

//	scheme://any_deeplink?0Qpage=page_id
//	scheme://any_deeplink?0Qpromotion=promotion_id

/**
 
 通过包含Deeplink的NSURL取得广告的PageId
 
 :param: url 包含Deeplink的NSURL
 :returns: 广告的PageId
 */
+(NSString*)getPageIdWithUrl:(NSURL*)url;

/**
 跟踪用户打开了同道的推送消息
 :param: userInfo 推送消息的附加信息
 */
+(void)trackOpenMesageForTongDaoPush:(NSDictionary*)userInfo;

/**
 
 跟踪用户打开了百度或JPush推送消息(已过时，请使用trackOpenPushMessageForBaiduAndJPush)
 
 :param: userInfo 推送消息的附加信息
 
 */
+(void)trackOpenMessageForBaiduAndJPush:(NSDictionary*)userInfo;

/**
 
 跟踪用户打开了百度或JPush推送消息
 
 :param: userInfo 推送消息的附加信息
 
 */
+(void)trackOpenPushMessageForBaiduAndJPush:(NSDictionary*)userInfo;

/**
 
 跟踪用户打开了友盟的推送消息
 
 :param: userInfo 推送消息的附加信息
 
 */
+(void)trackOpenPushMessageForUmeng:(NSDictionary*)userInfo;

/**
 
 跟踪用户打开了个推推送消息(已过时，请使用trackOpenPushMessageForGeTui)
 
 :param: userInfo 推送消息的附加信息
 
 */
+(void)trackOpenMessageForGeTui:(NSDictionary*)userInfo;

/**
 
 跟踪用户打开了个推推送消息
 
 :param: userInfo 推送消息的附加信息
 
 */
+(void)trackOpenPushMessageForGeTui:(NSDictionary*)userInfo;

/**
 跟踪用户点击了应用内消息
 
 :param tdMessageBean 同道返回的TdMessageBean
 */
+(void)trackOpenInAppMessage:(TdMessageBean*)tdMessageBean;

/**
 跟踪用户收到了应用内消息
 
 :param tdMessageBean 同道返回的TdMessageBean
 */
+(void)trackReceivedInAppMessage:(TdMessageBean*)tdMessageBean;


+(void)sendOpenMessageWithEventName:(NSString*)eventName andMid:(NSInteger)mid andCid:(NSInteger)cid;



















@end
