// addressToZip.js

export const AddressToZip = {

  /**
   * 正規化済み住所候補から最適な郵便番号を選択
   */
  async fetch(pref, city, town = "", candidates = []) {

    console.log("AddressToZip入力:", {
      pref,
      city,
      town
    });

    // 候補無し
    if (!Array.isArray(candidates) || candidates.length === 0) {
      console.log("候補なし");
      return null;
    }

    console.log("候補一覧:", candidates);

    // 完全一致優先
    let exact = candidates.find(loc =>
      loc.prefecture === pref &&
      loc.city === city &&
      loc.town === town
    );

    if (exact) {

      console.log("完全一致:", exact);

      return {
        pref: exact.prefecture,
        city: exact.city,
        town: exact.town,
        postal: exact.postal
      };
    }

    // 部分一致 fallback
    let partial = candidates.find(loc =>
      loc.prefecture === pref &&
      loc.city === city
    );

    if (partial) {

      console.log("部分一致:", partial);

      return {
        pref: partial.prefecture,
        city: partial.city,
        town: partial.town,
        postal: partial.postal
      };
    }

    console.log("一致候補なし");

    return null;
  }
};