let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getAccessToken() {
  const now = Date.now();

  if (accessToken && now < tokenExpiresAt) {
    return accessToken;
  }

  const basic = Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const tokenData = await tokenRes.json();

  accessToken = tokenData.access_token;
  tokenExpiresAt = Date.now() + tokenData.expires_in * 1000;

  return accessToken;
}
