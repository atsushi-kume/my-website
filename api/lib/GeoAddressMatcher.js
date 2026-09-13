// /api/lib/GeoAddressMatcher.js

import { AddressToZip } from "../services/AddressToZip.js";


/**
 * 住所検索共通モジュール
 *
 * 担当:
 *   - AddressToZip API結果の検索
 *   - 完全一致判定
 *   - 前方一致判定
 *   - 後方一致判定
 *   - 部分一致判定
 *   - 共通形式への変換
 *
 * 非担当:
 *   - 住所文字列の正規化
 *   - HeartRails API URLの生成
 *   - HeartRails APIへの直接接続
 *   - 最終的なmatchType配列の組み立て
 */

const GeoAddressMatcher = {

  /**
   * 住所候補を検索する
   *
   * @param {string} pref
   * @param {string} city
   * @param {string} town
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async search(
    pref = "",
    city = "",
    town = "",
    options = {}
  ) {

    const {

      // exact:
      //   完全一致のみ
      //
      // startsWith:
      //   完全一致＋前方一致
      //
      // endsWith:
      //   完全一致＋後方一致
      //
      // includes:
      //   完全一致＋包含一致
      //
      // both:
      //   完全一致＋前方または後方一致
      //
      matchType = "startsWith",

      // 完全一致をpartial側へ重複登録しない
      excludeExact = true,

      // 大文字・小文字の区別
      ignoreCase = false

    } = options;


    if (
      pref == null ||
      city == null ||
      town == null
    ) {
      throw new Error(
        "検索条件にnullまたはundefinedがあります"
      );
    }


    const searchPref =
      String(pref).trim();

    const searchCity =
      String(city).trim();

    const searchTown =
      String(town).trim();


    console.log(
      "GeoAddressMatcher 検索条件:",
      {
        pref: searchPref,
        city: searchCity,
        town: searchTown,
        matchType
      }
    );


    // API接続はAddressToZipに任せる
    const locations =
      await AddressToZip.fetch(
        searchPref,
        searchCity
      );


    if (!Array.isArray(locations)) {
      throw new Error(
        "AddressToZip.fetchの戻り値が配列ではありません"
      );
    }


    const exact = [];
    const partial = [];


    for (const location of locations) {

      if (!location) {
        continue;
      }


      const locationPref =
        location.prefecture ??
        location.pref ??
        "";

      const locationCity =
        location.city ??
        "";

      const locationTown =
        location.town ??
        "";


      // 都道府県の条件
      if (
        searchPref !== "" &&
        locationPref !== searchPref
      ) {
        continue;
      }


      // 市区町村の条件
      if (
        searchCity !== "" &&
        locationCity !== searchCity
      ) {
        continue;
      }


      const targetTown =
        this.normalizeForCompare(
          locationTown,
          ignoreCase
        );

      const inputTown =
        this.normalizeForCompare(
          searchTown,
          ignoreCase
        );


      // ==========================================
      // 完全一致
      // ==========================================

      if (
        inputTown !== "" &&
        targetTown === inputTown
      ) {

        exact.push(
          this.convertLocation(location)
        );

        continue;

      }


      // ==========================================
      // 部分一致
      // ==========================================

      if (
        inputTown === "" ||
        matchType === "exact"
      ) {
        continue;
      }


      let matched = false;


      switch (matchType) {

        case "startsWith":

          matched =
            targetTown.startsWith(inputTown);

          break;


        case "endsWith":

          matched =
            targetTown.endsWith(inputTown);

          break;


        case "includes":

          matched =
            targetTown.includes(inputTown);

          break;


        case "both":

          matched =
            targetTown.startsWith(inputTown) ||
            targetTown.endsWith(inputTown);

          break;


        default:

          throw new Error(
            `未対応のmatchTypeです: ${matchType}`
          );

      }


      if (
        matched &&
        (
          !excludeExact ||
          targetTown !== inputTown
        )
      ) {

        partial.push(
          this.convertLocation(location)
        );

      }

    }


    return {
      exact,
      partial
    };

  },


  /**
   * HeartRailsのlocationを共通形式へ変換
   *
   * @param {Object} location
   * @returns {Object}
   */
  convertLocation(location) {

    return {
      pref:
        location.prefecture ??
        location.pref ??
        "",

      city:
        location.city ??
        "",

      town:
        location.town ??
        "",

      postal:
        location.postal ??
        ""
    };

  },


  /**
   * 比較用の文字列に変換
   *
   * @param {string} value
   * @param {boolean} ignoreCase
   * @returns {string}
   */
  normalizeForCompare(value, ignoreCase) {

    let result =
      String(value ?? "").trim();

    // 全角英数字を半角へ変換
    result =
      result.replace(/[Ａ-Ｚａ-ｚ０-９]/g, char =>
        String.fromCharCode(
          char.charCodeAt(0) - 0xFEE0
        )
      );

    // 全角スペースを半角へ
    result =
      result.replace(/　/g, " ");

    // 連続スペースを1つへ
    result =
      result.replace(/\s+/g, " ");

    if (ignoreCase) {
      result =
        result.toLowerCase();
    }

    return result;

  }

};


export { GeoAddressMatcher };