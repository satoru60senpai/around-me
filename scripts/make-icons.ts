/**
 * Génère toutes les icônes de l'app Around Me (cible corail sur fond ivoire/corail).
 * Usage: bun scripts/make-icons.ts
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const CORAIL = '#FF7F6B';
const GLYPH = `<g stroke="#FFFFFF" stroke-width="26" fill="none" stroke-linecap="round"><circle cx="256" cy="256" r="88"/><path d="M256 112v46M256 354v46M112 256h46M354 256h46"/></g><circle cx="256" cy="256" r="34" fill="#FFFFFF"/>`;

function iconSvg(size: number, rx: number, scale: number, bg: string, glyph = GLYPH): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512"><rect width="512" height="512" rx="${rx}" fill="${bg}"/><g transform="translate(256,256) scale(${scale}) translate(-256,-256)">${glyph}</g></svg>`;
}

const outDir = path.join(process.cwd(), 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

async function render(svg: string, file: string) {
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, file));
  console.log('OK', file);
}

async function main() {
  // Icônes standard (fond corail plein)
  await render(iconSvg(512, 116, 1, CORAIL), 'icon-512.png');
  await render(iconSvg(192, 44, 1, CORAIL), 'icon-192.png');
  // Maskable : plein cadre, glyphe réduit
  await render(iconSvg(512, 0, 0.72, CORAIL), 'icon-maskable-512.png');
  await render(iconSvg(192, 0, 0.72, CORAIL), 'icon-maskable-192.png');
  // Apple touch (iOS masque lui-même → plein cadre)
  await render(iconSvg(180, 0, 0.8, CORAIL), 'apple-touch-icon.png');
  // Favicon
  await render(iconSvg(48, 12, 1, CORAIL), 'favicon-48.png');
  await render(iconSvg(32, 8, 1, CORAIL), 'favicon-32.png');
  console.log('ALL_DONE');
}

main();
