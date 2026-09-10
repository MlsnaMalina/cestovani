import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
it('všechny fotografie z katalogu jsou skutečně přibalené soubory JPEG',()=>{
 const photos=JSON.parse(readFileSync('data/photos.json','utf8'));
 for(const photo of Object.values(photos)){
  const bytes=readFileSync('public'+photo.src);
  expect(bytes.length).toBeGreaterThan(1000);
  expect(bytes[0]).toBe(255);expect(bytes[1]).toBe(216);
 }
});
