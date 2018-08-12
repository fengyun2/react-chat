function noop() {}

/**
 * 路由处理
 * @param {IO} io koa-socket实例
 * @param {IO} _io socket.io实例
 * @param {Object} routes
 */
module.exports = function (io, _io, routes) {
  console.log('11111111');

  Object.keys(routes).forEach((route) => {
    io.on(route, noop); // 注册事件
    console.log('route ====> ', route);
  });

  return async (ctx) => {
    console.log('ctx.event ===> ', ctx.event);
    // 判断路由是否存在
    if (routes[ctx.event]) {
      const { event, data, socket } = ctx;
      // 执行路由并获取返回数据
      ctx.res = await routes[ctx.event]({
        event, // 事件名
        data, // 请求数据
        socket, // 用户socket实例
        io, // koa-socket实例
        _io, // socket.io实例
      });
    }
  };
};
