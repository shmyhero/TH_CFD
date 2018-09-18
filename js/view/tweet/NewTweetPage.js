//import liraries
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { View, Text, StyleSheet,
    Dimensions,
    TextInput, 
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native';
var NavBar = require('../NavBar');
import TweetComponent from './TweetComponent';
var MainPage = require('../MainPage');
var StockSearchPage = require('../StockSearchPage');
import KeyboardSpacer from '../component/KeyboardSpacer';
var NetConstants = require('../../NetConstants');
var LogicData = require('../../LogicData');
var NetworkModule = require('../../module/NetworkModule');
var ColorConstants = require('../../ColorConstants');
var UIConstants = require('../../UIConstants')
var LS = require("../../LS");

var {height, width} = Dimensions.get('window')
const TWEET_WRITER = "TweetWriter"
// create a component
class NewTweetPage extends Component {
    static propTypes = {
        onPopOut: PropTypes.func,
    }

    static defaultProps = {
        onPopOut: ()=>{}
    }

    constructor(props){
        super(props)
        
        this.state = {
            text: "",
            contentHeight: height-60-UIConstants.HEADER_HEIGHT
            // text: "12 <a href=\"cfd://page/stock/36004\">456</a> 89",
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
                if(this.props.onPopOut){
                    this.props.onPopOut();
                }
                this.props.navigator.pop();
            },
            (result) => {
                Alert.alert(LS.str("TWEET_PUBLISH_FAILED_TITLE"), result.errorMessage);
            }
        )
    }

    renderKeyboardSpacer(){
        if(Platform.OS == "ios"){
            return (<KeyboardSpacer style={{backgroundColor: "white"}}/>)
        }
    }

    contentHeight = 0;

    render() {
        var {height, width} = Dimensions.get('window');

        var containerViewStyle = {};
        if (this.state.contentHeight !=0){
            containerViewStyle.height = this.state.contentHeight;
        }
        
        return (
            <View style={[styles.container]} onLayout={(event)=>{
                    //On Android, if the keyboard shows up, this function will be triggered and will 
                    //recieve the correct view height. But on iOS this way doesn't work. 
                    //So let's use KeyboardSpacer only for iOS. 
                    console.log("event.nativeEvent.layout.height " + event.nativeEvent.layout.height)
                    console.log("height " + height)
                    this.setState({
                        contentHeight: event.nativeEvent.layout.height
                    })
                }}>
                <View style={[{position:'absolute', top:0, left:0, right:0, bottom: 0}, containerViewStyle]}>
                    <NavBar title={LS.str("TWEET_PUBLISH")} showBackButton={true} navigator={this.props.navigator}
                        textOnRight={LS.str("CONFIG_SEND")}
                        rightTextOnClick={()=>this.pressCommitButton()}
                        enableRightText={this.state.text.length>0}/>
                
                    <TweetComponent ref={TWEET_WRITER} 
                        value={this.state.text}                    
                        onValueChanged={(value)=> {
                            console.log("onValueChanged "  + value)
                            this.setState({text:value})}
                    }/>
                
                    <TouchableHighlight style={{backgroundColor:'red'}} onPress={()=>this.addLinkBlock()} >
                        <View style={styles.bottomActionBar}>
                            <Text style={{color:'#666666', fontSize:30}}>@</Text>
                            <Text style={{color:'#666666'}}>{LS.str("TWEET_PUBLISH_PRODUCTS")}</Text>
                        </View>
                    </TouchableHighlight>

                    {this.renderKeyboardSpacer()}
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width
    },
    bottomActionBar: {
        width:width, 
        height:60,
        backgroundColor:'white', 
        justifyContent: 'center',
        flexDirection:'column', 
        alignItems:'center',
        borderTopWidth: 1,
        borderBottomWidth: 0,
        borderColor: ColorConstants.SEPARATOR_GRAY,
    }
});

//make this component available to the app
module.exports = NewTweetPage;
