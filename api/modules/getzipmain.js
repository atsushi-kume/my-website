// 1. importは必ず一番上に書く
import { ZipToAddress } from "../services/zipToAddress.js";
import { AddressToZip } from "../services/addressToZip.js";

// 2. 不要な function 宣言（1行目）を消すか、正しく閉じる
export const GeoApi = {
  async execute(input) {
    // 郵便番号(数値)か住所(オブジェクト)かで振り分け
    if (typeof input === "string" && /^\d{3}-?\d{4}$/.test(input)) {
      return await ZipToAddress.fetch(input);
    }
    if (typeof input === "object") {
      return await AddressToZip.fetch(input.pref, input.city, input.town);
    }
    throw new Error("入力形式が不正です");
  }
};
