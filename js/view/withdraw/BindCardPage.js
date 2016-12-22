'use strict';

import React, {Component, PropTypes} from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	Platform,
	ScrollView,
} from 'react-native';

var TimerMixin = require('react-timer-mixin');
import Picker from 'react-native-picker';

var Button = require('../component/Button')
var CheckBoxButton = require('../component/CheckBoxButton')
var MainPage = require('../MainPage')
var LogicData = require('../../LogicData')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var NavBar = require('../NavBar')
// var OpenAccountRoutes = require('./OpenAccountRoutes')
// var OpenAccountUtils = require('./OpenAccountUtils')
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require('../../NetConstants');
var LogicData = require('../../LogicData');

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)

var rowTitleWidth = (width - (2 * rowPadding)) / 4;
var rowValueWidth = (width - (2 * rowPadding)) / 4 * 3;

var viewsChoices = {};

viewsChoices.Provices = [
  {"value":110000,"displayText":"北京","ShortName":"北京", "children":[{"value":110100,"displayText":"北京市","ShortName":"北京"}]},
  {"value":310000,"displayText":"上海","ShortName":"上海", "children":[{"value":310100,"displayText":"上海市","ShortName":"上海"}]},
  {"value":320000,"displayText":"江苏省","ShortName":"江苏", "children":[{"value":320400,"displayText":"常州市","ShortName":"常州"},{"Id":320800,"Name":"淮安市","ShortName":"淮安"},{"Id":320700,"Name":"连云港市","ShortName":"连云港"},{"Id":320100,"Name":"南京市","ShortName":"南京"},{"Id":320600,"Name":"南通市","ShortName":"南通"},{"Id":321300,"Name":"宿迁市","ShortName":"宿迁"},{"Id":320500,"Name":"苏州市","ShortName":"苏州"},{"Id":321200,"Name":"泰州市","ShortName":"泰州"},{"Id":320200,"Name":"无锡市","ShortName":"无锡"},{"Id":320300,"Name":"徐州市","ShortName":"徐州"},{"Id":320900,"Name":"盐城市","ShortName":"盐城"},{"Id":321000,"Name":"扬州市","ShortName":"扬州"},{"Id":321100,"Name":"镇江市","ShortName":"镇江"}]},
]

viewsChoices.SupportedBanks = [
  {"displayText":"中国银行","value":"中国银行","logo":"https://cfdstorage.blob.core.chinacloudapi.cn/bank/bankofchina.jpg"},
];

var defaultRawData = [
		{"title":"姓名", "key": "AccountHolder", "value":"", hint:"请输入姓名", "type": "realname",},
		{"title":"开户城市", "key": "ProvinceAndCity", "value":{"Province": null, "City": null}, hint: "点击选择", "type": "cascadeChoice", "choicesKey": "Provices"},
		{"title":"开户银行", "key": "NameOfBank", "value":"", hint: "点击选择", "type": "choice", "choicesKey": "SupportedBanks"},
		{"title":"支行名称", "key": "Branch", "value":"", hint:"请输入支行名称", maxLength: 18, minLength: 18,},
		{"title":"银行卡号", "key": "AccountNumber", "value":"", hint:"请输入支行名称", maxLength:75, "type": "cardNumber",},
];

export default class BindCardPage extends Component {

	//mixins: [TimerMixin],
	pickerDisplayed = false;
  listRawData = [];
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 });
  provinceAndCities = [];

  static propTypes = {
    isReadOnlyMode: PropTypes.bool,
  }

  static defaultProps = {
    isReadOnlyMode: false,
  }

  constructor(props) {
	  super(props);

    this.listRawData = JSON.parse(JSON.stringify(defaultRawData));

    this.state={
      dataSource: this.ds.cloneWithRows(this.listRawData),
			validateInProgress: false,
			selectedPicker: -1,
    }
  }

  componentWillMount(){
    if(this.props.isReadOnlyMode){
      //Get the users card information.

      for(var i = 0; i < this.listRawData.length; i++){
        switch(this.listRawData[i].key){
          case "ProvinceAndCity":
            this.listRawData[i].value = {Province:{"displayText":"北京"}, City: {"displayText":"北京市"}};
            break;
          case "AccountHolder":
            this.listRawData[i].value = "你的名字呢";
            break;
          case "NameOfBank":
            this.listRawData[i].value = "中国银行";
            break;
          case "Branch":
            this.listRawData[i].value = "一个测试分行";
            break;
          case "AccountNumber":
            var cardNumber = "1234 5678 9012 3456 789";

						//Star the card number!
            var realNumberString = cardNumber.split(" ").join('');
            var startIndex = 6;
            var endIndex = 4;
            var starSize = realNumberString.length - startIndex - endIndex;
            var stars = Array(starSize).join("*")
            var staredCardNumber = realNumberString.substr(0, startIndex) + stars + realNumberString.substr(realNumberString.length - endIndex);

            var finalText = "";
            for(var j = 0; j < staredCardNumber.length; j +=4){
              if(j!=0){
                finalText+=" ";
              }
              finalText += staredCardNumber.slice(j, j+4);
            }
            this.listRawData[i].value = finalText;

            break;
          default:
            break;
        }
      }

    }

    var userData = LogicData.getUserData()
  	if(userData.token == undefined){return}

    //Get userinfo
    NetworkModule.fetchTHUrl(NetConstants.CFD_API.GET_USER_INFO,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
        },
      },
      (responseJson)=>{
        this.listRawData[0].value = responseJson.lastName + responseJson.firstName;
        this.updateList();
      },
      (result)=>{

      });

	  if(!this.props.isReadOnlyMode){
	    //Get banks
	    NetworkModule.fetchTHUrl(NetConstants.CFD_API.GET_SUPPORT_WITHDRAW_BANKS,
	      {
					method: 'GET',
				},
	      (responseJson)=>{
	        try{
	          viewsChoices.SupportedBanks = [];
	          for(var i = 0; i < responseJson.length; i++){
	            viewsChoices.SupportedBanks.push({"value": responseJson[i].cname, "displayText": responseJson[i].cname, "logo": responseJson[i].logo});
	          }
	        }catch(err){
	          console.log("error " + err)
	        }
	      },
	      (result)=>{

	      });

	    //Get Provices
	    //Provices and cities won't updated, so write it down locally.

	    NetworkModule.fetchTHUrl(NetConstants.CFD_API.GET_ALL_PROVINCES_AND_CITIES,
	      {
	  			method: 'GET',
	  		},
	      (responseJson)=>{
	        this.provinceAndCities = [];
	        for(var i = 0; i < responseJson.length; i++){
	          //{"value":110000,"displayText":"北京","ShortName":"北京"},
	          if(responseJson[i].ParentId){
	            //City
	            for(var j = 0; j < this.provinceAndCities.length; j++){
	              if(responseJson[i].ParentId == this.provinceAndCities[j].value){
	                this.provinceAndCities[j].children.push({"value": responseJson[i].Id, "displayText": responseJson[i].Name})
	                break;
	              }
	            }
	          }else{
	            //Province
	            this.provinceAndCities.push({"value": responseJson[i].Id, "displayText": responseJson[i].Name, children: []});
	          }

	        }
	      },
	      (result)=>{

	      });
		}
  }

  getCity(provinceId, onGetCitiesFinished, onGetCitiesFailed){
    viewsChoices.Cities = [];
        //GET_CITY: CFD_API_SERVER + "/api/area/?id=<id>",
        //		url = url.replace(/<stockCode>/, this.props.stockInfo.id)
    var url = NetConstants.CFD_API.GET_CITY.replace(/<id>/, provinceId);
    NetworkModule.fetchTHUrl(url,
      {
				method: 'GET',
			},
      (responseJson)=>{
        for(var i = 0; i < responseJson.length; i++){
          //{"value":110000,"displayText":"北京","ShortName":"北京"},
          viewsChoices.Cities.push({"value": responseJson[i].Id, "displayText": responseJson[i].Name});
        }
        if(onGetCitiesFinished){
          onGetCitiesFinished(viewsChoices.Cities);
        }
      },
      (result)=>{
        if(onGetCitiesFailed){
          onGetCitiesFailed(result);
        }
      },
      true);
  }

	bindCard() {
    //{"AccountHolder":"张三","AccountNumber":"1217 0000 0000 0000 000","Branch":"建设银行上海分行","City":"上海","NameOfBank":"建设银行","Province":"上海"}
    var userData = LogicData.getUserData()
    if(userData.token == undefined){return}

    this.setState({
      validateInProgress: true,
    });

    var body = {};
    for(var i = 0; i< this.listRawData.length; i++){
			if(this.listRawData[i]){
				if(this.listRawData[i].key == "ProvinceAndCity"){
					body.City = this.listRawData[i].value.City.displayText;
          body.Province = this.listRawData[i].value.Province.displayText;
				}else{
          body[this.listRawData[i].key] = this.listRawData[i].value;
        }
			}
		}
    //Get userinfo
    NetworkModule.fetchTHUrl(NetConstants.CFD_API.BIND_BANK_ACCOUNT,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
        showLoading: true,
      },
      (responseJson)=>{
        this.setState({
          validateInProgress: false,
        });
        if(responseJson.success){
          this.props.navigator.push({
            'name': MainPage.WITHDRAW_ROUTE,
          });
        }else{
          //Do something???
        }
      },
      (result)=>{
        this.setState({
          validateInProgress: false,
        });
        alert("error! " + result.errorMessage);
      });
	}

  unbindCard(){
    var userData = LogicData.getUserData()
    if(userData.token == undefined){return}

    //alert("解除绑定！")
    this.props.navigator.pop();
  }

	textInputChange(text, rowID) {
		this.listRawData[rowID].value = text;
		this.updateList();
	}

  ontextInputChange(text, rowID) {
    console.log("ontextInputChange " + console.log(Object.keys(text)));
	}

  cardNumberInputChange(text, rowID){
    console.log("cardNumberInputChange " + text);
    var placeholder = text.split(" ").join('');
    var finalText = ""
    console.log("cardNumberInputChange 1 text: " + text + ", placeholder: " + placeholder + ", finalText: " + finalText);
    for(var i = 0; i < placeholder.length; i +=4){
      if(i!=0){
        finalText+=" ";
      }
      finalText += placeholder.slice(i, i+4);
      console.log("finalText: " + finalText + ", i: " + i);
    }
    console.log("finalText: " + finalText + ", finally!");
    if(text !== finalText){

      this.listRawData[rowID].value = finalText;
      console.log("updateList");
  		this.updateList();
    }
  }

	// onPressPicker(rowData, rowID) {
	// 	this.setState({
	// 		selectedPicker: rowID,
	// 	})
  //
	// 	var selectedText = "";
	// 	var choices = [];
  //   var choiceDataArray = viewsChoices[rowData.choicesKey];
  //   //var choices = viewsChoices[rowData.choicesKey];
	// 	for(var i = 0; i < choiceDataArray.length; i++){
  //     console.log(""+JSON.stringify(choiceDataArray[i]))
	// 		if(rowData.value === choiceDataArray[i].value){
	// 			selectedText = choiceDataArray[i].displayText;
	// 		}
	// 		choices.push(choiceDataArray[i].displayText);
	// 	}
  //
  //   Picker.init({
  //       pickerData: choices,
  //       selectedValue: [selectedText],
	// 			pickerTitleText: "",
	// 			pickerConfirmBtnColor: [25,98,221,1],
	// 			pickerCancelBtnColor: [25,98,221,1],
  //       onPickerConfirm: data => {
	// 				if(data[0] === ""){
	// 					rowData.value = choiceDataArray[0].value;
	// 				}else{
	// 					for(var i = 0; i < choiceDataArray.length; i++){
	// 						if(data[0] === choiceDataArray[i].displayText){
	// 							rowData.value = choiceDataArray[i].value;
	// 						}
	// 					}
	// 				}
	// 				this.setState({
	// 					dataSource: this.ds.cloneWithRows(this.listRawData),
	// 					selectedPicker: -1,
	// 				})
  //       },
  //   });
  //   Picker.show();
	// }

  onProvincePickerPressed(rowData, rowID){
    this.showCascadePicker(this.provinceAndCities, [rowData.value.Province, rowData.value.City], rowID, (province, city)=>{
      this.listRawData[rowID].value.Province = province;
      this.listRawData[rowID].value.City = city;
      this.updateList();
    });
    // this.onPressPicker(viewsChoices[rowData.choicesKey],
    //   rowData.value,
    //   (selectedValue)=>{
    //     this.getCity(selectedValue,
    //       (cities)=>{
    //         this.onPressPicker(viewsChoices.Cities, viewsChoices.Cities[0].value,
    //           ()=>{
    //
    //           }, rowID);
    //       },
    //       (error)=>{
    //         alert("getcity error " + error);
    //       });
    //
    //     // rowData.value = selectedValue;
    //     // this.setState({
    //     //   dataSource: this.ds.cloneWithRows(this.listRawData),
    //     // });
    //   },
    //   rowID);
  }

  onGenericPickerPressed(rowData, rowID){
    this.onPressPicker(viewsChoices[rowData.choicesKey],
      rowData.value,
      (selectedValue)=>{
        rowData.value = selectedValue;
        this.setState({
          dataSource: this.ds.cloneWithRows(this.listRawData),
        });
      },
      rowID);
  }

  showCascadePicker(choiceDataArray, currentSelectedValue, rowID, onValueSelected){
    this.setState({
      selectedPicker: rowID,
    })

    if(!choiceDataArray || choiceDataArray.length == 0){
      console.log("choiceDataArray is empty")
      return;
    }

    var selectedValue = [];
    if(currentSelectedValue[0]){
      selectedValue.push(currentSelectedValue[0].displayText);
      if(currentSelectedValue[1]){
        selectedValue.push(currentSelectedValue[1].displayText);
      }
    }
    var choices = [];

    //var choices = viewsChoices[rowData.choicesKey];
    for(var i = 0; i < choiceDataArray.length; i++){
      var choice = {};
      choice[choiceDataArray[i].displayText] = [];
      if(choiceDataArray[i].children){
        for(var j = 0; j < choiceDataArray[i].children.length; j ++){
          choice[choiceDataArray[i].displayText].push(choiceDataArray[i].children[j].displayText);
        }
      }

      choices.push(choice);
    }

    Picker.init({
        pickerData: choices,
        selectedValue: selectedValue,
        pickerTitleText: "",
        pickerConfirmBtnColor: [25,98,221,1],
        pickerCancelBtnColor: [25,98,221,1],
        onPickerConfirm: data => {
          console.log("onPickerConfirm " + JSON.stringify(data))

          for(var i = 0; i < choiceDataArray.length; i++){
            if(data[0] === choiceDataArray[i].displayText){
              //console.log("found data[0] ")
              for(var j = 0; j < choiceDataArray[i].children.length; j++){
                if(data[1] === choiceDataArray[i].children[j].displayText){
                  //console.log("found data[1] ")
                  if(onValueSelected){
                    onValueSelected(choiceDataArray[i], choiceDataArray[i].children[j]);
                  }
                  break;
                }
              }
              break;
            }
          }
          this.setState({
            selectedPicker: -1,
          })
        },
    });
    Picker.show();
  }

  onPressPicker(choiceDataArray, currentSelectedValue, onValueSelected, rowID) {
		this.setState({
			selectedPicker: rowID,
		})

		var selectedText = "";
		var choices = [];
    //var choices = viewsChoices[rowData.choicesKey];
		for(var i = 0; i < choiceDataArray.length; i++){
      console.log(""+JSON.stringify(choiceDataArray[i]))
			if(currentSelectedValue === choiceDataArray[i].value){
				selectedText = choiceDataArray[i].displayText;
			}
			choices.push(choiceDataArray[i].displayText);
		}

    Picker.init({
        pickerData: choices,
        selectedValue: [selectedText],
				pickerTitleText: "",
				pickerConfirmBtnColor: [25,98,221,1],
				pickerCancelBtnColor: [25,98,221,1],
        onPickerConfirm: data => {
					if(data[0] === ""){
						if(onValueSelected){
              onValueSelected(choiceDataArray[0].value)
            }
					}else{
						for(var i = 0; i < choiceDataArray.length; i++){
							if(data[0] === choiceDataArray[i].displayText){
								if(onValueSelected){
                  onValueSelected(choiceDataArray[i].value);
                }
							}
						}
					}
					this.setState({
						selectedPicker: -1,
					})
        },
    });
    Picker.show();
	}

	hidePicker(){
		Picker.isPickerShow(show => {
			if(show){
				Picker.hide();
				this.setState({
					selectedPicker: -1,
				})
			}
		});
	}

	updateList(){
		this.setState({
				dataSource: this.ds.cloneWithRows(this.listRawData),
		});
	}

  pressHelpButton(){
    alert("help!!!")
  }

  renderChoiceSelectionIcon(){
    if(!this.props.isReadOnlyMode){
      return (<Image style={{width:17.5, height:13.5}} source={require("../../../images/icon_down_arrow.png")} />);
    }else{
      return null;
    }
  }

  renderChoice(rowData, rowID, type){
    var displayText = "";
    var textColor = ColorConstants.INPUT_TEXT_COLOR;
    var choices = viewsChoices[rowData.choicesKey];

    var onPress;
    if(type === "choice"){
      onPress = () => this.onGenericPickerPressed(rowData, rowID);
      for(var i = 0; i < choices.length; i++){
        if(rowData.value === choices[i].value){
          displayText = choices[i].displayText;
        }
      }
    }else if(type === "cascadeChoice"){
      onPress = () => this.onProvincePickerPressed(rowData, rowID);
      Object.keys(rowData.value).forEach((key)=>{
        if(rowData.value[key]){
          if(displayText != ""){
            displayText += ", "
          }
          displayText += rowData.value[key].displayText;
        }
      })
    }

    if(displayText === ""){
      displayText = rowData.hint;
      textColor = ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR;
    }

    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} disabled={this.props.isReadOnlyMode}>
        <View style={styles.rowWrapper}>
          <Text style={styles.rowTitle}>{rowData.title}</Text>
          <View style={styles.valueContent}>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: "center", margin: 0,}}>
              <Text style={[styles.centerText, {color: textColor}]}
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}>
                {displayText}
              </Text>
            </View>
            {this.renderChoiceSelectionIcon()}
          </View>
        </View>
      </TouchableOpacity>
      )
  }

  renderNameHint(){
    if(!this.props.isReadOnlyMode){
      return(
        <Text style={[{color: ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR, fontSize: 12}]}>
          与身份证一致，不可更改
        </Text>
      )
    }else{
      return null;
    }
  }

	renderRow(rowData, sectionID, rowID) {
		if (rowData.type === "choice" || rowData.type === "cascadeChoice") {
			return this.renderChoice(rowData, rowID, rowData.type);
		} else if(rowData.type === "realname"){
      return (
        <View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.title}</Text>
					<Text style={styles.valueText}>
            {rowData.value}
          </Text>
          {this.renderNameHint()}
				</View>
      );
    }else{
      var onChangeText;
      var cardNumber = rowData.value;
      if(rowData.type === "cardNumber"){
        var starSize = cardNumber.length - 10;
        var stars = Array(starSize).join("*")
        var cardNumber = cardNumber.substr(0, 6) + stars + cardNumber.substr(cardNumber.length - 4);
        console.log("render cardnumber " + rowData.value)
        onChangeText = (text)=>this.cardNumberInputChange(text, rowID)
      }else{
        onChangeText = (text)=>this.textInputChange(text, rowID)
      }

			return (
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.title}</Text>
					<TextInput style={styles.valueText}
            editable={!this.props.isReadOnlyMode}
						autoCapitalize="none"
						autoCorrect={false}
						defaultValue={cardNumber}
						placeholder={rowData.hint}
						placeholderTextColor={ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR}
						selectionColor={ColorConstants.INOUT_TEXT_SELECTION_COLOR}
						underlineColorAndroid='transparent'
						onChangeText={(text)=>onChangeText(text, rowID)}
            onChange={(text)=>this.ontextInputChange(text, rowID)}
						/>
				</View>
				)
		}
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted){
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
			)
	}

  renderActionButton(){
    var nextEnabled = true;
    var buttonText = "";
    var buttonAction;
    if(this.props.isReadOnlyMode){
      buttonText = "解除绑定";
      buttonAction = ()=>this.unbindCard();
    }else{
      buttonText = "下一步";
      buttonAction = ()=>this.bindCard();
      //OpenAccountUtils.canGoNext(this.listRawData);
      //console.log("listRawData: " + JSON.stringify(listRawData));
      for (var i = 0; i < this.listRawData.length; i++) {
        if (this.listRawData[i].type === "cascadeChoice") {
          if(this.listRawData[i].Province === null || this.listRawData[i].City === null){
            nextEnabled = false;
            break;
          }
        }else{
          if(this.listRawData[i].value === "" || this.listRawData[i].value === null) {
            nextEnabled = false;
            break;
          }
        }
      };
    }

    return (
      <View style={styles.bottomArea}>
        <Button style={styles.buttonArea}
          enabled={this.state.validateInProgress ? false : nextEnabled}
          onPress={buttonAction}
          textContainerStyle={styles.buttonView}
          textStyle={styles.buttonText}
          text={this.state.validateInProgress? "信息正在检查中...": buttonText} />
      </View>
    );
  }

	render() {
		var pickerModal = null

		if (this.state.selectedPicker>=0) {
			pickerModal = (
				<TouchableOpacity
					style={{backgroundColor:'transparent', flex:1, position:'absolute', top:0, left:0, right: 0, bottom:0}}
					onPress={()=>this.hidePicker()}>
				</TouchableOpacity>
			)
		}

		return (
			<View style={styles.wrapper}>
        <NavBar title="添加银行卡"
          showBackButton={true}
          navigator={this.props.navigator}
          imageOnRight={require('../../../images/icon_question.png')}
          rightImageOnClick={()=>this.pressHelpButton()}
          />
				<ScrollView style={styles.list}>
					{this.renderListView()}
				</ScrollView>
        {this.renderActionButton()}
				{pickerModal}
			</View>
		);
	}

	renderListView(){
		var listDataView = this.listRawData.map((data, i)=>{
			return(
				<View key={i}>
					{this.renderRow(data, 's1', i)}
					{this.renderSeparator('s1', i, false)}
				</View>
			);
		})

		return (
			<View>
				{listDataView}
			</View>);
	}
};

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
   		alignItems: 'stretch',
    	justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},

	list: {
		flex: 1,
	},
	rowWrapper: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#ffffff',
		paddingTop: rowPadding,
		paddingBottom: rowPadding,
	},
	multilineRowWrapper: {
		flexDirection: 'row',
		alignSelf: 'center',
		//alignItems: 'center',
		//height: 120,
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#ffffff',
		paddingTop: rowPadding,
		paddingBottom: rowPadding,
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		marginLeft: 0,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	rowTitle:{
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		width:rowTitleWidth,
	},
	valueText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		flex: 1,
		marginTop: -rowPadding,
		marginBottom: -rowPadding,
		alignItems:'center',
		justifyContent:'center',
		marginLeft:0,
		paddingLeft:0
	},
	centerText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		alignItems:'center',
		justifyContent:'center',
		margin: 0,
	},
	multilineValueText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		flex: 1,
		alignItems:'center',
		justifyContent:'center',
		padding:0,
		margin: 0,
		textAlignVertical: 'top',
		height: Platform.OS === "ios" ? 48 : 65,
		marginTop: Platform.OS === "ios" ? -5 : 0,
		alignSelf: "flex-start",
	},
	valueContent:{
		flex: 1,
		flexDirection: 'row',
	},
	bottomArea: {
		height: 72,
		backgroundColor: 'white',
		alignItems: 'flex-end',
		flexDirection:'row'
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
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
	datePicker: {
		flex:1,
		width: 0,
		padding:0,
		margin: 0,
		marginTop: -rowPadding,
		marginBottom: -rowPadding,
		alignItems:'center',
		justifyContent:'center',
		marginLeft:0,
		paddingLeft:0
	},
});


module.exports = BindCardPage;
