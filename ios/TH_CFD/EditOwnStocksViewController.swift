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
				let d1:StockData? = StockData()
				d1?.initWithId(20883, symbol: "AUDCAD", name: "苹果", open: 0.916701, close: 0.98570)
				let d2:StockData? = StockData()
				d2?.initWithId(20885, symbol: "AUDCHF", name: "百度", open: 0.916701, close: 0.98570)
				let d3:StockData? = StockData()
				d3?.initWithId(29567, symbol: "AUDDKK", name: "阿里巴巴", open: 0.916701, close: 0.98570)
				let d4:StockData? = StockData()
				d4?.initWithId(29567, symbol: "AUDK", name: "阿里", open: 0.916701, close: 0.98570)
			
				rawData = [d1!, d2!, d3!, d4!]
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
			
			let d1:StockData? = StockData()
			d1?.initWithId(20883, symbol: "AUDCAD", name: "苹果", open: 0.916701, close: 0.98570)
			let d2:StockData? = StockData()
			d2?.initWithId(20885, symbol: "AUDCHF", name: "百度", open: 0.916701, close: 0.98570)
			let d3:StockData? = StockData()
			d3?.initWithId(29567, symbol: "AUDDKK", name: "阿里巴巴", open: 0.916701, close: 0.98570)
			let d4:StockData? = StockData()
			d4?.initWithId(29567, symbol: "AUDK", name: "阿里", open: 0.916701, close: 0.98570)
			
			rawData = [d1!, d2!, d3!, d4!]
			editTableView.reloadData()
		}

}
