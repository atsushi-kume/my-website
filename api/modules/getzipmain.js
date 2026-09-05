import { ZipToAddress } from "../services/ZipToAddress.js";
import { AddressToZip } from "../services/AddressToZip.js";
import { NormalizeAddress } from "../services/normalizeAddress.js";
import { getFormat } from "../lib/getdatainfo.js";

console.log("getFormat:", getFormat);
console.log("AddressToZip:", AddressToZip);

export const GeoApi = {

  async execute(input) {

    // ----------------------------------------
    // 入力チェック
    // ----------------------------------------
    if (input == null) {
      throw new Error("入力値がありません");
    }

    // ----------------------------------------
    // 文字列化
    // ----------------------------------------
    if (typeof input !== "string") {
      input = String(input);
    }

    // ----------------------------------------
    // 前後空白除去
    // ----------------------------------------
    input = input.trim();

    // ----------------------------------------
    // 全角数字 → 半角数字
    // ----------------------------------------
    input = input.replace(/[０-９]/g, s =>
      String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
    );

    // ----------------------------------------
    // 全角ハイフン類統一
    // ----------------------------------------
    input = input.replace(/[―ー－‐]/g, "-");

    console.log("入力値判定開始:", input);

    // ========================================
    // 郵便番号 → 住所
    // ========================================
    if (/^\d{3}-?\d{4}$/.test(input)) {

      console.log("郵便番号入力として処理");

      const returndata =
        await ZipToAddress.fetch(input);

      console.log("データフォーマット:", getFormat(returndata));

      return returndata;
    }

    // ========================================
    // 住所 → 正規化 → 郵便番号
    // ========================================
    console.log("住所入力として処理");

    // ① 正規化
    const normalized =
      await NormalizeAddress.fetch(input);

    // ② 郵便番号検索
    const result =
      await AddressToZip.fetch(
        normalized.pref,
        normalized.city,
        normalized.town,
        normalized.candidates
      );

    console.log("郵便番号検索結果:", result);
    console.log("データフォーマット:", getFormat(result));

    return result;
  }
};