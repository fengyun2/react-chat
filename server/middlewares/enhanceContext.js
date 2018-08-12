/**
 * 增强context对象
 */
module.exports = function () {
  return async (ctx, next) => {
    await next();
    if (ctx.acknowledge) {
      // 没有ctx.acknowledge,则客户端收不到返回的消息
      ctx.acknowledge(ctx.res);
    }
  };
};
