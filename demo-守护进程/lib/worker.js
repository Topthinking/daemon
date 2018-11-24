const { fork } = require('child_process');
const fs = require('fs');

const createProcess = (appPath, pidFile) => {
  const worker = fork(appPath);

  worker.on('exit', function(err) {
    console.log('kill worker:', worker.pid);
    if (err) {
      console.error('exit-error', err);
    }
    createProcess(appPath, pidFile);
  });
  fs.writeFileSync(pidFile, worker.pid);
  console.log('create worker:', worker.pid);
};

process.on('message', function({ appPath, pidFile }) {
  createProcess(appPath, pidFile);
});
