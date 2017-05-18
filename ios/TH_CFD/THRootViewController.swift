//
//  THRootViewController.swift
//  TH_CFD
//
//  Created by william on 2017/3/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

import Foundation

class THRootViewController: UIViewController {
    
    var checked = false
    var enableIPCheck = true
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    init() {
        super.init(nibName: nil, bundle: nil)
        //Do whatever you want here

        if self.enableIPCheck {
            self.checkIP()
        }
    }
    
    override func viewWillTransition(to size:CGSize,
                                           with coordinator:UIViewControllerTransitionCoordinator)
    {
//        coordinator.animateAlongsideTransition(nil, completion:
//            {_ in
//                UIView.setAnimationsEnabled(true)
//        })
//        UIView.setAnimationsEnabled(false)
        super.viewWillTransition(to: size, with: coordinator);
    }
    
    override var shouldAutorotate : Bool {
        return true
    }
    
    func noticeAndQuit(_ message:String!) {
        let alertController = UIAlertController(title: message,
                                                message: "",
                                                preferredStyle: .alert)
        let okAction = UIAlertAction(title: "确定", style: .default, handler: {
            action in
            self.byebyeApp(message)
        })
        alertController.addAction(okAction)
        self.present(alertController, animated: true, completion: nil)
    }
    
    func byebyeApp(_ message:String!) {
//        fatalError(message)
        exit(0)
    }
    
    // MARK: - IP Check
    func checkIP()
    {
        //(1）设置请求路径
        let urlStr:NSString = String(format:"http://cfd-webapi.chinacloudapp.cn/api/ipcheck") as NSString
        let url:URL = URL(string: urlStr as String)!
        
        //(2) 创建请求对象
        let request:URLRequest = URLRequest(url: url)
        
        //(3) 发送请求
        NSURLConnection.sendAsynchronousRequest(request, queue:OperationQueue()) { (res, data, error)in
            if error == nil && data != nil {
                //服务器返回：请求方式 = GET，返回数据格式 = JSON
                let  str = NSString(data: data!, encoding:String.Encoding.utf8.rawValue)
                if str == "false" {
                    self.noticeAndQuit("检测到您当前所在的位置，不在本产品的许可区域内，点击确定退出")
                }
                else {
                    print ("IP address available.")
                    //                self.noticeAndQuit("检测到您当前所在的位置，不在本产品的许可区域内，点击确定退出")
                }
                
            }
        }
    }
}
