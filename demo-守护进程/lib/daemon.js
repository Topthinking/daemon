const { spawn } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./err.log', 'a');

const argvs = process.argv.slice(2);

let cmd = '',
  name = '';

argvs.map((item, index) => {
  if (item === 'start' && cmd === '') {
    cmd = 'start';
    name = argvs[index + 1];
  }

  if (item === 'stop' && cmd === '') {
    cmd = 'stop';
    name = argvs[index + 1];
  }

  if (item === 'clean' && cmd === '') {
    cmd = 'clean';
  }
});

const _name = crypto.createHmac('sha256', name).digest('hex');

const RootFileName = path.join(process.env.HOME, '._test_daemon__');

if (!fs.existsSync(RootFileName)) {
  fs.mkdirSync(RootFileName);
}

const pidFile = path.join(RootFileName, _name + '.pid');
const daemonPidFile = path.join(RootFileName, 'daemon.pid');

const appPath = path.join(process.cwd(), name);

if (cmd === 'start' && name) {
  if (fs.existsSync(pidFile)) {
    console.log('服务已经启动了');
    process.exit();
  }
  const monitor = spawn(
    process.execPath,
    [path.resolve(__dirname, 'worker.js')],
    {
      detached: true,
      stdio: ['ipc', out, err],
    },
  );

  fs.writeFileSync(daemonPidFile, monitor.pid);

  monitor.send({ appPath, pidFile });

  monitor.disconnect();

  monitor.unref();
  console.log('服务启动成功...');
}

if (cmd === 'stop' && name) {
  if (!fs.existsSync(daemonPidFile) || !fs.existsSync(pidFile)) {
    process.exit();
  }
  const daemonPid = fs.readFileSync(daemonPidFile, 'utf-8');
  const childPid = fs.readFileSync(pidFile, 'utf-8');

  spawn('kill', [daemonPid, childPid]);
  spawn('rm', ['-rf', pidFile]);
  console.log('服务关闭成功...');
}

if (cmd === 'clean') {
  spawn('rm', ['-rf', RootFileName]);
}
