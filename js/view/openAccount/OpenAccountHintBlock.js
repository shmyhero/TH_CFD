'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class OpenAccountHintBlock extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style = {styles.textLine}>
          <Text style = {styles.textRound}>●</Text>
          <Text style={styles.textValue}>差价合约是高风险的投资，并不适合所有投资者。您的资本面临风险。您应该确保了解其中的风险,如有必要,请寻求独立财务意见,以确保该产品符合您的投资目标。</Text>
        </View>

        <View style = {styles.textLine}>
          <Text style = {styles.textRound}>●</Text>
          <Text style={styles.textValue}>如果您在英国以外的司法辖区缴税，税法可能会发生改变或可能会有所不同。盈交易为安易永投（ayondo markets Limited）旗下产品名称。安易永投(ayondo markets Limited)是在英格兰和威尔士注册的公司(注册号为03148972)，并由英国金融行为监管局(FCA)授权和监管，FCA注册号为184333。</Text>
        </View>

        <View style = {styles.textLine}>
          <Text style = {styles.textRound}>●</Text>
          <Text style={styles.textValue}>您的资本面临风险。差价合约并不适合所有投资者。您应该确保了解其中的风险。</Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 18,
    marginBottom: 15,
  },

  textBlock:{
    color: '#7b7b7b',
    marginTop:12,
  },

	textRound:{
		fontSize:12,
		color:'#cccccc'
	},

	textTitle:{
		fontSize:14,
		color:'black',
		marginTop:15,
		marginBottom:5,
	},

	textValue:{
		fontSize:12,
		color:'#7b7b7b',
		marginLeft:5,
		marginRight:10,
	},

	textLine:{
		flexDirection:'row',
		marginTop:10,
	},

});

module.exports = OpenAccountHintBlock;
