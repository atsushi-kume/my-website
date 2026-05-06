export const NormalizeAddress = {
  async fetch(address) {

    const url = `https://geoapi.heartrails.com/api/json?method=search&keyword=${encodeURIComponent(address)}`;

    console.log("API URL:", url);

    const res = await fetch(url);
    const data = await res.json();

    console.log("APIレスポンス:", data);

    // 防御強化
    if (!data || !data.response) {
      throw new Error("APIレスポンス異常");
    }

    const list = data.response.location;

    if (!list || list.length === 0) {
      throw new Error("該当住所なし（keyword検索ヒットなし）");
    }

    const loc = list[0];

    // null防御
    if (!loc.prefecture || !loc.city) {
      throw new Error("住所データ不完全");
    }

    return {
      pref: loc.prefecture,
      city: loc.city,
      town: loc.town || ""
    };
  }
};