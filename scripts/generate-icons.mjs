/**
 * Generate PWA icon PNGs from public/icons/icon.svg using sharp.
 * Run: node scripts/generate-icons.mjs
 *
 * Outputs:
 *   public/icons/icon-192.png        — standard 192×192 PWA icon
 *   public/icons/icon-512.png        — standard 512×512 PWA icon
 *   public/icons/icon-maskable.png   — 512×512 maskable (content in centre 80%)
 *   public/icons/apple-touch-icon.png — 180×180 iOS home screen icon
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'public', 'icons', 'icon.svg');
const outDir = join(root, 'public', 'icons');

mkdirSync(outDir, { recursive: true });

const svgBuffer = readFileSync(svgPath);

const icons = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

// Standard icons
for (const { name, size } of icons) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(outDir, name));
  console.log(`✓ ${name} (${size}×${size})`);
}

// Maskable icon: 512×512 canvas, icon scaled to 80% (410px) centred
// This ensures content sits within Android's safe zone circle
const maskableSize = 512;
const innerSize = Math.round(maskableSize * 0.8); // 410px
const offset = Math.round((maskableSize - innerSize) / 2); // 51px each side

const innerPng = await sharp(svgBuffer)
  .resize(innerSize, innerSize)
  .png()
  .toBuffer();

await sharp({
  create: {
    width: maskableSize,
    height: maskableSize,
    channels: 4,
    background: { r: 13, g: 148, b: 136, alpha: 1 }, // #0D9488 teal
  },
})
  .composite([{ input: innerPng, top: offset, left: offset }])
  .png()
  .toFile(join(outDir, 'icon-maskable.png'));
console.log(`✓ icon-maskable.png (${maskableSize}×${maskableSize}, safe zone padded)`);

console.log('\nAll icons generated in public/icons/');
