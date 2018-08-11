// 聊天框
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import action from '@/store/action';
import config from '@/config';
import socket from '@/socket'
import xss from '@/utils/xss';
import Url from '@/utils/url';
import IconButton from '@/components/basic/IconButton';
import Dropdown from '@/components/basic/Dropdown';
import { Menu, MenuItem } from '@/components/basic/Menu';
import Dialog from '@/components/basic/Dialog';
import Message from '@/components/basic/Message';
import Input from '@/components/basic/Input';
import Button from '@/components/basic/Button';
import Loading from '@/components/basic/Loading';

import Expression from './Expression';
import CodeEditor from './CodeEditor';
import readDiskFile from '@/utils/readDiskFile';
import getRandomHuaji from '@/utils/getRandomHuaji';
import fetch from "@/utils/fetch";

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
      input.value = input.value.substring(0, startPos) + value + input.value.substring(endPos, input.value.length);
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
    return new Promise((resolve) => {
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
    connect: PropTypes.bool,
  }
  constructor(...args) {
    super(...args);
    this.state = {
      expressionVisible: false,
      codeInputVisible: false,
      expressionSearchVisible: false,
      expressionSearchLoading: false,
      expressionSearchResults: [],
    };
    this.lockEnter = false;
  }
  handleVisibleChange = (visible) => {
    this.setState({
      expressionVisible: visible,
    });
  }
  handleFeatureMenuClick = ({ key }) => {
    switch (key) {
      case 'image': {
        this.handleSelectFile();
        break;
      }
      case 'huaji': {
        this.sendHuaji();
        break;
      }
      case 'code': {
        this.setState({
          codeInputVisible: true,
        });
        break;
      }
      case 'expression': {
        this.setState({
          expressionSearchVisible: true,
        });
        break;
      }
      default: {
      }
    }
  }
  handleCodeEditorClose = () => {
    this.setState({
      codeInputVisible: false,
    });
  }
  closeExpressionSearch = () => {
    this.setState({
      expressionSearchVisible: false,
    });
  }
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
        avatar: user.get('avatar'),
      },
      Loading: true,
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
    const language = this.codeEditor.getLanguage();
    const rawCode = this.codeEditor.getValue();
    if (rawCode === '') {
      return Message.warning('请输入内容');
    }

    const code = `@language=${language}@${rawCode}`;
    const id = this.addSelfMessage('code', code);
    this.sendMessage(id, 'code', code);
    this.handleCodeEditorClose();
  }
  sendTextMessage = () => {
    if (!this.props.connect) {
      return Message.error('发送消息失败，您当前处于离线状态');
    }
    const message = this.message.value.trim();
    if (message.length === 0) {
      return;
    }
    // TODO:
    const id = this.addSelfMessage('text', xss(message));
    this.sendMessage(id, 'text', message);
  }
  async sendMessage(localId, type, content) {
    const { focus } = this.props;
    Message.success('发送消息成功');
  }
  handleSelectExpression = (expression) => {
    this.handleVisibleChange(false);
    ChatInput.insertAtCursor(this.message, `#(${expression})`);
  }
  sendImageMessage(image) {
    if (image.length > config.maxImageSize) {
      return Message.warning('要发送的图片过大', 3);
    }

    const { user, focus } = this.props;
    const ext = image.type
      .split('/')
      .pop()
      .toLowerCase();
    const url = URL.createObjectURL(image.result);

    const img = new Image();
    img.onload = () => {};
    img.src = url;
  }

  handleSelectFile = async () => {
    if (!this.props.connect) {
      return Message.error('发送消息失败，您当前处于离线状态');
    }
    const image = await readDiskFile('blob', 'image/png,image/jpeg,image/gif');
    if (!image) {
      return;
    }
    this.sendImageMessage(image);
  }

  sendHuaji = async () => {
    const huaji = getRandomHuaji();
    console.log('sendHuaji: ', huaji);
    const id = this.addSelfMessage('image', huaji);
    this.sendMessage(id, 'image', huaji);
  }
  searchExpression = async (keywords) => {
    console.log('你正在搜索表情包')
    if (keywords) {
      this.setState({
        expressionSearchLoading: true,
      });
      // const [err, result] = await axios
      setTimeout(() => {
        this.setState({
          expressionSearchResults: [],
        });
      }, 1000);
      this.setState({
        expressionSearchLoading: false,
      });
    }
  }
  handleSearchExpressionButtonClick = () => {
    const keywords = this.expressionSearchKeyword.getValue();
    this.searchExpression(keywords);
  }
  handleSearchExpressionInputEnter = (keywords) => {
    this.searchExpression(keywords);
  }
  // 点击选择表情
  handleClickExpression = (e) => {
    const $target = e.target;
    if ($target.tagName === 'IMG') {
      const url = Url.addParam($target.src, {
        width: $target.naturalWidth,
        height: $target.naturalHeight,
      });

      const id = this.addSelfMessage('image', url);
      this.sendMessage(id, 'image', url);
      this.setState({
        expressionSearchVisible: false,
      });
    }
  }
  // 选择表情
  expressionDropdown = (
    <div className="expression-dropdown">
      <Expression onSelect={this.handleSelectExpression} />
    </div>
  )

  featureDropdown = (
    <div className="feature-dropdown">
      <Menu onClick={this.handleFeatureMenuClick}>
        <MenuItem key="expression">发送表情包</MenuItem>
        <MenuItem key="huaji">发送滑稽</MenuItem>
        <MenuItem key="image">发送图片</MenuItem>
        <MenuItem key="code">发送代码</MenuItem>
      </Menu>
    </div>
  )

  render() {
    const {
      expressionVisible,
      codeInputVisible,
      expressionSearchVisible,
      expressionSearchLoading,
      expressionSearchResults,
    } = this.state;
    const { isLogin } = this.props;
    if (isLogin) {
      return (
        <div className="chat-chatInput">
          <Dropdown
            trigger={['click']}
            visible={expressionVisible}
            onVisibleChange={this.handleVisibleChange}
            overlay={this.expressionDropdown}
            animation="slide-up"
            placement="topLeft"
          >
            <IconButton className="expression" width={44} height={44} icon="expression" iconSize={32} />
          </Dropdown>
          <Dropdown trigger={['click']} overlay={this.featureDropdown} animation="slide-up" placement="topLeft">
            <IconButton className="feature" width={44} height={44} icon="feature" iconSize={32} />
          </Dropdown>
          <Dialog
            className="codeEditor-dialog"
            title="请输入要发送的代码"
            visible={codeInputVisible}
            onClose={this.handleCodeEditorClose}
          >
            <div className="container">
              <CodeEditor ref={i => (this.codeEditor = i)} />
              <button className="codeEditor-button" onClick={this.handleSendCode}>
                发送
              </button>
            </div>
          </Dialog>
          <Dialog
            className="expressionSearch-dialog"
            title="搜索表情包"
            visible={expressionSearchVisible}
            onClose={this.closeExpressionSearch}
          >
            <div className="container">
              <div className="input-container">
                <Input ref={i => (this.expressionSearchKeyword = i)} onEnter={this.handleSearchExpressionInputEnter} />
                <Button onClick={this.handleSearchExpressionButtonClick}>搜索</Button>
              </div>
              <div className={`loading ${expressionSearchLoading ? 'show' : 'hide'}`}>
                <Loading type="spinningBubbles" color="#4A90E2" height={100} width={100} />
              </div>
              <div className="expression-list" onClick={this.handleClickExpression}>
                {expressionSearchResults.map((image, index) => (
                  <img src={image} key={i + image} />
                ))}
              </div>
            </div>
          </Dialog>
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
          游客朋友您好，请
          <b onClick={ChatInput.handleLogin}>登录</b>
          后参与聊天
        </p>
      </div>
    );
  }
}

export default connect(state => ({
  isLogin: !!state.getIn(['user', '_id']),
  connect: state.get('connect'),
  focus: state.get('focus'),
  user: state.get('user'),
}))(ChatInput);
