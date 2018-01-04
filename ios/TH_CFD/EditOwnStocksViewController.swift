//
//  EditOwnStocksViewController.swift
//  TH_CFD
//
//  Created by william on 16/3/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit

@objc protocol EditOwnStocksViewControllerDelegate: class {
	@objc optional func onClickEditAlert(_ sender: EditOwnStocksViewController, alertData:AnyObject )
}

class EditOwnStocksViewController: UIViewController, UITableViewDelegate, UITableViewDataSource{
	
	@IBOutlet weak var topView: UIView!
	@IBOutlet weak var editTableView: UITableView!
	@IBOutlet weak var allButton: UIButton!
	@IBOutlet weak var deleteButton: UIButton!
    @IBOutlet weak var allLabel: UILabel!
    @IBOutlet weak var remindLabel: UILabel!
    @IBOutlet weak var topLabel: UILabel!
    @IBOutlet weak var moveLabel: UILabel!
    
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
		editTableView.isEditing = true
		// remove empty lines
		editTableView.tableFooterView = UIView()
	}
	
	override func viewDidAppear(_ animated: Bool) {
		editTableView.reloadData()
	}
	
	override func viewWillAppear(_ animated: Bool) {
		super.viewWillAppear(animated)
		
		self.updateColors()
		
		self.alertHeaderLabel.isHidden = !showAlert
		topLabelTrailConstraint.constant = showAlert ? 0:-30
		
		rawData = StockDataManager.sharedInstance().stockDataArray
		allButton.layer.cornerRadius = 4
		deleteButton.layer.cornerRadius = 4
		self.updateButtons()
	}
	
	override func viewWillDisappear(_ animated: Bool) {
		super.viewWillDisappear(animated)
		
		StockDataManager.sharedInstance().stockDataArray = rawData
		let dataString:String = StockDataManager.sharedInstance().jsonOwnStockData()
		let delegate:AppDelegate! = UIApplication.shared.delegate as! AppDelegate
		delegate!.nativeData!.send(toRN: "myList", data: dataString)
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
        allLabel.text = THLocalized(key: "allLabel")
        topLabel.text = THLocalized(key: "topLabel")
        remindLabel.text = THLocalized(key: "remindLabel")
        moveLabel.text = THLocalized(key: "moveLabel")
        
		let selectedRows = rawData.filter({ (stock) -> Bool in
			stock.choose == true
		})
		allSelect = selectedRows.count == rawData.count
		allButton.setTitle(allSelect ? THLocalized(key: "cancel"):THLocalized(key: "all"), for: UIControlState())
		allButton.isEnabled = rawData.count > 0
		allButton.backgroundColor = allButton.isEnabled ? _colorSet.bgColor : UIColor(hexInt: 0xe0e0e0)
		
		deleteButton.isEnabled = selectedRows.count > 0
        let deleteText = THLocalized(key: "delete")
		if deleteButton.isEnabled {
			deleteButton.backgroundColor = UIColor(hexInt: 0xf1585c)
			deleteButton.setTitle("\(deleteText)(\(selectedRows.count))", for: UIControlState())
		}
		else {
			deleteButton.backgroundColor = UIColor(hexInt: 0xe0e0e0)
			deleteButton.setTitle(deleteText, for: UIControlState())
		}
	}
	
	// MARK: - Table view data source
	func numberOfSections(in tableView: UITableView) -> Int {
		return 1
	}
	
	func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
		return rawData.count
	}
	
	func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
		let cell = tableView.dequeueReusableCell(withIdentifier: "EditStockCell", for: indexPath) as! EditOwnStockCell
		
		// Configure the cell...
		let stock:StockData = rawData[indexPath.row]
		cell.setData(stock)
		cell.moveToTop { (selectStock) -> Void in
			// move to top
			self.editTableView.beginUpdates()
			self.rawData = self.rawData.filter({ (stock) -> Bool in
				stock != selectStock
			})
			self.rawData.insert(selectStock, at: 0)
			self.editTableView.reloadData()
			
			for i in 0..<self.rawData.count {
				if self.rawData[i] == selectStock {
					let path:IndexPath = IndexPath(row: i, section: 0)
					self.editTableView.moveRow(at: path, to: IndexPath(row: 0, section: 0))
					break
				}
			}
			self.editTableView.endUpdates()
            self.noticeSuccess(self.THLocalized(key: "pin"))
		}
		
		cell.selectCell { (selectStock) -> Void in
			self.updateButtons()
		}
		
		cell.pushAlert { (selectStock) in
			self.delegate?.onClickEditAlert!(self, alertData: selectStock.stockId as AnyObject)
		}
		
		cell.alertButton.isHidden = !showAlert
		cell.topButtonTrailConstraint.constant = showAlert ? 40:10
		
		if showAlert {
			let hasAlert = StockDataManager.sharedInstance().alertEnabled(stock.stockId)
			cell.setAlert(hasAlert)
		}
		
		return cell
	}
	
	func tableView(_ tableView: UITableView, editingStyleForRowAt indexPath: IndexPath) -> UITableViewCellEditingStyle {
		return .none
	}
	
	func tableView(_ tableView: UITableView, shouldIndentWhileEditingRowAt indexPath: IndexPath) -> Bool {
		return false
	}
	
	// Override to support rearranging the table view.
	func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to toIndexPath: IndexPath) {
		let movedObject = rawData[fromIndexPath.row]
		rawData.remove(at: fromIndexPath.row)
		rawData.insert(movedObject, at: toIndexPath.row)
	}
	
	// Override to support conditional rearranging of the table view.
	func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
		return true
	}
	
	@IBAction func didTapAllButton(_ sender: AnyObject) {
		allSelect = !allSelect
		for stock in rawData {
			stock.choose = allSelect
		}
		editTableView.reloadData()
		updateButtons()
	}
	
	@IBAction func didTapDeleteButton(_ sender: AnyObject) {
		let refreshAlert = UIAlertController(title: THLocalized(key: "confirmDelete"), message: "", preferredStyle: UIAlertControllerStyle.alert)
		
		refreshAlert.addAction(UIAlertAction(title: THLocalized(key: "cancel"), style: .default, handler: { (action: UIAlertAction!) in
			// do nothing
		}))
		
		refreshAlert.addAction(UIAlertAction(title: THLocalized(key: "ok"), style: .default, handler: { (action: UIAlertAction!) in
			self.deleteStocks()
			self.updateButtons()
		}))
		
		present(refreshAlert, animated: true, completion: nil)
	}
	
	func deleteStocks() {
		editTableView.beginUpdates()
		var indexPaths:[IndexPath] = []
		for i in 0..<rawData.count {
			if self.rawData[i].choose {
				let path:IndexPath = IndexPath(row: i, section: 0)
				indexPaths.append(path)
			}
		}
		editTableView.deleteRows(at: indexPaths, with: .fade)
		
		rawData = rawData.filter({ (stock) -> Bool in
			stock.choose == false
		})
		
		editTableView.endUpdates()
	}
	
	@IBAction func didTapOKButton(_ sender: AnyObject) {
		StockDataManager.sharedInstance().stockDataArray = rawData
		let dataString:String = StockDataManager.sharedInstance().jsonOwnStockData()
		let delegate:AppDelegate! = UIApplication.shared.delegate as! AppDelegate
		delegate!.nativeData!.send(toRN: "myList", data: dataString)
		delegate!.rnRootViewController.dismiss(animated: true, completion: { () -> Void in
		})
	}
	
	func refresh() {
		DispatchQueue.main.async(execute: {
			self.editTableView.reloadData()
		})
	}
    
    func currentLanguage() -> String {
        return UserDefaults.standard.value(forKey: "appLanguage") as! String
    }
    
    func THLocalized(key:String) -> String {
        let path = Bundle.main.path(forResource: currentLanguage(), ofType: "lproj")
        return Bundle.init(path: path!)!.localizedString(forKey: key, value: nil, table: "NativeStrings")
    }
}
