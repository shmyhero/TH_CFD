//
//  EditOwnStocksViewController.swift
//  TH_CFD
//
//  Created by william on 16/3/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit

class EditOwnStocksViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
	
	@IBOutlet weak var editTableView: UITableView!
	var rawData:[StockData] = []
	
	override func viewDidLoad() {
		super.viewDidLoad()
		rawData = StockDataManager.sharedInstance().stockDataArray
		editTableView.editing = true
	}
	
	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
		// Dispose of any resources that can be recreated.
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
		for stock in rawData {
			stock.choose = true
		}
		editTableView.reloadData()
	}
	
	@IBAction func didTapDeleteButton(sender: AnyObject) {
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
		let dataString:String = StockDataManager.sharedInstance().jsonOwnStockData()
		NativeData.sharedInstance().sendDataToRN("myList", data: dataString)
		
		let delegate:AppDelegate! = UIApplication.sharedApplication().delegate as! AppDelegate
		delegate!.rnRootViewController?.dismissViewControllerAnimated(true, completion: { () -> Void in
			print("dismiss")
		})
	}
	
	func showEditOwnStocksView(message: String!){
		print("show edit!")
		print("EditOwnStocksViewController::printMessage => \(message)")
	}
}
