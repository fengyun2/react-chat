export const BASE_API = 'https://cnodejs.org/api/v1';
export default {
  server: process.env.NODE_ENV === 'development' ? '//localhost:8005' : '',
  maxImageSize: 1024 * 1024 * 3,
  maxBackgroundImageSize: 1024 * 1024 * 3,

  // 系统设置
  primaryColor: '74, 144, 226',
  primaryTextColor: '247, 247, 247',
  backgroundImage: require('./assets/images/background.jpg'),
  sound: 'default'
};
