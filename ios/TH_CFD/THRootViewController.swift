//
//  THRootViewController.swift
//  TH_CFD
//
//  Created by william on 2017/3/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

import Foundation
import CoreLocation

class THRootViewController: UIViewController,CLLocationManagerDelegate {
    
    var locationManager:CLLocationManager!
    var checked = false
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    init() {
        super.init(nibName: nil, bundle: nil)
        //Do whatever you want here
//        self.checkLocation()
        self.checkIP()
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
    
    // MARK: - Location Check
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
//        SwiftNotice.showNoticeWithText(SwiftNotice.NoticeType.info, text: "定位发生异常：\(error)", autoClear: true, autoClearTime: 1)
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if locations.count > 0{ //  使用last 获取 最后一个最新的位置， 前面是上一次的位置信息
            if (checked) {
                return
            }
            checked = true
            let locationInfo:CLLocation = locations.last!
            self.inValidCountries(locationInfo)
        }
    }
    
    func inValidCountries(_ currentLocation:CLLocation) {
        let geoCoder = CLGeocoder.init()
        
        geoCoder.reverseGeocodeLocation(currentLocation) { (placemarks, error) in
            if(placemarks!.count > 0) {
                let placeMark = placemarks![0]
                if ["CN", "HK"].contains(placeMark.isoCountryCode!) {
                    // ok
//                    self.noticeAndQuit("当前位于\(placeMark.ISOcountryCode)")
                }
                else {
                    self.noticeAndQuit("当前位于\(placeMark.country!)，不在本产品的许可区域内")
                }
            }else if (error == nil&&placemarks!.count == 0){
                print("没有地址返回");
            }
            else if ((error) != nil){
                print ("location error:%@",error!);
            }
        }
    }
    
    func checkLocation() {
        //如果设备没有开启定位服务
        if !CLLocationManager.locationServicesEnabled(){
            DispatchQueue.main.async{
                self.locationNotAvailable()
            }
            return
        }
        
        locationManager = CLLocationManager()
        
        //设置精确度
        locationManager.desiredAccuracy = kCLLocationAccuracyBest        //变化距离  超过100米 重新定位
        locationManager.distanceFilter = 100
        //在IOS8以上系统中，需要使用requestWhenInUseAuthorization方法才能弹窗让用户确认是否允许使用定位服务的窗口
        
        if (UIDevice.current.systemVersion as NSString).floatValue >=  8.0 {
            
            //状态为，用户还没有做出选择，那么就弹窗让用户选择
            if CLLocationManager.authorizationStatus() == CLAuthorizationStatus.notDetermined {
                locationManager.requestWhenInUseAuthorization()
                //locationManager.requestAlwaysAuthorization()
            }
                //状态为，用户在设置-定位中选择了【永不】，就是不允许App使用定位服务
            else if(CLLocationManager.authorizationStatus() == CLAuthorizationStatus.denied){
                //需要把弹窗放在主线程才能强制显示
                DispatchQueue.main.async{
                    self.locationNotAvailable()
                    return
                }
            }
        }
        //设置定位获取成功或者失败后的代理，Class后面要加上CLLocationManagerDelegate协议
        locationManager.delegate = self
        //开始获取定位信息，异步方式
        locationManager.startUpdatingLocation()
    }
    
    func locationNotAvailable() {
        let alertController = UIAlertController(title: "系统提示",
                                                message: "无法定位，因为您没有授权本程序使用定位，请至设置中开启！",
                                                preferredStyle: .alert)
        let okAction = UIAlertAction(title: "好的", style: .default, handler: {
            action in
            let settingUrl = URL(string: UIApplicationOpenSettingsURLString)!
            if UIApplication.shared.canOpenURL(settingUrl)
            {
                UIApplication.shared.openURL(settingUrl)
            }
        })
        alertController.addAction(okAction)
        self.present(alertController, animated: true, completion: nil)
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
