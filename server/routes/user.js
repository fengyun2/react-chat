const assert = require('assert');
const bluebird = require('bluebird');
const bcrypt = bluebird.promisifyAll(require('bcrypt'), { suffix: '$' });
const jwt = require('jwt-simple');
const { isValid } = require('mongoose').Types.ObjectId;

const User = require('../models/user');
const Group = require('../models/group');
const Socket = require('../models/socket');
const Friend = require('../models/friend');
const Message = require('../models/message');
const config = require('../../config/server');
const getRandomAvatar = require('../../utils/getRandomAvatar');

const saltRounds = 10;
const OneDay = 1000 * 60 * 60 * 24;

/**
 * 生成token
 * @param {User} user 用户
 * @param {Object} environment 客户端信息
 */
function generateToken(user, environment) {
  return jwt.encode(
    {
      user,
      environment,
      expires: Date.now() + config.tokenExpiresTime,
    },
    config.jwtSecret,
  );
}

/**
 * 处理注册时间不满24小时的用户
 * @param {User} user 用户
 */
function handleNewUser(user) {
  // 将用户添加到新用户列表，24小时后删除
  if (Date.now() - user.createTime.getTime() < OneDay) {
    const newUserList = global.mdb.get('newUserList');
    newUserList.add(user._id.toString());
    setTimeout(() => {
      newUserList.delete(user._id.toString());
    }, OneDay);
  }
}

module.exports = {
  async register(ctx) {
    const { username, password, os, browser, environment } = ctx.data;
    assert(username, '用户名不能为空');
    assert(password, '密码不能为空');

    const user = await User.findOne({ username });
    assert(!user, '该用户名已存在');

    const defaultGroup = await Group.findOne({ isDefault: true });
    assert(defaultGroup, '默认群组不存在');

    const salt = await bcrypt.genSalt$(saltRounds);
    const hash = await bcrypt.hash$(password, salt);

    let newUser = null;
    try {
      newUser = await User.create({
        username,
        salt,
        password: hash,
        avatar: getRandomAvatar(),
      });
    } catch (err) {
      if (err.name === 'ValidationError') {
        return '用户名包含不支持的字符或者长度超过限制';
      }
      throw err;
    }

    handleNewUser(newUser);

    defaultGroup.members.push(newUser);
    await defaultGroup.save();

    const token = generateToken(newUser._id, environment);

    ctx.socket.user = newUser._id;
    await Socket.update(
      { id: ctx.socket.id },
      {
        user: newUser._id,
        os,
        browser,
        environment,
      },
    );

    return {
      _id: newUser._id,
      avatar: newUser.avatar,
      username: newUser.username,
      groups: [
        {
          _id: defaultGroup._id,
          name: defaultGroup.name,
          avatar: defaultGroup.avatar,
          creator: defaultGroup.creator,
          createTime: defaultGroup.createTime,
          messages: [],
        },
      ],
      friends: [],
      token,
      isAdmin: false,
    };
  },
  async login(ctx) {
    assert(!ctx.socket.user, '你已经登录了');

    const { username, password, os, browser, environment } = ctx.data;
    assert(username, '用户名不能为空');
    assert(password, '密码不能为空');

    const user = await User.findOne({ username });
    assert(user, '该用户不存在');

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    assert(isPasswordCorrect, '密码错误');

    handleNewUser(user);
    user.lastLoginTime = Date.now();
    await user.save();
  },
};
