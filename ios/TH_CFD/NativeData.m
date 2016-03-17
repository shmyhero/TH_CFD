//
//  NativeData.m
//  TH_CFD
//
//  Created by william on 16/3/17.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "NativeData.h"
#import "TH_CFD-swift.h"

@implementation NativeData

RCT_EXPORT_MODULE();
- (void)receiveDataFromRN:(NSString *)dataName data:(NSString *)jsonData;
{
	NSError *error;
	NSData *data = [jsonData dataUsingEncoding:NSUTF8StringEncoding];
	NSArray *dataArray = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:&error];
	
	for (NSDictionary *dict in dataArray) {
		StockData *stock = [[StockData alloc] init];
		[stock initWithDictionay:dict]
	}
}

#pragma mark RCT_EXPORT
RCT_EXPORT_METHOD(passDataToNative:(NSString *)dataName data:(NSString *)jsonData) {
	[self receiveDataFromRN:dataName data:jsonData];
}
@end
