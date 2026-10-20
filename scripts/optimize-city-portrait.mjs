import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'public/profile.png');
const destination = resolve(root, 'public/city/textures/face-mask.webp');
const original = await readFile(source);
const sourceHash = createHash('sha256').update(original).digest('hex');
const metadata = await sharp(original).metadata();
if (metadata.width !== 601 || metadata.height !== 871) {
  throw new Error('The mask outline expects the 601 × 871 portrait; review its UV mapping before regenerating.');
}

await mkdir(dirname(destination), { recursive: true });
await sharp(original).resize({ width: 384 }).webp({ quality: 82, effort: 6 }).toFile(destination);
const output = await sharp(destination).metadata();
const bytes = (await stat(destination)).size;
if (createHash('sha256').update(await readFile(source)).digest('hex') !== sourceHash) {
  throw new Error('The original portrait changed during asset processing.');
}
const report = {
  source: 'public/profile.png',
  sourceSha256: sourceHash,
  sourceBytes: original.length,
  sourceDimensions: [metadata.width, metadata.height],
  output: 'public/city/textures/face-mask.webp',
  outputBytes: bytes,
  outputDimensions: [output.width, output.height],
  quality: 82,
  reductionPercent: (1 - bytes / original.length) * 100,
  originalPreserved: true,
};
await writeFile(resolve(root, 'docs/city/2026-10-20-portrait-optimization.json'), JSON.stringify(report, null, 2) + '\n');
process.stdout.write(JSON.stringify(report, null, 2) + '\n');
