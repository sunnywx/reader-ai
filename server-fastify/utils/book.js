import fs from "fs/promises";
import path from "path";

const acceptExts = [".pdf", ".epub", ".md"];
const ignoreDirs = [".git", "node_modules", "venv", ".venv", "__pycache__"];

/**
 * Reads a directory recursively and returns a list of directories and files.
 *
 * @param {string} directoryPath - Path to the directory to read.
 * @returns {Promise<Array<{name: string, isDir?: boolean, files?: Array<{name: string, size: number}>}>>}
 *          A promise resolving to an array of directory and file objects.
 */
export async function readDirectory(directoryPath, prefix='') {
  const result = [];

  const filesAndDirs = await fs.readdir(directoryPath);

  for (const file of filesAndDirs) {
    // console.log('file, prefix ', file, prefix)
    const filePath = path.join(directoryPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory() && !ignoreDirs.some((d) => filePath.endsWith(d))) {
      const next_prefix=path.join(prefix, file)
      const files = await readDirectory(filePath, next_prefix);

      if (files.length) {
        result.push({
          name: file,
          files,
          prefix: next_prefix
        });
      }
    } else {
      const ext = path.extname(file);
      if (acceptExts.includes(ext)) {
        result.push({ 
          name: file,
          size: stats.size,
          createAt: stats.ctime,
          prefix
        });
      }
    }
  }

  // sort files, directory first, sort by name
  return result.sort((f1, f2)=> {
    if(Array.isArray(f1.files)){
      if(Array.isArray(f2.files)) {
        return f1.name.localeCompare(f2.name)
      }
      return -1
    }

    return f1.name.localeCompare(f2.name)
  });
}
