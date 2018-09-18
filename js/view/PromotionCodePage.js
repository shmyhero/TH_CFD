'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';

var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var NavBar = require('./NavBar')
var Button = require('./component/Button')
var LogicData = require('../LogicData')
var LocalDataUpdateModule = require('../module/LocalDataUpdateModule')
var NetworkModule = require('../module/NetworkModule')
var NetConstants = require('../NetConstants')

var rowHeight = 40;
var fontSize = 16;
export default class PromotionCodePage extends Component {
  static propTypes = {
    onPop: PropTypes.func,
  }

  static defaultProps = {
    onPop: ()=>{},
  }

  constructor(props) {
    super(props);

    this.state={
      saveButtonEnabled: false,
      hasError: false,
      promotionCode: "",
      errorText: ""
    }
  }

  setPromotionCode(text){
    var saveButtonEnabled = false
    if(text.length > 0){
      saveButtonEnabled = true
    }
    this.setState({
      saveButtonEnabled: saveButtonEnabled,
      promotionCode: text,
      errorText: ""
    })
  }

  savePressed(){
    this.setState({
      saveButtonEnabled: false,
      //errorText: "错误"
    })
    var userData = LogicData.getUserData();
    var notLogin = Object.keys(userData).length === 0;
    if (!notLogin) {
      NetworkModule.fetchTHUrl(
        NetConstants.CFD_API.POST_UPDATE_FIRST_LOGIN_INFO, // + '?' + NetConstants.PARAMETER_NICKNAME + '=' + this.state.nickName + promoUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
          },
          body: JSON.stringify({
            promotionCode: this.state.promotionCode,
          }),
        },
        (responseJson) => {
          if (responseJson.message){
            this.setState({
              saveButtonEnabled: true,
              errorText: responseJson.message
            })
          }else{
            LocalDataUpdateModule.updateMeData(userData, ()=>{
              this.setState({
                //saveButtonEnabled: false,
                errorText: ""
              })
              this.popToPreviousPage()
    				});
          }
        },
        (result) => {
          this.setState({
            saveButtonEnabled: true,
            errorText: result.errorMessage
          })
        })
    }
  }

  popToPreviousPage(){
    if(this.props.onPop){
      this.props.onPop()
    }
    this.props.navigator.pop();
  }

  render() {
    console.log("buttonEnabled " + this.state.saveButtonEnabled + ", this.state.errorText " + this.state.errorText)
    return (
      <View style={styles.container}>
        <NavBar title="填写推广码" navigator={this.props.navigator}
                showBackButton={true}
                leftButtonOnClick={()=>this.popToPreviousPage()}/>
        <View style={[styles.rowWrapperWithBorder, {borderColor: '#c7c7cd'}]}>
          <View style={styles.promotionCodeTextView}>
            <Text style={styles.promotionCodeText}>
              推广码
            </Text>
          </View>

          <TextInput style={styles.nickNameInput}
            autoFocus={true}
            onChangeText={(text) => this.setPromotionCode(text)}
            underlineColorAndroid='#ffffff'
            maxLength={4}/>
        </View>

        {this.renderHintOrError()}

        <View style={styles.rowWrapper}>
          <Button style={styles.saveClickableArea}
            enabled={this.state.saveButtonEnabled}
            onPress={()=>this.savePressed()}
            textContainerStyle={[styles.saveTextView,{backgroundColor: ColorConstants.title_blue(),}]}
            textStyle={styles.saveText}
            text='保存' />
        </View>
      </View>
    );
  }

  renderHintOrError(){
    console.log("this.state.errorText " + this.state.errorText);
    console.log("this.state.errorText ? " + this.state.errorText !== "");

    if(this.state.errorText !== ""){
      return (
        <View style={styles.errorMsg}>
          <Text style={styles.errorText}>{this.state.errorText}</Text>
        </View>
      );
    }else{
        return (
          <View style={styles.noteView}>
            <Text style={styles.noteText}>
              推广码是用于确定归属关系，填写后不能修改！
            </Text>
          </View>
        );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowWrapperWithBorder: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		marginLeft: 10,
		marginRight: 10,
    marginTop: 10,
		borderWidth: 1,
		borderRadius: 3,
		borderColor: ColorConstants.TITLE_BLUE,
		backgroundColor: '#ffffff',
	},
	rowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		paddingTop: 10,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
	},
	promotionCodeTextView: {
		flex: 1,
		height: rowHeight,
		justifyContent: 'center',
	},
	promotionCodeText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#c7c7cd',
	},
	nickNameInput: {
		flex: 4,
		height: rowHeight,
		fontSize: fontSize,
		paddingLeft: 10,
	},
	saveClickableArea: {
		flex: 1,
		alignSelf: 'center',
	},
	saveTextView: {
		padding: 5,
		height: rowHeight,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	saveText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#ffffff',
	},
	noteView: {
		alignSelf: 'flex-start',
		marginLeft: 10,
		marginTop: 10,
	},
	noteText: {
		fontSize: 14,
		textAlign: 'center',
		color: '#c7c7cd',
	},
  errorText:{
    fontSize:14,
    color:'red',
    marginLeft:10
  },
  errorMsg:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
});

module.exports = PromotionCodePage;
