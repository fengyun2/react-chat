import React, { Component } from 'react';

import IconButton from '../../../components/basic/IconButton';
import Dialog from '../../../components/basic/Dialog';
import Input from '../../../components/basic/Input';
import Message from '../../../components/basic/Message';
import Avatar from '../../../components/basic/Avatar';
import { Tabs, TabPane, TabContent, ScrollableInkTabBar } from '../../../components/basic/Tabs';

import action from '../../../store/action';

class Feature extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      showAddButton: true,
      showCreateGroupDialog: false,
      showSearchResult: false,
      searchResultActiveKey: 'all',
      searchResult: {
        users: [],
        groups: []
      },
      showGroupInfo: false,
      groupInfo: {},
      showUserInfo: false,
      userInfo: {}
    };
  }
  componentDidMount() {
    document.body.addEventListener('click', this.handleBodyClick, false);
  }
  resetSearchView() {
    this.setState({
      showSearchResult: false,
      showAddButton: true,
      searchResultActiveKey: 'all',
      searchResult: {
        users: [],
        groups: []
      }
    });
    this.searchInput.value = '';
  }
  handleBodyClick = e => {
    if (e.target === this.searchInput || !this.state.showSearchResult) {
      return;
    }

    const { currentTarget } = e;
    let { target } = e;
    do {
      if (/search-result/.test(target.className)) {
        return;
      }
      target = target.parentElement;
    } while (target !== currentTarget);
    this.resetSearchView();
  };
  handleFocus = () => {
    this.setState({
      showAddButton: false,
      showSearchResult: true
    });
  };
  showCreateGroupDialog = () => {
    this.setState({
      showCreateGroupDialog: true
    });
  };
  closeCreateGroupDialog = () => {
    this.setState({
      showCreateGroupDialog: false
    });
  };
  handleCreateGroup = () => {
    // const name = this.groupName.getValue();
  };
  async search() {
    const keywords = this.searchInput.value.trim();
  }
  handleInputKeyDown = e => {
    if (e.key === 'Enter') {
      setTimeout(() => {
        this.search();
        this.lastSearchTime = Date.now();
      }, 0);
    }
  };
  handleActiveKeyChange = key => {
    this.setState({
      searchResultActiveKey: key
    });
  };

  render() {
    const {
      showAddButton,
      showCreateGroupDialog,
      searchResult,
      showSearchResult,
      searchResultActiveKey,
      showGroupInfo,
      groupInfo,
      showUserInfo,
      userInfo
    } = this.state;

    return (
      <div className="chatPanel-feature">
        <input
          className={showSearchResult ? 'focus' : 'blur'}
          type="text"
          placeholder="搜索群组/用户"
          autoComplete="false"
          ref={i => (this.searchInput = i)}
          onFocus={this.handleFocus}
          onKeyDown={this.handleInputKeyDown}
        />
        <i className="iconfont icon-search" />
        <IconButton
          style={{ display: showAddButton ? 'block' : 'none' }}
          width={40}
          height={40}
          icon="add"
          iconSize={38}
          onClick={this.showCreateGroupDialog}
        />
        <Dialog
          className="create-group-dialog"
          title="创建群组"
          visible={showCreateGroupDialog}
          onClose={this.closeCreateGroupDialog}
        >
          <div className="content">
            <h3>请输入群组名</h3>
            <Input ref={i => (this.groupName = i)} />
            <button onClick={this.handleCreateGroup}>创建</button>
          </div>
        </Dialog>
        <Tabs
          className="search-result"
          style={{ display: showSearchResult ? 'block' : 'none' }}
          activeKey={searchResultActiveKey}
          onChange={this.handleActiveKeyChange}
          renderTabBar={() => <ScrollableInkTabBar />}
          renderTabContent={() => <TabContent />}
        >
          <TabPane tab="全部" key="all">
            {searchResult.users.length === 0 && searchResult.groups.length === 0 ? (
              <p className="none">没有搜索到内容, 换个关键字试试吧~~</p>
            ) : (
              <div className="all-list">
                <div style={{ display: searchResult.users.length > 0 ? 'block' : 'none' }}>
                  <p>用户</p>
                  <div className="user-list" />
                  <div
                    className="more"
                    style={{ display: searchResult.users.length > 3 ? 'block' : 'none' }}
                  >
                    <span onClick={() => {}}>查看更多</span>
                  </div>
                </div>
                <div style={{ display: searchResult.groups.length > 0 ? 'block' : 'none' }}>
                  <p>群组</p>
                  <div className="group-list" />
                  <div
                    className="more"
                    style={{ display: searchResult.groups.length > 0 ? 'block' : 'none' }}
                  >
                    <span>查看更多</span>
                  </div>
                </div>
              </div>
            )}
          </TabPane>
          <TabPane tab="用户" key="user">
            {searchResult.users.length === 0 ? (
              <p className="none">没有搜索到内容, 换个关键字试试吧~~</p>
            ) : (
              <div className="user-list only" />
            )}
          </TabPane>
          <TabPane tab="群组" key="group">
            {searchResult.groups.length === 0 ? (
              <p className="none">没有搜索到内容, 换个关键字试试吧~~</p>
            ) : (
              <div className="group-list only" />
            )}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Feature;
