// HeartRails Geo を使って住所を正規化
export const NormalizeAddress = {
  async fetch(address) {
    const url = `https://geoapi.heartrails.com/api/json?method=search&keyword=${encodeURIComponent(address)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.response || !data.response.location || data.response.location.length === 0) {
      throw new Error("住所の正規化に失敗");
    }

    const loc = data.response.location[0];

    // ログ確認用
    console.log("正規化結果:", loc);

    return {
      pref: loc.prefecture,
      city: loc.city,
      town: loc.town
    };
  }
};