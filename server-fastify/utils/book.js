import fs from "fs/promises";
import path from "path";

const acceptExts = [".pdf", ".epub"];
const ignoreDirs = [".git", "node_modules", "venv", ".venv", "__pycache__"];

/**
 * Reads a directory recursively and returns a list of directories and files.
 *
 * @param {string} directoryPath - Path to the directory to read.
 * @returns {Promise<Array<{name: string, isDir?: boolean, files?: Array<{name: string, size: number}>}>>}
 *          A promise resolving to an array of directory and file objects.
 */
export async function readDirectory(directoryPath) {
  const result = [];

  const filesAndDirs = await fs.readdir(directoryPath);

  for (const file of filesAndDirs) {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory() && !ignoreDirs.some((d) => filePath.endsWith(d))) {
      const files = await readDirectory(filePath);
      if (files.length) {
        result.push({
          name: file,
          // isDir: true,
          files,
        });
      }
    } else {
      const ext = path.extname(file);
      if (acceptExts.includes(ext)) {
        result.push({ name: file, size: stats.size });
      }
    }
  }

  return result;
}
