//import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View,
    Text,
    StyleSheet,
    Dimensions,
    Clipboard,
    TouchableOpacity,
    ScrollView,
    Platform
} from 'react-native';
var TweetParser = require('./TweetParser');
import CustomTextInput from '../component/CustomTextInput';
var {height, width} = Dimensions.get('window');

//var TweetBlock = require('./TweetBlock')
class TweetComponent extends Component {
    lastSelection = {start:0, end:0}
    lastPressedKey = "";

    static propTypes = {
        value: PropTypes.string,
        onValueChanged: PropTypes.func,
    }

    static defaultProps = {
        value:'',
        onValueChanged: (text)=>{}
    }

    constructor(props) {
        super(props);

        //props.text
        this.textNodes = TweetParser.parseTextNodes(this.props.value);
        this.htmlText = this.props.value;
        //console.log("textNodes" + JSON.stringify(textNodes))
        var displayText = this.getDisplayText(this.textNodes);
        this.state = {
            displayText: displayText,
            selection:{ start: 0, end: 0},
            textInputHeight:38
        };
    }

    htmlText = "";
    textNodes = [];

    insertItem(item){
        console.log("insertItem");
        var linkText = TweetParser.convertItemToTagString(item);
        //console.log("linkText this.state.selection.start " + this.state.selection.start + ", this.state.selection.end " + this.state.selection.end);

        this.lastSelection = {
            start: this.state.selection.start,
            end: this.state.selection.end
        };

        this.insertText(linkText, {
            start:this.state.selection.start,
            end:this.state.selection.end,
        });
        
        var displayText = this.getDisplayText(this.textNodes);
        this.refs["TextInput"].setText(displayText);
    }

    getDisplayText(textNodes){
        var displayText = ""
        for(var i = 0; i < textNodes.length; i++){
            displayText += textNodes[i].text;
        }
        return displayText;
    }

    getCurrentPartSelections(newSelectionStart, newSelectionEnd){
        var partSelection = []
        var currentPartStart = 0;
        var currentPartEnd = 0;

        for (var i = 0; i < this.textNodes.length; i ++){
            var textPart = this.textNodes[i];
            currentPartStart = currentPartEnd
            currentPartEnd = currentPartStart + textPart.text.length;
            // console.log("getCurrentPartSelections currentPartStart " + currentPartStart)
            // console.log("getCurrentPartSelections currentPartEnd " + currentPartEnd)
            // console.log("getCurrentPartSelections newSelectionStart " + newSelectionStart)
            // console.log("getCurrentPartSelections newSelectionEnd " + newSelectionEnd)

            if((newSelectionStart <= currentPartEnd 
                && newSelectionEnd > currentPartStart)
                || newSelectionEnd == 0 && i ==0){
                if(newSelectionStart == currentPartEnd && textPart.type == "link"){
                    continue;
                }
                partSelection.push({
                    "part": i,
                    "partStartInWholeString": currentPartStart,
                    "partEndInWholeString": currentPartEnd,
                    "selectionStart": Math.max(newSelectionStart - currentPartStart, 0),
                    "selectionEnd": Math.min(newSelectionEnd - currentPartStart, textPart.text.length)
                })
            }            
        }

        //console.log("partSelection " + JSON.stringify(partSelection));
        return partSelection;
    }

    updateSelection(event){
        if(this.lastPressedKey != "" && Platform.OS == "android"){
            //Fix Android crash issue.
            return;
        }

        // console.log(event.nativeEvent)
        var newSelectionStart = Math.min(event.nativeEvent.selection.start,event.nativeEvent.selection.end);
        var newSelectionEnd = Math.max(event.nativeEvent.selection.start,event.nativeEvent.selection.end);

        var partSelections = this.getCurrentPartSelections(newSelectionStart, newSelectionEnd);
        for (var i=0; i < partSelections.length; i++) {
            var partSelection = partSelections[i];
            var currentPartEnd = partSelection.partEndInWholeString;
            var currentPartStart = partSelection.partStartInWholeString;
            var textPart = this.textNodes[partSelection.part]
            if (newSelectionEnd <= currentPartEnd) {
                //The selected part is link, just select all.
                if (textPart.type == "link") {
                    if (newSelectionStart == newSelectionEnd && newSelectionStart == currentPartEnd){
                        //The selection is at the end of the link, do nothing.
                    }
                    else {
                        if (newSelectionStart > currentPartStart){
                            newSelectionStart = currentPartStart;
                        }
                        if (newSelectionEnd < currentPartEnd){
                            newSelectionEnd = currentPartEnd;
                        }
                    }
                }
                break;
            }
        }

        this.lastSelection = {
            start: this.state.selection.start,
            end: this.state.selection.end
        };

        console.log("newSelectionEnd " + newSelectionEnd)
        console.log("newSelectionStart " + newSelectionStart)
        console.log("this.state.displayText " + this.state.displayText)
        console.log("this.state.displayText.length " + this.state.displayText.length)

        if(Platform.OS == "android" &&
            (newSelectionStart > this.state.displayText.length
            || newSelectionEnd > this.state.displayText.length )){
            return;
        }

        if(this.state.selection.start != newSelectionStart ||
            this.state.selection.end != newSelectionEnd){
            console.log("updateSelection newSelectionStart:", newSelectionStart)
            console.log("updateSelection newSelectionEnd:", newSelectionEnd)
            this.setState({
                selection:{ start: newSelectionStart, end: newSelectionEnd }
            });
        }

    }

    onKeyPress(event){
        var pressedKey = event.nativeEvent.key
        //console.log("onKeyPress " + pressedKey)
        if(pressedKey == "Backspace"){
            pressedKey = "<Backspace/>"
        }
        else if(pressedKey == "Enter"){
            pressedKey = "";
        }

        this.lastPressedKey = pressedKey;
    }

    insertText(insertedText, selection){
        console.log("insertText");
        
        var originalText = this.generateText();

        var OriginalTextselectionStart = -1;
        var OriginalTextselectionEnd = -1;
        var textNodes = this.textNodes;
        var currentTextIndex = 0;

        var partSelections = this.getCurrentPartSelections(
            selection.start, selection.end);

        console.log("insertText partSelections ", partSelections);

        for (var partIndex = 0; partIndex < textNodes.length; partIndex++){
            var textPart = textNodes[partIndex];
            for (var i = 0; i < partSelections.length; i++) {
                var partSelection = partSelections[i];
                var currentPartIndex = partSelection.part;
                console.log("selection part " + currentPartIndex)
                if(partIndex == currentPartIndex){
                    console.log("parse part " + partIndex)
                    //The part is in selection.
                    if(OriginalTextselectionStart == -1){
                        if(textPart.type == "link"){
                            if (insertedText == "<Backspace/>"){
                                //Select All if the input key is backspace!!!
                                OriginalTextselectionStart = currentTextIndex;
                            }else{
                                //The link will only be fully selected, or the last selected.
                                console.log("textPart.text.length " + textPart.text.length)
                                console.log("textPart.selectionStart " + partSelection.selectionStart)
                                if(textPart.text.length == partSelection.selectionStart){
                                    OriginalTextselectionStart = currentTextIndex + textPart.originalText.length;
                                }else{
                                    OriginalTextselectionStart = currentTextIndex;
                                }
                            }

                        }else{
                            console.log("currentTextIndex ",currentTextIndex)
                            console.log("partSelection.selectionStart ",partSelection.selectionStart)
                                
                            OriginalTextselectionStart = currentTextIndex + partSelection.selectionStart
                        }
                    }

                    if(textPart.type == "text"){
                        OriginalTextselectionEnd = currentTextIndex + partSelection.selectionEnd;
                    }else if(textPart.type == "link"){
                        // If it is a link part, always select all.
                        //console.log("textPart.originalText " + textPart.originalText)
                        if (insertedText == "<Backspace/>"){
                            //Select All if the input key is backspace!!!
                            OriginalTextselectionEnd = currentTextIndex + textPart.originalText.length;
                        }else{
                            if(partSelection.selectionStart == partSelection.selectionEnd){
                                OriginalTextselectionEnd = OriginalTextselectionStart;
                            }else{
                                OriginalTextselectionEnd = currentTextIndex + textPart.originalText.length;
                            }
                        }
                        //console.log("textPart.originalTextPart " + this.htmlText.substring(0, textPart.originalText))
                    }

                }else{
                    continue;
                }
            }
            currentTextIndex += textPart.originalText.length;
        }

        if(OriginalTextselectionStart == -1){
            OriginalTextselectionStart = originalText.length;
        }
        if(OriginalTextselectionEnd == -1){
            OriginalTextselectionEnd = originalText.length;
        }

        var newOriginalText = "";
        if (insertedText == "<Backspace/>"){
            if(OriginalTextselectionStart != OriginalTextselectionEnd){
                newOriginalText = originalText.substring(0, OriginalTextselectionStart)
                + originalText.substring(OriginalTextselectionEnd, originalText.length);
            }else{
                newOriginalText = originalText.substring(0, OriginalTextselectionStart-1)
                + originalText.substring(OriginalTextselectionEnd, originalText.length);
            }
        }
        else {
            newOriginalText = originalText.substring(0, OriginalTextselectionStart)
            + insertedText
            + originalText.substring(OriginalTextselectionEnd, originalText.length);
        }

        var currentEnd = this.state.selection.start;
        if (insertedText == "<Backspace/>"){
            if(this.state.selection.start == this.state.selection.end){
                if(currentEnd >0){
                    currentEnd = currentEnd - 1;
                }
            }
        }else{
            var newTextNodes = TweetParser.parseTextNodes(insertedText);
            for (var i = 0; i < newTextNodes.length; i++){
                currentEnd += newTextNodes[i].text.length;
            }
        }

        var newOriginalText = "";
        // console.log("insertText OriginalTextselectionStart " + OriginalTextselectionStart)
        // console.log("insertText OriginalTextselectionEnd " + OriginalTextselectionEnd)
        // console.log("originalText.substring(0, OriginalTextselectionStart) " + originalText.substring(0, OriginalTextselectionStart));
        // console.log("this.htmlText.substring(OriginalTextselectionEnd, this.htmlText.length) " + this.htmlText.substring(OriginalTextselectionEnd, this.htmlText.length));

        if (insertedText == "<Backspace/>"){
            if(OriginalTextselectionStart != OriginalTextselectionEnd){
                newOriginalText = originalText.substring(0, OriginalTextselectionStart)
                + this.htmlText.substring(OriginalTextselectionEnd, this.htmlText.length);
            }else{
                newOriginalText = originalText.substring(0, OriginalTextselectionStart-1)
                + this.htmlText.substring(OriginalTextselectionEnd, this.htmlText.length);
            }
            console.log("this.htmlText ", this.htmlText);
            console.log("OriginalTextselectionStart ", OriginalTextselectionStart);
            console.log("OriginalTextselectionEnd ", OriginalTextselectionEnd);
            console.log("newOriginalText ", newOriginalText);
        }
        else {
            newOriginalText = originalText.substring(0, OriginalTextselectionStart)
            + insertedText
            + this.htmlText.substring(OriginalTextselectionEnd, this.htmlText.length);
        }
        console.log("OriginalTextselectionStart ", OriginalTextselectionStart)
        console.log("OriginalTextselectionEnd ", OriginalTextselectionEnd)        
        console.log("insertedText ", insertedText)
        console.log("this.htmlText ", this.htmlText)
        console.log("this.htmlText.substring(OriginalTextselectionEnd, this.htmlText.length) ", this.htmlText.substring(OriginalTextselectionEnd, this.htmlText.length))

        this.lastSelection = {
            start: this.state.selection.start,
            end: this.state.selection.end
        };

        textNodes = TweetParser.parseTextNodes(newOriginalText);
        var displayText = this.getDisplayText(textNodes);

        console.log("onChangeText newOriginalText ", newOriginalText)
        console.log("onChangeText displayText ", displayText)
        console.log("this.lastSelection ", JSON.stringify(this.lastSelection))
        if (displayText != this.state.displayText){
            this.props.onValueChanged && this.props.onValueChanged(newOriginalText);
        }
        console.log("onChangeText this.state.selection " + JSON.stringify(this.state.selection))


        this.lastPressedKey = "";

        this.htmlText = newOriginalText;
        this.textNodes = textNodes;

        this.setState({
            displayText: displayText,
        });
    }

    generateText(){
        var newText = ""
        for(var i = 0; i < this.textNodes.length; i++){
            var part = this.textNodes[i];
            if(part.type == "text"){
                newText += part.text;
            }else if(part.type == "link"){
                //We need to remove the @
                newText += TweetParser.convertNodeToTagString(part);
            }
        }
        return newText;
    }

    renderShadowText(childViewList){
        if(childViewList.length > 0){
            //console.log("renderShadowText with children")
            return (
                // <TextInput style={[styles.textPart, styles.inputLayout]}
                //     multiline={true}
                //     editable={false}>
                <Text style={[styles.inputLayout]}>
                    {childViewList}
                </Text>
                // </TextInput>);
            );
        }else{
            //console.log("renderShadowText with empty")
            return (
                <Text style={[styles.textPart, styles.inputLayout, {color: 'gray', lineHeight:20}]}>{"今天你怎么看？"}</Text>)
        }
    }

    renderIOSTextInput(){
        return (
            <CustomTextInput style={[styles.inputLayout,]}
                ref="TextInput"
                textAlignVertical="top"
                underlineColorAndroid="transparent"
                multiline={true}
                maxLength={240}
                defaultValue={this.state.displayText}
                value={this.state.displayText}
                placeholder={"今天你怎么看？"}
                onTextInput={(event)=>{
                    var newText = event.nativeEvent.text;
                    if(event.nativeEvent.text == "" && event.nativeEvent.range.start != event.nativeEvent.range.end){
                        newText = "<Backspace/>";
                    }
                    this.insertText(newText, event.nativeEvent.range);
                }}                        
                onKeyPress={(event) => this.onKeyPress(event)}
                selection={this.state.selection}
                onSelectionChange={(event)=>this.updateSelection(event)}/>
        );
    }

    renderAndroidTextInput(){
        return (
            <CustomTextInput style={[styles.inputLayout,]}
                ref="TextInput"
                textAlignVertical="top"
                underlineColorAndroid="transparent"
                multiline={true}
                maxLength={240}
                defaultValue={this.state.displayText}
                //value={this.state.displayText}
                placeholder={"今天你怎么看？"}
                onTextInput={(event)=>{
                    var newText = event.nativeEvent.text;
                    if(event.nativeEvent.text == "" && event.nativeEvent.range.start != event.nativeEvent.range.end){
                        newText = "<Backspace/>";
                    }
                    this.insertText(newText, event.nativeEvent.range);
                }}                        
                onKeyPress={(event) => this.onKeyPress(event)}
                selection={this.state.selection}
                onSelectionChange={(event)=>this.updateSelection(event)}/>
        );
    }

    render() {
        console.log("render this.state.selection", this.state.selection)

        return(
            <View style={{flex: 1, paddingLeft:15, paddingRight:15}}>
                <View style={{flex: 1, alignItems:'stretch'}}>
                    {Platform.OS == "android" ? this.renderAndroidTextInput() : this.renderIOSTextInput()}                    
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',

    },

    inputLayout: {
        flex:1,
        fontSize:15,
        padding:0,
        color: '#333333',
        marginTop:5,
        // position:'absolute',
        // top:0,
        // left:0,
        // right:0,
        // bottom:0,
    },
});

//make this component available to the app
export default TweetComponent;