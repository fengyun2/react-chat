import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Feature from './Feature';
import './FeatureLinkmans.css';

class FeatureLinkmans extends Component {
  static propTypes = {
      isLogin: PropTypes.bool.isRequired,
  };
  render() {
      const { isLogin } = this.props;
      return <div className="module-main-feature">{isLogin ? <Feature /> : null}</div>;
  }
}

export default connect(state => ({
    isLogin: !!state.getIn(['user', '_id']),
}))(FeatureLinkmans);
