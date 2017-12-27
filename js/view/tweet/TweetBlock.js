//import liraries
import React, { Component, PropTypes} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
var TweetParser = require("./TweetParser")
var MainPage = require("../MainPage")

// create a component
class TweetBlock extends Component {
    static propTypes = {
        value: PropTypes.string,
        style: View.propTypes.style,
        onBlockPressed: PropTypes.func,
    }
    
    static defaultProps = {
        value:'',
        style: {},
        onBlockPressed: (stockID)=>{}
    }

    constructor(props){
        super(props)

        var textNodes = TweetParser.parseTextNodes(this.props.value);
        this.state = {
            textNodes: textNodes
        };
    }

    componentWillReceiveProps(props){
        if(props.value != this.props.value){
            var textNodes = TweetParser.parseTextNodes(props.value);
            this.state = {
                textNodes: textNodes
            };
        }
    }

    render() {
        var fontSize = 15;
        if(this.props.style && this.props.style.fontSize){
            fontSize = this.props.style.fontSize
        }
        var parsedListView = this.state.textNodes.map((node, index, array)=>{
            if(node.type == "text"){
                return (
                    <Text key={index}
                          style={[styles.textPart, {fontSize:fontSize}]}>
                        {node.text}
                    </Text>)
            }else if(node.type == "link"){
                return (
                    <Text key={index}
                        onPress={()=>{
                            MainPage.gotoStockDetail({
                                CName: node.text.substring(1), //Remove the first @
                                StockID: node.id,
                            });
                            console.log("node.link " + node.link)
                            this.props.onBlockPressed(node.link);
                        }}
                        style={[styles.linkedPart, {fontSize:fontSize}]}>
                        {node.text}
                    </Text>
                )
            }
        });

        return (           
            <Text style={[styles.container, this.props.style]}>
                {parsedListView}
            </Text>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    textPart:{
        fontSize: 15,
    },

    linkedPart:{
        color:'blue',
        fontSize: 30,
    }
});

//make this component available to the app
module.exports = TweetBlock;