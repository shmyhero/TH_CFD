//
//  EditOwnStocksView.m
//  TH_CFD
//
//  Created by william on 16/8/30.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "EditOwnStocksView.h"
#import "TH_CFD-swift.h"

@implementation EditOwnStocksView
{
	EditOwnStocksViewController *_editViewController;
}
@synthesize manager=_manager;

- (instancetype)initWithFrame:(CGRect)frame
{
	if ((self = [super initWithFrame:frame])) {
		UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
		_editViewController = [storyboard instantiateViewControllerWithIdentifier:@"EditOwnStocksViewController"];
		_editViewController.view.frame = frame;
		[self addSubview:_editViewController.view];
	}
	return self;
}

- (void)setManager:(EditOwnStocksViewManager *)manager
{
	_manager = manager;
	_editViewController.delegate = manager;
}
@end
