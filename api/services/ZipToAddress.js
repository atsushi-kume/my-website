// zipToAddress.js
export const ZipToAddress = {
  /**
   * 郵便番号から住所を取得
   * @param {string} zip - 郵便番号（例: 1000001 / 100-0001）
   * @returns {Promise<Object|null>}
   */
  async fetch(zip) {
    try {
      const code = zip.replace(/-/g, '');

      if (!/^\d{7}$/.test(code)) {
        throw new Error("郵便番号は7桁で入力してください");
      }

      const url = `https://geoapi.heartrails.com/api/json?method=searchByPostal&postal=${code}`;

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
      console.error("ZipToAddress error:", err);
      throw err;
    }
  }
};