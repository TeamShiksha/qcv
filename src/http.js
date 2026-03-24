export async function ensureJson(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Expected JSON response but received: ${text.slice(0, 200)}`);
  }
}

export async function requestJson(url, { method = "GET", body, headers = {} } = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await ensureJson(response);

  if (!response.ok) {
    const detail = data?.error || data?.message || response.statusText;
    throw new Error(`${method} ${url} failed (${response.status}): ${detail}`);
  }

  return data;
}
