'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

var Button = require('../component/Button')
var UIConstants = require('../../UIConstants');
var ColorConstants = require('../../ColorConstants');
var CheckBoxButton = require('../component/CheckBoxButton')
var {height, width} = Dimensions.get('window');

var heightRate = height/667.0;
var heightShow = height - UIConstants.HEADER_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER
var roundR = (width-10)/2

var dialog_horizontal_padding = 20;
var modelTextW = 15;//width/28;
var signEnable = true;//防止网络不畅多次点击事件发生

export default class OAWarningDialog extends Component {

  static propTypes = {
    proceedCallback: PropTypes.func,
    messageLines: PropTypes.array,
    //headerImage: PropTypes.number
  }

  static defaultProps = {
    proceedCallback: ()=>{},
    messageLines: [
      "根据您在申请过程中提供的有关您的知识、经验和财务状况的信息，我们认为您尚未完全了解点差交易及差价合约（CFD）交易所涉及的风险和潜在财务成本。因此该投资产品可能不适合您，我们建议您认真考虑是否仍希望继续该申请。",
      "如果在认真考虑之后，您仍希望参与点差交易或差价合约（CFD）交易，我们建议您在通过模拟交易账户熟悉我们的平台之后，以及查看我们的投资教育资料和产品风险警告提示后再寻求开立实盘账户。您也可寻求相关独立意见。",
      "请记住，点差交易或差价合约（CFD）交易是杠杆交易，并对您的资本带来高风险，因为价格可能向您不利的方向迅速运动。您的资本面临风险。本产品可能并不适合所有客户，因此您必须确保您了解相关风险。",
      "如果您仍然希望继续申请，请勾选方框接受以下声明。如果您对申请文件有任何疑问，请联系我们的客户服务团队。",
    ],
    //headerImage: require('../../images/sign_stratgy.png'),
  }

  constructor(props) {
	  super(props);

    this.state = {
      isStartUp: true,
      modalVisible: false,
      hasRead: false,
    }
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  show(){
    this._setModalVisible(true);
  }

  dismiss(){
    this._setModalVisible(false);
  }

  renderLine (message, index){
    return (
      <View style = {styles.lineText} key={index}>
        <Text style={styles.textModal}>{message}</Text>
      </View>
    );
  }

  renderLines(){
    var linesView = this.props.messageLines.map(
      (message, index) =>
        {
          return this.renderLine(message, index+1);
        }
      )

    return linesView;
    //return (
      // <ScrollView style={{height: height / 2, width: width/ 2, backgroundColor:'red'}}>
      //   <View style={{backgroundColor:'yellow'}}>
    //      {linesView}
      //   </View>
      // </ScrollView>
    //);
  }

  gotoNext(){
    if(this.props.proceedCallback){
      this.props.proceedCallback();
    }
    this.dismiss();
  }

  onClickCheckbox(value){
    this.setState({
      hasRead: value,
    })
  }

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        animationType={"slide"}
        style={{height: height, width: width}}
        onRequestClose={() => {this._setModalVisible(false)}}
        >
        <View style={styles.modalContainer}>
          <View style={styles.bodyContent}>
            <View style = {styles.modalTexContainer}>
              <Text style={styles.titleText}>风险提示</Text>
              <ScrollView style={{height: height / 2}}>
                {this.renderLines()}
                <View style={{width:width}}></View>
              </ScrollView>
              <View style={styles.checkboxView}>
                <CheckBoxButton
                  text={"我将确保预先熟悉相关产品、模拟帐户和投资教育材料，我只会在确信的情况下继续申请。"}
                  defaultSelected={false}
                  onPress={(value)=>{this.onClickCheckbox(value)}}/>
              </View>
              <View style={styles.buttonLine}>
                <View style={styles.button}>
                  <Button style={styles.buttonArea}
                    enabled={true}
                    onPress={()=>this.dismiss()}
                    textContainerStyle={styles.cancelButtonView}
                    textStyle={styles.buttonText}
                    text="取消"/>
                </View>
                <View style={styles.button}>
                  <Button style={styles.buttonArea}
        						enabled={this.state.hasRead}
        						onPress={()=>this.gotoNext()}
        						textContainerStyle={styles.buttonView}
        						textStyle={styles.buttonText}
        						text={this.state.validateInProgress? "信息正在检查中...": '继续'} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textDayNumber2:{
    fontSize:10,
    color:'#FFFFFF',
    textAlign:'center',
  },

  modalContainer:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.5)',
    paddingLeft: dialog_horizontal_padding,
    paddingRight: dialog_horizontal_padding,
    // paddingBottom:height/2,
  },

  modalInnerContainer: {
    //borderRadius: 4,
    alignItems: 'center',
    //backgroundColor: '#05FFFFFF',
  },

  bodyContent: {
    position: 'relative',
  },

  modalTexContainer:{
    alignItems: 'flex-start',
    backgroundColor: '#fffdf4',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },

  titleText:{
    fontSize: 18,
    marginBottom: 10,
  },

  textModal:{
    fontSize:modelTextW,
    lineHeight: modelTextW + 8,
    flex:1,
    color:'#666666',
  },

  lineText:{
    flexDirection:'row',
    flexWrap:'wrap',
    marginBottom:21,
  },

  closeButton:{
    marginTop:28,
  },

  imgClose:{
    width:36,
    height:36,
  },

  buttonLine:{
    flexDirection:'row',
    alignItems:'stretch',
  },

  button:{
    flex: 1,
    height: 50,
  },

  cancelButton:{
    marginLeft: 5,
  },

  checkboxView: {
    height: 50,
    marginRight: 10,
    marginTop:10,
    marginBottom:10,
  },

  buttonArea: {
		flex: 1,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 16,
		borderRadius: 3,
	},

  buttonView: {
    height: 40,
    borderRadius: 3,
    backgroundColor: ColorConstants.TITLE_DARK_BLUE,
    justifyContent: 'center',
  },

  cancelButtonView: {
    height: 40,
    borderRadius: 3,
    backgroundColor: ColorConstants.STOCK_UNCHANGED_GRAY,
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: 17,
    textAlign: 'center',
    color: '#ffffff',
  },

});

module.exports = OAWarningDialog;
