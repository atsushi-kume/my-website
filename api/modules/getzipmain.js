function getzipmain()
// geoApi.js
import { ZipToAddress } from "../services/zipToAddress.js";
import { AddressToZip } from "../services/addressToZip.js";
export const GeoApi = {
  /**
   * 入力値に応じて処理振り分け
   */
  async execute(input) {
    // 郵便番号っぽい場合
    if (typeof input === "string" && /^\d{3}-?\d{4}$/.test(input)) {
      return ZipToAddress.fetch(input);
    }

    // 住所オブジェクトの場合
    if (typeof input === "object") {
      return AddressToZip.fetch(input.pref, input.city, input.town);
    }

    throw new Error("入力形式が不正です");
  }
};