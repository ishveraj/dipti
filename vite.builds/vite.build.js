require('dotenv').config();
const { execSync } = require('child_process');

const isNodeApp = process.env.NODE_APP === 'yes';
const buildMode = process.env.BUILD_MODE || 'staging';

function run(cmd, extraEnv = {}) {
  console.log('\x1b[34m%s\x1b[0m', `> ${cmd}`);
  
  execSync('vite build', {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });
}

// Node App
if (isNodeApp) {
  const { pre, post } = require('./vite.build.node.js');

  pre();
  run(`building ${buildMode} for Node (client)`, { BUILD_MODE: buildMode });
  run(`building ${buildMode} for Node (server)`, { BUILD_MODE: buildMode, BUILD_TARGET: 'server' });
  post();
} 
// PHP App
else {
  run(`building ${buildMode} for PHP`, { BUILD_MODE: buildMode });
  require('./vite.build.php.js');
}