export const AddressToZip = {

  async fetch(pref, city, town = "", candidates = []) {

    console.log("AddressToZip入力:", {
      pref,
      city,
      town
    });

    // 候補なし
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return null;
    }

    // -----------------------------
    // スコアリング
    // -----------------------------
    const scored = candidates.map(loc => {

      let score = 0;

      // 完全一致
      if (loc.town === town) score += 100;

      // 前方一致
      else if (loc.town.startsWith(town)) score += 50;

      // ビル減点
      if (loc.town.includes("ビル")) score -= 30;

      // 階数減点
      if (/[0-9０-９]+階/.test(loc.town)) score -= 50;

      return {
        score,
        data: loc
      };
    });

    // 最大スコア採用
    scored.sort((a, b) => b.score - a.score);

    const best = scored[0]?.data;

    console.log("採用郵便番号:", best);

    if (!best) {
      return null;
    }

    return {
      pref: best.prefecture,
      city: best.city,
      town: best.town,
      postal: best.postal
    };
  }
};