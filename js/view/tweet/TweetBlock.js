//import liraries
import React, { Component, PropTypes} from 'react';
import { View, Text, StyleSheet } from 'react-native';
var TweetParser = require("./TweetParser")
// create a component
class TweetBlock extends Component {
    static propTypes = {
        value: PropTypes.string,
    }
    
    static defaultProps = {
        value:'',
    }

    constructor(props){
        super(props)

        var textNodes = TweetParser.parseTextNodes(this.props.value);
        this.state = {
            textNodes: textNodes
        };
    }

    render() {
        var parsedListView = this.state.textNodes.map((part, index, array)=>{
            if(part.type == "text"){
                return (
                    <Text key={index} 
                        //style={styles.textPart}
                    >
                        {part.text}
                    </Text>)
            }else if(part.type == "link"){
                return (<Text key={index} style={styles.linkedPart}>{part.text}</Text>)
            }
        });

        return (
            <View style={styles.container}>
                <Text>{parsedListView}</Text>
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
});

//make this component available to the app
export default TweetBlock;
