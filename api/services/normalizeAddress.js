export const NormalizeAddress = {
  async fetch(address) {

    // 数字以降削除（表記揺れ低減）
    address = address.replace(/[0-9０-９\-－].*$/, "");

    const url =
      `https://geoapi.heartrails.com/api/json` +
      `?method=suggest` +
      `&keyword=${encodeURIComponent(address)}` +
      `&matching=like`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("APIレスポンス:", data);

    const list = data.response?.location;

    if (!list || list.length === 0) {
      throw new Error("該当住所なし");
    }

    // -----------------------------
    // 正規化候補選定
    // -----------------------------
    const targetTown = extractTown(address);

    const loc =
      list.find(x => x.town === targetTown) ||
      list.find(x => x.town.startsWith(targetTown)) ||
      list.find(x => !x.town.includes("ビル")) ||
      list[0];

    console.log("採用候補:", loc);

    return {
      pref: loc.prefecture,
      city: loc.city,
      town: loc.town
    };
  }
};

// ------------------------------------
// 町域抽出
// ------------------------------------
function extractTown(address) {
  const match =
    address.match(/(?:都|道|府|県).+?[市区町村](.+)$/);

  return match ? match[1] : address;
}