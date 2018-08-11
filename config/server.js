const options = require('../utils/commandOptions');

module.exports = {
  // service port
  port: options.port || 9200,

  // mongodb address
  database: options.database || 'mongodb://localhost:27017/react-chat',

  // jwt encryption secret
  jwtSecret: options.jwtSecret || 'jwtSecret',

  // Maximize the number of groups
  maxGroupsCount: 3,

  // qiniu config
  qiniuAccessKey: options.qiniuAccessKey || '',
  qiniuSecretKey: options.qiniuSecretKey || '',
  qiniuBucket: options.qiniuBucket || '',
  qiniuUrlPrefix: options.qiniuUrlPrefix || '',

  allowOrigin: options.allowOrigin,

  // token expires time
  tokenExpiresTime: 1000 * 60 * 60 * 24 * 30,

  administrator: options.administrator || '',
};
