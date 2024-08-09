import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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