export const NormalizeAddress = {
  async fetch(address) {

    // 数字以降削除（精度UP）
    address = address.replace(/[0-9０-９\-－].*$/, "");

    const url = `https://geoapi.heartrails.com/api/json?method=suggest&keyword=${encodeURIComponent(address)}`;

    console.log("API URL:", url);

    const res = await fetch(url);
    const data = await res.json();

    console.log("APIレスポンス:", data);

    if (!data || !data.response) {
      throw new Error("APIレスポンス異常");
    }

    const list = data.response.location;

    if (!list || list.length === 0) {
      throw new Error("該当住所なし");
    }

    const loc = list[0];

    return {
      pref: loc.prefecture,
      city: loc.city,
      town: loc.town || ""
    };
  }
};