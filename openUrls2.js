/// openUrls2.js

document.addEventListener("DOMContentLoaded", function() {
  const openUrlsButton = document.getElementById('ECnavi2_Button');
  const openAllCheckbox = document.getElementById('openAllCheckbox'); // 今は使わないので無視OK

  if (!openUrlsButton) {
    console.warn('ECnavi2_Button が見つかりません');
    return;
  }

  openUrlsButton.addEventListener('click', () => {
    const isOpenAll = openAllCheckbox ? openAllCheckbox.checked : false;
    const urlList = [];

    // すべてのURLを取得
    document.querySelectorAll('a[href]').forEach(a => {
      const url = a.href;
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
  console.log('openUrls2.js がロードされ、イベントが設定されました');
});
