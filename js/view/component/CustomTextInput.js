//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';

class CustomTextInput extends Component {
    static propTypes = {
        ...TextInput.propTypes,
    }

    setText(text){
        if (this.textInputRef._inputRef) {
            this.textInputRef._inputRef.setNativeProps({
                text: text,
            });
        }
    }

    setSelection(selection){
        if (this.textInputRef._inputRef) {
            this.textInputRef._inputRef.setNativeProps({
                selection: selection,
            });
        }
    }

    render() {
        return (
            <TextInput
                ref={(ref)=>this.textInputRef = ref}
                {...this.props}
            />
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
});

//make this component available to the app
export default CustomTextInput;
