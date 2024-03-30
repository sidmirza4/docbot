import { readdir, lstat, unlink, rmdir } from "fs/promises";

async function removeDirectory(directoryPath: string) {
  // Read the contents of the directory
  const files = await readdir(directoryPath);

  // Iterate through each item in the directory
  for (const file of files) {
    const filePath = `${directoryPath}/${file}`;
    const stats = await lstat(filePath);

    // Check if the item is a file or directory
    if (stats.isDirectory()) {
      // Recursively remove subdirectories
      await removeDirectory(filePath);
    } else {
      // Remove file
      await unlink(filePath);
    }
  }

  // After removing all files, remove the directory itself
  await rmdir(directoryPath);
}

export default removeDirectory;
