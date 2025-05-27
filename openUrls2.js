// openUrls2.js

(function() {
  // 必要な要素を取得
  const openUrlsButton = document.getElementById('ECnavi2_Button');  // ✅ 修正: ECnavi2_Button を取得
  const openAllCheckbox = document.getElementById('openAllCheckbox'); // (HTMLにない場合はnull)

  if (!openUrlsButton) {
    console.warn('ECnavi2_Button が見つかりません');
    return;
  }

  // クリックイベントの設定
  openUrlsButton.addEventListener('click', () => {
    const isOpenAll = openAllCheckbox ? openAllCheckbox.checked : false;
    const urlList = [];

    // すべてのURLを取得
    document.querySelectorAll('a[href]').forEach(a => {
      const url = a.href;
      // すべて開く場合、または確認後
      if (isOpenAll || confirm(`${url} を開きますか？`)) {
        urlList.push(url);
      }
    });

    // ウィンドウごとに開く
    urlList.forEach((url, index) => {
      setTimeout(() => {
        window.open(url, '_blank');
      }, index * 500); // 0.5秒間隔
    });
  });

  // 初期化ログ
  console.log('openUrls2.jsがロードされました');
})();
