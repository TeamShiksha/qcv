export function usageText() {
  return `
qcv

Usage:
  qcv                     Start q.cv account onboarding
  qcv init                Start q.cv account onboarding
  qcv <file.md>           Generate a CV from a markdown file

Options:
  --api-base-url <url>    Override the qcv API base URL
  --out <path>            Output path for the generated CV
  --stdout                Print generated CV content instead of writing a file
  --dry-run               Print the request payload and skip network calls
  --help                  Show this help text
  --version               Print the CLI version
`.trim();
}
