/**
 * Génère les icônes de lanceur + écrans de splash Android pour Around Me.
 * Usage: bun scripts/make-launcher-icons.ts
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const RES = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'res');
const CORAIL = '#FF7F6B';
const IVOIRE = '#FFF8F0';

const GLYPH = `<g stroke="#FFFFFF" stroke-width="26" fill="none" stroke-linecap="round"><circle cx="256" cy="256" r="88"/><path d="M256 112v46M256 354v46M112 256h46M354 256h46"/></g><circle cx="256" cy="256" r="34" fill="#FFFFFF"/>`;

function squareIcon(size: number, rx: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512"><rect width="512" height="512" rx="${(rx / size) * 512}" fill="${CORAIL}"/><g>${GLYPH}</g></svg>`;
}

function roundIcon(size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512"><circle cx="256" cy="256" r="256" fill="${CORAIL}"/><g>${GLYPH}</g></svg>`;
}

function foregroundIcon(size: number): string {
  const scale = 0.42; // zone sûre des icônes adaptatives
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512"><g transform="translate(256,256) scale(${scale}) translate(-256,-256)">${GLYPH}</g></svg>`;
}

function splash(w: number, h: number): string {
  const icon = Math.round(Math.min(w, h) * 0.18);
  const x = w / 2 - icon / 2;
  const y = h / 2 - icon / 2;
  const rx = icon * 0.24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${IVOIRE}"/><rect x="${x}" y="${y}" width="${icon}" height="${icon}" rx="${rx}" fill="${CORAIL}"/><g transform="translate(${x},${y}) scale(${icon / 512})">${GLYPH}</g></svg>`;
}

const DENSITIES: Record<string, number> = {
  mdpi: 1,
  hdpi: 1.5,
  xhdpi: 2,
  xxhdpi: 3,
  xxxhdpi: 4,
};

async function main() {
  for (const [d, mult] of Object.entries(DENSITIES)) {
    const dir = path.join(RES, `mipmap-${d}`);
    fs.mkdirSync(dir, { recursive: true });

    // Icônes statiques (fallback)
    await sharp(Buffer.from(squareIcon(Math.round(48 * mult), Math.round(48 * mult * 0.22))))
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));
    await sharp(Buffer.from(roundIcon(Math.round(48 * mult))))
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));
    // Foreground adaptatif (base 108dp)
    await sharp(Buffer.from(foregroundIcon(Math.round(108 * mult))))
      .png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));
    console.log('OK mipmap-' + d);
  }

  // Couleur de fond de l'icône adaptative
  fs.writeFileSync(
    path.join(RES, 'values', 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${CORAIL}</color>\n</resources>\n`
  );
  console.log('OK ic_launcher_background');

  // Splashes (portrait + paysage)
  const SPLASHES: Array<[string, number, number]> = [
    ['mdpi', 480, 800], ['hdpi', 720, 1280], ['xhdpi', 960, 1600], ['xxhdpi', 1440, 2560], ['xxxhdpi', 1920, 3200],
  ];
  for (const [d, w, h] of SPLASHES) {
    const pDir = path.join(RES, `drawable-port-${d}`);
    const lDir = path.join(RES, `drawable-land-${d}`);
    if (fs.existsSync(pDir)) {
      await sharp(Buffer.from(splash(w, h))).png().toFile(path.join(pDir, 'splash.png'));
    }
    if (fs.existsSync(lDir)) {
      await sharp(Buffer.from(splash(h, w))).png().toFile(path.join(lDir, 'splash.png'));
    }
    await sharp(Buffer.from(splash(720, 1280))).png().toFile(path.join(RES, 'drawable', 'splash.png'));
    console.log('OK splash-' + d);
  }

  console.log('ALL_DONE');
}

main();
