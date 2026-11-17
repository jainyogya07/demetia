import { spawnSync } from 'node:child_process';

function hasCommand(cmd) {
  const res = spawnSync('which', [cmd], { stdio: 'ignore' });
  return res.status === 0;
}

console.log('Checking container engine...');

if (hasCommand('docker')) {
  const versionCheck = spawnSync('docker', ['compose', 'version'], { stdio: 'ignore' });
  if (versionCheck.status === 0) {
    const res = spawnSync('docker', ['compose', 'up', '-d'], { stdio: 'inherit' });
    if (res.status === 0) {
      process.exit(0);
    }
  }
}

if (hasCommand('podman')) {
  const startOrRun = (name, runArgs) => {
    const inspect = spawnSync('podman', ['container', 'exists', name], { stdio: 'ignore' });
    if (inspect.status === 0) {
      console.log(`Starting existing container ${name}...`);
      spawnSync('podman', ['start', name], { stdio: 'inherit' });
    } else {
      console.log(`Creating and starting container ${name}...`);
      spawnSync('podman', ['run', '-d', '--name', name, ...runArgs], { stdio: 'inherit' });
    }
  };

  startOrRun('smriti-postgres', [
    '-p', '5432:5432',
    '-e', 'POSTGRES_USER=smriti',
    '-e', 'POSTGRES_PASSWORD=smriti',
    '-e', 'POSTGRES_DB=smriti',
    '-v', 'smriti_pg:/var/lib/postgresql/data',
    'docker.io/library/postgres:16-alpine',
  ]);

  startOrRun('smriti-mailpit', [
    '-p', '1025:1025',
    '-p', '8025:8025',
    'docker.io/axllent/mailpit:latest',
  ]);

  console.log('Postgres + Mailpit are ready via Podman!');
  process.exit(0);
}

console.error('Error: Neither docker nor podman is installed on this system.');
process.exit(1);
