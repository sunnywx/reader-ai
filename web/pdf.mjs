import { pdfjs } from 'react-pdf';
console.log('pdfjs version: ', pdfjs.version)

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from "node:url";

// export const getCurrentDir=(importUrl = import.meta.url)=> {
//   const __filename = fileURLToPath(importUrl);
//   return path.dirname(__filename);
// }

// const pdfjsDistPath = path.dirname(fileURLToPath('pdfjs-dist/package.json'));
// const pdfWorkerPath = path.join(pdfjsDistPath, 'build', 'pdf.worker.mjs');

// console.log('pdfjs dist path: ', pdfjsDistPath)
// console.log('pdfjs worker path: ', pdfWorkerPath)

// fs.cpSync(pdfWorkerPath, './dist/pdf.worker.mjs', { recursive: true });

// copy cmaps, run script inside web folder
const pkg_dir='node_modules/.pnpm/pdfjs-dist@3.11.174/node_modules/pdfjs-dist/package.json'
const cMapsDir = path.join(path.dirname(pkg_dir), 'cmaps');

console.log('cmap dir: ', cMapsDir)

// fs.cpSync(cMapsDir, 'public/dist/cmaps/', { recursive: true });