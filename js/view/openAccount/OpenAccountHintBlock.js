'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

var LS = require("../../LS")

export default class OpenAccountHintBlock extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style = {styles.textLine}>
          <Text style = {styles.textRound}>●</Text>
          <Text style={styles.textValue}>{LS.str("OPEN_ACCOUNT_RISK_NOTICE_1")}</Text>
        </View>

        <View style = {styles.textLine}>
          <Text style = {styles.textRound}>●</Text>
          <Text style={styles.textValue}>{LS.str("OPEN_ACCOUNT_RISK_NOTICE_2")}</Text>
        </View>

        <View style = {styles.textLine}>
          <Text style = {styles.textRound}>●</Text>
          <Text style={styles.textValue}>{LS.str("OPEN_ACCOUNT_RISK_NOTICE_3")}</Text>
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
		color:'#cccccc',
		marginLeft:5,
		marginRight:10,
	},

	textLine:{
		flexDirection:'row',
		marginTop:10,
	},

});

module.exports = OpenAccountHintBlock;
