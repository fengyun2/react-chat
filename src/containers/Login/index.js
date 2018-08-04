import React, { Component } from 'react';
import platform from 'platform';

import { Tabs, TabPane, TabContent, ScrollableInkTabBar } from '../../components/basic/Tabs';
import Input from '../../components/basic/Input';
import Message from '../../components/basic/Message';

import './login.css';

class Login extends Component {
  handleLogin = () => {
    const loginInfo = {
      username: this.loginUsername.getValue(),
      password: this.loginPassword.getValue(),
      os: platform.os.family,
      browser: platform.name,
      environment: platform.description
    };
    console.log(loginInfo);
  };
  handleRegister = () => {
    const registerInfo = {
      username: this.registerUsername.getValue(),
      password: this.registerPassword.getValue(),
      os: platform.os.family,
      browser: platform.name,
      environment: platform.description
    };
    console.log(registerInfo);
  };
  renderLogin() {
    return (
      <div className="pane">
        <h3>用户名</h3>
        <Input ref={i => (this.loginUsername = i)} onEnter={this.handleLogin} />
        <h3>密码</h3>
        <Input ref={i => (this.loginPassword = i)} type="password" onEnter={this.handleLogin} />
        <button onClick={this.handleLogin}>登录</button>
      </div>
    );
  }

  renderRegister() {
    return (
      <div className="pane">
        <h3>用户名</h3>
        <Input
          ref={i => (this.registerUsername = i)}
          onEnter={this.handleRegister}
          placeholder="用户名即昵称，请慎重，不可修改"
        />
        <h3>密码</h3>
        <Input
          ref={i => (this.registerPassword = i)}
          onEnter={this.handleRegister}
          placeholder="暂也不支持修改"
        />
        <button onClick={this.handleRegister}>注册</button>
      </div>
    );
  }

  render() {
    return (
      <Tabs
        className="main-login"
        defaultActiveKey="login"
        renderTabBar={() => <ScrollableInkTabBar />}
        renderTabContent={() => <TabContent />}
      >
        <TabPane tab="登录" key="login">
          {this.renderLogin()}
        </TabPane>
        <TabPane tab="注册" key="register">
          {this.renderRegister()}
        </TabPane>
      </Tabs>
    );
  }
}

export default Login;