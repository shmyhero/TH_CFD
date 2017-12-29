//import liraries
import React, { Component, PropTypes } from 'react';
import { View,
    Text,
    StyleSheet,
    TextInput,
    Dimensions,
    Clipboard,
    TouchableOpacity,
    ScrollView,
    Platform
} from 'react-native';
var TweetParser = require('./TweetParser');
var {height, width} = Dimensions.get('window');
var LS = require("../../LS")

//var TweetBlock = require('./TweetBlock')
class TweetComponent extends Component {

    /////////this.lastSelection////////
    //在ios中通过键盘输入的字符，onTextChanged在调用之前会先调用onSelectionChanged,
    //所以此时的this.state.selection指向的是错误的位置。需要手动把输入之前的selection位置记下来。

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
        var textNodes = TweetParser.parseTextNodes(this.props.value);
        //console.log("textNodes" + JSON.stringify(textNodes))
        var displayText = this.getDisplayText(textNodes);
        this.state = {
            text: this.props.value,
            displayText: displayText,
            selection:{ start: 0, end: 0},
            textNodes: textNodes,
            textInputHeight:38
        };
    }

    insertItem(item){
        var linkText = TweetParser.convertItemToTagString(item);
        console.log("linkText this.state.selection.start " + this.state.selection.start + ", this.state.selection.end " + this.state.selection.end);

        this.lastSelection = {
            start: this.state.selection.start,
            end: this.state.selection.end
        };

        console.log("insertItem" + JSON.stringify(this.lastSelection));
        this.insertText(linkText, {
            start:this.state.selection.start,
            end:this.state.selection.end,
        });

        // this.refs["RichTextEditor"].focusContent()
        // setTimeout(()=>{
        //     this.refs["RichTextEditor"].prepareInsert()
        //     this.refs["RichTextEditor"].getSelectedText().then((selectedText)=>{
        //         console.log("selectedText " + selectedText)
        //         this.refs["RichTextEditor"].insertLink("cfd://page/stock/" + item.id, item.name);
        //     });
        // }, 1000)
    }

    getDisplayText(textNodes){
        var displayText = ""
        for(var i = 0; i < textNodes.length; i++){
            displayText += textNodes[i].text;
        }
        return displayText;
    }



    getCurrentSelectionsOnText(newSelectionStart, newSelectionEnd){
        var partSelections = this.getCurrentPartSelections(newSelectionStart, newSelectionEnd);
        for(var i = 0; i < partSelections.length; i++){
            // partSelections[i].selectionStart
        }
    }

    getCurrentPartSelections(newSelectionStart, newSelectionEnd){
        var partSelection = []
        var currentPartStart = 0;
        var currentPartEnd = 0;

        for (var i = 0; i < this.state.textNodes.length; i ++){
            var textPart = this.state.textNodes[i];
            currentPartStart = currentPartEnd
            currentPartEnd = currentPartStart + textPart.text.length;
            // console.log("getCurrentPartSelections currentPartStart " + currentPartStart)
            // console.log("getCurrentPartSelections currentPartEnd " + currentPartEnd)
            // console.log("getCurrentPartSelections newSelectionStart " + newSelectionStart)
            // console.log("getCurrentPartSelections newSelectionEnd " + newSelectionEnd)

            if((newSelectionStart <= currentPartEnd && newSelectionEnd > currentPartStart)
                || newSelectionEnd == 0 && i ==0){
                partSelection.push({
                    "part": i,
                    "partStartInWholeString": currentPartStart,
                    "partEndInWholeString": currentPartEnd,
                    "selectionStart": Math.max(newSelectionStart - currentPartStart, 0),
                    "selectionEnd": Math.min(newSelectionEnd - currentPartStart, textPart.text.length)
                })
            }
            // if(newSelectionEnd <= currentPartEnd

            //     ||newSelectionEnd == 0 && i ==0){
            //     if (partSelection.length > 0 && partSelection[0].part == i){
            //         //console.log("update!")
            //         partSelection[0].selectionEnd = Math.max(newSelectionEnd - currentPartStart, 0);
            //     }else{
            //         //console.log("push!")
            //         partSelection.push({
            //             "part": i,
            //             "partStartInWholeString": currentPartStart,
            //             "partEndInWholeString": currentPartEnd,
            //             "selectionStart": 0,
            //             "selectionEnd": Math.min(newSelectionEnd - currentPartStart, 0)
            //         })
            //     }
            // }
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
            var textPart = this.state.textNodes[partSelection.part]
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

    onChangeText(newTextValue){
        //在RN中无法得知新增的string是什么，
        //目前的解决方案是比较新旧string的不同，将其作为新的值插入。

        console.log("onChangeText newText: " + newTextValue + ", old: " + this.state.displayText)

        var newSelection = {start:-1, end:-1}
        var oldSelection = {start:-1, end:-1}
        if (this.lastPressedKey=="<Backspace/>"){
            this.insertText(this.lastPressedKey, this.state.selection);
        }else if(this.state.displayText != newTextValue){
            for(var i = 0; i < Math.min(this.state.displayText.length, newTextValue.length); i++){
                if(newTextValue[i] != this.state.displayText[i]){
                    newSelection.start = i;
                    break;
                }
            }
            if(newSelection.start == -1){
                newSelection.start = Math.min(newTextValue.length, this.state.displayText.length);
            }
            oldSelection.start = newSelection.start;

            if(this.state.displayText.length == oldSelection.start){
                oldSelection.end = oldSelection.start;
                newSelection.end = newTextValue.length;
            }else if(newTextValue.length == oldSelection.start){
                oldSelection.end = this.state.displayText.length;
                newSelection.end = newSelection.start;
            }else{
                if(newTextValue.length == 0){
                    oldSelection.end = this.state.displayText.length;
                    newSelection.end = 0;
                }else{
                    //只比较较短的String末尾到selectionStart的部分。
                    for(var i = 0; i < Math.min(this.state.displayText.length, newTextValue.length) - newSelection.start; i++){
                        if(newTextValue[newTextValue.length-i] != this.state.displayText[this.state.displayText.length-i]){
                            newSelection.end = newTextValue.length-i+1;
                            oldSelection.end = this.state.displayText.length-i+1;
                            break;
                        }
                    }

                    //如果没有找到新的selecitonend，则表明短的string的selectionend = selection.start，
                    //长的string的selectionend = selection.start + 两个string的长度差
                    if(newSelection.end == -1){
                        newSelection.end = newSelection.start + Math.max(0, newTextValue.length - this.state.displayText.length);
                    }
                    if(oldSelection.end == -1){
                        oldSelection.end = oldSelection.start + Math.max(0, this.state.displayText.length - newTextValue.length);
                    }
                }
            }
            // for(var i = 1; i <  Math.max(newTextValue.length, this.state.displayText.length); i++){
            //     if(newTextValue[newTextValue.length-i] != this.state.displayText[this.state.displayText.length-i]){
            //         newSelection.end = newTextValue.length-i+1;
            //         oldSelection.end = this.state.displayText.length-i+1;
            //         break;
            //     }
            // }

            // console.log("newTextValue " + newTextValue);
            // console.log("this.state.displayText " + this.state.displayText);

            // console.log("newSelection.end " + newSelection.end + " newTextValue.length " + newTextValue.length)
            // console.log("oldSelection.end " + oldSelection.end + " oldSelection.length " + this.state.displayText.length)

            if(newSelection.end == -1){
                newSelection.end = Math.max(newTextValue.length, this.state.displayText.length) - Math.min(newTextValue.length, this.state.displayText.length);
            }
            this.lastSelection = oldSelection
            var newText = newTextValue.substring(newSelection.start, newSelection.end);

            if(newSelection.end == newSelection.start){
                newText = "<Backspace/>"
            }

            console.log("onChangeText newSelection " + JSON.stringify(newSelection))
            console.log("onChangeText newText " + newText);
            console.log("onChangeText oldSelection " + JSON.stringify(oldSelection))
            // newText = newText.replace("\n", "")
            this.insertText(newText, oldSelection);
        }else{
            return;
        }
    }

    insertText(newText, selectionInOriginalText){
        // console.log("insertText")
        // console.log(selectionInOriginalText)

        var originalText = this.generateText();

        var OriginalTextselectionStart = -1;
        var OriginalTextselectionEnd = -1;
        var textNodes = this.state.textNodes;
        var currentTextIndex = 0;

        var partSelections = this.getCurrentPartSelections(
            this.lastSelection.start, this.lastSelection.end);

        for (var partIndex = 0; partIndex < textNodes.length; partIndex++){
            var textPart = textNodes[partIndex];
            for (var i = 0; i < partSelections.length; i++) {
                var partSelection = partSelections[i];
                var currentPartIndex = partSelection.part;
                //console.log("selection part " + currentPartIndex)
                if(partIndex == currentPartIndex){
                    //console.log("parse part " + partIndex)
                    //The part is in selection.
                    if(OriginalTextselectionStart == -1){
                        if(textPart.type == "link"){
                            if (newText == "<Backspace/>"){
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
                            OriginalTextselectionStart = currentTextIndex + partSelection.selectionStart
                        }
                    }

                    if(textPart.type == "text"){
                        OriginalTextselectionEnd = currentTextIndex + partSelection.selectionEnd;
                    }else if(textPart.type == "link"){
                        // If it is a link part, always select all.
                        //console.log("textPart.originalText " + textPart.originalText)
                        if (newText == "<Backspace/>"){
                            //Select All if the input key is backspace!!!
                            OriginalTextselectionEnd = currentTextIndex + textPart.originalText.length;
                        }else{
                            if(partSelection.selectionStart == partSelection.selectionEnd){
                                OriginalTextselectionEnd = OriginalTextselectionStart;
                            }else{
                                OriginalTextselectionEnd = currentTextIndex + textPart.originalText.length;
                            }
                        }
                        //console.log("textPart.originalTextPart " + this.state.text.substring(0, textPart.originalText))
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
        if (newText == "<Backspace/>"){
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
            + newText
            + originalText.substring(OriginalTextselectionEnd, originalText.length);
        }

        var currentEnd = this.state.selection.start;
        if (newText == "<Backspace/>"){
            if(this.state.selection.start == this.state.selection.end){
                if(currentEnd >0){
                    currentEnd = currentEnd - 1;
                }
            }
        }else{
            var newTextNodes = TweetParser.parseTextNodes(newText);
            for (var i = 0; i < newTextNodes.length; i++){
                currentEnd += newTextNodes[i].text.length;
            }
        }

        var newOriginalText = "";
        // console.log("insertText OriginalTextselectionStart " + OriginalTextselectionStart)
        // console.log("insertText OriginalTextselectionEnd " + OriginalTextselectionEnd)
        // console.log("originalText.substring(0, OriginalTextselectionStart) " + originalText.substring(0, OriginalTextselectionStart));
        // console.log("this.state.text.substring(OriginalTextselectionEnd, this.state.text.length) " + this.state.text.substring(OriginalTextselectionEnd, this.state.text.length));

        if (newText == "<Backspace/>"){
            if(OriginalTextselectionStart != OriginalTextselectionEnd){
                newOriginalText = originalText.substring(0, OriginalTextselectionStart)
                + this.state.text.substring(OriginalTextselectionEnd, this.state.text.length);
            }else{
                newOriginalText = originalText.substring(0, OriginalTextselectionStart-1)
                + this.state.text.substring(OriginalTextselectionEnd, this.state.text.length);
            }
        }
        else {
            newOriginalText = originalText.substring(0, OriginalTextselectionStart)
            + newText
            + this.state.text.substring(OriginalTextselectionEnd, this.state.text.length);
        }

        //console.log("newOriginalText " + newOriginalText)

        this.lastSelection = {
            start: this.state.selection.start,
            end: this.state.selection.end
        };

        textNodes = TweetParser.parseTextNodes(newOriginalText);
        var displayText = this.getDisplayText(textNodes);

        console.log("onChangeText newOriginalText " + newOriginalText)
        console.log("onChangeText displayText "+ displayText)
        console.log("this.lastSelection " + JSON.stringify(this.lastSelection))
        if (displayText != this.state.displayText){
            this.props.onValueChanged && this.props.onValueChanged(newOriginalText);
        }
        console.log("onChangeText this.state.selection " + JSON.stringify(this.state.selection))


        this.lastPressedKey = "";

        var newState = {
            text: newOriginalText,
            textNodes: textNodes,
            displayText: displayText,
        };
        this.setState({
            text: newOriginalText,
            textNodes: textNodes,
            displayText: displayText,
        });
    }

    generateText(){
        var newText = ""
        for(var i = 0; i < this.state.textNodes.length; i++){
            var part = this.state.textNodes[i];
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
                <Text style={[styles.textPart, styles.inputLayout, {color: 'gray', lineHeight:20}]}>{LS.str("TWEET_HINT")}</Text>)
        }
    }

    render() {
        //console.log("this.state.textNodes " + this.state.textNodes)
        // var parsedListView = this.state.textNodes.map((part, index, array)=>{
        //     if(part.type == "text"){
        //         return (
        //             <Text key={index}
        //                 //style={styles.textPart}
        //             >
        //                 {part.text}
        //             </Text>)
        //     }else if(part.type == "link"){
        //         return (<Text key={index} style={styles.linkedPart}>{part.text}</Text>)
        //     }
        // })
        // var parsedShadowListView = this.state.textNodes.map((part, index, array)=>{
        //     if(part.type == "text"){
        //         return (<Text key={index} style={[styles.textPart, {color:"transparent"}]}>{part.text}</Text>)
        //     }else if(part.type == "link"){
        //         return (<Text key={index} style={[styles.linkedPart, {color:"transparent"}]}>{part.text}</Text>)
        //     }
        // })
        // parsedListView.push(<Text key={parsedListView.length} style={styles.textPart}>{"\n"}</Text>)

        return(
            <View style={{flex: 1, paddingLeft:15, paddingRight:15}}>
                <View style={{flex: 1, alignItems:'stretch'}}>
                    {/* {this.renderShadowText(parsedListView)} */}
                    {/* <TweetBlock value={this.state.text}/> */}
                    <TextInput style={[styles.inputLayout,]}
                        ref="TextInput"
                        textAlignVertical="top"
                        underlineColorAndroid="transparent"
                        multiline={true}
                        maxLength={240}
                        value={this.state.displayText}
                        placeholder={LS.str("TWEET_HINT")}
                        onChange={(event)=>{
                            console.log("onChange")
                            console.log(event.nativeEvent)
                            if(Platform.OS == "android"){
                                // if(event.nativeEvent.contentSize.height != this.state.textInputHeight){
                                //     this.setState({
                                //         textInputHeight: event.nativeEvent.contentSize.height,
                                //     })
                                // }
                                this.onChangeText(event.nativeEvent.text)
                            }
                        }}
                        onChangeText={(text)=>{
                            if(Platform.OS == "ios"){
                                this.onChangeText(text)
                            }
                        }} //iOS
                        onKeyPress={(event) => this.onKeyPress(event)}
                        selection={this.state.selection}
                        onSelectionChange={(event)=>this.updateSelection(event)}>
                    </TextInput>
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
module.exports = TweetComponent;
