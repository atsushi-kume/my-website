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

  // クリックイベント設定
  openUrlsButton.addEventListener('click', () => {
    // ここはチェックボックスが無いので、全部開くモードのみでOKならfalseにしておく
    const isOpenAll = false; // チェックボックスが無いなら固定でfalse

    // URLリスト、まずGarapon1ページ目を追加
    const urlList = [garaponPage];

    // aタグのhref全取得 → 1ページ目以外のみ判定して追加
    document.querySelectorAll('a[href]').forEach(a => {
      const url = a.href;
      if (url !== garaponPage) {
        if (isOpenAll || confirm(`${url} を開きますか？`)) {
          urlList.push(url);
        }
      }
    });

    // 0.5秒間隔で順次タブを開く
    urlList.forEach((url, index) => {
      setTimeout(() => {
        window.open(url, '_blank');
      }, index * 500);
    });
  });

  console.log('✅ openUrls2.js がロードされ、イベントが設定されました');
});
