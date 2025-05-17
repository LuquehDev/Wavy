// utils/pkce.ts
export async function generatePKCE() {
  const codeVerifier = [...crypto.getRandomValues(new Uint8Array(64))]
    .map((x) => String.fromCharCode(x % 26 + 97)) // a-z
    .join("");

  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
  const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return { codeVerifier, codeChallenge: base64Digest };
}
