import { ZipToAddress } from "../services/zipToAddress.js";
import { AddressToZip } from "../services/addressToZip.js";

export const GeoApi = {
  async execute(input) {

    // 全角→半角変換
    if (typeof input === "string") {
      input = input.replace(/[０-９]/g, s =>
        String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
      );
    }

    // 郵便番号
    if (typeof input === "string" && /^\d{3}-?\d{4}$/.test(input)) {
      return await ZipToAddress.fetch(input);
    }

    // 住所
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