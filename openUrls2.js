// openUrls2.openUrlsButton.addEventListener('click', () => {
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
