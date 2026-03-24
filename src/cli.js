import { parseArgs } from "./args.js";
import { runGenerateCv } from "./commands/generate-cv.js";
import { runInitAccount } from "./commands/init-account.js";
import { CLI_VERSION, resolveApiBaseUrl, resolveToken } from "./config.js";
import { usageText } from "./usage.js";

export async function run(argv = []) {
  const { options, positionals } = parseArgs(argv);

  if (options.help) {
    console.log(usageText());
    return;
  }

  if (options.version) {
    console.log(CLI_VERSION);
    return;
  }

  const apiBaseUrl = resolveApiBaseUrl(options);
  const token = resolveToken();

  if (positionals.length === 0 || positionals[0] === "init") {
    await runInitAccount({
      apiBaseUrl,
      token,
      cliVersion: CLI_VERSION,
      dryRun: options.dryRun
    });
    return;
  }

  if (positionals.length > 1) {
    throw new Error(`Expected a single markdown file, received ${positionals.length} arguments.`);
  }

  await runGenerateCv({
    inputPath: positionals[0],
    apiBaseUrl,
    token,
    cliVersion: CLI_VERSION,
    out: options.out,
    stdout: options.stdout,
    dryRun: options.dryRun
  });
}
