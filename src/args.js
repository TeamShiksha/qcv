function isFlag(token) {
  return token.startsWith("-");
}

export function parseArgs(argv) {
  const options = {
    apiBaseUrl: undefined,
    out: undefined,
    stdout: false,
    dryRun: false,
    help: false,
    version: false
  };
  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--help" || token === "-h") {
      options.help = true;
      continue;
    }

    if (token === "--version" || token === "-v") {
      options.version = true;
      continue;
    }

    if (token === "--stdout") {
      options.stdout = true;
      continue;
    }

    if (token === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (token === "--api-base-url") {
      const value = argv[index + 1];
      if (!value || isFlag(value)) {
        throw new Error("Missing value for --api-base-url");
      }
      options.apiBaseUrl = value;
      index += 1;
      continue;
    }

    if (token === "--out") {
      const value = argv[index + 1];
      if (!value || isFlag(value)) {
        throw new Error("Missing value for --out");
      }
      options.out = value;
      index += 1;
      continue;
    }

    if (isFlag(token)) {
      throw new Error(`Unknown option: ${token}`);
    }

    positionals.push(token);
  }

  return { options, positionals };
}
