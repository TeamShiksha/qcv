# qcv

`qcv` is the CLI companion to `q.cv`. It has two jobs:

- `npx qcv` starts account onboarding for `q.cv`
- `npx qcv file.md` sends markdown to the resume-generation API and writes a generated CV back to disk

The backend contract is still being designed, so this repo ships with a pragmatic placeholder API shape that is easy to replace later.

## Usage

```bash
npx qcv
npx qcv profile.md
npx qcv profile.md --out profile.cv.md
npx qcv profile.md --api-base-url http://localhost:8787/v1
QCV_TOKEN=your-token npx qcv profile.md
```

## Current CLI behavior

### 1. Start a q.cv account

Running `qcv` with no positional arguments, or `qcv init`, calls:

```http
POST /accounts/init
Content-Type: application/json
```

Request body:

```json
{
  "source": "npx-qcv",
  "cliVersion": "0.1.0"
}
```

Expected response:

```json
{
  "accountId": "acct_123",
  "signupUrl": "https://q.cv/start/acct_123",
  "message": "Continue setup in your browser."
}
```

### 2. Generate a CV from markdown

Running `qcv profile.md` calls:

```http
POST /cv/generate
Content-Type: application/json
Authorization: Bearer <QCV_TOKEN>
```

Request body:

```json
{
  "sourceFormat": "markdown",
  "sourcePath": "profile.md",
  "markdown": "# Jane Doe\n...",
  "cliVersion": "0.1.0"
}
```

Expected response:

```json
{
  "document": "# Jane Doe\nGenerated CV...",
  "format": "md",
  "suggestedFilename": "profile.cv.md",
  "previewUrl": "https://q.cv/cv/cv_123"
}
```

The CLI writes the returned `document` to the chosen output path. If the API eventually returns a `downloadUrl` instead, the client already supports fetching that file.

## Flags

- `--api-base-url <url>` overrides the default API origin
- `--out <path>` chooses the output file path for generated CVs
- `--stdout` prints generated CV content instead of writing a file
- `--dry-run` validates the command and prints the request payload without calling the API
- `--help` shows usage
- `--version` prints the CLI version

## Environment variables

- `QCV_API_BASE_URL` sets the API base URL (default: `https://api.q.cv/v1`)
- `QCV_TOKEN` adds a bearer token for authenticated API calls

## Local development

```bash
node ./bin/qcv.js --help
node ./bin/qcv.js --dry-run
node ./bin/qcv.js examples/profile.md --dry-run
npm test
```

## Roadmap

- Formalize the q.cv API contract
- Add account login and device-linking flow
- Support richer source formats and templates
- Publish to npm so `npx qcv` resolves publicly
