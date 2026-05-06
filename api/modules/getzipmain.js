import { ZipToAddress } from "../services/ZipToAddress.js";
import { AddressToZip } from "../services/AddressToZip.js";
import { NormalizeAddress } from "../services/normalizeAddress.js";

export const GeoApi = {
  async execute(input) {

    // 全角→半角
    if (typeof input === "string") {
      input = input.replace(/[０-９]/g, s =>
        String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
      );
    }

    // 郵便番号
    if (typeof input === "string" && /^\d{3}-?\d{4}$/.test(input)) {
      return await ZipToAddress.fetch(input);
    }

    // 住所（文字列 → 正規化API）
    if (typeof input === "string") {
      const parsed = await NormalizeAddress.fetch(input);

      return await AddressToZip.fetch(
        parsed.pref,
        parsed.city,
        parsed.town
      );
    }

    // object入力
    if (
      typeof input === "object" &&
      input !== null &&
      "pref" in input &&
      "city" in input &&
      "town" in input
    ) {
      return await AddressToZip.fetch(input.pref, input.city, input.town);
    }

    throw new Error("入力形式が不正です");
  }
};