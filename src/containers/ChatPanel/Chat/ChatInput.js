// 聊天框
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import action from '../../../store/action';
import config from '../../../config';
import xss from '../../../utils/xss';
import IconButton from '../../../components/basic/IconButton';
import Dropdown from '../../../components/basic/Dropdown';
import { Menu, MenuItem } from '../../../components/basic/Menu';
import Dialog from '../../../components/basic/Dialog';
import Message from '../../../components/basic/Message';
import Input from '../../../components/basic/Input';
import Button from '../../../components/basic/Button';
import Loading from '../../../components/basic/Loading';

class ChatInput extends Component {
  static handleLogin() {
    action.showLoginDialog();
  }
  static insertAtCursor(input, value) {
    if (document.selection) {
      input.focus();
      const sel = document.selection.createRange();
      sel.text = value;
      sel.select();
    } else if (input.selectionStart || input.selectionStart === '0') {
      const startPos = input.selectionStart;
      const endPos = input.selectionEnd;
      const restoreTop = input.scrollTop;
      input.value =
        input.value.substring(0, startPos) +
        value +
        input.value.substring(endPos, input.value.length);
      if (restoreTop > 0) {
        input.scrollTop = restoreTop;
      }
      input.focus();
      input.selectionStart = startPos + value.length;
      input.selectionEnd = startPos + value.length;
    } else {
      input.value += value;
      input.focus();
    }
  }
  static compressImage(image, mimeType, quality = 1) {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      canvas.toBlob(resolve, mimeType, quality);
    });
  }
  static propTypes = {
    isLogin: PropTypes.bool.isRequired,
    focus: PropTypes.string,
    user: ImmutablePropTypes.map,
    connect: PropTypes.bool
  };
  constructor(...args) {
    super(...args);
    this.state = {
      expressionVisible: false,
      codeInputVisible: false,
      expressionSearchVisible: false,
      expressionSearchLoading: false,
      expressionSearchResults: []
    };
    this.lockEnter = false;
  }
  handleVisibleChange = visible => {
    this.setState({
      expressionVisible: visible
    });
  };
  closeExpressionSearch = () => {
    this.setState({
      expressionSearchVisible: false
    });
  };
  addSelfMessage(type, content) {
    const { user, focus } = this.props;
    const _id = focus + Date.now();
    const message = {
      _id,
      type,
      content,
      createTime: Date.now(),
      from: {
        _id: user.get('_id'),
        username: user.get('username'),
        avatar: user.get('avatar')
      },
      Loading: true
    };
    if (type === 'image') {
      message.percent = 0;
    }
    return _id;
  }
  handleSendCode = () => {
    if (!this.props.connect) {
      return Message.error('发送消息失败，您当前处于离线状态');
    }
  };
  sendTextMessage = () => {
    if (!this.props.connect) {
      return Message.error('发送消息失败，您当前处于离线状态');
    }
    const message = this.message.value.trim();
    if (message.length === 0) {
      return;
    }
    // TODO
    const id = this.addSelfMessage('text', xss(message));
    this.sendMessage(id, 'text', message);
  };
  async sendMessage(localId, type, content) {
    const { focus } = this.props;
    Message.success('发送消息成功');
  }

  render() {
    const {
      expressionVisible,
      codeInputVisible,
      expressionSearchVisible,
      expressionSearchLoading,
      expressionSearchResults
    } = this.state;
    const { isLogin } = this.props;
    if (isLogin) {
      return (
        <div className="chat-chatInput">
          {/*<Dropdown
            trigger={['click']}
            visible={expressionVisible}
            onVisibleChange={this.handleVisibleChange}
            animation="slide-up"
            placement="topLeft"
          >
            <IconButton
              className="expression"
              width={44}
              height={44}
              icon="expression"
              iconSize={32}
            />
          </Dropdown>*/}
          <input
            type="text"
            placeholder="代码会写了吗, 给加薪了吗, 股票涨了吗, 来吐槽一下吧~~"
            maxLength="2048"
            ref={i => (this.message = i)}
          />
          <IconButton
            className="send"
            width={44}
            height={44}
            icon="send"
            iconSize={32}
            onClick={this.sendTextMessage}
          />
        </div>
      );
    }
    return (
      <div className="chat-chatInput guest">
        <p>
          游客朋友您好，请<b onClick={ChatInput.handleLogin}>登录</b>后参与聊天
        </p>
      </div>
    );
  }
}

export default connect(state => ({
  isLogin: !!state.getIn(['user', '_id']),
  connect: state.get('connect'),
  focus: state.get('focus'),
  user: state.get('user')
}))(ChatInput);
