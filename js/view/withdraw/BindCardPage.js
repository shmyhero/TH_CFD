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
		{"title":"支行名称", "key": "Branch", "value":"", hint:"请输入支行名称", maxLength: 50,},
		{"title":"银行卡号", "key": "AccountNumber", "value":"", hint:"请输入银行卡号", maxLength:50, "type": "cardNumber",},
];

export default class BindCardPage extends Component {
	hardwareBackPress = ()=>{return this.backButtonPressed();};
	pickerDisplayed = false;
  listRawData = [];
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 });
  provinceAndCities = [];
	SupportedBanks = UserInfoSelectorProvider.getSupportedBanks();

  static propTypes = {
		popToOutsidePage: PropTypes.func,
  }

  static defaultProps = {
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

    //Get banks
    NetworkModule.fetchTHUrl(NetConstants.CFD_API.GET_SUPPORT_WITHDRAW_BANKS,
      {
				method: 'GET',
			},
      (responseJson)=>{
        try{
          this.SupportedBanks = [];
          for(var i = 0; i < responseJson.length; i++){
            this.SupportedBanks.push({"value": responseJson[i].cname, "logo": responseJson[i].logo});
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
			if(responseJson[i].ParentId){
				//City
				for(var j = 0; j < this.provinceAndCities.length; j++){
					if(responseJson[i].ParentId === this.provinceAndCities[j].value){
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
  }
	//
	// componentDidMount(){
	// 	var routes = this.props.navigator.getCurrentRoutes();
	// 	console.log("componentDidMount routes: " + JSON.stringify(routes))
	// 	var withdrawParentRouteIndex = routes.length - 2
	// 	for(; withdrawParentRouteIndex > 0 ; withdrawParentRouteIndex-- ){
	// 		if(routes[withdrawParentRouteIndex].name == MainPage.DEPOSIT_WITHDRAW_ROUTE){
	// 			console.log("found " + withdrawParentRouteIndex);
	// 			break;
	// 		}else{
	// 			console.log("not right! " + withdrawParentRouteIndex);
	// 		}
	// 	}
	// 	if(withdrawParentRouteIndex != routes.length - 2){
	// 		routes.splice(withdrawParentRouteIndex, 1);
	// 		console.log("new componentDidMount routes: " + JSON.stringify(routes))
	// 		this.props.navigator.immediatelyResetRouteStack(routes);
	// 	}
	// }

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
				if(this.listRawData[i].key === "ProvinceAndCity"){
					body.City = this.listRawData[i].value.City.displayText;
          body.Province = this.listRawData[i].value.Province.displayText;
				}else{
          body[this.listRawData[i].key] = this.listRawData[i].value;
        }
			}
		}
		//
		// console.log("this.listRawData " + JSON.stringify(this.listRawData))
		console.log("body " + JSON.stringify(body))
		//
		// this.setState({
		// 	validateInProgress: false,
		// });
		// return

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
						this.props.navigator.replace({
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
    if(finalText.length < this.listRawData[rowID].maxLength){
	    if(text !== finalText || this.listRawData[rowID].value !== finalText){
	      this.listRawData[rowID].value = finalText;
	      console.log("updateList");
	  		this.updateList();
	    }
		}else{
			this.listRawData[rowID].value = this.listRawData[rowID].value;
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

    if(!choiceDataArray || choiceDataArray.length === 0){
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
		console.log(JSON.stringify(choiceDataArray));
		console.log(JSON.stringify(choices));

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
				selectedText = choiceDataArray[i].value;
			}
			choices.push(choiceDataArray[i].value);
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
							if(data[0] === choiceDataArray[i].value){
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
    return (<Image style={{width:17.5, height:13.5}} source={require("../../../images/icon_down_arrow.png")} />);
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
	          displayText = choices[i].value;
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
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
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
    return(
      <Text style={[{color: ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR, fontSize: 12}]}>
        与身份证一致，不可更改
      </Text>
    )
  }

	renderRowValue(rowData, rowID){
		var onChangeText;
		var displayText = rowData.value;
		var keyboardType = "default"
		if(rowData.type === "cardNumber"){
			keyboardType = 'numeric';
			onChangeText = (text)=>this.cardNumberInputChange(text, rowID)
		}else{
			onChangeText = (text)=>this.textInputChange(text, rowID)
		}

		return (<TextInput style={styles.valueText}
				editable={true}
				autoCapitalize="none"
				autoCorrect={false}
				defaultValue={displayText}
				placeholder={rowData.hint}
				placeholderTextColor={ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR}
				selectionColor={ColorConstants.INOUT_TEXT_SELECTION_COLOR}
				underlineColorAndroid='transparent'
				onChangeText={(text)=>onChangeText(text, rowID)}
				onEndEditing={(event)=>{onChangeText(event.nativeEvent.text, rowID)}}
				keyboardType={keyboardType}
				ellipsizeMode={''}
				maxLength={rowData.maxLength-1}
				/>);
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
			return (
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.title}</Text>
					{this.renderRowValue(rowData, rowID)}
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

		var navbarTitle = "添加银行卡";

		return (
			<View style={styles.wrapper}>
        <NavBar title={navbarTitle}
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
