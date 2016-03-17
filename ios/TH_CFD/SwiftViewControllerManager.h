//
//  SwiftViewControllerManager.h
//  TH_CFD
//
//  Created by william on 16/3/17.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@interface SwiftViewControllerManager : NSObject<RCTBridgeModule>

- (void) showEditOwnStocks;
@end
