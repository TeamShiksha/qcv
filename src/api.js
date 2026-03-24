import { requestJson } from "./http.js";

function authHeaders(token) {
  return token ? { authorization: `Bearer ${token}` } : {};
}

export async function createAccount({ apiBaseUrl, token, cliVersion }) {
  return requestJson(`${apiBaseUrl}/accounts/init`, {
    method: "POST",
    headers: authHeaders(token),
    body: {
      source: "npx-qcv",
      cliVersion
    }
  });
}

export async function generateCv({
  apiBaseUrl,
  token,
  cliVersion,
  sourcePath,
  markdown
}) {
  const response = await requestJson(`${apiBaseUrl}/cv/generate`, {
    method: "POST",
    headers: authHeaders(token),
    body: {
      sourceFormat: "markdown",
      sourcePath,
      markdown,
      cliVersion
    }
  });

  if (response.document) {
    return response;
  }

  if (response.downloadUrl) {
    const downloadResponse = await fetch(response.downloadUrl, {
      headers: authHeaders(token)
    });

    if (!downloadResponse.ok) {
      throw new Error(
        `Fetching generated CV failed (${downloadResponse.status}): ${downloadResponse.statusText}`
      );
    }

    return {
      ...response,
      document: await downloadResponse.text()
    };
  }

  throw new Error("API response did not include `document` or `downloadUrl`.");
}
