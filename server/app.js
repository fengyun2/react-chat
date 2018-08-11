const Koa = require('koa');
const IO = require('koa-socket');
const koaSend = require('koa-send');
const koaStatic = require('koa-static');
const path = require('path');

const config = require('../config/server');

const app = new Koa();
// 将前端路由指向 index.html
app.use(async (ctx, next) => {
  if (!/\./.test(ctx.request.url)) {
    await koaSend(ctx, 'index.html', {
      root: path.join(__dirname, '../public'),
      maxAge: 1000 * 60 * 60 * 24 * 7,
      gzip: true,
    });
  } else {
    await next();
  }
});

// 静态文件访问
app.use(koaStatic(path.join(__dirname, '../public'), { maxage: 1000 * 60 * 60 * 24 * 7, gzip: true }));

if (process.env.NODE_ENV === 'production' && config.allowOrigin) {
  // app._io.origins(config.allowOrigin);
}

module.exports = app;
