const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = __dirname.replace(/\\scripts$/, '');
const serverPath = path.join(root, 'server');
const clientPath = path.join(root, 'client');
const portFile = path.join(serverPath, '.dev-port');

const server = spawn('npm', ['run', 'dev'], { cwd: serverPath, shell: true, stdio: 'inherit' });

function waitForPort(timeoutMs = 30000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const tryRead = () => {
      if (fs.existsSync(portFile)) {
        const port = fs.readFileSync(portFile, 'utf8').trim();
        if (port) {
          resolve(port);
          return;
        }
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('Timed out waiting for backend port file'));
        return;
      }

      setTimeout(tryRead, 1000);
    };

    tryRead();
  });
}

waitForPort()
  .then((port) => {
    const apiTarget = `http://127.0.0.1:${port}`;
    const client = spawn('npm', ['run', 'dev'], {
      cwd: clientPath,
      shell: true,
      stdio: 'inherit',
      env: { ...process.env, VITE_API_TARGET: apiTarget, VITE_SOCKET_URL: apiTarget }
    });

    client.on('exit', (code) => {
      server.kill();
      process.exit(code || 1);
    });

    process.on('SIGINT', () => {
      server.kill();
      client.kill();
      process.exit(0);
    });
  })
  .catch((error) => {
    console.error(error.message);
    server.kill();
    process.exit(1);
  });

server.on('exit', (code) => {
  if (code !== 0) {
    process.exit(code || 1);
  }
});
