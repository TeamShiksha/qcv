#!/usr/bin/env node

import { run } from "../src/cli.js";

run(process.argv.slice(2)).catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`qcv error: ${message}`);
  process.exitCode = 1;
});
