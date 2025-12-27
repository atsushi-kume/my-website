/* ===== Microsoft Graph 認証ユーティリティ ===== */

const GRAPH_CLIENT_ID =
  "04f0c124-f2bc-4f28-b4a9-6b3c94f8e6e2"; // Microsoft公式

const GRAPH_SCOPES = [
  "Files.Read",
  "Files.Read.All"
].join(" ");

const REDIRECT_URI =
  location.origin + location.pathname;

/* STEP1+2: ログイン開始 */
export function startGraphLogin() {
  const authUrl =
    "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize" +
    "?client_id=" + GRAPH_CLIENT_ID +
    "&response_type=token" +
    "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
    "&scope=" + encodeURIComponent(GRAPH_SCOPES) +
    "&response_mode=fragment";

  window.location.href = authUrl;
}

/* STEP3: トークン取得 */
export function getGraphToken() {
  const hash = location.hash.substring(1);
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const token = params.get("access_token");

  if (token) {
    // URLを汚さない
    history.replaceState(null, "", location.pathname);
  }
  return token;
}

/* STEP4: 認証保証 */
export function ensureGraphAuth() {
  const token = getGraphToken();
  if (token) return token;

  startGraphLogin();
  return null;
}