const cluster = require('cluster');
const http = require('http');
const cpuNums = require('os').cpus().length;

if (cluster.isMaster) {
  var i = 0;
  const widArr = [];
  for (let i = 0; i < cpuNums; i++) {
    cluster.fork();
  }
  cluster.on('fork', (worker) => {
    console.log(`fork:worker${worker.id}`);
  });
  cluster.on('online', (worker) => {
    console.log(`worker${worker.id} is online now`);
  });
  cluster.on('message', (worker, msg) => {
    if (msg === 'ex') {
      i++;
      widArr.push(worker.id);
      i >= 80 && process.exit(0);
    }
  });

  process.on('exit', (code) => {
    console.log(analyzeArr(widArr));
  });
  //统计每个worker被调用的次数
  function analyzeArr(arr) {
    let obj = {};
    arr.forEach((id, idx, arr) => {
      obj['work' + id] = obj['work' + id] !== void 0 ? obj['work' + id] + 1 : 1;
    });
    return obj;
  }
} else {
  http
    .createServer((q, s) => {
      console.log(`worker${cluster.worker.id}`);
      process.send('ex');
      s.end('hello world' + cluster.worker.id);
    })
    .listen(3001);
}
