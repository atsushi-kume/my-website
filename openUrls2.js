// openUrls2.js

document.addEventListener("DOMContentLoaded", function() {
  // ECnavi2_Buttonを取得
  const openUrlsButton = document.getElementById('ECnavi2_Button');
  if (!openUrlsButton) {
    console.warn('ECnavi2_Button が見つかりません');
    return;
  }

  // ボタンクリックイベント
  openUrlsButton.addEventListener('click', () => {
    const urlList = [];

    // すべての <a href=""> を取得
    document.querySelectorAll('a[href]').forEach(a => {
      const url = a.href;
      if (confirm(`${url} を開きますか？`)) {
        urlList.push(url);
      }
    });

    // URLを新しいタブで開く
    urlList.forEach((url, index) => {
      setTimeout(() => {
        window.open(url, '_blank');
      }, index * 500); // 0.5秒間隔
    });
  });

  // 初期化ログ
  console.log('✅ openUrls2.js がロードされ、ECnavi2_Button にイベントが設定されました');
});
