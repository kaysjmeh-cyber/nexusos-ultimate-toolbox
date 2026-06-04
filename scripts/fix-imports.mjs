import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx|mjs)$/.test(name)) {
      const s = fs.readFileSync(p, 'utf8');
      const n = s.replaceAll("@nexus-types/", "@nexus-types/");
      if (n !== s) fs.writeFileSync(p, n);
    }
  }
}

walk(path.join(root, 'src'));
walk(path.join(root, 'scripts'));
