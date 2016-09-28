//
//  InfoDataTool.h
//  TongDaoOcSdk
//
//  Created by bin jin on 15/7/8.
//  Copyright (c) 2015年 Tongdao. All rights reserved.
//

#import <Foundation/Foundation.h>

static NSString *const MODEL = @"!model";
static NSString *const BRAND = @"!brand";
static NSString *const DEVICE_NAME = @"!device_name";
static NSString *const RESOLUTION_WIDTH = @"resolution_width";
static NSString *const RESOLUTION_HEIGHT = @"resolution_height";
static NSString *const APP_VERSION_CODE=@"!version_code";
static NSString *const APP_VERSION_NAME=@"!version_name";
static NSString *const OS_NAME=@"!os_name";
static NSString *const OS_VERSION=@"!os_version";
static NSString *const LANGUAGE = @"!language";
static NSString *const CONNECTION_TYPE =@"!connection_type";
static NSString *const CONNECTION_QUALITY = @"!connection_quality";
static NSString *const CARRIER = @"!carrier_name";
static NSString *const CARRIER_CODE = @"!carrier_code";
static NSString *const SDK_VERSION=@"sdk_version";
static NSString *const IDFV=@"!idfv";
static NSString *const IDFV_MD5=@"!idfv_md5";
static NSString *const IDFV_SHA1=@"!idfv_sha1";
static NSString *const IDFA=@"!idfa";
static NSString *const IDFA_MD5=@"!idfa_md5";
static NSString *const IDFA_SHA1=@"!idfa_sha1";
static NSString *const APPSTORE_ID=@"appstore_id";
static NSString *const APPSTORE_NAME=@"appstore_name";
static NSString *const REGISTERED_AT=@"registered_at";
static NSString *const WIDTH=@"!width";
static NSString *const HEIGHT=@"!height";

struct ScreenSize {
    NSInteger width;
    NSInteger height;
};
typedef struct ScreenSize ScreenSize;

@interface InfoDataTool : NSObject


-(ScreenSize)getWidthAndHeight;

-(NSDictionary*)getDeviceDict;

-(NSDictionary*)getAppDic;

-(NSDictionary*)getCarrierDic;

-(NSDictionary*)getFingerprintDict;

@end
