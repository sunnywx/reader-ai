import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import os from 'os';
import path from 'path';

const baseDir=process.cwd()

/**
 * __dirname is not defined in esm, use import.meta.url
 * @param {*} importUrl 
 * @returns 
 */
export const getCurrentDir=(importUrl = import.meta.url)=> {
  const __filename = fileURLToPath(importUrl);
  return dirname(__filename);
}

export const getDirFromRoot=(dir)=> {
  return resolve(baseDir, dir)
}

/**
 * Converts a tilde path to its full path
 * @param {string} pathname - Path starting with ~ or ~user
 * @returns {string} The expanded absolute path
 */
export function expandPath(pathname) {
  if (pathname[0] === '~') {
    // If the path starts with ~/, replace it with the home directory
    if (pathname.length === 1 || pathname[1] === '/') {
      return path.join(os.homedir(), pathname.slice(1));
    }
    // If it's like ~username/path, we would need to get that user's home directory
    // This is more complex and not directly supported in Node.js
    throw new Error('Expanding ~user paths is not supported');
  }
  // If it doesn't start with ~, return the path as is
  if(pathname.startsWith('/')) return pathname

  return resolve(baseDir, pathname);
}