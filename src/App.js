import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from './components/basic/Dialog/index';
import Login from './containers/Login/index';

console.log('Login: ', Login);

class App extends Component {
  static propTypes = {
    showLoginDialog: PropTypes.bool,
    backgroundImage: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      width: App.getWidth(),
      height: 0.85,
      resize: 0,
      backgroundWidth: window.innerWidth,
      backgroundHeight: window.innerHeight
    };
  }
  componentDidMount() {
    const img = new Image();
    img.onload = () => {
      this.setState({
        backgroundWidth: Math.max(img.width, window.innerWidth),
        backgroundHeight: Math.max(img.height, window.innerHeight)
      });
    };
    img.src = this.props.backgroundImage;

    window.onresize = () => {
      // 触发rerender
      this.setState({
        resize: this.state.resize + 1,
        width: App.getWidth()
      });
    };
  }
  get style() {
    const { backgroundWidth, backgroundHeight } = this.state;
    return {
      backgroundImage: `url(${this.props.backgroundImage})`,
      backgroundSize: `${backgroundWidth}px ${backgroundHeight}px`,
      backgroundRepeat: 'no-repeat'
    };
  }
  get blurStyle() {
    const { width, height } = this.state;
    const { innerWidth, innerHeight } = window;
    return Object.assign(
      {
        backgroundPosition: `${(-(1 - width) * innerWidth) / 2}px ${(-(1 - height) * innerHeight) /
          2}px`
      },
      this.childStyle,
      this.style
    );
  }
  get childStyle() {
    const { width, height } = this.state;
    return {
      width: `${width * 100}%`,
      height: `${height * 100}%`,
      position: 'absolute',
      left: `${((1 - width) / 2) * 100}%`,
      top: `${((1 - height) / 2) * 100}%`
    };
  }
  static getWidth() {
    let width = 0.6;
    if (window.innerWidth < 1000) {
      width = 0.9;
    } else if (window.innerWidth < 1300) {
      width = 0.8;
    } else if (window.innerWidth < 1600) {
      width = 0.7;
    }
    return width;
  }

  render() {
    const { showLoginDialog = true } = this.props;
    return (
      <div className="app" style={this.style}>
        <div className="blur" style={this.blurStyle} />
        <div className="child" style={this.childStyle} />
        <Dialog visible={showLoginDialog} closable={false} onClose={() => {}}>
          <Login />
        </Dialog>
      </div>
    );
  }
}

export default App;
