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
	@IBOutlet weak var alertButton: UIButton!
	@IBOutlet weak var codeLabelLeftConstraint: NSLayoutConstraint!
	@IBOutlet weak var topButtonTrailConstraint: NSLayoutConstraint!
	
	var stockData: StockData?
	var selectImageName = "Select"
	var unselectImageName = "Unselect"
	var reminderOffImageName = "Reminder"
	var reminderOnImageName = "Reminder01"
	var topImageName = "Top"
	
	func setData(_ data:StockData) {
		self.setupColor()
		self.stockData = data
		self.nameLabel.text = data.name
		self.codeLabel.text = data.symbol
		if let stockTag = data.stockTag {
			self.codeLabelLeftConstraint.constant = 18
			self.tagLabel.isHidden = false
			self.tagLabel.text = stockTag
			self.tagLabel.layer.cornerRadius = 2
		}
		else {
			self.codeLabelLeftConstraint.constant = 0
			self.tagLabel.isHidden = true
		}
		let name:String = data.choose ? selectImageName : unselectImageName
		self.selectButton.setImage(UIImage.init(named: name), for: UIControlState())
		self.topButton.setImage(UIImage.init(named: topImageName), for: UIControlState())
	}
	
	func setAlert(_ hasAlert: Bool) {
		let name:String = hasAlert ? reminderOnImageName : reminderOffImageName
		self.alertButton.setImage(UIImage.init(named: name), for: UIControlState())
	}
	
	func setupColor() {
		if (StockDataManager.sharedInstance().isLive) {
			selectImageName = "SelectLive"
			unselectImageName = "UnselectLive"
			reminderOnImageName = "Reminder01Live"
			reminderOffImageName = "ReminderLive"
			topImageName = "TopLive"
			self.tagLabel.backgroundColor = UIColor(hexInt: 0x5483d8)
		}
		else {
			selectImageName = "Select"
			unselectImageName = "Unselect"
			reminderOnImageName = "Reminder01"
			reminderOffImageName = "Reminder"
			topImageName = "Top"
			self.tagLabel.backgroundColor = UIColor(hexInt: 0x00B2FE)
		}
	}
	
	typealias callbackfunc=(StockData)->Void
    
    var tapTop : callbackfunc?
    var tapSelect : callbackfunc?
    var tapAlert : callbackfunc?
	
	func moveToTop(tapTopFunction:@escaping callbackfunc ){
		tapTop = tapTopFunction
	}
	
	func selectCell(tapSelectButton:@escaping callbackfunc ){
		tapSelect = tapSelectButton
	}
	
	func pushAlert(tapAlertButton:@escaping callbackfunc) {
		tapAlert = tapAlertButton
	}
	
	override func awakeFromNib() {
		super.awakeFromNib()
		// Initialization code
	}
	
	@IBAction func tapSelectButton(_ sender: AnyObject) {
		self.stockData!.choose = !self.stockData!.choose
		let name:String = self.stockData!.choose ? selectImageName : unselectImageName
		self.selectButton.setImage(UIImage.init(named: name), for: UIControlState())
		
		tapSelect!(stockData!)
	}
	
	@IBAction func tapTopButton(_ sender: AnyObject) {
		tapTop!(stockData!);
	}
	
	@IBAction func tapAlertButton(_ sender: AnyObject) {
		tapAlert!(stockData!);
	}
}


