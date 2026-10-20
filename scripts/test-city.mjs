import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const testDirectory = resolve(projectRoot, 'src/features/city');
const outputDirectory = resolve(projectRoot, '.next/city-tests');
const tests = readdirSync(testDirectory).filter((name) => name.endsWith('.test.ts'));

// Keep all generated artifacts inside the portfolio and stop before running stale output.
const compilation = spawnSync(process.execPath, [
  resolve(projectRoot, 'node_modules/typescript/bin/tsc'),
  ...tests.map((name) => resolve(testDirectory, name)),
  '--outDir', outputDirectory,
  '--module', 'commonjs',
  '--target', 'es2022',
  '--esModuleInterop',
  '--skipLibCheck',
  '--noEmitOnError',
], { cwd: projectRoot, stdio: 'inherit' });

if (compilation.error) throw compilation.error;
if (compilation.status !== 0) process.exit(compilation.status ?? 1);

const execution = spawnSync(process.execPath, [
  '--test', ...tests.map((name) => resolve(outputDirectory, name.replace(/\.ts$/, '.js'))),
], { cwd: projectRoot, stdio: 'inherit' });

if (execution.error) throw execution.error;
process.exit(execution.status ?? 1);
