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
	Modal,
	Alert,
	BackAndroid,
	Keyboard,
} from 'react-native';

import Picker from 'react-native-picker';

var Button = require('../component/Button')
var CheckBoxButton = require('../component/CheckBoxButton')
var MainPage = require('../MainPage')
var LogicData = require('../../LogicData')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var NavBar = require('../NavBar')
var UserInfoSelectorProvider = require('./UserInfoSelectorProvider')

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

var defaultRawData = [
		{"title":"姓名", "key": "AccountHolder", "value":"", hint:"请输入姓名", "type": "realname",},
		{"title":"开户城市", "key": "ProvinceAndCity", "value":{"Province": null, "City": null}, hint: "点击选择", "type": "cascadeChoice", "choicesKey": "Provices"},
		{"title":"开户银行", "key": "NameOfBank", "value":"", hint: "点击选择", "type": "choice", "choicesKey": "SupportedBanks"},
		{"title":"支行名称", "key": "Branch", "value":"", hint:"请输入支行名称", maxLength: 18, minLength: 18,},
		{"title":"银行卡号", "key": "AccountNumber", "value":"", hint:"请输入银行卡号", maxLength:75, "type": "cardNumber",},
];

export default class BindCardPage extends Component {
	hardwareBackPress = ()=>{return this.backButtonPressed();};
	pickerDisplayed = false;
  listRawData = [];
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 });
  provinceAndCities = [];
	SupportedBanks = UserInfoSelectorProvider.getSupportedBanks();

  static propTypes = {
    isUnbindMode: PropTypes.bool,
		popToOutsidePage: PropTypes.func,
  }

  static defaultProps = {
    isUnbindMode: false,
		popToOutsidePage: ()=>{},
  }

  constructor(props) {
	  super(props);

    this.listRawData = JSON.parse(JSON.stringify(defaultRawData));

    this.state={
      dataSource: this.ds.cloneWithRows(this.listRawData),
			validateInProgress: false,
			selectedPicker: -1,
			modalVisible: false,
    }
  }

	componentWillUnmount(){
		BackAndroid.removeEventListener('hardwareBackPress', this.hardwareBackPress);
	}

  componentWillMount(){
		BackAndroid.addEventListener('hardwareBackPress', this.hardwareBackPress);

		var liveUserInfo = LogicData.getLiveUserInfo();
		this.listRawData[0].value = liveUserInfo.lastName + liveUserInfo.firstName;

    if(this.props.isUnbindMode){
      //Get the users card information.
			for(var i = 0; i < this.listRawData.length; i++){
        switch(this.listRawData[i].key){
          case "ProvinceAndCity":
            this.listRawData[i].value = {Province:{"displayText":liveUserInfo.province}, City: {"displayText":liveUserInfo.city}};
            break;
          case "AccountHolder":
            this.listRawData[i].value = liveUserInfo.lastName + liveUserInfo.firstName;
            break;
          case "NameOfBank":
            this.listRawData[i].value = liveUserInfo.bankName;
            break;
          case "Branch":
            this.listRawData[i].value = liveUserInfo.branch;
            break;
          case "AccountNumber":
            var cardNumber = liveUserInfo.bankCardNumber;

						//Star the card number!
            var realNumberString = cardNumber.split(" ").join('');
            var startIndex = Math.max(0, (realNumberString.length > 10 ? 6 : ((realNumberString.length / 2).toFixed(0) - 1)));
            var endIndex = Math.max(0, realNumberString.length > 10 ? 4 : ((realNumberString.length / 2).toFixed(0) - 2));
            var starSize = realNumberString.length - startIndex - endIndex;

            var stars = Array(starSize+1).join("*")
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

    //Get userinfo
    // NetworkModule.fetchTHUrl(NetConstants.CFD_API.GET_USER_INFO,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
    //     },
    //   },
    //   (responseJson)=>{
    //     this.listRawData[0].value = responseJson.lastName + responseJson.firstName;
    //     this.updateList();
    //   },
    //   (result)=>{
		//
    //   });

	  if(!this.props.isUnbindMode){
	    //Get banks
	    NetworkModule.fetchTHUrl(NetConstants.CFD_API.GET_SUPPORT_WITHDRAW_BANKS,
	      {
					method: 'GET',
				},
	      (responseJson)=>{
	        try{
	          this.SupportedBanks = [];
	          for(var i = 0; i < responseJson.length; i++){
	            this.SupportedBanks.push({"value": responseJson[i].cname, "displayText": responseJson[i].cname, "logo": responseJson[i].logo});
	          }
	        }catch(err){
	          console.log("error " + err)
	        }
	      },
	      (result)=>{

	      });

			console.log("get all areas");
			var responseJson = UserInfoSelectorProvider.getAllAreas();
			console.log("get all areas responseJson " + JSON.stringify(responseJson));

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
			console.log("get all areas this.provinceAndCities " + JSON.stringify(this.provinceAndCities));

	    //Get Provices
	    //Provices and cities won't updated, so write it down locally.
	    // NetworkModule.fetchTHUrl(NetConstants.CFD_API.GET_ALL_PROVINCES_AND_CITIES,
	    //   {
	  	// 		method: 'GET',
	  	// 	},
	    //   (responseJson)=>{
	    //     this.provinceAndCities = [];
	    //     for(var i = 0; i < responseJson.length; i++){
	    //       //{"value":110000,"displayText":"北京","ShortName":"北京"},
	    //       if(responseJson[i].ParentId){
	    //         //City
	    //         for(var j = 0; j < this.provinceAndCities.length; j++){
	    //           if(responseJson[i].ParentId == this.provinceAndCities[j].value){
	    //             this.provinceAndCities[j].children.push({"value": responseJson[i].Id, "displayText": responseJson[i].Name})
	    //             break;
	    //           }
	    //         }
	    //       }else{
	    //         //Province
	    //         this.provinceAndCities.push({"value": responseJson[i].Id, "displayText": responseJson[i].Name, children: []});
	    //       }
			//
	    //     }
	    //   },
	    //   (result)=>{
			//
	    //   });
		}
  }

  getCity(provinceId, onGetCitiesFinished, onGetCitiesFailed){
    this.Cities = [];
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
          this.Cities.push({"value": responseJson[i].Id, "displayText": responseJson[i].Name});
        }
        if(onGetCitiesFinished){
          onGetCitiesFinished(this.Cities);
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
		Keyboard.dismiss();

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

    //Bind bank account
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
					//Refresh userinfo
			    NetworkModule.fetchTHUrl(NetConstants.CFD_API.GET_USER_INFO,
		      {
		        method: 'GET',
		        headers: {
		          'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
		        },
		      },
		      (responseJson)=>{
		        LogicData.setLiveUserInfo(responseJson);
	          this.props.navigator.push({
	            'name': MainPage.WITHDRAW_ROUTE,
							'popToOutsidePage': this.props.popToOutsidePage,
	          });
		      },
		      (result)=>{
						this.setState({
		          validateInProgress: false,
		        });
						Alert.alert('', result.errorMessage, [{text: '确认',}]);
		      });
				}else{
					//Do something???
				}
      },
      (result)=>{
        this.setState({
          validateInProgress: false,
        });
				Alert.alert('', result.errorMessage, [{text: '确认',}]);
      });
	}

	readyToUnbindCard(){
		// this.setState({
		// 	modalVisible: true,
		// });
		var liveUserInfo = LogicData.getLiveUserInfo();
		var cardNumber = liveUserInfo.bankCardNumber;
		var realNumberString = cardNumber.split(" ").join('');
		var lastNumber = realNumberString.slice(realNumberString.length - 4);

		Alert.alert(
		  '确认删除',
		  '尾号为' + lastNumber + "的银行卡",
		  [
		    {text: '取消', onPress: () => console.log('cancel unbind  d'), style: 'cancel'},
			  {text: '确认', onPress: () => this.unbindCard()},
		  ]
		)
	}

  unbindCard(){
		// this.setState({
		// 	modalVisible: false,
		// });

		var userData = LogicData.getUserData()
		if(userData.token == undefined){return}

		//Get userinfo
		NetworkModule.fetchTHUrl(NetConstants.CFD_API.REQUEST_UNBIND_CARD,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			(responseJson)=>{
				console.log("aaaa");
				var liveUserInfo = LogicData.getLiveUserInfo();
				var clearedInfo = {};
				clearedInfo.firstName = liveUserInfo.firstName;
				clearedInfo.lastName = liveUserInfo.lastName;
				LogicData.setLiveUserInfo(clearedInfo);

				console.log("bbbb");

				var routes = this.props.navigator.getCurrentRoutes();
				var popToRoute = null;
				for(var i = routes.length - 2; i >= 0 ;i --){
					if(routes[i].name === MainPage.DEPOSIT_WITHDRAW_ROUTE){
						popToRoute = routes[i];
						break;
					}
				}

				if(popToRoute){
					this.props.navigator.popToRoute(popToRoute);
				}else{
					this.props.navigator.pop();
				}
			},
			(result)=>{
				alert(result.errorMessage);
			});

  }

	backButtonPressed(){
		Picker.isPickerShow(show => {
			if(show){
				Picker.hide();
				this.setState({
					selectedPicker: -1,
				})
			}else{
				this.props.popToOutsidePage && this.props.popToOutsidePage();
				this.props.navigator.pop();
			}
		});

		return true;
	}

	_setModalVisible(value){
		this.setState({
			modalVisible: value
		})
	}

	textInputChange(text, rowID) {
		if(this.listRawData[rowID].value !== text){
			this.listRawData[rowID].value = text;
			this.updateList();
		}
	}

  cardNumberInputChange(text, rowID){
    var placeholder = text.split(" ").join('');
    var finalText = ""
    for(var i = 0; i < placeholder.length; i +=4){
      if(i!=0){
        finalText+=" ";
      }
      finalText += placeholder.slice(i, i+4);
    }
    console.log("finalText: " + finalText + ", finally!");
    console.log("this.listRawData[rowID].value: " + this.listRawData[rowID].value);
    console.log("text: " + text);
    if(text !== finalText || this.listRawData[rowID].value !== finalText){
      this.listRawData[rowID].value = finalText;
      console.log("updateList");
  		this.updateList();
    }
  }

  onProvincePickerPressed(rowData, rowID){
    this.showCascadePicker(this.provinceAndCities, [rowData.value.Province, rowData.value.City], rowID, (province, city)=>{
      this.listRawData[rowID].value.Province = province;
      this.listRawData[rowID].value.City = city;
      this.updateList();
    });
  }

  onGenericPickerPressed(rowData, rowID){
    this.onPressPicker(this[rowData.choicesKey],
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
		this.props.navigator.push({
      name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
      url: NetConstants.TRADEHERO_API.HELP_CENTER_URL_ACTUAL,
      isShowNav: false,
      title: "帮助中心",
    });
  }

  renderChoiceSelectionIcon(){
    if(!this.props.isUnbindMode){
      return (<Image style={{width:17.5, height:13.5}} source={require("../../../images/icon_down_arrow.png")} />);
    }else{
      return null;
    }
  }

  renderChoice(rowData, rowID, type){
    var displayText = "";
    var textColor = ColorConstants.INPUT_TEXT_COLOR;
    var choices = this[rowData.choicesKey];

    var onPress;
    if(type === "choice"){

      onPress = () => this.onGenericPickerPressed(rowData, rowID);
			if(rowData.value){
				displayText = rowData.value;
			}else{
	      for(var i = 0; i < choices.length; i++){
	        if(rowData.value === choices[i].value){
	          displayText = choices[i].displayText;
	        }
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
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} disabled={this.props.isUnbindMode}>
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
    if(!this.props.isUnbindMode){
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
			var keyboardType = "default"
      if(rowData.type === "cardNumber"){
				keyboardType = 'numeric';
        onChangeText = (text)=>this.cardNumberInputChange(text, rowID)
      }else{
        onChangeText = (text)=>this.textInputChange(text, rowID)
      }

			return (
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.title}</Text>
					<TextInput style={styles.valueText}
            editable={!this.props.isUnbindMode}
						autoCapitalize="none"
						autoCorrect={false}
						defaultValue={cardNumber}
						placeholder={rowData.hint}
						placeholderTextColor={ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR}
						selectionColor={ColorConstants.INOUT_TEXT_SELECTION_COLOR}
						underlineColorAndroid='transparent'
						onChangeText={(text)=>onChangeText(text, rowID)}
						onEndEditing={(event)=>{onChangeText(event.nativeEvent.text, rowID)}}
            keyboardType={keyboardType}
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
    if(this.props.isUnbindMode){
      buttonText = "解除绑定";
      buttonAction = ()=>this.readyToUnbindCard();
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
        <NavBar title={this.props.isUnbindMode ? "我的银行卡" : "添加银行卡"}
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
				{/* {this.renderUnbindCardDialog()} */}
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

	renderUnbindCardDialog(){
		var liveUserInfo = LogicData.getLiveUserInfo();
		var cardNumber = liveUserInfo.bankCardNumber;
		var realNumberString = cardNumber.split(" ").join('');
		var lastNumber = realNumberString.slice(realNumberString.length - 4);

		if(this.props.isUnbindMode){
			return(
				<Modal
	        transparent={true}
	        visible={this.state.modalVisible}
	        animationType={"slide"}
	        style={{height: height, width: width}}
	        onRequestClose={() => {this._setModalVisible(false)}}
	        >
					<View style={styles.modalContainer}>

						<TouchableOpacity style={{flex: 1}} onPress={() => this._setModalVisible(false)}>
						</TouchableOpacity>

						<View style={{height:200, width: width, backgroundColor: "#f8f8f8"}}>
							<Text style={{alignSelf: 'center',
								fontSize: 18,
								marginTop: 30}}>
								{"确定删除尾号为" + lastNumber + "的银行卡？"}
							</Text>
							<TouchableOpacity style={{alignItems:'center'}} onPress={()=>this.unbindCard()}>
								<View style={{borderRadius:5, backgroundColor: ColorConstants.TITLE_BLUE, height: 48, width: 105,
									alignItems:'center', justifyContent:'center',
									marginTop: 30}}>
									<Text style={{
										color: '#ffffff',
										textAlign: 'center',
										alignItems:'center',}}>
										确认
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
	      </Modal>
			);
		}
		else{
			return null;
		}
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
	modalContainer:{
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		backgroundColor:'rgba(0, 0, 0, 0.5)',
		// paddingBottom:height/2,
	},
});


module.exports = BindCardPage;
