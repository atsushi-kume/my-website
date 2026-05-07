export const NormalizeAddress = {
  async fetch(address) {

    address = address.replace(/[0-9０-９\-－].*$/, "");

    const url = `https://geoapi.heartrails.com/api/json?method=suggest&keyword=${encodeURIComponent(address)}&matching=like`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("APIレスポンス:", data);

    const list = data.response?.location;

    if (!list || list.length === 0) {
      throw new Error("該当住所なし");
    }

    const loc = list[0];

    return {
      pref: loc.prefecture,
      city: loc.city,
      town: loc.town || "",
      postal: loc.postal || null   // ←追加
    };
  }
};