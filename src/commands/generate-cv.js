import path from "node:path";

import { generateCv } from "../api.js";
import { inferOutputPath, readMarkdownFile, writeDocument } from "../fs.js";

export async function runGenerateCv({
  inputPath,
  apiBaseUrl,
  token,
  cliVersion,
  out,
  stdout,
  dryRun
}) {
  const { absolutePath, markdown } = await readMarkdownFile(inputPath);
  const payload = {
    sourceFormat: "markdown",
    sourcePath: path.basename(absolutePath),
    markdown,
    cliVersion
  };

  if (dryRun) {
    console.log(JSON.stringify({
      mode: "generate-cv",
      url: `${apiBaseUrl}/cv/generate`,
      payload,
      outputPath: stdout ? null : path.resolve(out || inferOutputPath(inputPath))
    }, null, 2));
    return;
  }

  const result = await generateCv({
    apiBaseUrl,
    token,
    cliVersion,
    sourcePath: path.basename(absolutePath),
    markdown
  });

  if (stdout) {
    process.stdout.write(result.document);
    if (!result.document.endsWith("\n")) {
      process.stdout.write("\n");
    }
  } else {
    const format = result.format || "md";
    const outputPath = out || inferOutputPath(inputPath, format);
    const savedPath = await writeDocument(outputPath, result.document);
    console.log(`Generated CV written to ${savedPath}`);
  }

  if (result.previewUrl) {
    console.log(`Preview: ${result.previewUrl}`);
  }
}
