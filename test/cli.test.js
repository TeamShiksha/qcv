import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { run } from "../src/cli.js";

async function withMockFetch(handler, fn) {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = handler;
    await fn();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("qcv init calls the onboarding endpoint", async () => {
  await withMockFetch(async (url, options = {}) => {
    assert.equal(options.method, "POST");
    assert.equal(String(url), "https://mock.q.cv/v1/accounts/init");

    const payload = JSON.parse(options.body);
    assert.equal(payload.source, "npx-qcv");

    return Response.json({
      accountId: "acct_test",
      signupUrl: "https://q.cv/start/acct_test",
      message: "Continue setup in your browser."
    });
  }, async () => {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));

    try {
      await run(["init", "--api-base-url", "https://mock.q.cv/v1"]);
    } finally {
      console.log = originalLog;
    }

    assert.match(logs.join("\n"), /acct_test/);
    assert.match(logs.join("\n"), /https:\/\/q\.cv\/start\/acct_test/);
  });
});

test("qcv file.md writes a generated markdown CV", async () => {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "qcv-"));
  const inputPath = path.join(tmpDir, "profile.md");
  const outputPath = path.join(tmpDir, "profile.cv.md");
  await writeFile(inputPath, "# Test User\n\nBio", "utf8");

  try {
    await withMockFetch(async (url, options = {}) => {
      assert.equal(options.method, "POST");
      assert.equal(String(url), "https://mock.q.cv/v1/cv/generate");

      const payload = JSON.parse(options.body);
      assert.equal(payload.sourcePath, "profile.md");
      assert.match(payload.markdown, /# Test User/);

      return Response.json({
        document: "# Test User\n\nGenerated CV",
        format: "md",
        previewUrl: "https://q.cv/cv/cv_test"
      });
    }, async () => {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(" "));

      try {
        await run([inputPath, "--api-base-url", "https://mock.q.cv/v1", "--out", outputPath]);
      } finally {
        console.log = originalLog;
      }

      const generated = await readFile(outputPath, "utf8");
      assert.match(generated, /Generated CV/);
      assert.match(logs.join("\n"), /profile\.cv\.md/);
      assert.match(logs.join("\n"), /https:\/\/q\.cv\/cv\/cv_test/);
    });
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
});
