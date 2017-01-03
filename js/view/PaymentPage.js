'use strict'

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
} from 'react-native';

import RNViewShot from "react-native-view-shot";
var QRCode = require('@remobile/react-native-qrcode-local-image');
var WebViewPage = require('./WebViewPage');

export default class PaymentPage extends Component {
  static propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    paymentDestination: PropTypes.string,
    onPopToRoute: PropTypes.func,
  }

  static defaultProps = {
    url: "www.baidu.com",
    title: "支付",
    paymentDestination: "alipay", //unionpay, wechat,
    onPopToRoute: ()=>{}
  }

  constructor(props) {
    super(props);

    this.state = {
      showPaymentButton: false,
    }
  }

  pressPayButton(){
    //Take snapshot of the webview.
		RNViewShot.takeSnapshot(this.refs["webView"].getWebViewRef(), {
		  format: "jpeg",
		  quality: 1
		})
		.then( uri => {
				var origionUri = uri;
				console.log("Image saved to", uri);
        //The lib doesn't accept file:/// prefix. Remove it before using.
				if(uri.startsWith("file:///")){
					uri = uri.substring(8);
				}

				try{
					QRCode.decode(uri, (error, result)=>{
						if(error){
              console.log("qr scanner error: " + error);
              alert("扫码失败，请截屏后打开" + this.getDestinationName() + "，选择扫一扫付款。")
              // Wechat test...
							// Linking.openURL("weixin://wxpay/bizpayurl?pr=xtZdnua");
							// Linking.openURL("weixin://scanqrcode?pr=xtZdnua")
  						// Linking.openURL("weixin://scanqrcode");//ios上可打开微信扫一扫
							// Linking.openURL("alipayqr://platformapi/startapp?saId=10000007");// + encodedValue/*+"%3Dweb-other"*/);
						}else{
							console.log("qr scanner result: " + result);

							var encodedValue = encodeURIComponent(result);
							if(result.includes("qr.alipay.com")){
                //Alipay scheme.
								try{
                  Linking.openURL("alipayqr://platformapi/startapp?saId=10000007&qrcode=" + encodedValue/*+"%3Dweb-other"*/)
                  .then(()=>{
                    console.log('openURL success')
                  })
                  .catch(err => {
                    //User may not install alipay. So just open the url inside the qrcode.
                    console.log('An error occurred' + err + ", result + " + result)
                    Linking.openURL(uri)
                  });
                }catch(error){
                  alert(error)
                }
							}else {
								Linking.openURL(uri);
							}
						}
	        });
				}catch(error){
					console.log("QRCode error: " + error);
          alert("扫码失败，请截屏后打开支付宝，选择扫一扫付款。")
				}
			},
		  error => console.error("Oops, snapshot failed", error)
		);
  }

  webPageLoaded(content){
    // todo
    console.log("webPageLoaded: "+ content.url);
    if(content.url && content.url.includes("payForward.do")){
      this.setState({
        showPaymentButton: true,
      })
    }else if(content.url && content.url.includes("test_form/finish")){
      this.props.navigator.popToTop();
    }else{
      this.setState({
        showPaymentButton: false,
      })
    }
  }

  getDestinationName(){
    switch (this.props.paymentDestination) {
      case "alipay":
        return "支付宝";
      case "wechat":
        return "微信";
      case "unionpay":
        return "银联支付";
      default:
        return "";
    }
  }

  renderPayButton(){
    if(this.state.showPaymentButton){
      return (
        <TouchableOpacity style={styles.paymentButton} onPress={()=>this.pressPayButton()}>
          <Text style={styles.paymentText}>
            前往{this.getDestinationName()}
          </Text>
        </TouchableOpacity>
      );
    }else{
      return (<View/>);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <WebViewPage ref={"webView"} url={this.props.url} title={"支付"} navigator={this.props.navigator} backFunction={this.props.backFunction}
          onWebPageLoaded={(content)=>this.webPageLoaded(content)}/>
        {this.renderPayButton()}
        {/* <TextInput style={[{backgroundColor: 'white'}]} onChangeText={(text)=>this.setText(text)} value={"https://www.google.com"}/> */}
        {/* <TouchableOpacity style={styles.paymentButton} onPress={()=>this.pressDeepLink()}>
          <Text style={styles.paymentText}>
            前往deeplink
          </Text>
        </TouchableOpacity> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  paymentButton: {
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#ff6666',
  },

  paymentText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ffffff'
  }
});

module.exports = PaymentPage;
