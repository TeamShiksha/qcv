import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function readMarkdownFile(filePath) {
  const absolutePath = path.resolve(filePath);
  const markdown = await readFile(absolutePath, "utf8");

  return {
    absolutePath,
    markdown
  };
}

export function inferOutputPath(inputPath, format = "md") {
  const parsed = path.parse(path.resolve(inputPath));
  return path.join(parsed.dir, `${parsed.name}.cv.${format}`);
}

export async function writeDocument(outputPath, content) {
  const absolutePath = path.resolve(outputPath);
  await writeFile(absolutePath, content, "utf8");
  return absolutePath;
}
