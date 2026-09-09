import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.',import.meta.url));
http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1:4173');
    const file = path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    if (!file.startsWith(root) || !['.html','.png'].includes(path.extname(file))) { res.writeHead(404);res.end();return; }
    const body = await readFile(file);
    res.writeHead(200,{'Content-Type':file.endsWith('.png')?'image/png':'text/html; charset=utf-8','Cache-Control':'no-store'});
    res.end(body);
  } catch { res.writeHead(404);res.end('Nenalezeno'); }
}).listen(4173,'127.0.0.1',()=>console.log('Koncepty: http://127.0.0.1:4173'));
