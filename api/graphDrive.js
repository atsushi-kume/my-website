/* ===== OneDrive API ラッパー ===== */

export async function listRootFiles(token) {
  const res = await fetch(
    "https://graph.microsoft.com/v1.0/me/drive/root/children",
    {
      headers: { Authorization: "Bearer " + token }
    }
  );
  return res.json();
}

export async function listFolder(token, path) {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/drive/root:/${path}:/children`,
    {
      headers: { Authorization: "Bearer " + token }
    }
  );
  return res.json();
}

export async function downloadFile(token, itemId) {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}/content`,
    {
      headers: { Authorization: "Bearer " + token }
    }
  );
  return res.blob();
}