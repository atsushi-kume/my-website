function getzipmain()
const GeoApi = {
  // 1. 郵便番号 → 住所
  async getAddressByPostal(zip) {
    const code = zip.replace('-', ''); // ハイフン除去
    const url = `https://heartrails.com{code}`;
    return this._fetch(url);
  },

  // 2. 住所 → 郵便番号
  async getPostalByAddress(pref, city) {
    const url = `https://heartrails.com{encodeURIComponent(pref)}&city=${encodeURIComponent(city)}`;
    return this._fetch(url);
  },