// addressToZip.js

export const AddressToZip = {

  /**
   * 正規化済み住所から郵便番号取得
   * @param {string} pref
   * @param {string} city
   * @param {string} town
   * @returns {Promise<Object|null>}
   */
  async fetch(pref, city, town = "") {

    try {

      console.log("★★ AddressToZip.fetch START ★★");

      //========================================================
      // 必須チェック
      //========================================================
      if (!pref || !city) {
        throw new Error("都道府県と市区町村は必須です");
      }

      //========================================================
      // URL生成
      //========================================================
      let url =
        `https://geoapi.heartrails.com/api/json?method=getTowns`
        + `&prefecture=${encodeURIComponent(pref)}`
        + `&city=${encodeURIComponent(city)}`;

      console.log("URL:", url);

      //========================================================
      // API実行
      //========================================================
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTPエラー: ${res.status}`);
      }

      const data = await res.json();

      console.log("APIレスポンス:", data);

      //========================================================
      // town一覧取得
      //========================================================
      const locations = data?.response?.location ?? [];

      console.log("候補一覧:", locations);

      if (locations.length === 0) {
        console.log("候補0件");
        return null;
      }

      //========================================================
      // town完全一致
      //========================================================
      let result = null;

      if (town) {

        result = locations.find(loc =>
          loc.town === town
        );

        console.log("完全一致:", result);
      }

      //========================================================
      // fallback
      //========================================================
      if (!result) {

        console.log("完全一致なし → 先頭候補採用");

        result = locations[0];
      }

      //========================================================
      // 返却
      //========================================================
      const returnData = {
        pref: pref,
        city: city,
        town: result.town,
        postal: result.postal
      };

      console.log("返却値:", returnData);

      return returnData;

    } catch (err) {

      console.error("AddressToZip error:", err);
      throw err;
    }
  }
};
