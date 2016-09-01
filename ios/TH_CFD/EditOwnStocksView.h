//
//  EditOwnStocksView.h
//  TH_CFD
//
//  Created by william on 16/8/30.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "EditOwnStocksViewManager.h"

@interface EditOwnStocksView : UIView

@property (nonatomic, assign) EditOwnStocksViewManager *manager;
@property (nonatomic, assign) BOOL isLogin;

@end
