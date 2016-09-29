//
//  TongDaoUiCore.h
//  TestLayout
//
//  Created by bin jin on 11/12/14.
//  Copyright (c) 2014 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import <TongDaoSDK/TongDao.h>

@interface TongDaoUiCore : NSObject


/*!
 *
 *@abstract 注册奖品领取结果的回调接口
 *@param RewardBean 返回奖品领取数据
 */
@property (nonatomic, copy) void (^registerOnRewardBeanUnlocked)(NSArray* rewards);


/*!
 *
 *@abstract 初始化同道服务
 *@param appKey 开发者从同道平台获得的AppKey
 *@return BOOL 同道服务的初始化结果
 */
-(BOOL) initSdkWithAppKey:(NSString*) appKey;

/*!
 *
 *@abstract 初始化同道服务
 *@param appKey 开发者从同道平台获得的AppKey
 *@param userId 开发者保存的有价值的用户ID
 *@return BOOL 同道服务的初始化结果
 */
-(BOOL) initSdkWithAppKey:(NSString*) appKey andUserId:(NSString*)userId;

/*!
 *
 *@abstract 初始化同道服务
 *@param appKey 开发者从同道平台获得的AppKey
 *@param userId 开发者保存的有价值的用户ID
 *@return BOOL 同道服务的初始化结果
 */
-(BOOL) initTDSdkWithTDAppKey:(NSString*) tdappKey andUserId:(NSString*)userId;

/*!
 *
 *@abstract 获得同道SDK产生的userId
 *@return 生成的userId
 */
-(NSString*)generateUserId;

/*!
 *@abstract 注册Track功能的回调接口
 *
 *@param OnErrorListener 结果回调接口
 *
 *@discussion 如果需要更新界面,建议在结果回调接口中使用 dispatch_async(dispatch_get_main_queue(), {
 * 更新界面的方法
 * })
 */
-(void) registerErrorListener:(id<OnErrorListener>)onErrorListener;

/*!
 *
 *@abstract 跟踪用户自定义事件
 *@param eventName 用户自定义事件名称(不能以!打头)
 */
-(void) trackWithEventName:(NSString*)eventName;

/*!
 *
 *@abstract 跟踪用户自定义事件
 *@param eventName 用户自定义事件名称(不能以!打头)
 *@param values 跟踪事件附带的键值对(值支持字符串和数字)
 */
-(void) trackWithEventName:(NSString *)eventName andValues:(NSDictionary*)values;

/*!
 *@abstract 开始记录用户的使用时长
 *@param viewController 当前应用程序的ViewController
 */
-(void) onSessionStart:(UIViewController*)viewController;

/*!
 *@abstract 开始记录用户的使用时长
 *@param pageName 用户定义的页面名称
 */
-(void) onSessionStartWithPageName:(NSString*)pageName;

/*!
 *@abstract 终止记录用户的使用时长
 *@param viewController 当前应用程序的ViewController
 */
-(void) onSessionEnd:(UIViewController*)viewController;

/*!
 *@abstract 终止记录用户的使用时长
 *@param pageName 用户定义的页面名称
 */
-(void) onSessionEndWithPageName:(NSString*)pageName;

/*!
 *@abstract 保存用户多个自定义属性
 *
 *@param values 用户的属性键值对(值支持字符串和数字)
 */
-(void) identify:(NSDictionary*)values;

/*!
 *@abstract 保存用户单个自定义属性
 *
 *@param key 属性名
 *@param value 属性值(值支持字符串和数字)
 */
-(void) identifyWithKey:(NSString*)key andValue:(id)value;

/*!
 *@abstract 保存用户全名
 *
 *@param fullName 用户全名
 */
-(void) identifyFullName:(NSString*)fullName;

/*!
*@abstract 保存用户的推送Token到同道平台，同道将根据用户Token推送信息
*
*@param push_token 用户的推送Token
*/
-(void) identifyPushToken:(id)push_token;

/*!
 *@abstract 保存用户名字属性
 *
 *@param firstName 名
 *@param lastName 姓
 */
-(void) identifyFullNameWithFirstName:(NSString*)firstName andLastName:(NSString*)lastName;

/*!
 *@abstract 保存用户应用中的名字
 *
 *@param userName 用户应用中的名字
 */
-(void) identifyUserName:(NSString*)userName;

/*!
 *@abstract 保存用户邮件地址
 *
 *@param email 用户邮件地址
 */
-(void) identifyEmail:(NSString*)email;

/*!
 *@abstract 保存用户电话号码
 *
 *@param phoneNumber 用户电话号码
 */
-(void) identifyPhone:(NSString*)phoneNumber;

/*!
 *@abstract 保存用户性别
 *
 *@param gender 用户性别(字符串类型，具体请参考sdk)
 */
-(void) identifyGender:(NSString*)gender;

/*!
 *@abstract 保存用户年龄
 *
 *@param age 用户年龄
 */
-(void) identifyAge:(int)age;

/*!
 *@abstract 保存用户头像链接地址
 *
 *@param url 用户头像链接地址
 */
-(void) identifyAvatar:(NSString*)url;

/*!
 *@abstract 保存用户联系地址
 *
 *@param address 用户联系地址
 */
-(void) identifyAddress:(NSString*)address;

/*!
 *@abstract 保存用户出生日期
 *
 *@param date 用户出生日期
 */
-(void) identifyBirthday:(NSDate*)date;

/*!
 *@abstract 保存用户应用源信息
 *
 *@param tdSource 用户应用源信息对象
 */
-(void) identifySource:(TdSource*)tdSource;

/*!
 *@abstract 跟踪应用评分
 *
 *@param rating 应用评分
 */
-(void) identifyRating:(int)rating;

/*!
 *@abstract 跟踪应用注册日期
 *
 *@param date 用户设置的日期对象
 */
-(void) trackRegistrationWithDate:(NSDate*)date;

/*!
 *
 *@abstract 跟踪应用注册日期(使用当前系统时间,无日期参数)
 *
 */
-(void) trackRegistration;

/*!
 *@abstract 跟踪浏览商品类别
 *
 *@param category 商品类别
 */
-(void) trackViewProductCategory:(NSString*)category;

/*!
 *@abstract 跟踪浏览商品信息
 *
 *@param product 商品信息
 */
-(void) trackViewProduct:(TdProduct*)product;

/*!
 *@abstract 跟踪添加多个订单到购物车
 *
 *@param orderLines 订单列表
 */
-(void) trackAddCarts:(NSArray*)orderLines;

/*!
 *@abstract 跟踪添加单个订单到购物车
 *
 *@param orderLine 单个订单
 */
-(void) trackAddCart:(TdOrderLine*)orderLine;

/*!
 *@abstract 跟踪从购物车删除多个订单
 *
 *@param orderLines 订单列表
 */
-(void) trackRemoveCarts:(NSArray*)orderLines;

/*!
 *@abstract 跟踪从购物车删除单个订单
 *
 *@param orderLine 单个订单
 */
-(void) trackRemoveCart:(TdOrderLine*)orderLine;

/*!
 *@abstract 跟踪提交的交易信息
 *
 *@param order 交易信息
 */
-(void) trackPlaceOrder:(TdOrder*)order;

/*!
 *
 *@abstract 跟踪提交的交易信息
 *
 *@param name 产品名称
 *@param price 产品价格
 *@param currency 产品货币
 *@param quantity 产品个数
 */
-(void) trackPlaceOrder:(NSString*)name andPrice:(float)price andCurrency:(NSString*)currency andQuantity:(int)quantity;

/*!
 *
 *@abstract 跟踪提交的交易信息，产品个数默认为1
 *
 *@param name 产品名称
 *@param price 产品价格
 *@param currency 产品货币
 */
-(void) trackPlaceOrder:(NSString*)name andPrice:(float)price andCurrency:(NSString*)currency;

/*!
 *
 *@abstract 解析从url来的deeplink,并显示活动界面
 *@param url
 *@discussion url 格式: app://tongrd/pages/pageid
 *@param view 传递外部容器的view
 *@result 无返回结果
 */
-(void) displayAdvertisementWithUrl:(NSURL*) url andContainerView:(UIView*) view;

/**
 *
 *@brief 下载应用广告页面信息
 *@param pageid 广告页面的id
 *@param delegate 下载page的回调接口
 *
 */
-(void) downloadPageWithPageId:(int)pageId andDelegate:(id<OnDownloadPageListener>)delegate;

/**
*
*@brief 显示应用消息的界面
*@param view 传递外部容器的view
*@result 返回结果
*/
-(void) displayInAppMessage:(UIView*)view;

/**
 *
 *@brief 获得SDK保存的AppKey
 *@result appKey
 */
-(NSString*) getAppKey;

/*!
 *
 @brief 跟踪用户打开了百度或JPush推送消息(已过时，请使用trackOpenPushMessageForBaiduAndJPush)
 @param userInfo 推送消息的附加信息
 */
-(void)trackOpenMessageForBaiduOrJPush:(NSDictionary*)userInfo;

/**
 @brief 跟踪用户打开了百度或JPush推送消息
 @param userInfo 推送消息的附加信息
 */
-(void)trackOpenPushMessageForBaiduOrJPush:(NSDictionary*)userInfo;

/**
 @brief 跟踪用户打开了个推推送消息(已过时，请使用trackOpenPushMessageForGeTui)
 @param userInfo 推送消息的附加信息
 */
-(void)trackOpenMessageForGeTui:(NSDictionary*)userInfo;

/**
  @brief 跟踪用户打开了个推推送消息
  @param userInfo 推送消息的附加信息
 */
-(void)trackOpenPushMessageForGeTui:(NSDictionary*)userInfo;

/**
 @brief 跟踪用户打开了同道推送消息
 @param userInfo 推送消息的附加信息
 */
-(void)trackOpenPushMessageForTongDao:(NSDictionary*)userInfo;

/**
 @brief 跟踪用户打开了同道推送消息
 @param userInfo 推送消息的附加信息
 */
-(void)trackOpenPushMessageForUmeng:(NSDictionary*)userInfo;

/**
  @brief 跟踪用户点击了应用内消息
  @param tdMessageBean 同道返回的TdMessageBean
 */
-(void)trackOpenInAppMessage:(TdMessageBean*)tdMessageBean;

/**
 @brief 跟踪用户收到了应用内消息
 @param tdMessageBean 同道返回的TdMessageBean
 */
-(void)trackReceivedInAppMessage:(TdMessageBean*)tdMessageBean;

-(void)openPageForBaiduOrJPush:(UIViewController*)rootViewController andUserInfo:(NSDictionary*)userInfo andDeeplinkAndControllerId:(NSMutableDictionary*)deeplinkAndControllerId;

-(void)openPageForGeTui:(UIViewController*)rootViewController andUserInfo:(NSDictionary*)userInfo andDeeplinkAndControllerId:(NSMutableDictionary*)deeplinkAndControllerId;

-(void)openPageForTongDao:(UIViewController*)rootViewController andUserInfo:(NSDictionary*)userInfo andDeeplinkAndControllerId:(NSMutableDictionary*)deeplinkAndControllerId;

-(void)reset;

-(void)setDeeplinkDictionary:(NSMutableDictionary*)dictionary;

-(NSMutableDictionary*)getDeeplinkDictionary;

+(TongDaoUiCore*)sharedManager;

@end
