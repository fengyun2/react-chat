// 聊天室
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import immutable from 'immutable';

import config from '../../../config';
import action from '../../../store/action';
import Avatar from '../../../components/basic/Avatar';
import Tooltip from '../../../components/basic/Tooltip';
import Message from '../../../components/basic/Message';
import Button from '../../../components/basic/Button';
import HeaderBar from './HeaderBar';
import ChatInput from './ChatInput';

import './Chat.css';

class Chat extends Component {
  static propTypes = {
    focus: PropTypes.string,
    members: ImmutablePropTypes.list,
    userId: PropTypes.string,
    creator: PropTypes.string,
    avatar: PropTypes.string,
    to: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string
  };
  constructor(...args) {
    super(...args);
    this.state = {
      groupInfoDialog: false,
      userInfoDialog: false,
      userInfo: {}
    };
  }
  componentDidMount() {
    document.body.addEventListener('click', this.handleBodyClick, false);
  }
  handleBodyClick = e => {
    if (!this.state.groupInfoDialog) {
      return;
    }

    const { currentTarget } = e;
    let { target } = e;
    do {
      if (/float-panel/.test(target.className)) {
        return;
      }
      target = target.parentElement;
    } while (target !== currentTarget);
    this.closeGroupInfo();
  };
  groupInfoDialog = async e => {
    const { focus, userId } = this.props;
    this.setState({
      groupInfoDialog: true
    });
    e.stopPropagation();
    e.preventDefault();
  };
  closeGroupInfo = () => {
    this.setState({
      groupInfoDialog: false
    });
  };
  showUserInfoDialog(userInfo) {
    this.setState({
      userInfoDialog: true,
      userInfo
    });
  }
  closeUserInfoDialog = () => {
    this.setState({
      userInfoDialog: false
    });
  };

  render() {
    const { groupInfoDialog, userInfoDialog, userInfo } = this.state;
    const { userId, creator, avatar, type, to, name } = this.props;

    return (
      <div className="module-main-chat">
        <HeaderBar
          onShowInfo={
            type === 'group'
              ? this.showUserInfoDialog
              : this.showUserInfoDialog.bind(this, { _id: to, username: name, avatar })
          }
        />
        <ChatInput />
      </div>
    );
  }
}

export default connect(state => {
  const isLogin = !!state.getIn(['user', '_id']);
  if (!isLogin) {
    return {
      userId: '',
      focus: state.getIn(['user', 'linkmans', 0, '_id']),
      creator: '',
      avatar: state.getIn(['user', 'linkmans', 0, 'avatar']),
      members: state.getIn(['user', 'linkmans', 0, 'members']) || immutable.fromJS([])
    };
  }
  const focus = state.get('focus');
  const linkman = state.getIn(['user', 'linkmans']).find(l => l.get('_id') === focus);
  return {
    userId: state.getIn(['user', '_id']),
    focus,
    type: linkman.get('type'),
    creator: linkman.get('creator'),
    to: linkman.get('to'),
    name: linkman.get('name'),
    avatar: linkman.get('avatar'),
    members: linkman.get('members') || immutable.fromJS([])
  };
})(Chat);
