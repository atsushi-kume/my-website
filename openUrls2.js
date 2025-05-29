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

  // ボタンクリックイベント
  openUrlsButton.addEventListener('click', () => {
    console.log('✅ ボタンがクリックされました');

    const isOpenAll = false; // 必要に応じて true に
    const urlList = [garaponPage];

    document.querySelectorAll('a[href]').forEach(a => {
      const url = a.href;
      if (url !== garaponPage && url.startsWith('https://ecnavi.jp/ad/')) {
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

  console.log('openUrls2.js がロードされ、イベントが設定されました');
});
