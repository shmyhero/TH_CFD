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
	@IBOutlet weak var tagLabel: UILabel!
	@IBOutlet weak var topButton: UIButton!
	@IBOutlet weak var codeLabelLeftConstraint: NSLayoutConstraint!
	
	var stockData: StockData?
	
	func setData(data:StockData) {
		self.stockData = data
		self.nameLabel.text = data.name
		self.codeLabel.text = data.symbol
		if (data.stockTag != nil) {
			self.codeLabelLeftConstraint.constant = 18
			self.tagLabel.hidden = false
			self.tagLabel.text = data.stockTag
			self.tagLabel.layer.cornerRadius = 2
		}
		else {
			self.codeLabelLeftConstraint.constant = 0
			self.tagLabel.hidden = true
		}
		let name:String = data.choose ?"Select":"Unselect"
		self.selectButton.setImage(UIImage.init(named: name), forState: .Normal)
	}
	
	typealias callbackfunc=(selectStock:StockData)->Void
	var tapTop = callbackfunc?()
	var tapSelect = callbackfunc?()
	
	func moveToTop( tapTopFunction:callbackfunc ){
		tapTop = tapTopFunction
	}
	
	func selectCell( tapSelectButton:callbackfunc ){
		tapSelect = tapSelectButton
	}
	
	override func awakeFromNib() {
		super.awakeFromNib()
		// Initialization code
	}
	
	@IBAction func tapSelectButton(sender: AnyObject) {
		self.stockData!.choose = !self.stockData!.choose
		let name:String = self.stockData!.choose ?"Select":"Unselect"
		self.selectButton.setImage(UIImage.init(named: name), forState: .Normal)
		
		tapSelect!(selectStock: stockData!)
	}
	
	@IBAction func tapTopButton(sender: AnyObject) {
		tapTop!(selectStock: stockData!);
	}
}


