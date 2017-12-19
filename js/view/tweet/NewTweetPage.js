//import liraries
import React, { Component, PropTypes} from 'react';
import { View, Text, StyleSheet,
    Dimensions,
    TextInput, 
    TouchableHighlight,
    TouchableOpacity,
    Alert
} from 'react-native';
var NavBar = require('../NavBar');
var TweetComponent = require('./TweetComponent');
var MainPage = require('../MainPage');
var StockSearchPage = require('../StockSearchPage');
import KeyboardSpacer from '../component/KeyboardSpacer';
var NetConstants = require('../../NetConstants');
var LogicData = require('../../LogicData');
var NetworkModule = require('../../module/NetworkModule');
var ColorConstants = require('../../ColorConstants');

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
                Alert.alert('发布失败', result.errorMessage);
            }
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="发布动态" showBackButton={true} navigator={this.props.navigator}
                    textOnRight='发送'
					rightTextOnClick={()=>this.pressCommitButton()}
					enableRightText={this.state.text.length>0}/>
               
                <TweetComponent ref={TWEET_WRITER} 
                    value={this.state.text}                    
                    onValueChanged={(value)=> {
                        console.log("onValueChanged "  + value)
                        this.setState({text:value})}
                    }/>
                <TouchableHighlight onPress={()=>this.addLinkBlock()} >
                    <View style={styles.bottomActionBar}>
                        <Text style={{color:'#666666', fontSize:30}}>@</Text>
                        <Text style={{color:'#666666'}}>产品</Text>
                    </View>
                </TouchableHighlight>
                <KeyboardSpacer/>
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
    bottomActionBar: {
        width:width, 
        height:60,
        backgroundColor:'white', 
        justifyContent: 'center',
        flexDirection:'column', 
        alignItems:'center',
        borderTopWidth: 0.5,
        borderColor: ColorConstants.SEPARATOR_GRAY,

    }
});

//make this component available to the app
module.exports = NewTweetPage;
