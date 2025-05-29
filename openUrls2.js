// openUrls2.js

document.addEventListener("DOMContentLoaded", function() {
  // GaraponページのURLを定義（1ページ目）
  const garaponPage = 'https://ecnavi.jp/game/lottery/garapon/';

  // ボタンを取得（IDはECnavi2_Buttonのままにしておく想定）
  const openUrlsButton = document.getElementById('ECnavi2_Button');
  if (!openUrlsButton) {
    console.warn('ECnavi2_Button が見つかりません');
    return;
  }

  // ✅ ここが抜けていた！クリックイベントの登録
  openUrlsButton.addEventListener('click', () => {
    console.log('✅ ボタンがクリックされました');

    const isOpenAll = false;
    const urlList = [garaponPage];

    document.querySelectorAll('a[href]').forEach(a => {
      const url = a.href;
      if (url !== garaponPage) {
        console.log(`🔍 リンク候補: ${url}`);
        if (isOpenAll || confirm(`${url} を開きますか？`)) {
          urlList.push(url);
        }
      }
    });

    console.log(`📦 開くURLリスト:`, urlList);

    urlList.forEach((url, index) => {
      setTimeout(() => {
        console.log(`🚀 開く: ${url}`);
        window.open(url, '_blank');
      }, index * 500);
    });
  });
});
