//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,
    Dimensions,
    TextInput, 
    TouchableHighlight,
    TouchableOpacity} from 'react-native';
var NavBar = require('../NavBar')
var TweetComponent = require('./TweetComponent')
var MainPage = require('../MainPage')
var StockSearchPage = require('../StockSearchPage')
import KeyboardSpacer from '../component/KeyboardSpacer';
var NetConstants = require('../../NetConstants')
var LogicData = require('../../LogicData')
var NetworkModule = require('../../module/NetworkModule')

var {height, width} = Dimensions.get('window')
const TWEET_WRITER = "TweetWriter"
// create a component
class NewTweetPage extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            text: "12 <a href=\"cfd://page/stock/36004\">456</a> 89",
        };
    }

    addLinkBlock() {
        this.props.navigator.push({
            name: MainPage.STOCK_SEARCH_ROUTE,
            searchType: "getItem",
            onGetItem: (item)=>{
                this.refs[TWEET_WRITER].insertItem(item)
            }
        })
    }

    handleTextChange(event) {
        const {name, type, value} = event.nativeEvent;
        let processedData = value;
        if(type==='text') {
            processedData = value.toUpperCase();
        } else if (type==='number') {
            processedData = value * 2;
        }
        //this.setState({[name]: processedData})
    }

    pressCommitButton(){
        var userData = LogicData.getUserData()

        var body = {'message': this.state.text}
        NetworkModule.fetchTHUrl(
            NetConstants.CFD_API.SUBMIT_TREND,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            },
            (responseJson) => {
               //  Alert.alert('set deviceToken success auth： ' + alertData.deviceToken +" * " +alertData.deviceType);
                console.log()
                this.props.navigator.pop();
            },
            (result) => {
                console.log('errorMessage' + result.errorMessage);
            }
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="发表动态" showBackButton={true} navigator={this.props.navigator}
                    textOnRight='发送'
					rightTextOnClick={()=>this.pressCommitButton()}
					enableRightText={this.state.text.length>0}/>
               
                <TweetComponent ref={TWEET_WRITER} 
                    value={this.state.text}
                    style={{backgroundColor:'red'}} 
                    onValueChanged={(value)=> {
                        console.log("onValueChanged "  + value)
                    this.setState({text:value})}
                    }/>
                <TouchableHighlight onPress={()=>this.addLinkBlock()} 
                    style={{height:60}}>
                    <View style={{width:width, height:50, backgroundColor:'white', 
                        flexDirection:'column', alignItems:'center'}}>
                        <Text style={{color:'#666666', fontSize:20}}>@</Text>
                        <Text style={{color:'#666666'}}>产品</Text>
                    </View>
                </TouchableHighlight>
                <KeyboardSpacer style={{}}/>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
    },
});

//make this component available to the app
module.exports = NewTweetPage;
