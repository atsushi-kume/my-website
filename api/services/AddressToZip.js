// addressToZip.js
export const AddressToZip = {
  /**
   * 住所から郵便番号を取得
   * @param {string} pref - 都道府県
   * @param {string} city - 市区町村
   * @param {string} town - 町域（任意）
   * @returns {Promise<Object|null>}
   */
  async fetch(pref, city, town = "") {
    try {
      if (!pref || !city) {
        throw new Error("都道府県と市区町村は必須です");
      }

      let url = `https://geoapi.heartrails.com/api/json?method=searchByAddress`
              + `&prefecture=${encodeURIComponent(pref)}`
              + `&city=${encodeURIComponent(city)}`;

      if (town) {
        url += `&town=${encodeURIComponent(town)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);

      const data = await res.json();

      if (!data.response || !data.response.location) {
        return null;
      }

      return data.response.location.map(loc => ({
        pref: loc.prefecture,
        city: loc.city,
        town: loc.town,
        postal: loc.postal
      }));

    } catch (err) {
      console.error("AddressToZip error:", err);
      throw err;
    }
  }
};