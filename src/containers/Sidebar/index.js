// sidebar
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TwitterPicker } from 'react-color';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import Switch from 'react-switch';
import ReactLoading from 'react-loading';

// import self components
import Avatar from '@/components/basic/Avatar';
import IconButton from '@/components/basic/IconButton';
import Dialog from '@/components/basic/Dialog';
import Button from '@/components/basic/Button';
import Message from '@/components/basic/Message';
import Input from '@/components/basic/Input';

import action from "@/store/action";
import socket from '@/socket'
import setCssVariable from '@/utils/setCssVariable';
import config from '@/config';

import './index.css';

class Sidebar extends Component {
  static logout() {
    action.logout()
    window.localStorage.removeItem('token');
    Message.success('您已经退出登录');
    socket.disconnect()
    socket.connect()
  }
  static resetThume() {
    action.setPrimaryColor(config.primaryColor)
    action.setPrimaryTextColor(config.primaryTextColor)
    action.setBackgroundImage(config.backgroundImage)
    setCssVariable(config.primaryColor, config.primaryTextColor)
    window.localStorage.removeItem('primaryColor')
    window.localStorage.removeItem('primaryTextColor')
    window.localStorage.removeItem('backgroundImage')
    Message.success('已恢复默认主题');
  }
  static resetSound() {
    action.setSound(config.sound)
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
    isAdmin: PropTypes.bool,
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
      adminDialog: false,
    };
  }
  openSettingDialog = () => {
    this.setState({
      settingDialog: true,
    });
  }
  closeSettingDialog = () => {
    this.setState({
      settingDialog: true,
    });
  }
  openUserDialog = () => {
    this.setState({
      userDialog: true
    })
  }
  closeUserDialog = () => {
    this.setState({
      userDialog: false
    })
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
      isAdmin,
    } = this.props;
    const {
      settingDialog,
      userDialog,
      rewardDialog,
      infoDialog,
      appDownloadDialog,
      avatarLoading,
      backgroundLoading,
      adminDialog,
    } = this.state;

    if (isLogin) {
      return (
        <div className="module-main-sidebar">
          <Avatar className="avatar" src={avatar} onClick={this.openUserDialog} />
          <div className="buttons">
            {isAdmin ? (
              <IconButton width={40} height={40} icon="administrator" iconSize={28} />
                      ) : null}
            <IconButton width={40} height={40} icon="about" iconSize={26} />
            <IconButton width={40} height={40} icon="setting" iconSize={26} onClick={this.openSettingDialog}/>
            <IconButton width={40} height={40} icon="logout" iconSize={26} onClick={Sidebar.logout} />
          </div>
          <Dialog className="dialog system-setting" visible={settingDialog} title="系统设置" onClose={this.closeSettingDialog}>
            <div className="content">
              <div>
                <p>恢复</p>
                <div className="buttons">
                  <Button onClick={() => {}}>恢复默认主题</Button>
                  <Button onClick={() => {}}>恢复默认提示音</Button>
                </div>
              </div>
              <div>
                <p>开关</p>
                <div className="switch">
                  <p>声音提醒</p>
                  <Switch onChange={action.setSoundSwitch} checked={soundSwitch}></Switch>
                  <p>桌面提醒</p>
                  <Switch onChange={action.setNotificationSwitch} checked={notificationSwitch}></Switch>
                  <p>语音播报</p>
                  <Switch onChange={action.setVoiceSwitch} checked={voiceSwitch}></Switch>
                </div>
              </div>
              <div>
                <p>提示音</p>
                <div className="sounds">
                  <RadioGroup value={sound} onChange={() => {}} horizontal>
                    <RadioButton value="default">默认</RadioButton>
                    <RadioButton value="apple">苹果</RadioButton>
                    <RadioButton value="pcqq">电脑QQ</RadioButton>
                    <RadioButton value="mobileqq">手机QQ</RadioButton>
                    <RadioButton value="momo">陌陌</RadioButton>
                    <RadioButton value="huaji">滑稽</RadioButton>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </Dialog>
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
  voiceSwitch: state.getIn(['ui', 'voiceSwitch']),
}))(Sidebar);
