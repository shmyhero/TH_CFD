//
//  SwiftViewControllerManager.h
//  TH_CFD
//
//  Created by william on 16/3/17.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
//#import "RCTBridge.h"
//#import "RCTEventDispatcher.h"
#import <React/RCTBridgeModule.h>

@interface NativeScene : NSObject<RCTBridgeModule>

- (void) showScene:(NSString *)sceneName;
@end
