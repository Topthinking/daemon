require('http')
  .createServer((q, s) => {
    if (q.url == '/e') {
      throw {};
    }
    s.end('hello world');
  })
  .listen(3000);
