const Koa = require('koa');
const Views = require('koa-views');
const Mount = require('koa-mount');
const Static = require('koa-static');
const https = require('https');
const fs = require('fs');

const app = new Koa();

app.use(Views('./'));

app.use(Mount('/static', new Koa().use(Static('./static'))));

app.use(async (ctx, next) => {
  await ctx.render('index');
});

https
  .createServer(
    {
      cert: fs.readFileSync('./https.crt'),
      key: fs.readFileSync('./https.key'),
    },
    app.callback(),
  )
  .listen(443);
