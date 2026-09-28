// /api/lib/NormalizeAddress.js

/**
 * 住所文字列の正規化・構造化モジュール
 *
 * 担当:
 *   - 入力文字列の基本正規化
 *   - HeartRails suggest APIによる住所候補取得
 *   - 都道府県・市区町村・町名の抽出
 *   - 町名と町名以降の付加部分の分離
 *
 * 非担当:
 *   - 郵便番号検索
 *   - 完全一致判定
 *   - 部分一致判定
 *   - 郵便番号APIの呼び出し
 *
 * 返却形式:
 *
 * {
 *   pref: "東京都",
 *   city: "千代田区",
 *
 *   town: {
 *     name: "大手町",
 *     include: "2丁目"
 *   },
 *
 *   postal: "",
 *
 *   candidates: [...]
 * }
 */


const NormalizeAddress = {

  /**
   * 住所を正規化・構造化する
   *
   * @param {string} input
   * @returns {Promise<Object>}
   */
  async fetch(input) {

    // ----------------------------------------
    // 入力チェック
    // ----------------------------------------
    if (input == null) {
      throw new Error("住所入力値がありません");
    }

    // ----------------------------------------
    // 文字列化
    // ----------------------------------------
    if (typeof input !== "string") {
      input = String(input);
    }

    // ----------------------------------------
    // 基本正規化
    // ----------------------------------------
    const normalizedInput =
      this.normalizeText(input);

    if (normalizedInput === "") {
      throw new Error("住所入力値が空です");
    }

    console.log(
      "NormalizeAddress 入力値:",
      normalizedInput
    );

    // ----------------------------------------
    // 数字・番地以降を除いた検索用住所を作成
    //
    // 例:
    // 東京都千代田区大手町2丁目3番4号
    // ↓
    // 東京都千代田区大手町
    //
    // ただし「2丁目」のような町名に含まれる
    // 丁目情報は、後でtown.includeとして扱う。
    // ----------------------------------------
    const searchInput =
      this.createSearchInput(normalizedInput);

    console.log(
      "NormalizeAddress API検索値:",
      searchInput
    );

    // ----------------------------------------
    // HeartRails suggest API
    // ----------------------------------------
    const candidates =
      await this.fetchCandidates(searchInput);

    console.log(
      "NormalizeAddress 候補:",
      candidates
    );

    // ----------------------------------------
    // 住所構造化
    // ----------------------------------------
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


  // ==================================================
  // 基本文字列正規化
  // ==================================================

  /**
   * 全角数字・ハイフン・空白などを統一
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

      // ハイフン類を半角ハイフンへ
      .replace(/[―ー－‐-−]/g, "-")

      // 全角スペース → 半角スペース
      .replace(/　/g, " ")

      // 連続空白を1個に
      .replace(/\s+/g, " ");
  },


  // ==================================================
  // API検索用住所作成
  // ==================================================

  /**
   * API検索用の住所を作成する
   *
   * 数字・ハイフン以降を削除する。
   *
   * 例:
   *
   * 東京都千代田区大手町2丁目3番4号
   * ↓
   * 東京都千代田区大手町
   *
   * 東京都千代田区大手町2丁目
   * ↓
   * 東京都千代田区大手町
   *
   * @param {string} input
   * @returns {string}
   */
  createSearchInput(input) {

    return input.replace(
      /[0-9\-].*$/,
      ""
    ).trim();
  },


  // ==================================================
  // HeartRails API
  // ==================================================

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


  // ==================================================
  // 住所構造化
  // ==================================================

  /**
   * API候補から住所を構造化する
   *
   * @param {string} input
   * @param {Array} candidates
   * @returns {Object}
   */
  extractAddress(input, candidates) {

    // ----------------------------------------
    // API候補が存在する場合
    // ----------------------------------------
    if (
      Array.isArray(candidates) &&
      candidates.length > 0
    ) {

      // ----------------------------------------
      // 都道府県・市区町村・町名が
      // 入力と一致する候補を探す
      // ----------------------------------------
      const matched =
        candidates.find(candidate =>
          this.isCandidateMatch(
            input,
            candidate
          )
        );

      const result =
        matched ?? candidates[0];

      // ----------------------------------------
      // 入力文字列からtown.includeを取得
      // ----------------------------------------
      const town =
        this.extractTownParts(
          input,
          result
        );

      return {
        pref:
          result.prefecture ??
          result.pref ??
          "",

        city:
          result.city ??
          "",

        town,

        postal:
          result.postal ??
          ""
      };
    }

    // ----------------------------------------
    // API候補がない場合
    // ----------------------------------------
    return this.extractByText(input);
  },


  // ==================================================
  // API候補との照合
  // ==================================================

  /**
   * API候補と入力住所が対応しているか判定
   *
   * ここでは「完全一致」「部分一致」の
   * 判定は行わない。
   *
   * あくまでNormalizeAddressが
   * 住所の基準候補を取得するための判定。
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

    if (
      pref === "" ||
      city === "" ||
      town === ""
    ) {
      return false;
    }

    return (
      input.includes(pref) &&
      input.includes(city) &&
      input.includes(town)
    );
  },


  // ==================================================
  // 町名分解
  // ==================================================

  /**
   * 町名を
   *
   *   name
   *   include
   *
   * に分離する。
   *
   * 例:
   *
   * 入力:
   *   東京都千代田区大手町2丁目
   *
   * API候補:
   *   大手町
   *
   * 結果:
   *
   * {
   *   name: "大手町",
   *   include: "2丁目"
   * }
   *
   * @param {string} input
   * @param {Object} candidate
   * @returns {Object}
   */
  extractTownParts(input, candidate) {

    const townName =
      candidate.town ??
      "";

    if (townName === "") {
      return {
        name: "",
        include: ""
      };
    }

    // ----------------------------------------
    // 入力中からAPIが返した町名を探す
    // ----------------------------------------
    const index =
      input.indexOf(townName);

    if (index === -1) {

      return {
        name: townName,
        include: ""
      };
    }

    // ----------------------------------------
    // 町名の直後を取得
    // ----------------------------------------
    const include =
      input
        .slice(index + townName.length)
        .trim();

    return {
      name: townName,
      include
    };
  },


  // ==================================================
  // APIが使えなかった場合の住所解析
  // ==================================================

  /**
   * API候補が取得できなかった場合、
   * 入力文字列から都道府県・市区町村・町名を
   * 可能な範囲で抽出する。
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

    // ----------------------------------------
    // 都道府県
    // ----------------------------------------
    const pref =
      prefectures.find(value =>
        input.startsWith(value)
      ) ?? "";

    // ----------------------------------------
    // 都道府県以降
    // ----------------------------------------
    const afterPref =
      pref !== ""
        ? input.slice(pref.length)
        : input;

    // ----------------------------------------
    // 市区町村
    // ----------------------------------------
    const cityMatch =
      afterPref.match(
        /^(.+?[市区町村])/
      );

    const city =
      cityMatch
        ? cityMatch[1]
        : "";

    // ----------------------------------------
    // 市区町村以降
    // ----------------------------------------
    const afterCity =
      city !== ""
        ? afterPref.slice(city.length)
        : afterPref;

    // ----------------------------------------
    // 町名とincludeを分離
    //
    // 数字が出てきたところから
    // includeとする。
    // ----------------------------------------
    const townMatch =
      afterCity.match(
        /^([^0-9]+?)([0-9].*)$/
      );

    if (townMatch) {

      return {
        pref,
        city,

        town: {
          name:
            townMatch[1].trim(),

          include:
            townMatch[2].trim()
        },

        postal: ""
      };
    }

    // ----------------------------------------
    // 数字がない場合
    // ----------------------------------------
    return {
      pref,
      city,

      town: {
        name:
          afterCity.trim(),

        include: ""
      },

      postal: ""
    };
  }

};


export { NormalizeAddress };
