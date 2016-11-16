//
//  EditOwnStocksViewController.swift
//  TH_CFD
//
//  Created by william on 16/3/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit

@objc protocol EditOwnStocksViewControllerDelegate: class {
	optional func onClickEditAlert(sender: EditOwnStocksViewController, alertData:AnyObject )
}

class EditOwnStocksViewController: UIViewController, UITableViewDelegate, UITableViewDataSource{
	
	@IBOutlet weak var topView: UIView!
	@IBOutlet weak var editTableView: UITableView!
	@IBOutlet weak var allButton: UIButton!
	@IBOutlet weak var deleteButton: UIButton!
	
	@IBOutlet var headLabels: [UILabel]!
	@IBOutlet weak var alertHeaderLabel: UILabel!
	@IBOutlet weak var topLabelTrailConstraint: NSLayoutConstraint!
	weak var delegate:EditOwnStocksViewControllerDelegate?
	
	var showAlert:Bool = false
	var allSelect:Bool = false
	
	var rawData:[StockData] = []
	
	var _colorSet:ColorSet = ColorSet()
	
	override func viewDidLoad() {
		super.viewDidLoad()
		editTableView.editing = true
		// remove empty lines
		editTableView.tableFooterView = UIView()
	}
	
	override func viewDidAppear(animated: Bool) {
		editTableView.reloadData()
	}
	
	override func viewWillAppear(animated: Bool) {
		super.viewWillAppear(animated)
		
		self.updateColors()
		
		self.alertHeaderLabel.hidden = !showAlert
		topLabelTrailConstraint.constant = showAlert ? 0:-30
		
		rawData = StockDataManager.sharedInstance().stockDataArray
		allButton.layer.cornerRadius = 4
		deleteButton.layer.cornerRadius = 4
		self.updateButtons()
	}
	
	override func viewWillDisappear(animated: Bool) {
		super.viewWillDisappear(animated)
		
		StockDataManager.sharedInstance().stockDataArray = rawData
		let dataString:String = StockDataManager.sharedInstance().jsonOwnStockData()
		let delegate:AppDelegate! = UIApplication.sharedApplication().delegate as! AppDelegate
		delegate!.nativeData!.sendDataToRN("myList", data: dataString)
	}
	
	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
		// Dispose of any resources that can be recreated.
	}
	
	func updateColors() {
		_colorSet.update()
		topView.backgroundColor = _colorSet.bgColor
		for label in headLabels {
			label.textColor = _colorSet.headLabelColor
		}
	}
	
	func updateButtons() {
		let selectedRows = rawData.filter({ (stock) -> Bool in
			stock.choose == true
		})
		allSelect = selectedRows.count == rawData.count
		allButton.setTitle(allSelect ? "取消":"全部", forState: .Normal)
		allButton.enabled = rawData.count > 0
		allButton.backgroundColor = allButton.enabled ? _colorSet.bgColor : UIColor(hexInt: 0xe0e0e0)
		
		deleteButton.enabled = selectedRows.count > 0
		if deleteButton.enabled {
			deleteButton.backgroundColor = UIColor(hexInt: 0xf1585c)
			deleteButton.setTitle("删除(\(selectedRows.count))", forState: .Normal)
		}
		else {
			deleteButton.backgroundColor = UIColor(hexInt: 0xe0e0e0)
			deleteButton.setTitle("删除", forState: .Normal)
		}
	}
	
	// MARK: - Table view data source
	func numberOfSectionsInTableView(tableView: UITableView) -> Int {
		return 1
	}
	
	func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
		return rawData.count
	}
	
	func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
		let cell = tableView.dequeueReusableCellWithIdentifier("EditStockCell", forIndexPath: indexPath) as! EditOwnStockCell
		
		// Configure the cell...
		let stock:StockData = rawData[indexPath.row]
		cell.setData(stock)
		cell.moveToTop { (selectStock) -> Void in
			// move to top
			self.editTableView.beginUpdates()
			self.rawData = self.rawData.filter({ (stock) -> Bool in
				stock != selectStock
			})
			self.rawData.insert(selectStock, atIndex: 0)
			self.editTableView.reloadData()
			
			for i in 0..<self.rawData.count {
				if self.rawData[i] == selectStock {
					let path:NSIndexPath = NSIndexPath(forRow: i, inSection: 0)
					self.editTableView.moveRowAtIndexPath(path, toIndexPath: NSIndexPath(forRow: 0, inSection: 0))
					break
				}
			}
			self.editTableView.endUpdates()
			self.noticeSuccess("已置顶")
		}
		
		cell.selectCell { (selectStock) -> Void in
			self.updateButtons()
		}
		
		cell.pushAlert { (selectStock) in
			self.delegate?.onClickEditAlert!(self, alertData: selectStock.stockId)
		}
		
		cell.alertButton.hidden = !showAlert
		cell.topButtonTrailConstraint.constant = showAlert ? 40:10
		
		if showAlert {
			let hasAlert = StockDataManager.sharedInstance().alertEnabled(stock.stockId)
			cell.setAlert(hasAlert)
		}
		
		return cell
	}
	
	func tableView(tableView: UITableView, editingStyleForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCellEditingStyle {
		return .None
	}
	
	func tableView(tableView: UITableView, shouldIndentWhileEditingRowAtIndexPath indexPath: NSIndexPath) -> Bool {
		return false
	}
	
	// Override to support rearranging the table view.
	func tableView(tableView: UITableView, moveRowAtIndexPath fromIndexPath: NSIndexPath, toIndexPath: NSIndexPath) {
		let movedObject = rawData[fromIndexPath.row]
		rawData.removeAtIndex(fromIndexPath.row)
		rawData.insert(movedObject, atIndex: toIndexPath.row)
	}
	
	// Override to support conditional rearranging of the table view.
	func tableView(tableView: UITableView, canMoveRowAtIndexPath indexPath: NSIndexPath) -> Bool {
		return true
	}
	
	@IBAction func didTapAllButton(sender: AnyObject) {
		allSelect = !allSelect
		for stock in rawData {
			stock.choose = allSelect
		}
		editTableView.reloadData()
		updateButtons()
	}
	
	@IBAction func didTapDeleteButton(sender: AnyObject) {
		let refreshAlert = UIAlertController(title: "确认删除", message: "", preferredStyle: UIAlertControllerStyle.Alert)
		
		refreshAlert.addAction(UIAlertAction(title: "取消", style: .Default, handler: { (action: UIAlertAction!) in
			// do nothing
		}))
		
		refreshAlert.addAction(UIAlertAction(title: "确定", style: .Default, handler: { (action: UIAlertAction!) in
			self.deleteStocks()
			self.updateButtons()
		}))
		
		presentViewController(refreshAlert, animated: true, completion: nil)
	}
	
	func deleteStocks() {
		editTableView.beginUpdates()
		var indexPaths:[NSIndexPath] = []
		for i in 0..<rawData.count {
			if self.rawData[i].choose {
				let path:NSIndexPath = NSIndexPath(forRow: i, inSection: 0)
				indexPaths.append(path)
			}
		}
		editTableView.deleteRowsAtIndexPaths(indexPaths, withRowAnimation: .Fade)
		
		rawData = rawData.filter({ (stock) -> Bool in
			stock.choose == false
		})
		
		editTableView.endUpdates()
	}
	
	@IBAction func didTapOKButton(sender: AnyObject) {
		StockDataManager.sharedInstance().stockDataArray = rawData
		let dataString:String = StockDataManager.sharedInstance().jsonOwnStockData()
		let delegate:AppDelegate! = UIApplication.sharedApplication().delegate as! AppDelegate
		delegate!.nativeData!.sendDataToRN("myList", data: dataString)
		delegate!.rnRootViewController.dismissViewControllerAnimated(true, completion: { () -> Void in
		})
	}
	
	func refresh() {
		dispatch_async(dispatch_get_main_queue(), {
			self.editTableView.reloadData()
		})
	}
}
