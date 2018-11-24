const fork = require('child_process').fork;

const workers = {};

const createWorker = (appPath) => {
  const worker = fork(appPath);
  worker.on('exit', function() {
    console.log('worker:' + worker.pid + 'exited');
    delete workers[worker.pid];
    createWorker(appPath);
  });

  workers[worker.pid] = worker;
  console.log('Create worker:' + worker.pid);
};

createWorker('./server.js');

// process.on('exit', function() {
//   for (let pid in workers) {
//     workers[pid].kill();
//   }
// });
