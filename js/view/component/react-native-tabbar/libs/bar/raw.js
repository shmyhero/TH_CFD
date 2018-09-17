import React, { Component } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

export default class Rawbar extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { children, style } = this.props;

    return (
      <Animated.View style={style}>
        {children}
      </Animated.View>
    );
  }
}

Rawbar.propTypes = {
  style: PropTypes.any.isRequired
};
