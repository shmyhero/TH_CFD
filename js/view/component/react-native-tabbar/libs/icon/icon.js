import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { extendRawIcon } from './raw';

const styles = StyleSheet.create({
  icon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

class Icon extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selected: false,
      enable: true,
    };
  }

  onPress() {
    const { tabName, gotoTab } = this.context;
    if(this.state.enable){
      gotoTab(tabName);
    }
  }

  tabDidActive() {
    this.setState({ selected: true });
    //console.log(`tab ${this.context.tabName} is active`);
  }

  tabDidInactive() {
    this.setState({ selected: false });
    //console.log(`tab ${this.context.tabName} is inactive`);
  }

  setActiveColor(color){
    this.setState({
      onActiveColor: color,
    })
  }

  setLabel(value){
    this.setState({
      label: value,
    })
  }

  setEnable(value){
    this.state.enable = value;
  }

  render() {
    const {type, from, size, iconStyle, onActiveColor, onInactiveColor, ...rest } = this.props;
    const label = this.state.label ? this.state.label : this.props.label;
    const { selected } = this.state;

    const color = selected? (this.state.onActiveColor ? this.state.onActiveColor  : onActiveColor ): onInactiveColor

    let icon = null;
    if (!!type && !from) {
      throw new Error("icon must contains 'type' and 'from' values");
    } else if (!type && !!from) {
      throw new Error("icon must contains 'type' and 'from' values");
    } else if (!!type && !!from) {
      icon = (
        <Text style={[iconStyle, { fontSize: size, fontFamily: from, color: color }]}>
          {type}
        </Text>
      );
    }

    return (
      <TouchableWithoutFeedback {...rest} style={{ flex: 1 }} onPress={this.onPress.bind(this)}>
        <View style={styles.icon}>
          {icon}
          <View style={{ paddingTop: 5 }}>
            <Text style={{ fontSize: 12, color: color }}>{label}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

Icon.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  from: PropTypes.string,
  size: PropTypes.number,
  iconStyle: PropTypes.any,
  onActiveColor: PropTypes.string,
  onInactiveColor: PropTypes.string
};

Icon.defaultProps = {
  size: 20,
  onActiveColor: 'white',
  onInactiveColor: 'black'
};

Icon.contextTypes = {
  tabName: PropTypes.string,
  gotoTab: PropTypes.func
};

export default extendRawIcon(Icon);
