import { ZipToAddress } from "../services/ZipToAddress.js";
import { AddressToZip } from "../services/AddressToZip.js";
import { NormalizeAddress } from "../services/normalizeAddress.js";

export const GeoApi = {
  async execute(input) {

    // 全角→半角
    if (typeof input === "string") {
  const parsed = await NormalizeAddress.fetch(input);

  console.log("正規化結果:", parsed);

  // ★ここ重要
  if (parsed.postal) {
    console.log("郵便番号を直接使用:", parsed.postal);
    return parsed;  // ←そのまま返す
  }

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