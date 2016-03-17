//
//  EditOwnStockCell.swift
//  TH_CFD
//
//  Created by william on 16/3/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit

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
		let name:String = data.choose ?"Select":"Unselect"
		self.selectButton?.setImage(UIImage.init(named: name), forState: .Normal)
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
		let name:String = self.stockData!.choose ?"Select":"Unselect"
		self.selectButton?.setImage(UIImage.init(named: name), forState: .Normal)
	}
	
	@IBAction func tapTopButton(sender: AnyObject) {
		print(sender);
		tapTop!(selectStock: stockData!);
	}
}


