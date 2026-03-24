import { createAccount } from "../api.js";

export async function runInitAccount({ apiBaseUrl, token, cliVersion, dryRun }) {
  const payload = {
    source: "npx-qcv",
    cliVersion
  };

  if (dryRun) {
    console.log(JSON.stringify({
      mode: "account-init",
      url: `${apiBaseUrl}/accounts/init`,
      payload
    }, null, 2));
    return;
  }

  const result = await createAccount({ apiBaseUrl, token, cliVersion });

  if (result.message) {
    console.log(result.message);
  }

  if (result.signupUrl) {
    console.log(`Open: ${result.signupUrl}`);
  }

  if (result.accountId) {
    console.log(`Account: ${result.accountId}`);
  }
}
