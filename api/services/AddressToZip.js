// addressToZip.js
export const AddressToZip = {

  /**
   * 住所から郵便番号を取得
   * @param {string} pref
   * @param {string} city
   * @param {string} town
   * @returns {Promise<Object|null>}
   */
  async fetch(pref, city, town = "") {

    try {

      if (!pref || !city) {
        throw new Error("都道府県と市区町村は必須です");
      }

      let url =
        `https://geoapi.heartrails.com/api/json?method=searchByAddress`
        + `&prefecture=${encodeURIComponent(pref)}`
        + `&city=${encodeURIComponent(city)}`;

console.log("URL:", url);

      if (town) {
        url += `&town=${encodeURIComponent(town)}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTPエラー: ${res.status}`);
      }

      const data = await res.json();

      // 配列取得
      const locations = data?.response?.location ?? [];

      console.log("候補一覧:", locations);

      if (locations.length === 0) {
        return null;
      }

      // town指定時は完全一致優先
      let result = null;

      if (town) {

        result = locations.find(loc =>
          loc.prefecture === pref &&
          loc.city === city &&
          loc.town === town
        );

        console.log("完全一致:", result);
      }

      // 一致なしなら先頭採用
      if (!result) {
        result = locations[0];
        console.log("先頭候補採用:", result);
      }

      return {
        pref: result.prefecture,
        city: result.city,
        town: result.town,
        postal: result.postal
      };

    } catch (err) {

      console.error("AddressToZip error:", err);
      throw err;
    }
  }
};