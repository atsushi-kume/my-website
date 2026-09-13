// /api/lib/NormalizeAddress.js

/**
 * 住所文字列の正規化専用モジュール
 *
 * 担当:
 *   - 全角数字の半角化
 *   - ハイフン類の統一
 *   - HeartRails suggest APIによる住所候補取得
 *   - 都道府県・市区町村・町名の抽出
 *
 * 非担当:
 *   - 郵便番号検索
 *   - 完全一致判定
 *   - 部分一致判定
 *   - 郵便番号APIの呼び出し
 */

const NormalizeAddress = {

  /**
   * 住所を正規化する
   *
   * @param {string} input
   * @returns {Promise<Object>}
   */
  async fetch(input) {

    if (input == null) {
      throw new Error("住所入力値がありません");
    }

    if (typeof input !== "string") {
      input = String(input);
    }

    const normalizedInput =
      this.normalizeText(input);

    if (normalizedInput === "") {
      throw new Error("住所入力値が空です");
    }

    console.log(
      "NormalizeAddress 入力値:",
      normalizedInput
    );

    const candidates =
      await this.fetchCandidates(normalizedInput);

    console.log(
      "NormalizeAddress 候補:",
      candidates
    );

    const address =
      this.extractAddress(
        normalizedInput,
        candidates
      );

    console.log(
      "NormalizeAddress 正規化結果:",
      address
    );

    return {
      ...address,
      candidates
    };

  },


  /**
   * 文字列の基本的な正規化
   *
   * @param {string} value
   * @returns {string}
   */
  normalizeText(value) {

    return value
      .trim()

      // 全角数字 → 半角数字
      .replace(/[０-９]/g, char =>
        String.fromCharCode(
          char.charCodeAt(0) - 0xFEE0
        )
      )

      // ハイフン類を半角ハイフンに統一
      .replace(/[―ー－‐‑−]/g, "-")

      // 全角スペース → 半角スペース
      .replace(/　/g, " ")

      // 連続スペースを1つにする
      .replace(/\s+/g, " ");

  },


  /**
   * HeartRails suggest APIから住所候補を取得
   *
   * @param {string} keyword
   * @returns {Promise<Array>}
   */
  async fetchCandidates(keyword) {

    const url =
      "https://geoapi.heartrails.com/api/json"
      + "?method=suggest"
      + `&keyword=${encodeURIComponent(keyword)}`
      + "&matching=like";

    console.log(
      "NormalizeAddress API URL:",
      url
    );

    const res =
      await fetch(url);

    if (!res.ok) {
      throw new Error(
        `NormalizeAddress HTTPエラー: ${res.status}`
      );
    }

    const data =
      await res.json();

    console.log(
      "NormalizeAddress APIレスポンス:",
      data
    );

    return data?.response?.location ?? [];

  },


  /**
   * API候補から住所を抽出
   *
   * @param {string} input
   * @param {Array} candidates
   * @returns {Object}
   */
  extractAddress(input, candidates) {

    if (
      Array.isArray(candidates) &&
      candidates.length > 0
    ) {

      // まず入力文字列に最も近い候補を探す
      const matched =
        candidates.find(candidate =>
          this.isCandidateMatch(
            input,
            candidate
          )
        );

      const result =
        matched ?? candidates[0];

      return {
        pref:
          result.prefecture ??
          result.pref ??
          "",

        city:
          result.city ??
          "",

        town:
          result.town ??
          "",

        postal:
          result.postal ??
          ""
      };

    }


    // API候補がない場合の簡易抽出
    return this.extractByText(input);

  },


  /**
   * API候補と入力値の関連性を簡易判定
   *
   * @param {string} input
   * @param {Object} candidate
   * @returns {boolean}
   */
  isCandidateMatch(input, candidate) {

    const pref =
      candidate.prefecture ??
      candidate.pref ??
      "";

    const city =
      candidate.city ??
      "";

    const town =
      candidate.town ??
      "";

    const joined =
      `${pref}${city}${town}`;

    return (
      input.includes(pref) &&
      input.includes(city) &&
      (
        input.includes(town) ||
        joined.includes(input)
      )
    );

  },


  /**
   * API候補が取得できなかった場合の簡易抽出
   *
   * 都道府県と市区町村の抽出を優先する。
   * 町名は残りの文字列から推定する。
   *
   * @param {string} input
   * @returns {Object}
   */
  extractByText(input) {

    const prefectures = [
      "北海道",

      "青森県",
      "岩手県",
      "宮城県",
      "秋田県",
      "山形県",
      "福島県",

      "茨城県",
      "栃木県",
      "群馬県",
      "埼玉県",
      "千葉県",
      "東京都",
      "神奈川県",

      "新潟県",
      "富山県",
      "石川県",
      "福井県",
      "山梨県",
      "長野県",
      "岐阜県",
      "静岡県",
      "愛知県",

      "三重県",
      "滋賀県",
      "京都府",
      "大阪府",
      "兵庫県",
      "奈良県",
      "和歌山県",

      "鳥取県",
      "島根県",
      "岡山県",
      "広島県",
      "山口県",

      "徳島県",
      "香川県",
      "愛媛県",
      "高知県",

      "福岡県",
      "佐賀県",
      "長崎県",
      "熊本県",
      "大分県",
      "宮崎県",
      "鹿児島県",
      "沖縄県"
    ];

    const pref =
      prefectures.find(value =>
        input.startsWith(value)
      ) ?? "";

    const afterPref =
      pref !== ""
        ? input.slice(pref.length)
        : input;

    const cityMatch =
      afterPref.match(
        /^(.+?[市区町村])/
      );

    const city =
      cityMatch
        ? cityMatch[1]
        : "";

    const town =
      city !== ""
        ? afterPref.slice(city.length)
        : afterPref;

    return {
      pref,
      city,
      town,
      postal: ""
    };

  }

};


export { NormalizeAddress };