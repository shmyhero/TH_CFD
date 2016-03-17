//
//  EditOwnStockCell.swift
//  TH_CFD
//
//  Created by william on 16/3/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit

class StockData: NSObject {
	var stockId: Int = 0
	var symbol: String?
	var name: String?
	var open: Double?
	var close: Double?
	var choose: Bool = false
	
	func initWithId(stockId:Int, symbol:String, name:String, open:Double, close:Double) -> Void {
		self.stockId = stockId
		self.symbol = symbol
		self.name = name
		self.open = open
		self.close = close
	}
}

class EditOwnStockCell: UITableViewCell {
		@IBOutlet weak var selectButton: UIButton!
		@IBOutlet weak var nameLabel: UILabel!
		@IBOutlet weak var codeLabel: UILabel!
		@IBOutlet weak var topButton: UIButton!
	
		var stockData: StockData?
	
		func setData(data:StockData) {
				self.stockData = data
				self.nameLabel?.text = data.name
				self.codeLabel?.text = data.symbol
				self.selectButton?.setTitle(data.choose ?"1":"0", forState: .Normal)
		}
	
		typealias callbackfunc=(selectStock:StockData)->Void
		var tapTop = callbackfunc?()
	
		func moveToTop( tapTopFunction:callbackfunc ){
			tapTop = tapTopFunction
		}
	
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

		@IBAction func tapSelectButton(sender: AnyObject) {
			self.stockData!.choose = !self.stockData!.choose
			self.selectButton?.setTitle(self.stockData!.choose ?"1":"0", forState: .Normal)
		}
	
		@IBAction func tapTopButton(sender: AnyObject) {
			print(sender);
			tapTop!(selectStock: stockData!);
		}
}


