/**
 * Génère les images de démonstration des commerces de Lomé (AI), converties en JPEG optimisé.
 * Usage: bun scripts/gen-images.ts
 */
import ZAI from 'z-ai-web-dev-sdk';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const jobs: Array<[string, string]> = [
  ['phone-repair', 'Close-up photo of a phone repair shop workbench in West Africa, technician hands fixing a smartphone screen with tools, warm ambient light, shallow depth of field, photorealistic, high quality, no text'],
  ['electronics', 'Small electronics repair shop interior with TV sets, radios and decoders on shelves, West African context, warm daylight, photorealistic, high quality, no text'],
  ['cafe', 'Cozy small café terrace in Lomé Togo, coffee cup and pastries on wooden table, plants and rattan chairs, warm morning light, photorealistic, high quality, no text'],
  ['restaurant', 'Delicious West African togolese meal with grilled fish, attiéké and spicy sauce on a plate, outdoor restaurant wooden table, appetizing food photography, photorealistic, no text'],
  ['fish-grill', 'Grilled whole fish with fried plantains (aloco) being served at a lively open-air maquis restaurant in West Africa, charcoal grill smoke, evening light, photorealistic, no text'],
  ['barbershop', 'Modern African barbershop interior with vintage barber chair, mirror and clippers on wooden counter, warm light, photorealistic, high quality, no text'],
  ['hair-salon', 'African hair braiding salon, stylist braiding beautiful cornrows, colorful braids, bright friendly interior, photorealistic, high quality, no text'],
  ['pharmacy', 'Small neighborhood pharmacy counter with medicine boxes and green cross, pharmacist hand giving advice, clean bright interior, West Africa, photorealistic, no text'],
  ['boutique', 'Small fashion boutique with colorful African wax fabric rolls and clothing racks, warm light, West African market context, photorealistic, high quality, no text'],
  ['money', 'Person using smartphone mobile money payment at a small kiosk shop in West Africa, friendly agent, warm daylight, photorealistic, high quality, no text'],
  ['zemidjan', 'Yellow motorcycle taxi (zémidjan) driving on a sunny street in Lomé Togo, motion blur background, vibrant street life, photorealistic, high quality, no text'],
  ['printshop', 'Small print shop copy center with printer machines, paper stacks and photocopies, West African context, bright interior, photorealistic, high quality, no text'],
];

const outDir = path.join(process.cwd(), 'public', 'images', 'shops');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const zai = await ZAI.create();
  for (const [name, prompt] of jobs) {
    const out = path.join(outDir, `${name}.jpg`);
    if (fs.existsSync(out) && fs.statSync(out).size > 10000) {
      console.log('SKIP', name);
      continue;
    }
    let done = false;
    for (let attempt = 1; attempt <= 3 && !done; attempt++) {
      try {
        const r = await zai.images.generations.create({ prompt, size: '1152x864' });
        const b64 = r?.data?.[0]?.base64;
        if (!b64) throw new Error('empty response');
        const buf = Buffer.from(b64, 'base64');
        await sharp(buf).jpeg({ quality: 78, mozjpeg: true }).toFile(out);
        console.log('OK', name, fs.statSync(out).size, 'bytes');
        done = true;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('ERR', name, 'attempt', attempt, msg);
        await new Promise((res) => setTimeout(res, 2000 * attempt));
      }
    }
  }
  console.log('ALL_DONE');
}

main();
