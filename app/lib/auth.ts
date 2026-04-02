export const ANILIST_CLIENT_ID = "38375";
export const ANILIST_CLIENT_SECRET = "qDYSPdAONzxSZ0kPmcLFDuVYZOvBZrpclpKVgYff";
export const ANILIST_REDIRECT_URI = "http://localhost:5173/auth-callback";

export const ANILIST_AUTH_URL =
  `https://anilist.co/api/v2/oauth/authorize` +
  `?client_id=${ANILIST_CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(ANILIST_REDIRECT_URI)}` +
  `&response_type=code`;

const TOKEN_KEY = "anilist_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch("/api/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: ANILIST_CLIENT_ID,
      client_secret: ANILIST_CLIENT_SECRET,
      redirect_uri: ANILIST_REDIRECT_URI,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error("Token exchange failed");
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("No access token in response");
  }

  return data.access_token as string;
}
