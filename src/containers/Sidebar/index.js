// sidebar
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TwitterPicker } from 'react-color';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import Switch from 'react-switch';
import ReactLoading from 'react-loading';

// import self components
import Avatar from '../../components/basic/Avatar';
import IconButton from '../../components/basic/IconButton';
import Dialog from '../../components/basic/Dialog';
import Button from '../../components/basic/Button';
import Message from '../../components/basic/Message';
import Input from '../../components/basic/Input';

import setCssVariable from '../../utils/setCssVariable';
import config from '../../config';

import './index.css';

class Sidebar extends Component {
  static logout() {
    window.localStorage.removeItem('token');
    Message.success('您已经退出登录');
  }
  static resetThume() {
    Message.success('已恢复默认主题');
  }
  static resetSound() {
    window.localStorage.removeItem('sound');
    Message.success('已恢复默认提示音');
  }
  static propTypes = {
    isLogin: PropTypes.bool.isRequired,
    isConnect: PropTypes.bool.isRequired,
    avatar: PropTypes.string,
    primaryColor: PropTypes.string,
    primaryTextColor: PropTypes.string,
    backgroundImage: PropTypes.string,
    userId: PropTypes.string,
    sound: PropTypes.string,
    soundSwitch: PropTypes.bool,
    notificationSwitch: PropTypes.bool,
    voiceSwitch: PropTypes.bool,
    isAdmin: PropTypes.bool
  };
  constructor(...args) {
    super(...args);
    this.state = {
      settingDialog: false,
      userDialog: false,
      rewardDialog: false,
      infoDialog: false,
      appDownloadDialog: false,
      avatarLoading: false,
      backgroundLoading: false,
      adminDialog: false
    };
  }
  openSettingDialog() {
    this.setState({
      settingDialog: true
    });
  }
  closeSettingDialog() {
    this.setState({
      settingDialog: true
    });
  }
  render() {
    const {
      isLogin,
      isConnect,
      avatar,
      primaryColor,
      primaryTextColor,
      backgroundImage,
      sound,
      soundSwitch,
      notificationSwitch,
      voiceSwitch,
      isAdmin
    } = this.props;
    const {
      settingDialog,
      userDialog,
      rewardDialog,
      infoDialog,
      appDownloadDialog,
      avatarLoading,
      backgroundLoading,
      adminDialog
    } = this.state;

    if (isLogin) {
      return (
        <div className="module-main-sidebar">
          <Avatar className="avatar" src={avatar} />
          <div className="buttons">
            {isAdmin ? (
              <IconButton width={40} height={40} icon="administrator" iconSize={28} />
            ) : null}
            <IconButton width={40} height={40} icon="about" iconSize={26} />
            <IconButton width={40} height={40} icon="setting" iconSize={26} />
            <IconButton width={40} height={40} icon="logout" iconSize={26} />
          </div>
        </div>
      );
    }

    return <div className="module-main-sidebar" />;
  }
}

export default connect(state => ({
  isLogin: !!state.getIn(['user', '_id']),
  isConnect: state.get('connect'),
  avatar: state.getIn(['user', 'avatar']),
  userId: state.getIn(['user', '_id']),
  isAdmin: state.getIn(['user', 'isAdmin']),
  primaryColor: state.getIn(['ui', 'primaryColor']),
  primaryTextColor: state.getIn(['ui', 'primaryTextColor']),
  backgroundImage: state.getIn(['ui', 'backgroundImage']),
  sound: state.getIn(['ui', 'sound']),
  soundSwitch: state.getIn(['ui', 'soundSwitch']),
  notificationSwitch: state.getIn(['ui', 'notificationSwitch']),
  voiceSwitch: state.getIn(['ui', 'voiceSwitch'])
}))(Sidebar);
