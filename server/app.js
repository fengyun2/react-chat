const Koa = require('koa');
const IO = require('koa-socket');
const koaSend = require('koa-send');
const koaStatic = require('koa-static');
const path = require('path');

const config = require('../config/server');

// middlewares
const enhanceContext = require('./middlewares/enhanceContext');
const catchError = require('./middlewares/catchError');
const isLogin = require('./middlewares/isLogin');
const route = require('./middlewares/route');

// routes
const userRoutes = require('./routes/user');

// models
const Socket = require('./models/socket');

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

const io = new IO({
  ioOptions: {
    pingTimeout: 10000,
    pingInterval: 5000,
  },
});

// 注入应用
io.attach(app);

if (process.env.NODE_ENV === 'production' && config.allowOrigin) {
  app._io.origins(config.allowOrigin);
}

// 中间件
io.use(enhanceContext());
io.use(catchError());
io.use(isLogin());
io.use(route(app.io, app._io, Object.assign({}, userRoutes)));

app.io.on('connection', async (ctx) => {
  console.log(`  <<<< connection ${ctx.socket.id} ${ctx.socket.request.connection.remoteAddress}`);
  await Socket.create({
    id: ctx.socket.id,
    ip: ctx.socket.request.connection.remoteAddress,
  });
});

app.io.on('disconnect', async (ctx) => {
  console.log(`  >>>> disconnect ${ctx.socket.id}`);
  await Socket.remove({
    id: ctx.socket.id,
  });
});

module.exports = app;
