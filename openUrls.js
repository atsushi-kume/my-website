document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('ECnavi_Button'); // ボタンID

  if (!button) {
    console.warn('ボタンが見つかりませんでした');
    return;
  }

  button.addEventListener('click', function () {
    const baseURL = 'https://ecnavi.jp';
    const relativePaths = [
      '/research/chinju_lesson/',
      '/vote/choice/',
      '/contents/enquete_rally/',
      '/mainichi_news/',
      '/game/lottery/garapon/',
      '/contents/doron/',
      '/smile_project/click_fund/',
      '/game/vegetable/',
      '/contents/chirashi/#chirashi_title',
      '/contents/divination/'
    ];

    relativePaths.forEach((path, index) => {
      setTimeout(() => {
        const fullURL = baseURL + path;
        window.open(fullURL, '_blank');
      }, index * 1000); // 1秒ずつ遅延
    });
  });
});
